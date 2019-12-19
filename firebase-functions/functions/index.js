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
    .orderBy('createdAt', 'desc')
    .get()
    .then((data) => {
      let lists = [];
      data.forEach((doc) => {
        lists.push({
          listId: doc.id,
          user: doc.data().user,
          createdAt: doc.data().createdAt,
          list: doc.data().list,
          title: doc.data.title
        });
      })
      return res.json(lists);
    })
    .catch(err => console.log('err', err))

})

app.post('/list', (req, res) => {
  const newList = {
    title: req.body.title,
    user: req.body.user,
    createdAt: new Date().toISOString(),
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
    });
});

// https://baseurl.com/api/

exports.api = functions.https.onRequest(app);
