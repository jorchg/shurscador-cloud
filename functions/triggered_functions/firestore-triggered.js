const functions = require('firebase-functions');
const algolia = require('../modules/algolia');

const ALGOLIA_INDEX_NAME = 'shurscador';

const onThreadInserted = functions.firestore.document('threads/{threadId}')
  .onCreate((snap, context) => {
    const thread = snap.data();
    const algoliaIndex = algolia.initIndex(ALGOLIA_INDEX_NAME);
    return algoliaIndex.addObject({
      objectID: thread.id,
      createdBy: thread.createdBy,
      createdById: thread.createdById,
      forumId: thread.forumId,
      title: thread.title,
      link: thread.link,
      type: thread.type,
      forumName: thread.forumName,
    })
  });

const onThreadUpdated = functions.firestore.document('threads/{threadId}')
  .onUpdate((change, context) => {
    const newDoc = change.after.data();
    const algoliaIndex = algolia.initIndex(ALGOLIA_INDEX_NAME);
    newDoc.objectID = context.params.threadId;
    return algoliaIndex.saveObject(newDoc);
  });

const onThreadDeleted = functions.firestore.document('threads/{threadId}')
  .onDelete((change, context) => {
    const algoliaIndex = algolia.initIndex(ALGOLIA_INDEX_NAME);
    const deletedId = context.params.threadId;
    return algoliaIndex.deleteObject(deletedId);
  });

  module.exports = {
    onThreadInserted,
    onThreadUpdated,
    onThreadDeleted,
  };
