const functions = require('firebase-functions');
const admin = require('firebase-admin');

// const serviceAccount = require('../serviceAccount.json');
const serviceAccount = require('./key/serviceAccount.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://seanstack-daf2a.firebaseio.com"
});

const express = require('express');
const app = express();

app.get('/lists', (req, res) => {
    // for access to db -> admin.firestore() === db
    admin
    .firestore()
    .collection('lists')
    .get()
    .then((data) => {
      let lists = [];
      data.forEach((doc) => {
        lists.push(doc.data());
      })
      return res.json(lists);
    })
    .catch(err => console.log('err', err))

})


exports.createList = functions.https.onRequest((req, res) => {
  if (req.method !== 'POST'){
    return res.status(400).json({error: 'Method not allowed: You tried method other than a POST on a POST route'})
  }
  const newList = {
    title: req.body.title,
    user: req.body.user,
    createdAt: admin.firestore.Timestamp.fromDate(new Date()),
    list: req.body.list
  };
  admin
  .firestore()
    .collection('lists')
    .add(newList)
    .then(doc => {
      res.json({ message: `document ${doc.id} created successfully`})
    })
    .catch(err => {
      res.status(500).json({error: 'something amiss'});
      console.log('err', err)
    })
});

// https://baseurl.com/api/

exports.api = functions.https.onRequest(app);
