
const dataService = require('./dataService.js');

function getMonthsStrings(month) {
  var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  var res = [];
  for (var i = 0; i < month; i++) {
    res.push(meses[i]);
  }
  return res;
}

function chartUrl(chart, altomes, cambiarAncho) {
  var stringChart = '{';
  stringChart += JSON.stringify(chart);
  var width = 500;
  if (cambiarAncho) {
    width = cambiarAncho;
  }
  var splitted = stringChart.split("\"");
  var changeheight = ((altomes / 10) + 1) * 300;

  var finalUrl = 'https://quickchart.io/chart?width=' + width + '&height=' + changeheight + '&c={';

  for (var i = 1; i < splitted.length; i++) {
    finalUrl += "%27" + splitted[i];
  }
  return finalUrl;

}

function getGroupGraph2(uid) {
  var groupHistories = dataService.getGroupHistories(uid);
  if (groupHistories) {
    var groupName = groupHistories[0];
    var today = new Date();
    today = today.setHours(today.getHours() + 1);
    today = new Date(today);
    var month = today.getMonth() + 1;
    var datasets = [];
    var monthss = getMonthsStrings(month);
    var labels = [];
    var labelsWithTotal = [];

    for (var i = 1; i < groupHistories.length; i++) {
      var username = Object.keys(groupHistories[i])[0];
      if (groupHistories[i][username]) {
        labelsWithTotal.push(username + ' [' + groupHistories[i][username][today.getFullYear()].total + ']');
        labels.push(username);
      }
    }

    for (var i = 0; i < month; i++) {
      var label = monthss[i];
      var data = [];
      for (var e = 0; e < labels.length; e++) {
        var history = groupHistories[e + 1][labels[e]];
        if (history[today.getFullYear()].months[i + 1]) {
          data.push(history[today.getFullYear()].months[i + 1]);
        } else {
          data.push(0);
        }
      }

      var dataset = {
        label: label,
        data: data
      }
      datasets.push(dataset);
    }



    var chart = {
      type: 'bar',
      data: {
        labels: labelsWithTotal,
        datasets: datasets
      },
      options: {
        title: {
          display: true,
          text: groupName,
          fontColor: 'hotpink',
          fontSize: 25,
        },
        legend: {
          position: 'bottom',
        },
        scales: {
          xAxes: [{ stacked: true }],
          yAxes: [{
            stacked: true,
            ticks: {
              callback: function (value) {
                return value + '💩';
              }
            }
          }],
        },
        plugins: {
          datalabels: {
            display: true,
            font: {
              style: 'bold',
            },
          },
        },
      },
    };


    return chartUrl(chart, month);
  } else {
    console.log('error because someone does not have username')
  }
}


function generateYearGraph(history, username, year) {
  if (year == null) {
    year = new Date().getFullYear();
  }
  var yearStats = history[year];

  var labels = [];
  var data = [];

  var months = Object.keys(yearStats.months);
  labels = getMonthsStrings(months[months.length - 1]);
  for (var i = 1; i < Number(months[months.length - 1]) + 1; i++) {
    if (yearStats.months[i]) {
      data.push(yearStats.months[i]);
    } else {
      data.push(0);
    }
  }

  var chart = {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: username,
        data: data
      }]
    },
    options: {
      title: {
        display: true,
        text: year,
        fontColor: 'hotpink',
        fontSize: 25,
      },
      legend: {
        position: 'bottom',
      },

      plugins: {
        datalabels: {
          display: true,
          font: {
            style: 'bold',
          },
        },
      },
    }
  };

  return chartUrl(chart);
}

function generateHoursGraph(dates, username) {
  var label = username;
  var dates = dates;
  var data = [];

  if (dates.length) {
    for (i = 0; i < dates.length; i++) {
      var logDate = new Date(dates[i]);
      var minutes = logDate.getMinutes() / 60;
      var time = (logDate.getHours()) + minutes;
      time = Math.floor(time * 10) / 10;
      data.push({ x: i + 1, y: time })
    }
  }

  var chart = {
    type: 'scatter',
    data: {
      datasets: [{
        label: label,
        data: data
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            max: 24,
            min: 0,
            stepSize: 0.1
          }
        }]
      }
    }
  };

  return chartUrl(chart, 30);

}

function generateHoursBarGraph(hours, username) {
  var label = "Las 24 horas de " + username;
  var hoursLog = hours;
  var data = [];

  var chart = {
    type: "bar",
    data: {
      labels: ["0h", "1h", "2h", "3h", "4h", "5h", "6h", "7h", "8h", "9h", "10h", "11h", "12h", "13h", "14h", "15h", "16h", "17h", "18h", "19h", "20h", "21h", "22h", "23h"],
      datasets: [
        {
          label: label,
          data: hoursLog,
          fill: false,
          backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(255, 159, 64, 0.2)", "rgba(255, 205, 86, 0.2)", "rgba(75, 192, 192, 0.2)", "rgba(54, 162, 235, 0.2)", "rgba(153, 102, 255, 0.2)", "rgba(201, 203, 207, 0.2)", "rgba(255, 99, 132, 0.2)", "rgba(255, 159, 64, 0.2)", "rgba(255, 205, 86, 0.2)", "rgba(75, 192, 192, 0.2)", "rgba(54, 162, 235, 0.2)", "rgba(153, 102, 255, 0.2)", "rgba(201, 203, 207, 0.2)", "rgba(255, 99, 132, 0.2)", "rgba(255, 159, 64, 0.2)", "rgba(255, 205, 86, 0.2)", "rgba(75, 192, 192, 0.2)", "rgba(54, 162, 235, 0.2)", "rgba(153, 102, 255, 0.2)", "rgba(201, 203, 207, 0.2)", "rgba(255, 99, 132, 0.2)", "rgba(255, 159, 64, 0.2)", "rgba(255, 205, 86, 0.2)"],
          borderColor: ["rgb(255, 99, 132)", "rgb(255, 159, 64)", "rgb(255, 205, 86)", "rgb(75, 192, 192)", "rgb(54, 162, 235)", "rgb(153, 102, 255)", "rgb(201, 203, 207)", "rgb(255, 99, 132)", "rgb(255, 159, 64)", "rgb(255, 205, 86)", "rgb(75, 192, 192)", "rgb(54, 162, 235)", "rgb(153, 102, 255)", "rgb(201, 203, 207)", "rgb(255, 99, 132)", "rgb(255, 159, 64)", "rgb(255, 205, 86)", "rgb(75, 192, 192)", "rgb(54, 162, 235)", "rgb(153, 102, 255)", "rgb(201, 203, 207)", "rgb(255, 99, 132)", "rgb(255, 159, 64)", "rgb(255, 205, 86)"],
          borderWidth: 1
        }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      },
      plugins: {
        datalabels: {
          display: true,
          font: {
            style: 'bold',
          },
        },
      },
    }
  };

  return chartUrl(chart, 3, 800);

}

module.exports = {
  generateYearGraph,
  getGroupGraph2,
  generateHoursGraph,
  generateHoursBarGraph
};
