const firestore = require('../modules/firestore');

const algolia = require('../modules/algolia');

module.exports = (app) => {
  app.post('/index/thread', (req, res) => {
    if (req.method.toLowerCase() !== 'post') return res.sendStatus(405);
    const threads = req.body;

    let functions = [], addFunctions = [], docsToAdd = [];
    threads.forEach(thread => functions.push(firestore.getThread(thread.id)));

    Promise.all(functions)
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
      .catch(e => res.status(500).send(e.message));
  });
}
