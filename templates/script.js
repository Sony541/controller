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
var config = {
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

window.onload = function() {
    var ctx = document.getElementById('canvas').getContext('2d');
    window.myLine = new Chart(ctx, config);

};
