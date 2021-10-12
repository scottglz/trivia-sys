'use strict';
var PgStorage = require('../storage/pgstorage');
var pgOptions = {
   user: 'trivacct@trivia-postgres-11',
   host: 'trivia-postgres-11.postgres.database.azure.com',
   database: 'postgres',
   password: 'X#2r7#aP91'
};

module.exports = {
   pgOptions: pgOptions,
   storage: new PgStorage(pgOptions),
   port: process.env.PORT || 1337,
   slackChannel: require('../slack/slackchannels').trivia_channel,
   mailgun: {
      apiKey: 'key-a1af20defe5d5014de01044ddf633dfb',
      domain: 'mg.thatpagethere.com'
   },
   mailFrom: 'Trivia Bot <triviabot@thatpagethere.com>'
};