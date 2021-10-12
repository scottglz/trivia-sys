'use strict';
var PgStorage = require('../storage/pgstorage');
var pgOptions = {
   user: 'postgres',
   host: 'localhost',
   database: 'postgres',
   password: 'bedrock'
};

module.exports = {
   storage: new PgStorage(pgOptions),
   pgOptions: pgOptions,
   port: process.env.PORT || 1337,
   slackChannel: require('../slack/slackchannels').smg_direct
};