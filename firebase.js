const admin = require("firebase-admin");

const serviceAccount = JSON.parse(process.env.SERVICEACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://termometer-badtunna.firebaseio.com",
});

const db = admin.firestore();

module.exports = { db };
