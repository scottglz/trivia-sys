import { Pool, PoolConfig, types } from 'pg';
import * as days from '@trivia-nx/days';
import { userFull } from '@trivia-nx/users';
import { QuestionWire } from '@trivia-nx/types';

// Get date types as 'YYYY-MM-DD' strings instead of JS Date objects
const DATE_OID = 1082;
types.setTypeParser(DATE_OID, function(val) {
   return val;
});

interface Storage {
   getUsers: () => Promise<userFull[]>,
   createUser: (name: string, email: string, startday: string) => Promise<userFull[]>,
   startStopUser: (userid: number, day: string) => Promise<void>,
   getFullQuestions: (earliestDay: string, latestDay: string) => Promise<QuestionWire[]>
}

export default class PGStorage implements Storage {

   pool: Pool;
   host: string;

   constructor(connectionData: PoolConfig) {
      this.pool = new Pool(connectionData);
      this.host = connectionData.host;
   }

   query(text: string, params?: unknown[]) {
      if (params) {
         // some validation
         if (params.some(param => param === undefined)) {
            throw new Error('Undefined query parameter');
         }
      }
      return this.pool.query(text, params);
   }


   async queryRows(text: string, params?: unknown[]) {
      const result = await this.query(text, params);
      return result.rows;
   }

   async getUsers() {
      const users = await this.queryRows('SELECT "userid", "username", "startday", "email" FROM "users"');  
      const startStopData = await this.queryRows(`SELECT "userid", json_agg("day" ORDER BY "day" ASC) AS startstop FROM "userstartstop" GROUP BY "userid"`);
      const activeRangesMap = {};
      for (const data of startStopData) {
         const startStopNums = data.startstop.map(days.getDayNumber);
         if (startStopNums.length % 2) { // Odd
            startStopNums.push(1e20);
         }
         const activeRange = [];
         for (let i=0; i < startStopNums.length - 1; i += 2) {
            activeRange.push([startStopNums[i], startStopNums[i+1]]);
         
         }
         activeRangesMap[data.userid] = activeRange;
      }
     // Hmm?  
     for (const user of users) {
        user.activeRanges = activeRangesMap[user.userid];
     }
     return users;
   }

   async createUser(name: string, email: string, startday: string) {
      await this.query('INSERT INTO "users" ("username", "email", "startday") VALUES ($1, $2, $3)',
         [name, email, startday]
      );
      await this.query('INSERT INTO "userstartstop" ("userid", "day") SELECT "userid", $1 FROM "users" WHERE "email"=$2',
         [startday, email]
      );
      const users = await this.queryRows('SELECT "userid", "username", "startday", "email" FROM "users" WHERE "email"=$1', [email]);    
      return users[0];
   }
   
   async startStopUser(userid: number, day: string) {
      await this.query('INSERT INTO "userstartstop" ("userid", "day") VALUES ($1, $2)', [userid, day]);
   }
   
   async upsertQuestions(questions) {
      for (const question of questions) {
         await this.query('INSERT INTO "questions" ("day", "q") VALUES ($1, $2) ON CONFLICT DO NOTHING', [question.day, question.q]);
      }
   }
   
   async insertGuess(day: string, userid: number, guess: string) {
      await this.query('INSERT INTO "guesses" ("day", "userid", "guess") VALUES ($1,$2,$3)', [day, userid, guess]);
   }

   async insertComment(day: string, userid: number, comment: string) {
      const insertCommentQuery =
      `WITH new_log AS (
        INSERT INTO "log" ("day", "userid") VALUES ($1,$2) RETURNING "logid"
      )
      INSERT INTO commentlog (logid, comment) VALUES ((SELECT "logid" FROM new_log), $3) RETURNING "logid";`

      await this.query(insertCommentQuery, [day, userid, comment]);
   }

   async getComments(day: string) {
      return await this.queryRows(`SELECT * FROM "log" NATURAL JOIN "commentlog" WHERE "day"=$1`, [day]);
   }
   
   async insertAnswerAndGrades(day: string, answer: string, grades: {correct: boolean, userid: number}[]) {
      await this.query('UPDATE "questions" SET "a"=$1 WHERE "day"=$2', [answer, day]);
      for (const grade of grades) {
         await this.query('UPDATE "guesses" SET "correct"=$1 WHERE "day"=$2 AND "userid"=$3', [grade.correct, day, grade.userid]);
      }
   }
   
   async getFullQuestions(earliestDay: string, latestDay: string) {
      const sql = [
         'SELECT q."day", q."q", q."a"',
         ',json_agg(json_build_object(\'guessid\', g."guessid", \'day\', q."day", \'userid\', g."userid", \'guess\' , g."guess", \'correct\', g."correct")) AS guesses',
         'FROM "questions" q',
         'LEFT OUTER JOIN "guesses" g ON g."day"=q."day"',
         'LEFT OUTER JOIN "users" u ON g."userid"=u."userid"',
         'WHERE q."day">=$1 AND q."day"<=$2',
         'GROUP BY q."day" ORDER BY q."day" DESC'
      ].join('\n');
      const result =  await this.query(sql, [earliestDay, latestDay]);
      const rows = result.rows;
      // Process out {userid:null, guess:null, correct: null} guesses that got in there from the LEFT OUTER JOIN... I'm not
      // going to further obfuscate the query to do that
      for (const q of rows) {
         q.id = q.day;
         q.guesses = q.guesses.filter(guess => guess.userid !== null);
      }
      return rows;
   }
}

