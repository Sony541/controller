const N = 10;

new Chart(document.querySelector('#chart'), {
  type: 'line',
  data: {
    labels: [...Array(N)].map((n, i) => i + 1),
    datasets: [ {
      label: 'hello, world!!',
      data: [...Array(N)].map((n, i) => (Math.random() * 200 | 0) - 100),
       pointHitRadius: 15,
       pointHoverBorderColor: 'blue',
       pointHoverBackgroundColor: 'red',
    } ],
  },
});

