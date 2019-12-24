const app = require('express')(); // start up express server
const functions = require('firebase-functions');
const { getAllLists, createList , getList, deleteList, commentOnList, likeList, unlikeList} = require('./routeHandlers/lists');
const { signup, login, uploadImage, addUserDetails, getAuthenticatedUser, getUserDetails, markNotificationsAsRead } = require('./routeHandlers/users');
const { fbAuth } = require('./util/fbAuth')
const { db } = require('./util/admin')

/*
  In simple terms, you can think of required files as functions that return a single object, 
  and you can add properties (strings, numbers, arrays, functions, anything) to the object that's returned by setting them on exports. e.g. exports.getAllLists, exports.signup, etc
  -https://stackoverflow.com/questions/5311334/what-is-the-purpose-of-node-js-module-exports-and-how-do-you-use-it
*/

// *lists routes (get and post)*
app.get('/lists', getAllLists); // not protected -> want non-logged-in-users to be able to view lists
app.post('/list', fbAuth, createList); // protected
app.get('/list/:listId', getList); // not protected -> want non-logged-in-users to be able to view lists
app.delete('/list/:listId', fbAuth, deleteList);
app.post('/list/:listId/comment', fbAuth, commentOnList);
app.get('/list/:listId/like', fbAuth, likeList);
app.get('/list/:listId/unlike', fbAuth, unlikeList);

// *users routes (post signup and post login)*
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', fbAuth, uploadImage);
app.post('/user', fbAuth, addUserDetails);
app.get('/user', fbAuth, getAuthenticatedUser);
app.get('/user/:username', getUserDetails);
app.post('/notifications', markNotificationsAsRead);

exports.api = functions.https.onRequest(app);

exports.createNotificationOnLike = functions
  // .region('us-central1')
  .firestore
  .document('likes/{id}')
  .onCreate(snapshotOfLikeDoc => {
    // when like is created -> have a snapshot of that like doc
    db.doc(`/lists/${snapshotOfLikeDoc.data().listId}`).get()
      .then(listDoc => {
        if (listDoc.exists) {
          return db.doc(`/notifications/${snapshotOfLikeDoc.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: listDoc.data().username,
            sender: snapshotOfLikeDoc.data().username,
            type: 'like',
            read: false,
            listId: listDoc.id
          });
        }
      })
      .then(() => {
        console.log('like note success??? this is on successful set')
        return;
      })
      .catch(err => {
        console.error(err);
        return ;
      })
});

exports.deleteNotificationOnUnlike = functions
  // .region('us-central1')
  .firestore
  .document('likes/{id}')
  .onDelete(snapshotOfLikeDoc => {
    db.doc(`/notifications/${snapshotOfLikeDoc.id}`)
      .delete()
      .then(() => {
        console.log('unlike note delete happend???')
        return;
      })
      .catch(err => {
        console.log(err)
        return;
      })
})


exports.createNotificationOnComment = functions
  // .region('us-central1')
  .firestore.document('comments/{id}')
  .onCreate(snapshotOfCommentDoc => {
    db.doc(`/lists/${snapshotOfCommentDoc.data().listId}`)
      .get()
      .then(listDoc => {
        if (listDoc.exists) {
          return db.doc(`/notifications/${snapshotOfCommentDoc.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: listDoc.data().username,
            sender: snapshotOfCommentDoc.data().username,
            type: 'comment',
            read: false,
            listId: listDoc.id
          });
        }
      })
      .then(() => {
        return;
      })
      .catch(err => {
        console.error(err);
        return ;
      })

});

