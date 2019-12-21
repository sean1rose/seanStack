const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();

const serviceAccount = require('./key/serviceAccount.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://seanstack-daf2a.firebaseio.com"
});

const firebaseConfig = {
  apiKey: "AIzaSyBDWmFWHvmBAIdwGrSxEdns2ccj2RMpuco",
  authDomain: "seanstack-daf2a.firebaseapp.com",
  databaseURL: "https://seanstack-daf2a.firebaseio.com",
  projectId: "seanstack-daf2a",
  storageBucket: "seanstack-daf2a.appspot.com",
  messagingSenderId: "539122818574",
  appId: "1:539122818574:web:40560d21196b60a413665f",
  measurementId: "G-L4VZ350BVR"
};

const firebase = require('firebase');
firebase.initializeApp(firebaseConfig);

const db = admin.firestore()

app.get('/lists', (req, res) => {
    // for access to db -> admin.firestore() === db
  db
  .collection('lists')
  .orderBy('createdAt', 'desc')
  .get()
  .then((data) => {
    let lists = [];
    data.forEach((doc) => {
      lists.push({
        listId: doc.id,
        username: doc.data().username,
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
    username: req.body.username,
    createdAt: new Date().toISOString(),
    list: req.body.list
  };
  db
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

// signup route
app.post('/signup', (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    username: req.body.username,
  }

  let token, userId;
  db.doc(`/users/${newUser.username}`).get()
    .then(doc => {
      // even if doc doesn't exist, will have a snapshot
      if (doc.exists) {
        // this username is already taken...
        return res.status(400).json({ username: `The username ${newUser.username} is already taken`});
      }
      else {
        return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
        .then(data => {
          userId = data.user.uid;
          return data.user.getIdToken();
        })
        .then(idToken => {
          token = idToken;
          // create user document here...
          const userCredentials = {
            username: newUser.username,
            email: newUser.email,
            createdAt: new Date().toISOString(),
            userId
          }
          // save these creds to a doc in our user collection...
            // give the firebase db the document path (`/users/`)
            // set creates the document
          db.doc(`/users/${newUser.username}`).set(userCredentials)
            .then(() => {
              return res.status(201).json({ token });
            })
        })
        .catch(err => {
          console.error(err);
          if (err.code === 'auth/email-already-in-use') {
            return res.status(400).json({ email: 'This email is already taken'});
          }
          else {
            return res.status(500).json({ error: err.code });
          }
        })
            
      }
    })

});

exports.api = functions.https.onRequest(app);
