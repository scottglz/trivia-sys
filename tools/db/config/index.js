'use strict';

var env = process.env.IGX_WHICH_DBS || 'production';
env = env.trim();
// eslint-disable-next-line no-console
console.log(`Loading ${env} Configuration`);
var config = require(`./${env}`);
module.exports = config;