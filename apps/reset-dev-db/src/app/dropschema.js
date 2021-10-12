async function dropTable(storage, table) {
   await storage.query(`DROP TABLE IF EXISTS "${table}"`);
}

export default async function(storage) {
   console.log('Dropping Schema');

   if (storage.host !== 'localhost' && storage.host !== 'host.docker.internal') {
      throw new Error(`Yikes, trying to clear all data from elsewhere than localhost: "${storage.host}"`);
   }
   
   for (const table of ['commentlog', 'log', 'guesses', 'questions', 'userstartstop', 'users']) {
      await dropTable(storage, table);
   }
};
