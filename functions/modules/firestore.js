const admin = require('./admin');
const firestoreSvc = admin.firestore();

const firestore = {
  getThread: (id = null) => {
    return firestoreSvc
      .collection('threads')
      .doc(id)
      .get();
  },
  addThread: (thread = {}) => {
    const doc = {
      createdBy: thread.createdBy,
      createdById: thread.createdById,
      forumId: thread.forumId,
      id: thread.id,
      lastSeen: thread.lastSeen,
      title: thread.title,
      type: thread.type,
      forumName: thread.forumName,
    };
    return firestoreSvc
      .collection('threads')
      .doc(thread.id)
      .set(doc);
  },
  getPost: (id = null) => {
    return firestoreSvc
      .collection('posts')
      .doc(id)
      .get();
  },
  addPost: (post = {}) => {
    const doc = {
      id: post.id,
      postBy: post.postBy,
      postById: post.postById,
      postContent: post.postContent,
      postCount: post.postCount,
      threadId: post.threadId,
      threadTitle: post.threadTitle,
      type: post.type,
    };
    return firestoreSvc
      .collection('posts')
      .doc(post.id)
      .set(doc);
  },
};

module.exports = firestore;
