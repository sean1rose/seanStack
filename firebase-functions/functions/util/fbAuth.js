const {admin, db} = require('./admin');

// middleware function to protect routes (each request to route that uses this middleware will require the auth token)
exports.fbAuth = (req, res, next) => {
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
      // ***adding user data to req-obj, so each protected route will now have access to that user-object***
      req.user = decodedToken;
      // then get this specific user from the collection so can add his username to our request
        // i guess we need more than just the token on each request...
      return db.collection('users')
        .where('userId', '==', req.user.uid)
        .limit(1)
        .get();
    })
    .then(data => {
      // adding username to each request.user object (used at @2)
      req.user.username = data.docs[0].data().username
      return next();
    })
    .catch(err => {
      // error handling
      console.error('err:', err)
      return res.status(500).json({error: `Error verifying token: ${err}`});
    })
}