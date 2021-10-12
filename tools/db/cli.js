const { Pool } = require('pg');
var config = require('./config');
const pool = new Pool(config.pgOptions);

const readline = require('readline');
const rl = readline.createInterface({
   input: process.stdin,
   output: process.stdout,
   prompt: 'ENTER QUERY> '
});

rl.prompt();

rl.on('line', (line) => {
   pool.query(line).then((result) => {
      console.log(JSON.stringify(result.rows, null, 1));
      rl.prompt();
   }).catch((error) => {
      console.log('ERROR: ' + JSON.stringify(error, null, 1));
      rl.prompt();
   });  
   
}).on('close', () => {
   console.log('Have a great day!');
   process.exit(0);
});