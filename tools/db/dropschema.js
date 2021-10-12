'use strict';

const { storage } = require('./config');

async function dropTable(table) {
   await storage.query(`DROP TABLE IF EXISTS "${table}"`);
}

module.exports = async function() {
   console.log('Dropping Schema');

   if (storage.host !== 'localhost' && storage.host !== 'host.docker.internal') {
      throw new Error(`Yikes, trying to clear all data from elsewhere than localhost: "${storage.host}"`);
   }
   
   for (const table of ['commentlog', 'log', 'guesses', 'questions', 'userstartstop', 'users']) {
      await dropTable(table);
   }
};

require('./mayberunscript')(module);