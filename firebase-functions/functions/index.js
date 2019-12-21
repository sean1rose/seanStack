const app = require('express')(); // start up express server
const functions = require('firebase-functions');


// firestore setup (db-collection read/writes)
const admin = require('firebase-admin'); // use admin to access firestore db (your collections)
const serviceAccount = require('./key/serviceAccount.json')
// initialize firestore db w/ necessary key
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://seanstack-daf2a.firebaseio.com"
});
const db = admin.firestore()


// firebase setup (authentication: to create authenticated users)
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
// will use firebase (instead of firestore) to create authorized user...
firebase.initializeApp(firebaseConfig);


// *get lists route*
app.get('/lists', (req, res) => {
    // for access to db -> admin.firestore() === db
  db
  .collection('lists')
  .orderBy('createdAt', 'desc')
  .get()
  .then((collectionOfLists) => {
    // have snapshot of the collection of lists
    let lists = [];
    collectionOfLists.forEach((listDoc) => {
      lists.push({
        listId: listDoc.id,
        username: listDoc.data().username,
        createdAt: listDoc.data().createdAt,
        list: listDoc.data().list,
        title: listDoc.data.title
      });
    })
    return res.status(200).json({lists});
  })
  .catch(err => {
    // error handling
    res.status(500).json({error: `Something amiss: ${err}`});
    console.log('err', err)
  })
});

// middleware function
const FBAuth = (req, res, next) => {
  let idToken;
  // if the headers on the request has an authorization value and that value starts w/ 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    idToken = req.headers.authorization.split('Bearer ')[1];
  }
  else {
    console.error('No token found');
    return res.status(403).json({error: 'Unauthorized'});
  }
  // need to verify that we authorized this token...
  admin.auth().verifyIdToken(idToken)
    .then(decodedToken => {
      // need to add this data to our request object
      console.log('decodedToken -', decodedToken)
      req.user = decodedToken;
      // then get this specific user from the collection so can add his username to our request
        // i guess we need more than just the token on each request...
      return db.collection('users')
        .where('userId', '==', req.user.uid)
        .limit(1)
        .get();
    })
    .then(data => {
      // adding username to each request.user object
      req.user.username = data.docs[0].data().username
      return next();
    })
    .catch(err => {
      // error handling
      console.error('err:', err)
      return res.status(500).json({error: `Error verifying token: ${err}`});
    })
}

// *post list route*
app.post('/list', FBAuth, (req, res) => {
  const newList = {
    title: req.body.title,
    username: req.user.username,
    createdAt: new Date().toISOString(),
    list: req.body.list
  };
  // will add this list-document to the collection of lists
  db
  .collection('lists')
  .add(newList)
  .then(doc => {
    // @
    // upon successful doc-creation in lists collection -> return 1) status code + 2) json
    // TODO: list should be a get() of the document (not the 'newList' created fromt the request)
    res.status(200).json({ message: `document ${doc.id} created successfully`, list: newList })
  })
  .catch(err => {
    // error handling
    res.status(500).json({error: `Something amiss: ${err}`});
    console.log('err:', err)
  });
});

// ***validation helpers BEGIN***
const isStringEmpty = str => {
  if (str.trim() === '') {
    return true;
  }
  else {
    return false;
  }
}

const isEmail = email => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(emailRegEx)) {
    return true
  } else {
    return false
  }
}

const doesAuthRequestPassValidation = authRequest => {
  let errors = {};  
  // validate each field to make sure newUser properties are all populated...
  if (isStringEmpty(authRequest.email)) {
    errors.email = 'Email field must be populated'
  } else if (!isEmail(authRequest.email)) {
    errors.email = 'Must be a valid email address'
  }

  if (isStringEmpty(authRequest.password)) errors.password = 'Password field must be populated'
  if (authRequest.hasOwnProperty('confirmPassword') && authRequest.password !== authRequest.confirmPassword) errors.confirmPassword = 'Password fields must match'
  if (authRequest.hasOwnProperty('username') && isStringEmpty(authRequest.username)) errors.username = 'Username field must be populated'

  // errors obj must be empty in order to proceed (otherwise we have an error)
  if (Object.keys(errors).length > 0) return {doesPass: false, errors}
  else return {doesPass: true}
}
// ***validation helpers END***


// *post signup route*
app.post('/signup', (req, res) => {
  // when post signup route is hit -> start with newUser object...
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    username: req.body.username,
  }

  // ***VALIDATION***
  const {doesPass, errors} = doesAuthRequestPassValidation(newUser)
  // if does not pass validation -> return 400 error
  if (!doesPass) return res.status(400).json(errors)


  let token, userId, userDocToCreate;
  // create a document in the the db-collection @ path `/users/${newUser.username}`...
    // then get a snapshot of that created document...
    // get ===> https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentReference.html#get
  db.doc(`/users/${newUser.username}`).get()
    .then(doc => {
      // doc === document snapshot ===> https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentSnapshot.html
      if (doc.exists) {
        // this username is already taken -> 1) return 400 status + 2) return json
        return res.status(400).json({ username: `The username ${newUser.username} is already taken`});
      }
      // user doesn't exist in db yet, so can proceed with db write
      else {
        // native firebase API to create authorized user account w/ email and pw
        return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
          .then(userCredential => {
            // returns userCredential === (userCredential) ===> https://firebase.google.com/docs/reference/js/firebase.auth.html#usercredential
            // userCredential.user ===> https://firebase.google.com/docs/reference/js/firebase.User.html
            userId = userCredential.user.uid;
            return userCredential.user.getIdToken(); // grab the token that firebase-auth creates upon successful authentication
          })
          .then(idToken => {
            // we have the token & we have the auth-user -> want to create a document in db-collection @ path `/users/${newUser.username}`
            token = idToken;
            // create user document with these properties...
            userDocToCreate = {
              username: newUser.username,
              email: newUser.email,
              createdAt: new Date().toISOString(),
              userId
            }
            // save these creds to a doc in our user collection...
              // give the firebase db the document path (`/users/`)
              // set -> creates the document ===> https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentReference.html#set
            db.doc(`/users/${newUser.username}`).set(userDocToCreate)
          })
          .then(() => {
            // no data available in the promise returned from set...
            // @
            // upon successful doc-creation in users collection -> return 1) status code + 2) json
            return res.status(201).json({ token, user: userDocToCreate});
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

// LOGIN route
app.post('/login', (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  };

  // ***VALIDATION***
  const {doesPass, errors} = doesAuthRequestPassValidation(user)
  // if does not pass validation -> return 400 error
  if (!doesPass) return res.status(400).json(errors)


  // use firebase API to login
  firebase.auth().signInWithEmailAndPassword(user.email, user.password)  
    .then(userCredential => {
        // returns userCredential === (userCredential) ===> https://firebase.google.com/docs/reference/js/firebase.auth.html#usercredential
        // userCredential.user ===> https://firebase.google.com/docs/reference/js/firebase.User.html
        userId = userCredential.user.uid;
        return userCredential.user.getIdToken(); // grab the token that firebase-auth creates upon successful authentication
      })
      .then(token => {
        // note we are only returning the token (not the logged in user obj)
        return res.json({token});
      })
      .catch(err => {
        console.error(err);
        if (err.code === 'auth/wrong-password') {
          return res.status(403).json({ general: 'Incorrect password'});
        }
        else {
          return res.status(500).json({ error: err.code });
        }

      })
  
})

exports.api = functions.https.onRequest(app);
