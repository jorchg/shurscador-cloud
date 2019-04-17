const algoliasearch = require('algoliasearch');
const config = require('../config/index');

// Algolia config
const ALGOLIA_ID = config.algolia.app_id;
const ALGOLIA_API_KEY = config.algolia.api_key;
const algoliaClient = algoliasearch(ALGOLIA_ID, ALGOLIA_API_KEY);

module.exports = algoliaClient;
