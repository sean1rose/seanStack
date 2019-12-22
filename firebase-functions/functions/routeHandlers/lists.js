const { db } = require('../util/admin')

exports.getAllLists = (req, res) => {
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
  });
};

exports.createList = (req, res) => {
  const newList = {
    title: req.body.title,
    username: req.user.username, // @2
    userImage: req.user.imageUrl,
    createdAt: new Date().toISOString(),
    list: req.body.list,
    likeCount: 0,
    commentCount: 0
  };
  // will add this list-document to the collection of lists
  db
  .collection('lists')
  .add(newList)
  .then(doc => {
    // @
    // upon successful doc-creation in lists collection -> return 1) status code + 2) json
    // TODO: list should be a get() of the document (not the 'newList' created fromt the request)
    const listResponse = newList;
    listResponse.listId = doc.id;
    res.status(200).json(listResponse);
  })
  .catch(err => {
    // error handling
    res.status(500).json({error: `Something amiss: ${err}`});
    console.log('err:', err)
  });
};

// fetch one list
exports.getList = (req, res) => {
  // gets requested list by id then adds comments
  let listData = {};
  db.doc(`/lists/${req.params.listId}`).get()
    .then(listDoc => {
      if (!listDoc.exists) {
        return res.status(404).json({ error: 'List not found'});
      }
      listData = listDoc.data();
      listData.listId = listDoc.id;
      return db
        .collection('comments')
        .orderBy('createdAt', 'desc')
        .where('listId', '==', req.params.listId)
        .get();
    })
    .then(commentDocData => {
      listData.comments = [];
      commentDocData.forEach(commentDoc => {
        listData.comments.push(commentDoc.data());
      });
      return res.status(201).json(listData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

// comment on a list
exports.commentOnList = (req, res) => {
  // clean/validate comment data
  if (req.body.body.trim() === '') return res.status(400).json({message: 'No comment text to add'})

  const newComment = {
    username: req.user.username, // req.user is passed by our middleware
    listId: req.params.listId,
    body: req.body.body,
    createdAt: new Date().toISOString(),
    userImage: req.user.imageUrl
  };

  // make sure list exists before adding comment (is this really necessary?)
  db.doc(`/lists/${req.params.listId}`)
    .get()
    .then(listDoc => {
      if (!listDoc.exists) return res.status(404).json({ error: 'List not found'});
      
      // otherwise create comment add to comments doc
      return listDoc.ref.update({commentCount: listDoc.data().commentCount + 1});
    })
    .then(() => {
      return db
        .collection('comments')
        .add(newComment)
        
    })
    .then(commentDoc => {
      // upon successful doc-creation in lists collection -> return 1) status code + 2) json
      console.log('comment before data ', commentDoc)
      return res.status(201).json({ message: `comment document ${commentDoc.id} created successfully`, comment: newComment })
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

// like a list
exports.likeList = (req, res) => {
  const likeDocument = db.collection('likes').where('username', '==', req.user.username)
    .where('listId', '==', req.params.listId).limit(1)

  // %reference to the actual list-document -> this will be updated w/ the like count increment
  const listDocument = db.doc(`/lists/${req.params.listId}`);

  let listData; // for our tracking purposes and to send that data to FE (not the actual data from colleciton)
  listDocument.get()
    .then(listDoc => {
      if (listDoc.exists) {
        // 
        listData = listDoc.data();
        listData.listId = listDoc.id;
        return likeDocument.get();
      }
      else {
        return res.status(400).json({error: 'list not found'});
      }
    })
    .then(likeDocData => {
      console.log('likeDocData - ', likeDocData);
      if (likeDocData.empty) {
        // if like doc doesn't exist
        return db.collection('likes').add({
          listId: req.params.listId,
          username: req.user.username
        })
        .then(() => {
          // after successfully like -> increment count
          console.log('like count before - ', listData.likeCount)
          listData.likeCount++;
          console.log('like count after - ', listData.likeCount)
          // %need to actually update like count of the list-document in db-collection
          return listDocument.update({likeCount: listData.likeCount});
        })
        .then(() => {
          return res.json(listData); // return the list w/ updated count
        })
      }
      else {
        return res.status(400).json({ error: 'list already liked'});
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    })
}

exports.unlikeList = (req, res) => {
  const likeDocument = db.collection('likes').where('username', '==', req.user.username)
    .where('listId', '==', req.params.listId).limit(1)

  // %reference to the actual list-document -> this will be updated w/ the like count increment
  const listDocument = db.doc(`/lists/${req.params.listId}`);

  let listData; // for our tracking purposes and to send that data to FE (not the actual data from colleciton)
  listDocument.get()
    .then(listDoc => {
      if (listDoc.exists) {
        // 
        listData = listDoc.data();
        listData.listId = listDoc.id;
        return likeDocument.get();
      }
      else {
        return res.status(400).json({error: 'list not found'});
      }
    })
    .then(likeDocData => {
      if (likeDocData.empty) {
        // can't unlike a list that hasn't been liked yet...
        console.error(err);
        res.status(500).json({ error: err.code });
      }
      else {
        // need to delete the like document first
        return db
          .doc(`/likes/${likeDocData.docs[0].id}`)
          .delete()
          .then(() => {
            listData.likeCount--;
            return listDocument.update({likeCount: listData.likeCount})
          })
          .then(() => {
            return res.json(listData);
          })
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    })  
};

// delete single list 
exports.deleteList = (req, res) => {
  const document = db.doc(`/lists/${req.params.listId}`);
  document.get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'List not found'});
      }
      // need to make sure token owner is the owner of this list...
      if (doc.data().username !== req.user.username){
        return res.status(403).json({ error: 'Unauthorized bruh'});
      }
      else {
        return document.delete();
      }
    })
    .then(() => {
      res.json({ message: `List w/ listId ${req.params.listId} deleted successfully`});
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    })
}