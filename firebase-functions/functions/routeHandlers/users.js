const { admin, db } = require('../util/admin');
const firebaseConfig = require('../util/firebaseConfig')
const {doesAuthRequestPassValidation} = require('../util/validators')


// firebase setup (authentication: to create authenticated users)
const firebase = require('firebase');
// will use firebase (instead of firestore) to create authorized user...
firebase.initializeApp(firebaseConfig);


exports.signup = (req, res) => {
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

  const noImg = 'no-img.png';

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
              imageUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${noImg}?alt=media`,
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

}

exports.login = (req, res) => {
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
  
}

exports.uploadImage = (req, res) => {
  const BusBoy = require('busboy');
  const path = require('path');
  const os = require('os');
  const fs = require('fs');

  const busboy = new BusBoy({ headers: req.headers});
  let imageFileName;
  let imageToBeUploaded = {};

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
      return res.status(400).json({ error: 'Invalid file type. Need jpeg or png'});
    }
    
    // image.png
    const imageExtension = filename.split('.')[filename.split('.').length - 1];
    // 574637739.png
    imageFileName = `${Math.round(Math.random() * 1000000000)}.${imageExtension}`;
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = {filepath, mimetype};
    file.pipe(fs.createWriteStream(filepath));
  });

  busboy.on('finish', () => {
    admin.storage().bucket(`${firebaseConfig.storageBucket}`).upload(imageToBeUploaded.filepath, {
      resumable: false,
      metadata: {
        metadata: {
          contentType: imageToBeUploaded.mimetype
        }
      }
    })
    .then(() => {
      // construct imageUrl to add to our user
      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`;
      return db.doc(`/users/${req.user.username}`).update({ imageUrl});
    })
    .then(() => {
      return res.status(200).json({ message: 'Image uploaded successfully'});
    })
    .catch(err => {
      console.error('err:', err)
      return res.status(500).json({error: err.code});
    })
  });

  busboy.end(req.rawBody);
}