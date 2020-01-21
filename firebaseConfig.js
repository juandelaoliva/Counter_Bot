
const apiKey = process.env.firebaseApiKey;
const authDomain = process.env.firebaseAuthDomain;
const databaseURL = process.env.firebaseDatabaseURL;
const projectId = process.env.firebaseProjectId;
const storageBucket = process.env.firebaseStorageBucket;
const messagingSenderId = process.env.firebaseMessagingSenderId;
const appId = process.env.firebaseAppId;
const measurementId = process.env.firebaseMeasurementId;

module.exports = {
    apiKey: apiKey,
    authDomain: authDomain,
    databaseURL: databaseURL,
    projectId: projectId,
    storageBucket: storageBucket,
    messagingSenderId: messagingSenderId,
    appId: appId,
    measurementId: measurementId
}
