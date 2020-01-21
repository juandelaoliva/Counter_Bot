
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

        }
    } else if (diferencia < 0) {
        for (i = 0; i > diferencia; i--) {
            arrayStat.pop();
        }
    }

    users[uid].stats[id].dates = arrayStat;
    users[uid].counter[id] = val;

    setTimeout(() => {
        saveUsers();
    }, 4000);

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

function getAllCounters(uid) {
    return users[uid].counter;
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
    getStats
};
