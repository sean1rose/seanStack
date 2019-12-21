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
  })
}

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
    res.status(200).json({ message: `document ${doc.id} created successfully`, list: newList })
  })
  .catch(err => {
    // error handling
    res.status(500).json({error: `Something amiss: ${err}`});
    console.log('err:', err)
  });
}