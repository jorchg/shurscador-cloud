const functions = require('firebase-functions');

const config = functions.config();
config.serviceAccount = require('../credentials/shurscador-firebase.json');

module.exports = config;