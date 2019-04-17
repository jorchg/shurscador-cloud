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
      forumId: thread.forumId,
      id: thread.id,
      lastSeen: thread.lastSeen,
      title: thread.title,
      type: thread.type,
    };
    return firestoreSvc
      .collection('threads')
      .doc(thread.id)
      .set(doc);
  },
};

module.exports = firestore;
