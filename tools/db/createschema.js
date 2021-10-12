'use strict';

const { storage } = require('./config');

var userTableQuery = [
   'CREATE TABLE IF NOT EXISTS "users" (',
   '"userid" SERIAL PRIMARY KEY NOT NULL,',
   '"username" text NOT NULL,',
   '"email" text NOT null,',
   '"startday" date NOT NULL default(\'01-01-2017\')',
   ')'
].join('\n');

var userStartStopDaysQuery = `CREATE TABLE IF NOT EXISTS "userstartstop" ("userid" integer REFERENCES "users" ("userid"), "day" date NOT NULL, CONSTRAINT "pk_startstop" PRIMARY KEY("userid", "day"))`;
   


var questionTableQuery = [
   'CREATE TABLE IF NOT EXISTS "questions" (',
   '"day" date PRIMARY KEY NOT NULL,',
   '"q" text NOT NULL,',
   '"a" text NULL',
   ')'
].join('\n');

var guessTableQuery = `
CREATE TABLE IF NOT EXISTS "guesses" (
   "guessid" SERIAL PRIMARY KEY NOT NULL,
   "day" date REFERENCES "questions" ("day"),
   "userid" integer REFERENCES "users" ("userid"),
   "guess" text NOT NULL,
   "correct" boolean NULL,
   CONSTRAINT "u_guesses" UNIQUE ("day", "userid")
)`;

var logTableQuery = `
CREATE TABLE IF NOT EXISTS "log" (
   "logid" SERIAL PRIMARY KEY NOT NULL,
   "logtime" timestamp NOT NULL DEFAULT NOW(),
   "day" date REFERENCES "questions" ("day") NOT NULL,
   "userid" integer REFERENCES "users" ("userid") NULL
)`;

var correctAnswerLogTableQuery = `
CREATE TABLE IF NOT EXISTS "correctanswerlog" (
   "logid" integer PRIMARY KEY REFERENCES "log" ("logid") NOT NULL,
   "answerday" date REFERENCES "questions" ("day") NOT NULL,
   "answer" text NOT NULL
)`;

var gradeGuessLogTableQuery = `
CREATE TABLE IF NOT EXISTS "gradeguesslog" (
   "logid" integer PRIMARY KEY REFERENCES "log" ("logid") NOT NULL,
   "guessid" integer REFERENCES "guesses" ("guessid"),
   "correct" boolean NULL
)`;

var commentLogTableQuery = `
CREATE TABLE IF NOT EXISTS "commentlog" (
   "logid" integer PRIMARY KEY REFERENCES "log" ("logid") NOT NULL,
   "comment" text NOT NULL
)`;


module.exports = async function go() {
   console.log('Creating Schema');
   await storage.query(userTableQuery);
   await storage.query(userStartStopDaysQuery);
   await storage.query(questionTableQuery);
   await storage.query(guessTableQuery);
   await storage.query(logTableQuery);
   await storage.query(commentLogTableQuery);

};

require('./mayberunscript')(module);