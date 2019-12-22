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
    res.status(200).json({ message: `list document ${doc.id} created successfully`, list: newList })
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
  db.doc(`/lists/${req.params.listId}`).get()
    .then(listDoc => {
      if (!listDoc.exists) return res.status(404).json({ error: 'List not found'});
      
      // otherwise create comment add to comments doc
      return db
        .collection('comments')
        .add(newComment)
        .then(commentDoc => {
          // upon successful doc-creation in lists collection -> return 1) status code + 2) json
          console.log('comment before data ', commentDoc)
          return res.status(201).json({ message: `comment document ${commentDoc.id} created successfully`, comment: newComment })
        })
        .catch(err => {
          console.error(err);
          res.status(500).json({ error: err.code });
        });
    });
};