from os import popen
from time import time
import json, requests


def execute(command):
    stream = popen(command)
    output = stream.read()
    return output


def execute_service(SERVICES, COMMANDS, service, command):
    if service in SERVICES and command in COMMANDS:
        info = execute("sudo systemctl %s %s" % (command, service))
        return info
    else:
        return "Error! Unknown service or command!"


def poll_services(SERVICES, COMMANDS):
    def get_uptime(row):
            time_pos = row.rfind(";")
            if not time_pos == -1:
                return row[time_pos + 2:row.rfind('ago')]
            else:
                return None

    def get_status(row):
        if "Active: active (running)" in row:
            return "up"
        else:
            return "down"

    def get_enabled(row):
        return "; enabled" in row

    for service in SERVICES:
        info = execute_service(SERVICES, COMMANDS, service, "status")
        if info:
            lst = info.split("\n")
            if len(lst) >= 2:
                SERVICES[service]["uptime"] = get_uptime(lst[2])
                SERVICES[service]["status"] = get_status(lst[2])
                SERVICES[service]["enabled"] = get_enabled(lst[1])
                continue
        SERVICES[service]["uptime"] = None
        SERVICES[service]["status"] = "unknown"
        SERVICES[service]["enabled"] = None
    return SERVICES


def update_cache(CACHE, PORTS):
    CACHE['time'] = int(time())
    CACHE['temp'] = execute("vcgencmd measure_temp | cut -b 6-7")
    CACHE['uptime'] = execute("uptime -p")

    CACHE['graphs'] = {}
    CACHE['graphs']['cpu_temp'] = \
        json.loads(requests.get('http://127.0.0.1:%s/api/%s' % \
                           (PORTS['restapi'], "v1/metrics/cpu_temp?last=24")).content)['data']
    CACHE['graphs']['diskspace_left'] = \
        next(iter(json.loads(requests.get('http://127.0.0.1:%s/api/%s' % \
                                     (PORTS['restapi'], "v1/metrics/diskspace_left?last=1")).content)[
                      'data'].values()))
    # CACHE['graphs']['diskspace_left'] = loads(requests.get('http://127.0.0.1:%s/api/%s' % (PORTS['restapi'], "v1/metrics/diskspace_left?last=1")).content)['data']

    return CACHE