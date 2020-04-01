#!/usr/bin/python3

import requests
from flask import Flask, render_template, redirect, url_for, request, Response
import shell
from json import loads, dumps


app = Flask(__name__)


PORTS = {'restapi': 9542}
COMMANDS = ["restart", "start", "status", "stop", "enable", 'disable']

SERVICES = {
    "ssh": {},
    "syncthing": {},
    "bot": {},
    "controller": {},
    "dhcpcd": {},
    "galery": {},
    "restapi": {},
    "dnsmasq": {}
}


CACHE = {}

CACHE['graphs'] = {}
CACHE['graphs']['cpu_temp'] = loads(requests.get('http://127.0.0.1:%s/api/%s' % (PORTS['restapi'], "v1/metrics/cpu_temp?last=24")).content)['data']
CACHE['graphs']['diskspace_left'] = next(iter(loads(requests.get('http://127.0.0.1:%s/api/%s' % (PORTS['restapi'], "v1/metrics/diskspace_left?last=1")).content)['data'].values()))
#CACHE['graphs']['diskspace_left'] = loads(requests.get('http://127.0.0.1:%s/api/%s' % (PORTS['restapi'], "v1/metrics/diskspace_left?last=1")).content)['data']

@app.route('/')
@app.route('/index')
def index():

    shell.update_cache(CACHE)
    shell.poll_services(SERVICES, COMMANDS)
    param = request.args
    return render_template('index.html', title='Main', services=SERVICES, commands=COMMANDS, cache=CACHE, param=param)


@app.route('/run/<service>/<command>')
def run(service, command):
    stdout = shell.execute_service(SERVICES, COMMANDS, service, command)
    if stdout:
        return render_template('run.html', title='Run %s %s' % (service, command), stdout=stdout, command=command, service=service)
    else:
        return redirect(url_for('index'))


@app.route('/api/<path:path>', methods=['GET', 'PUT'])
def proxy(path):
    if request.method=='GET':
        addr = 'http://127.0.0.1:%s/api/%s%s' % (PORTS['restapi'], path, ("?" + request.query_string.decode('utf-8') if request.query_string else ""))
        resp = requests.get(addr)
        excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
        headers = [(name, value) for (name, value) in     resp.raw.headers.items() if name.lower() not in excluded_headers]
        response = Response(resp.content, resp.status_code, headers)
        return response
    else:
        resp = requests.put('http://127.0.0.1:%s/api/%s' % (PORTS['restapi'], path), request.get_data())
        excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
        headers = [(name, value) for (name, value) in     resp.raw.headers.items() if name.lower() not in excluded_headers]
        response = Response(resp.content, resp.status_code, headers)
        return response


@app.route('/reboot')
def reboot():
    execute("sudo reboot")
    return redirect(url_for('index', reboot=True))


app.run(debug=True, host="0.0.0.0", port=9541)
