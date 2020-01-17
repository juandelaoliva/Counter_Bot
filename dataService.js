const fs = require('fs');
var usrFileName = "./users.json";

var users = {};
var fileLocked = false;

function loadUsers() {
    fs.readFile(usrFileName, (err, data) => {
        if (err) throw err;
        users = JSON.parse(data);
        //console.log('Así carga el archivo \n',users);
    });
}

function saveUsers() {
    if (!fileLocked) {
        fileLocked = true;
        var json = JSON.stringify(users);
        fs.writeFile(usrFileName, json, 'utf8', function (err) {
            if (err) throw err;
            fileLocked = false;
        })
    }
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
                users[uid].stats[id] = [];
                saveUsers();
            }
        }
        else {
            users[uid].counter = {};
            users[uid].counter[id] = 0;
            users[uid].stats = {};
            users[uid].stats[id] = [];
            saveUsers();
        }
    }
    else {
        //console.log("[ERROR] User ID", uid, "does not exist in database");
        var usr = { enabled: true, data: { from: undefined, chat: undefined, error: "user was not initialized properly" }, counter: { "0": 1 } };
        users[uid] = usr;
        saveUsers();
    }
}


function setCounter(uid, id, val) {

    assertCounter(uid, id);

    var oldVal = users[uid].counter[id];
    var moment = createStats();
    var diferencia = val - oldVal;

    if (diferencia > 0) {
        var i;
        for (i = 0; i < diferencia; i++) {
            users[uid].stats[id].push(moment);
        }
    } else if (diferencia < 0) {
        for (i = 0; i > diferencia; i--) {
            users[uid].stats[id].pop();
        }
    }

    users[uid].counter[id] = val;
    setTimeout(function () { saveUsers() }, 3000);

}

function createStats() {
    var d = new Date();
    var stat = {
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        day: d.getDate(),
        hour: d.getHours(),
        minute: d.getMinutes()
    }
    return stat;
}

function getCounter(uid, id) {
    assertCounter(uid, id);
    return users[uid].counter[id];
}

function getStats(uid, id) {
    assertCounter(uid, id);
    return users[uid].stats[id];
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
