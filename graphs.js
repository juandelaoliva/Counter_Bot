
const dataService = require('./dataService.js');

function getMonthsStrings(month) {
  var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  var res = [];
  for (var i = 0; i < month; i++) {
    res.push(meses[i]);
  }
  return res;
}

function chartUrl(chart, month) {
  var stringChart = '{';
  stringChart += JSON.stringify(chart);
  var splitted = stringChart.split("\"");
  var changeheight = ((month / 10) + 1) * 300;

  var finalUrl = 'https://quickchart.io/chart?width=500&height=' + changeheight + '&c={';

  for (var i = 1; i < splitted.length; i++) {
    finalUrl += "%27" + splitted[i];
  }
  return finalUrl;

}

function getGroupGraph2(uid) {
  var groupHistories = dataService.getGroupHistories(uid);
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
  for (var i = 1; i < Number(months[months.length-1])+1; i++) {
    if(yearStats.months[i]) {
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

module.exports = {
  generateYearGraph,
  getGroupGraph2
};
