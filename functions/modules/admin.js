const admin = require('firebase-admin');
const config = require('../config/index');

// Init firebase-admin
admin.initializeApp({
  credential: admin.credential.cert(config.serviceAccount),
});

module.exports = admin;
