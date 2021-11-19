import { dateToDayString } from '@trivia-nx/days';

const MILLIS_IN_HOUR = 60 * 60 * 1000;
const MILLIS_PER_DAY = MILLIS_IN_HOUR * 24;

export function getQuestions(body: string): string[] {
   const ret = [];
   for (let i=1; i<=5; i++) {
      const match = body.match(new RegExp('^ *' + i + '\\. *(.*)$', 'm'));
      if (match) {
         ret.push(match[1]);
      }
   }

   return ret;
}

const FRIDAY = 5;

export function analyze(utcDate: number, body: string): { day: string, q: string }[] {
   const day = new Date(utcDate).getUTCDay();
   const rawQuestions = getQuestions(body);

   // Mon's Mail -- Tuesday's question
   // ...
   // Thursday's Mail -- Friday's question
   // Friday's Mail -- Sat, Sun, Mon's question

   let questions: string[];
   if (day === FRIDAY) {
      // Need three for the weekend. Take the middle 3
      questions = rawQuestions.slice(1, 4);
   }
   else {
      // Just the third
      questions = rawQuestions.slice(2, 3);
   }
   
   return questions.map(function(question, i) {
      return {
         q: question,
         day: dateToDayString(utcDate + (i+1) * MILLIS_PER_DAY)
      };
   });
};
