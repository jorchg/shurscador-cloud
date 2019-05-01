const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');

// Initialize express APP
const app = express();

// Automatically allow cross-origin requests
app.use(cors()); 

// Initialize routes and non-http functions
const routes = require('./routes/index')(app);

const {
  onThreadInserted,
  onThreadUpdated,
  onThreadDeleted,
  onPostInserted,
  onPostUpdated,
  onPostDeleted,
} = require('./triggered_functions/firestore-triggered');
const v1 = functions.https.onRequest(app);

module.exports = {
  v1,
  onThreadInserted,
  onThreadUpdated,
  onThreadDeleted,
  onPostInserted,
  onPostUpdated,
  onPostDeleted,
};
