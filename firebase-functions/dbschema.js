let db = {
  users: {
    userId: 'HpLxVkiAm4eOAeZHaWXFJZQRxNP2',
    email: 'j@alpha.com',
    username: 'userJ',
    createdAt: '2019-12-21T06:49:26.162Z',
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/seanstack-daf2a.appspot.com/o/no-img.png?alt=media',
    bio: 'From the slums of Shaolin',
    website: 'https://userj.com',
    location: 'Staten Island'
  },
  lists: [
    {
      user: 'user',
      list: {
        '1': 'foo',
        '2': 'bar',
        '3': 'foobar'
      },
      createdAt: '2019-03-15T11:45:01.018Z',
      likeCount: 5,
      commentCount: 2
    }
  ],
  comments: [
    {
      username: 'userH',
      listId: 'arlj18t3c5yCeZDWgNgQ',
      body: 'I agree 100%',
      createdAt: '2019-12-21T09:49:26.162Z'
    }
  ]
}

const userDetails = {
  // state tree for user:
  credentials: {
    userId: 'HpLxVkiAm4eOAeZHaWXFJZQRxNP2',
    email: 'j@alpha.com',
    username: 'userJ',
    createdAt: '2019-12-21T06:49:26.162Z',
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/seanstack-daf2a.appspot.com/o/no-img.png?alt=media',
    bio: 'From the slums of Shaolin',
    website: 'https://userj.com',
    location: 'Staten Island'
  },
  likes: [
    {
      username: 'userH',
      listId: 'arlj18t3c5yCeZDWgNgQ'
    },
    {
      username: 'foo1',
      listId: '5y2cLYVW4rsgNQOzpSqd'
    }
  ]
}