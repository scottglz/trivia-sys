'use strict';

const { Pool, types } = require('pg');
var config = require('../config.js');
const pool = new Pool(config.development.connection);
const DATE_OID = 1082;
types.setTypeParser(DATE_OID, function(val) {
  return val;
});

async function go() {
    var userRows = await pool.query('select * from "users"');
    var questionRows = await pool.query('select * from "questions"');
    var guessRows = await pool.query('select * from "guesses"');
    return JSON.stringify({
        users: userRows.rows,
        questions: questionRows.rows,
        guesses: guessRows.rows
    });
}

go().then(function(result) {
    console.log(result);
    process.exit(0);
}).catch(function(err) {
    console.error('Error: ' + JSON.stringify(err, null, 1));
    process.exit(-1);
}); 