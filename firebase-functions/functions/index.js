const app = require('express')(); // start up express server
const functions = require('firebase-functions');
const { getAllLists, createList , getList, commentOnList} = require('./routeHandlers/lists');
const { signup, login, uploadImage, addUserDetails, getAuthenticatedUser } = require('./routeHandlers/users');
const { fbAuth } = require('./util/fbAuth')

/*
  In simple terms, you can think of required files as functions that return a single object, 
  and you can add properties (strings, numbers, arrays, functions, anything) to the object that's returned by setting them on exports. e.g. exports.getAllLists, exports.signup, etc
  -https://stackoverflow.com/questions/5311334/what-is-the-purpose-of-node-js-module-exports-and-how-do-you-use-it
*/

// *lists routes (get and post)*
app.get('/lists', getAllLists); // not protected -> want non-logged-in-users to be able to view lists
app.post('/list', fbAuth, createList); // protected
app.get('/list/:listId', getList); // not protected -> want non-logged-in-users to be able to view lists
/* TODO: 
  delete list
  like list
  unlike list
  comment on list
*/
app.post('/list/:listId/comment', fbAuth, commentOnList)

// *users routes (post signup and post login)*
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', fbAuth, uploadImage);
app.post('/user', fbAuth, addUserDetails);
app.get('/user', fbAuth, getAuthenticatedUser);

exports.api = functions.https.onRequest(app);
