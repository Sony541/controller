const N = 10;

new Chart(document.querySelector('#chart'), {
    type: 'line',
    data: {

        datasets: [ {
            label: 'hello, world!!',
            data : [{% for item in cache['graphs']['cpu_temp'] %} { x: {{item}}, y: {{ cache['graphs']['cpu_temp'][item]}} },{% endfor %}],
            pointHitRadius: 15,
            pointHoverBorderColor: 'blue',
            pointHoverBackgroundColor: 'red'
        }],
    },
    options: {
        responsive: true,
        legend: {
            display: false
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }],
            xAxes: [{
                type: 'time',
               /* time: {
                    unit: 'minute'
                }*/
            }]
        }
    }
});
/*

        new Chart(document.querySelector('#chart'), {
            labels : [{% for item in cache['graphs']['cpu_temp'] %} {{item}},{% endfor %}],
            datasets : [{
                label: '{{ legend }}',
                fill: true,
                lineTension: 0.1,
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data : [{% for item in cache['graphs']['cpu_temp'] %}"{{ cache['graphs']['cpu_temp'][item]}}",{% endfor %}],
                spanGaps: false
            }]
        });
*/