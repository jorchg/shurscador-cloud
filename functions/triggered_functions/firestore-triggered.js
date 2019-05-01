const functions = require('firebase-functions');
const algolia = require('../modules/algolia');
const firestoreSvc = require('../modules/firestore');

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
      type: thread.type,
      forumName: thread.forumName,
    });
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

const onPostInserted = functions.firestore.document('posts/{postId}')
  .onCreate(async (snap, context) => {
    const post = snap.data();
    const algoliaIndex = algolia.initIndex(ALGOLIA_INDEX_NAME);
    const thread = await firestoreSvc.getThread(post.threadId);
    const threadData = thread.data();
    const forumName = threadData.forumName;
    const forumId = threadData.forumId;

    return algoliaIndex.addObject({
      objectID: post.id,
      postBy: post.postBy,
      postById: post.postById,
      postContent: post.postContent,
      postCount: post.postCount,
      threadId: post.threadId,
      threadTitle: post.threadTitle,
      type: post.type,
      forumName,
      forumId,
    });
  });

const onPostUpdated = functions.firestore.document('posts/{postId}')
  .onUpdate((change, context) => {
    const newDoc = change.after.data();
    const algoliaIndex = algolia.initIndex(ALGOLIA_INDEX_NAME);
    newDoc.objectID = context.params.postId;
    return algoliaIndex.saveObject(newDoc);
  });

const onPostDeleted = functions.firestore.document('posts/{postId}')
  .onDelete((change, context) => {
    const algoliaIndex = algolia.initIndex(ALGOLIA_INDEX_NAME);
    const deletedId = context.params.postId;
    return algoliaIndex.deleteObject(deletedId);
  });

  module.exports = {
    onThreadInserted,
    onThreadUpdated,
    onThreadDeleted,
    onPostInserted,
    onPostUpdated,
    onPostDeleted,
  };
