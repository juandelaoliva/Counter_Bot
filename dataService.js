const config = require('./config');
//firebase
const firebaseConfig = require('./firebaseConfig');
const firebase = require('firebase');
const app = firebase.initializeApp({
    apiKey: firebaseConfig.apiKey,
    authDomain: firebaseConfig.authDomain,
    databaseURL: firebaseConfig.databaseURL,
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket,
    messagingSenderId: firebaseConfig.messagingSenderId,
    appId: firebaseConfig.appId,
    measurementId: firebaseConfig.measurementId
});
const ref = firebase.database().ref();
var sitesRef = ref.child("users");

var users = {};


function loadUsers() {

    // Get a database reference to our users
    var usersRef = firebase.database().ref("users");

    // Attach an asynchronous callback to read the data at our posts reference
    usersRef.on("value", function (snapshot) {
        if (snapshot.val() == null) {
            sitesRef.set({});
        }
        users = snapshot.val();

    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    })
}

function saveUsers() {
    sitesRef.set(users);
}

function registerUser(msg) {
    var uid = msg.chat.id;
    var usr = { enabled: true, data: { from: msg.from, chat: msg.chat } };
    users[uid] = usr;
    saveUsers();
}

function getUser(uid) {
    return users[uid];
}

function getUserList() {
    return Object.keys(users);
}

function setMetaData(uid, key, val) {
    users[uid].data[key] = val;
    saveUsers();
}

function getMetaData(uid, key) {
    return users[uid].data[key];
}

function assertCounter(uid, id) {
    if (users[uid]) {
        if (users[uid].counter) {
            if (users[uid].counter[id]) {
                return true;
            }
            else {
                users[uid].counter[id] = 0;
            }
        }
        else {
            users[uid].counter = {};
            users[uid].counter[id] = 0;

        }
        if (users[uid].stats) {
            if (users[uid].stats[id]) {
                return true;
            }
            else {
                users[uid].counter[id] = 0;
                users[uid].stats[id] = {
                    'enabled': true,
                };
            }
        }
        else {
            users[uid].stats = {};
            users[uid].stats[id] = {
                'enabled': true,
            };

        }

        saveUsers();
    }
    else {
        var usr = { enabled: true, data: { from: undefined, chat: undefined, error: "user was not initialized properly" }, counter: { "0": 1 } };
        users[uid] = usr;
        saveUsers();
    }

}


function setCounter(uid, id, val) {

    assertCounter(uid, id);

    var oldVal = users[uid].counter[id];
    var diferencia = val - oldVal;
    var moment = createStats().getTime();
    var arrayStat = [];



    if (users[uid].stats[id].dates) {
        arrayStat = Object.values(users[uid].stats[id].dates);
    }

    if (diferencia > 0) {
        var i;
        for (i = 0; i < diferencia; i++) {
            arrayStat.push(moment);
            if (users[uid].stats[id].history) {
                var mmntArray = [moment];
                generateHistory(uid, id, mmntArray);
            }

        }
    } else if (diferencia < 0) {
        for (i = 0; i > diferencia; i--) {
            if (users[uid].stats[id].history) {
                var logDate = new Date(arrayStat[arrayStat.length - 1]);
                decrementHistory(uid, id, logDate);
            }
            arrayStat.pop();
        }
    }

    users[uid].stats[id].dates = arrayStat;
    if (!users[uid].stats[id].history) {
        generateHistory(uid, id, arrayStat);
    }
    users[uid].counter[id] = val;

    setTimeout(() => {
        saveUsers();
    }, 4000);

}

function setCounterCustom(uid, id, val, timeParameters) {
    var time = new Date();
    var moment;
    if (timeParameters.length == 1) {
        time.setHours(timeParameters[0].split(":")[0], timeParameters[0].split(":")[1], 0);
        console.log(time);
    }
    if (timeParameters.length == 2) {
        var month = Number(timeParameters[1].split("/")[1]);
        if (month.toString().length != 2) {
            month = "0" + month;
        }
        console.log(month)
        time = new Date(timeParameters[1].split("/")[2] + '-' + month + '-' + timeParameters[1].split("/")[0] + "T" + timeParameters[0] + ":00Z");
        console.log(time);
    }
    moment = time.getTime();

    assertCounter(uid, id);

    var oldVal = users[uid].counter[id];
    var diferencia = val - oldVal;
    var arrayStat = [];

    if (users[uid].stats[id].dates) {
        arrayStat = Object.values(users[uid].stats[id].dates);
    }

    if (diferencia > 0) {
        var i;
        for (i = 0; i < diferencia; i++) {
            arrayStat.push(moment);
            if (users[uid].stats[id].history) {
                var mmntArray = [moment];
                generateHistory(uid, id, mmntArray);
            }

        }
    } else if (diferencia < 0) {
        for (i = 0; i > diferencia; i--) {
            if (users[uid].stats[id].history) {
                var logDate = new Date(arrayStat[arrayStat.length - 1]);
                decrementHistory(uid, id, logDate);
            }
            arrayStat.pop();
        }
    }

    users[uid].stats[id].dates = arrayStat;
    if (!users[uid].stats[id].history) {
        generateHistory(uid, id, arrayStat);
    }
    users[uid].counter[id] = val;

    setTimeout(() => {
        saveUsers();
    }, 4000);

}


function decrementHistory(uid, id, date) {
    users[uid].stats[id].history[date.getFullYear()].total--;
    users[uid].stats[id].history[date.getFullYear()].months[date.getMonth() + 1]--;
    users[uid].stats[id].history[date.getFullYear()].days[date.getDate()]--;
    users[uid].stats[id].history[date.getFullYear()].hours[date.getHours()]--;
    users[uid].stats[id].history[date.getFullYear()].minutes[date.getMinutes()]--;
}

function createStats() {
    var date = new Date();
    date = date.setHours(date.getHours()+1);
    date = new Date(date);
    return date;
}

function getCounter(uid, id) {
    assertCounter(uid, id);
    return users[uid].counter[id];
}

function getStats(uid, id) {
    assertCounter(uid, id);
    var dates = Object.values(users[uid].stats[id].dates);
    return dates;
}

function generateHistory(uid, id, stats) {
    var history = {};
    if (users[uid].stats[id].history) {
        history = users[uid].stats[id].history
    }
    for (var i = 0; i < stats.length; i++) {
        var logDate = new Date(stats[i]);

        if (history[logDate.getFullYear()]) {
            history[logDate.getFullYear()].total++;
        } else {
            history[logDate.getFullYear()] = { "total": 1, "days": {}, "months": { "0": 0 }, "hours": {}, "minutes": {} };
        }


        if (history[logDate.getFullYear()].months[logDate.getMonth() + 1]) {
            history[logDate.getFullYear()].months[logDate.getMonth() + 1]++;
        } else {
            history[logDate.getFullYear()].months[logDate.getMonth() + 1] = 1;
        }

        if (history[logDate.getFullYear()].days[logDate.getDate()]) {
            history[logDate.getFullYear()].days[logDate.getDate()]++;
        } else {
            history[logDate.getFullYear()].days[logDate.getDate()] = 1;
        }

        if (history[logDate.getFullYear()].hours[logDate.getHours()]) {
            history[logDate.getFullYear()].hours[logDate.getHours()]++;
        } else {
            history[logDate.getFullYear()].hours[logDate.getHours()] = 1;
        }

        if (history[logDate.getFullYear()].minutes[logDate.getMinutes()]) {
            history[logDate.getFullYear()].minutes[logDate.getMinutes()]++;
        } else {
            history[logDate.getFullYear()].minutes[logDate.getMinutes()] = 1;
        }
    }

    users[uid].stats[id].history = history;
    saveUsers();
}

function getAllCounters(uid) {
    return users[uid].counter;
}

function getHistory(uid, id) {
    if (users[uid].stats[id].history) {
        return users[uid].stats[id].history;
    } else {
        return false;
    }
}

function getGroupHistories(uid) {
    if (users[uid].data.chat.type == "group") {
        var histories = [users[uid].data.chat.title];
        for (var i = 0; i < Object.keys(users[uid].stats).length; i++) {
            var name = Object.keys(users[uid].stats)[i];
            var hist = users[uid].stats[name].history;

            var histLog = { [name]: hist };
            histories.push(histLog);
        }
        return histories;
    } else {
        console.log(-1);
    }
}

// Hay que comprobar si el chat es el -353783471 y quitar los registros del día 21 y 22 de Enero que fue cuando se estableció el cagómetro
// Para comprobar que es tras esas fechas veremos que la fecha en milisegundos sea posterior a 1579730400000
function getHoursLog(dates, uid) {
    var specialgroup = (uid == -353783471);
    var hours = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; //Array en el que el índice indica la hora desde la 0 hasta la 23
    var dates = dates;
    if (dates.length) {
        if (specialgroup) {
            for (i = 0; i < dates.length; i++) {
                if (dates[i] >= 1704017156) { // comprobamos que el momento sea tras el establecimiento
                    var logDate = new Date(dates[i]);
                    var hour = logDate.getHours();
                    hours[hour]++;
                }
            }
        } else {
            for (i = 0; i < dates.length; i++) {
                var logDate = new Date(dates[i]);
                var hour = logDate.getHours();
                hours[hour]++;
            }
        }
    }
    return hours;
}

function getHoursTop3(hours) {
    var hoursLog = hours;
    var top3hours = [0, 0, 0];
    var top3Amount = [0, 0, 0];
    for (var i = 0; i < hoursLog.length; i++) {
        if (hoursLog[i] > top3Amount[0]) {
            top3hours[2] = top3hours[1];
            top3hours[1] = top3hours[0];
            top3hours[0] = i;

            top3Amount[2] = top3Amount[1];
            top3Amount[1] = top3Amount[0];
            top3Amount[0] = hours[top3hours[0]];

        } else if (hoursLog[i] > top3Amount[1]) {
            top3hours[2] = top3hours[1];
            top3hours[1] = i;

            top3Amount[2] = top3Amount[1];
            top3Amount[1] = hours[top3hours[1]];
        } else if (hoursLog[i] > top3Amount[2]) {
            top3hours[2] = i;
            top3Amount[2] = hours[top3hours[2]];
        }
    }

    var top3 = {
        top3hours: top3hours,
        top3Amount: top3Amount
    }

    return top3;
}

function assertUserLocation(id) {
    if (users[id]) {
        if (users[id].locations[1]) {
            return true;
        }
    } else {
        var locations = { locations: { enabled: true } };
        users[id] = locations;
        saveUsers();
    }
}

function saveLocation(lat, long, id) {
    assertUserLocation(id);
    setTimeout(() => {
        var location = { latitude: lat, longitude: long };
        let locations = Object.values(users[id].locations);
        locations.push(location);
        users[id].locations = locations;
        saveUsers();
        console.log(id + ": added a new location -> { lat:" + lat + " , long:" + long + " }");
    }, 50);
}

function getLocations(id) {
    assertUserLocation(id);
    var locations = Object.values(users[id].locations);
    return locations;
}

function createMap(locations) {
    if (locations.length > 1) {
        var url = "http://maps.googleapis.com/maps/api/staticmap?&size=600x600&style=visibility:on&style=feature:water%7Celement:geometry%7Cvisibility:on&style=feature:landscape%7Celement:geometry%7Cvisibility:on";
        for (var i = 1; i < locations.length; i++) {
            if (locations[i]) {
                url += "&markers=icon:https://i.ibb.co/T2y11tH/336345-shit-emoji-png.png%7C" + locations[i].latitude + "," + locations[i].longitude;
            }
        }
        url += "&key=" + config.staticMapApiKey;
        return url;
    }
}

function createBingMap(locations) {
    if (locations.length > 1) {
        var url = "https://www.bing.com/maps?lvl=12&sp=";
        for (var i = 1; i < locations.length; i++) {
            if (locations[i]) {
                url += "point." + locations[i].latitude + "_" + locations[i].longitude + "_Caca~";
            }
        }
        return url;
    }
}

module.exports = {
    loadUsers,
    registerUser,
    getUserList,
    setMetaData,
    getMetaData,
    setCounter,
    setCounterCustom,
    getCounter,
    getAllCounters,
    getStats,
    getHistory,
    getGroupHistories,
    getHoursLog,
    getHoursTop3,
    assertUserLocation,
    saveLocation,
    createMap,
    createBingMap,
    getLocations
};
