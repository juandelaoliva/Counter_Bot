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
                saveUsers();
            }
        }
        else {
            users[uid].counter = {};
            users[uid].counter[id] = 0;

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
    users[uid].counter[id] = val;
    saveUsers();
}

function getCounter(uid, id) {
    assertCounter(uid, id);
    return users[uid].counter[id];
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
    getAllCounters
};
