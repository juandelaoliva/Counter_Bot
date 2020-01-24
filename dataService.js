
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


function decrementHistory(uid, id, date) {
    users[uid].stats[id].history[date.getFullYear()].total--;
    users[uid].stats[id].history[date.getFullYear()].months[date.getMonth()]--;
    users[uid].stats[id].history[date.getFullYear()].days[date.getDate()]--;
    users[uid].stats[id].history[date.getFullYear()].hours[date.getHours()]--;
    users[uid].stats[id].history[date.getFullYear()].minutes[date.getMinutes()]--;
}

function createStats() {
    var date = new Date();
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
            history[logDate.getFullYear()] = { "total": 1, "days": {},"months": {"0":0}, "hours": {}, "minutes": {} };
        }

        
        if (history[logDate.getFullYear()].months[logDate.getMonth()+1]) {
            history[logDate.getFullYear()].months[logDate.getMonth()+1]++;
        } else {
            history[logDate.getFullYear()].months[logDate.getMonth()+1] = 1;
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
    console.log(history[2020].months);
    saveUsers();
}

function getAllCounters(uid) {
    return users[uid].counter;
}

function getHistory(uid, id) {
    if (users[uid].stats[id].history) {
        return users[uid].stats[id].history;
        console.log(users[uid].stats[id].history);
    } else {
        return false;
    }
}

function getGroupHistories(uid) {
    console.log(uid);
    if (users[uid].data.chat.type == "group") {
        var histories = [];
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

module.exports = {
    loadUsers,
    registerUser,
    getUserList,
    setMetaData,
    getMetaData,
    setCounter,
    getCounter,
    getAllCounters,
    getStats,
    getHistory,
    getGroupHistories
};
