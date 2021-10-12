'use strict';
var PgStorage = require('../storage/pgstorage');
var pgOptions = {
   user: 'postgres',
   host: process.env.IS_DOCKER ? 'host.docker.internal' : 'localhost',
   database: 'postgres',
   password: 'bedrock'
};

module.exports = {
   pgOptions: pgOptions,
   storage: new PgStorage(pgOptions),
   port: process.env.PORT || 1337,
   slackChannel: require('../slack/slackchannels').smg_direct,
   mailgun: {
      apiKey: 'key-a1af20defe5d5014de01044ddf633dfb',
      domain: 'mg.thatpagethere.com'
   },
   mailFrom: 'Trivia Bot <triviabot@thatpagethere.com>'
};