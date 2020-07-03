const admin = require("firebase-admin");

const serviceAccount = require("./firebaseConfig");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://termometer-badtunna.firebaseio.com",
});

const db = admin.firestore();

module.exports = { db };
