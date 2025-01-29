/**
 * For usage, visit Chart.js docs https://www.chartjs.org/docs/latest/
 */
const lineConfig = {
  type: 'line',
  data: {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Respuestas',
        /**
         * These colors come from Tailwind CSS palette
         * https://tailwindcss.com/docs/customizing-colors/#default-color-palette
         */
        backgroundColor: '#0694a2',
        borderColor: '#0694a2',
        data: [43, 48, 40, 54, 67, 73, 70],
        fill: false,
      },
      //Aqui iba algo

    ],
  },
  options: {
    responsive: true,
    /**
     * Default legends are ugly and impossible to style.
     * See examples in charts.html to add your own legends
     *  */
    legend: {
      display: false,
    },
    tooltips: {
      mode: 'index',
      intersect: false,
    },
    hover: {
      mode: 'nearest',
      intersect: true,
    },
    scales: {
      x: {
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Month',
        },
      },
      y: {
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Value',
        },
      },
    },
  },
}

// change this to the id of your chart element in HMTL
const lineCtx = document.getElementById('line')
window.myLine = new Chart(lineCtx, lineConfig)

const countCommentsByDay = (data) => {
  let map = new Map();
  for(entry of Object.values(data)){
    let date = entry.saved.split(",")[0];
    let currentValue = map.get(date) ? map.get(date) : 0;
    map.set(date, currentValue + 1);
  }
  let days = Array.from(map.keys());
  let counts = new Array();
  let comparator = (date1, date2) => {
    const [day1, month1, year1] = date1.split('/').map(Number);
    const [day2, month2, year2] = date2.split('/').map(Number);
    const d1 = new Date(year1, month1 - 1, day1);
    const d2 = new Date(year2, month2 - 1, day2);
    return d1 - d2;
  };
  days.sort(comparator);
  for(let day of days){
    counts.push(map.get(day));
  }
  return { days, counts }
};

update = () => {
  fetch('/api/v1/landing')
    .then(response => response.json())
    .then(data => {
      let { days, counts } = countCommentsByDay(data);
      window.myLine.data.labels = [];
      window.myLine.data.datasets[0].data = [];
      window.myLine.data.labels = [...days]
      window.myLine.data.datasets[0].data = [...counts]
      window.myLine.update();
    })
    .catch(error => console.error('Error:', error));
}

update();