// firestore setup (db-collection read/writes)
const admin = require('firebase-admin'); // use admin to access firestore db (your collections)
const serviceAccount = require('../key/serviceAccount.json')
// initialize firestore db w/ necessary key
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://seanstack-daf2a.firebaseio.com"
});
const db = admin.firestore()

module.exports = { admin, db };