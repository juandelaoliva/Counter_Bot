
const dataService = require('./dataService.js');

function getMonthsStrings(month) {
    var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    var res = [];
    for (var i = 0; i < month; i++) {
        res.push(meses[i]);
    }
    return res;
}

function chartUrl(chart) {
    var stringChart = '{';
    stringChart += JSON.stringify(chart);
    var splitted = stringChart.split("\"");
    var finalUrl = 'https://quickchart.io/chart?c={';
    for (var i = 1; i < splitted.length; i++) {
        finalUrl += "%27" + splitted[i];
    }

    return finalUrl;

}
function getGroupGraph(uid) {
    var groupHistories = dataService.getGroupHistories(uid);
    var groupName = groupHistories[0];
    var today = new Date();
    var month = today.getMonth() + 1;
    var datasets = [];
    var labels = getMonthsStrings(month);


    for (var i = 1; i < groupHistories.length; i++) {
        var username = Object.keys(groupHistories[i])[0];
        if (groupHistories[i][username]) {
            history = groupHistories[i][username];
            var data = [];
            for (var e = 0; e < month; e++) {
                if (history[today.getFullYear()].months[e + 1]) {
                    data.push(history[today.getFullYear()].months[e + 1]);
                } else {
                    data.push(0);
                }
            }
            var dataset = {
                label: username,
                data: data
            }
            datasets.push(dataset);
        }

    }


    var chart = {
        type: 'bar',
        data: {
            labels: labels,
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


function generateYearGraph(history, username, year) {
    if (year == null) {
        year = new Date().getFullYear();
    }
    var yearStats = history[year];

    var labels = [];
    var data = [];

    var months = Object.keys(yearStats.months);
    labels = getMonthsStrings(months[months.length-1]);
    for (var i = 1; i < Object.keys(yearStats.months).length; i++) {
        data.push(yearStats.months[Object.keys(yearStats.months)[i]]);
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
    getGroupGraph
};