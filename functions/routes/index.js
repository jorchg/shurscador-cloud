const firestore = require('../modules/firestore');

const algolia = require('../modules/algolia');

module.exports = (app) => {
  app.post('/index/thread', (req, res) => {
    if (req.method.toLowerCase() !== 'post') return res.sendStatus(405);
    const threads = req.body;

    let functions = [], addFunctions = [], docsToAdd = [];
    threads.forEach(thread => functions.push(firestore.getThread(thread.id)));

    return Promise.all(functions)
      .then((results) => {
        results.forEach((result, index) => { threads[index].exists = result.exists });
        return threads.filter(thread => thread.exists === false);
      })
      .then((filteredDocs) => {
        docsToAdd = filteredDocs;
        filteredDocs.forEach(doc => addFunctions.push(firestore.addThread(doc)));
        return Promise.all(addFunctions);
      })
      .then(result => res.sendStatus(200))
      .catch(e => {
        console.error(e);
        res.status(500).send(e.message);
      });
  });

  app.post('/index/post', async(req, res) => {
    if (req.method.toLowerCase() !== 'post') return res.sendStatus(405);
    try {
      const posts = req.body;
  
      let functions = [], addFunctions = [];
      posts.forEach(post => functions.push(firestore.getPost(post.id)));
  
      const results = await Promise.all(functions);
      results.forEach((result, index) => { posts[index].exists = result.exists });
      const filteredDocs = posts.filter(post => post.exists === false);
      filteredDocs.forEach(doc => addFunctions.push(firestore.addPost(doc)));
      await Promise.all(addFunctions);
      return res.sendStatus(200);
    } catch (e) {
      return res.status(500).send(e.message);
    }
  });
}
