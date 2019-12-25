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
    return db.doc(`/lists/${snapshotOfLikeDoc.data().listId}`).get()
      .then(listDoc => {
        if (listDoc.exists && listDoc.data().username !== snapshotOfLikeDoc.data().username) {
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
      .catch(err => {
        console.error(err);
      })
});

exports.deleteNotificationOnUnlike = functions
  // .region('us-central1')
  .firestore
  .document('likes/{id}')
  .onDelete(snapshotOfLikeDoc => {
    return db.doc(`/notifications/${snapshotOfLikeDoc.id}`)
      .delete()
      .catch(err => {
        console.log(err)
      })
});

exports.createNotificationOnComment = functions
  // .region('us-central1')
  .firestore.document('comments/{id}')
  .onCreate(snapshotOfCommentDoc => {
    return db.doc(`/lists/${snapshotOfCommentDoc.data().listId}`)
      .get()
      .then(listDoc => {
        if (listDoc.exists && listDoc.data().username !== snapshotOfCommentDoc.data().username) {
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
      .catch(err => {
        console.error(err);
      })

});

exports.onUserImageChange = functions
  .firestore
  .document(`/users/{userId}`)
  .onUpdate(change => {
    // change obj has 2 properties
    console.log('change.before.data()', change.before.data());
    console.log('change.after.data()', change.after.data());
    // update in multiple places -> so batch
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      console.log('image has changed');
      const batch = db.batch();
      return db
        .collection('lists')
        .where('username', '==', change.before.data().username)
        .get()
        .then(listData => {
          listData.forEach(listDoc => {
            const list = db.doc(`/lists/${listDoc.id}`);
            batch.update(list, { userImage: change.after.data().imageUrl});
          })
          return batch.commit();
        })
    } else return true;
  });

// when user deletes a list -> delete all associated likes, comments and notifications
exports.onListDelete = functions
  .firestore
  .document('/lists/{listId}')
  .onDelete((snapshot, context) => {
    const listId = context.params.listId;
    const batch = db.batch();
    return db.collection('comments').where('listId', '==', listId).get()
      .then(commentData => {
        commentData.forEach(commentDoc => {
          batch.delete(db.doc(`/comments/${commentDoc.id}`));
        })
        // delete the likes
        return db.collection('likes').where('listId', '==', listId).get()
      })
      .then(likeData => {
        likeData.forEach(likeDoc => {
          batch.delete(db.doc(`/likes/${likeDoc.id}`));
        })
        return db.collection('notifications').where('listId', '==', listId).get()
      })
      .then(notificationData => {
        notificationData.forEach(notificationDoc => {
          batch.delete(db.doc(`/notifications/${notificationDoc.id}`));
        })
        return batch.commit();
      })
      .catch(err => console.error(err));
  });