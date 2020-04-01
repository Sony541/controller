var timeFormat = 'MM/DD/YYYY HH:mm';



function newDateLabel(hours) {
    return moment().add(hours, 'h').toDate();
}

function newDate(sec) {
    return moment().add(sec, 'd').toDate();
}

function newDateString(sec) {
    return moment(sec*1000).format(timeFormat);
}

var color = Chart.helpers.color;
var config_temp = {
    type: 'line',
    data: {
        labels: [ // Date Objects
        ],
        datasets: [ {
            label: 'Температура процессора',
            backgroundColor: color('#bbcc88').alpha(0.7).rgbString(),
            borderColor: "#bbcc88",
            fill: false,
            data : [{% for item in cache['graphs']['cpu_temp'] %} { x: newDateString({{item}}), y: {{ cache['graphs']['cpu_temp'][item]}} },{% endfor %}],
        },/*{
            label: 'Место на диске',
            backgroundColor: color('#dd8888').alpha(0.7).rgbString(),
            borderColor: "#dd8888",
            fill: false,
            data : [{% for item in cache['graphs']['diskspace_left'] %} { x: newDateString({{item}}), y: {{ cache['graphs']['diskspace_left'][item]}} },{% endfor %}],
        }*/]
    },
    options: {
        title: {
            text: 'Chart.js Time Scale'
        },
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                type: 'time',
                time: {
                    parser: timeFormat,
                    tooltipFormat: 'll HH:mm'
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Date'
                }
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true
                },
                scaleLabel: {
                    display: true,
                    labelString: 'value'
                }
            }]
        },
    }
};

var hdd_space = Math.round(({{cache['graphs']['diskspace_left']}} / 1024 / 1024)*100) / 100;

var config_hdd = {
    type: 'doughnut',
    data: {
        datasets: [{
            hoverBorderColor: ['#ffffff', '#ffffff'],
            borderColor: ['#ffffff', '#ffffff'],
            backgroundColor: [color('#cccccc').alpha(0.7).rgbString(),color('#bbcc88').alpha(0.7).rgbString()],
            data: [
                16-hdd_space, hdd_space
            ]
        }],
        labels: ['Занято','Свободно'],
    },
    options: {
        title: {
            text: 'Место на диске'
        },
        maintainAspectRatio: false,
        circumference: Math.PI / 2,
        rotation: -Math.PI / 4 * 3
    }
};

window.onload = function() {
    var ctx_temp = document.getElementById('canvas_temp').getContext('2d');
    window.myLine = new Chart(ctx_temp, config_temp);
    var ctx_hdd = document.getElementById('canvas_hdd').getContext('2d');
    window.myLine = new Chart(ctx_hdd, config_hdd);
};
