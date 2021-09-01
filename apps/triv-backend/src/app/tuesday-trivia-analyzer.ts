import { dateToDayString } from '@trivia-nx/days';

const MILLIS_IN_HOUR = 60 * 60 * 1000;
const MILLIS_IN_DAY = 24 * MILLIS_IN_HOUR;


export default function analyze(dateNum: number, body: string) {
   
   const emailDate = getBestTuesday(dateNum);
   
   const ret = [];
   for (let i=1; i<=7; i++) {
      const match = body.match(new RegExp('^ *' + i + '\\. *(.*)$', 'm'));
      if (match) {
         const questionDate = emailDate + (i-1) * MILLIS_IN_DAY;
         ret.push({
            day: dateToDayString(questionDate),
            q: match[1]
         });
      }
   }

   return ret;
}

function getBestTuesday(utcDate: number) {
   const day = new Date(utcDate).getUTCDay();
   return utcDate + (2-day) * MILLIS_IN_DAY;
}

