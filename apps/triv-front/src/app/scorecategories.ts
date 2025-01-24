import * as days from '@trivia-nx/days';
import { userFull, isUserActive } from '@trivia-nx/users';
import { questionPlus } from './types/question';
import { GuessWire } from '@trivia-nx/types';

export interface scoreObj {
   value: number,
   outOf?: number
}

function incrementBasicScore(previousScore: scoreObj, question: questionPlus, user: userFull) {
   const guess = question.guessesMap[user.userid];
   const isTry = !!guess;
   return {
      value: isTry && guess.correct ? previousScore.value + 1 : previousScore.value,
      outOf: isTry ?  (previousScore.outOf || 0) + 1 : previousScore.outOf
   };
}

function getBasicScore(gradedQuestions: questionPlus[], user: userFull, firstDay='0000-00-00', lastDay='9999-99-99') {
   const initialScore = {
      value: 0,
      outOf: 0
   } as scoreObj;
   return gradedQuestions
      .filter(question => question.day >= firstDay && question.day <= lastDay && isUserActive(user, question.day))
      .reduce((score, question) => incrementBasicScore(score, question, user), initialScore);
}

export interface graphDatum {
   name: string,
   [userid: number]: number
}

function getBasicGraphData(questionsIn: questionPlus[], activeUsers: userFull[], firstDay: string, lastDay: string) {
   const data = [];
   const hits = {} as {[userid: number]: number};
   const atBats = {} as {[userid: number]: number};;
   activeUsers.forEach(user => hits[user.userid] = atBats[user.userid] = 0);
   const questions = questionsIn.filter(question => question.day >= firstDay && question.day <= lastDay);
   for (let i=questions.length-1; i >= 0; i--) {
      const question = questions[i];
      if (question.allGraded) {
         const datum = { name: question.day} as graphDatum;
         activeUsers.forEach(user => {
            const userId = user.userid;
            const guess = question.guessesMap[userId];
            const isTry = guess && guess.guess;
            if (isTry) {
               atBats[userId]++;
               if (guess.correct) {
                  hits[userId]++;
               }
            }
            if (atBats[userId]) {
               datum[userId] = hits[userId];
            }
         });
         data.push(datum);
      }
   }
   return data;
}



function pad2(x: number) {
   return (x < 0 || x > 9 ? '' : '0') + x;
}

function getLongestStreak(gradedQuestions: questionPlus[], user: userFull, isGuessStreaky: (guess: GuessWire) => boolean) {
   let currentStreak = 0;
   let longestStreak = 0;
   gradedQuestions.forEach(function(question) {
      if (isGuessStreaky(question.guessesMap[user.userid])) {
         currentStreak++;
      }
      else {
         longestStreak = Math.max(currentStreak, longestStreak);
         currentStreak = 0;
      }
   });
   return Math.max(currentStreak, longestStreak);
}

function countWhere<Type>(array: Type[], predicate: (element: Type, index: number) => boolean) {
   return array.reduce((total, element, i) => predicate(element, i) ? total+1 : total, 0);
}

function getOnlyRights(gradedQuestions: questionPlus[], user: userFull) {
   return countWhere(gradedQuestions, question => {
      const guess = question.guessesMap[user.userid];
      return guess && guess.correct === true && Object.values(question.guessesMap).every(guess => guess.userid === user.userid || !guess.correct);
   });
}

function getOnlyWrongs(gradedQuestions: questionPlus[], user: userFull) {
   return countWhere(gradedQuestions, question => {
      const guess = question.guessesMap[user.userid];
      return guess && guess.correct === false &&  Object.values(question.guessesMap).every(guess => guess.userid === user.userid || guess.correct);
   });
}

function isMonday(dayString: string) {
   const date = days.dayStringToDate(dayString);
   return date.getUTCDay() === 1;
}

function getMondaysScore(gradedQuestions: questionPlus[], user: userFull) {
   return {
      value: countWhere(gradedQuestions, question => question.guessesMap[user.userid] && question.guessesMap[user.userid].correct === true && isMonday(question.day) ),
      outOf: countWhere(gradedQuestions, question => isMonday(question.day))
   };
}


export interface scoreCategoryDefinition {
   name: string,
   inLeaderboard?: boolean,
   getUserScore: (gradedQuestions: questionPlus[], user: userFull) => scoreObj,
   getGraphData?: (scoresData: questionPlus[], activeUsers: userFull[]) => graphDatum[]
}

export function getScoreCategories(year: number) : scoreCategoryDefinition[] {
   const ret = [{
      name: 'Year to Date',
      inLeaderboard: true,
      getUserScore: function(gradedQuestions, user) {
         return getBasicScore(gradedQuestions, user, year + '-01-01', year + '-12-31');
      },
      
      getGraphData: function(scoresData, activeUsers) {
         return getBasicGraphData(scoresData, activeUsers, year + '-01-01', year + '-12-31');
      }
   }] as scoreCategoryDefinition[] ;
   
   if (year === 2018) {
      ret.push({
         name: 'Since Harv',
         getUserScore: function(gradedQuestions, user) {
            return getBasicScore(gradedQuestions, user, '2018-07-14', '2018-12-31');
         },
         
         getGraphData: function(scoresData, activeUsers) {
            return getBasicGraphData(scoresData, activeUsers, '2018-07-14', '2018-12-31');
         }
      });
   }
   else if (year === 2019) {
      ret.push({
         name: 'Since Sturges',
         getUserScore: function(gradedQuestions, user) {
            return getBasicScore(gradedQuestions, user, '2019-01-18', '2019-12-31');
         },
         
         getGraphData: function(scoresData, activeUsers) {
            return getBasicGraphData(scoresData, activeUsers, '2019-01-18', '2019-12-31');
         }
      });   
      
      ret.push({
         name: 'Since Lee',
         getUserScore: function(gradedQuestions, user) {
            return getBasicScore(gradedQuestions, user, '2019-09-27', '2019-12-31');
         },
         
         getGraphData: function(scoresData, activeUsers) {
            return getBasicGraphData(scoresData, activeUsers, '2019-09-27', '2019-12-31');
         }
      });   
   }
   else if (year === 2021) {
      ret.push({
         name: 'Since Dillon',
         getUserScore: function(gradedQuestions, user) {
            return getBasicScore(gradedQuestions, user, '2021-06-25', '2021-12-31');
         },
         
         getGraphData: function(scoresData, activeUsers) {
            return getBasicGraphData(scoresData, activeUsers, '2021-06-25', '2021-12-31');
         },

         inLeaderboard: true
      });   
   }  

   const now = new Date();
   const nowMonth = now.getUTCMonth();
   ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].forEach(function(name, month) {
      if (new Date(year, month, 1) <= now) {
         ret.push({
            name: name,
            inLeaderboard: nowMonth === month, 
            getUserScore: function(gradedQuestions, user) {
               const yearMonth = year + '-' + pad2(month+1);
               return getBasicScore(gradedQuestions, user, yearMonth + '-01', yearMonth + '-31');
            },
            
            getGraphData: function(scoresData, activeUsers) {
               const yearMonth = year + '-' + pad2(month+1);
               return getBasicGraphData(scoresData, activeUsers, yearMonth + '-01', yearMonth + '-31');
            }

         });
      }
   });
   
   ret.push({
      name: 'Longest Streak',
      getUserScore: function(gradedQuestions, user) {
         return { value: getLongestStreak(gradedQuestions, user, guess => guess && guess.correct === true)};
      }
   });
   
   ret.push({
      name: 'Longest Miss Streak',
      getUserScore: function(gradedQuestions, user) {
         return {value: getLongestStreak(gradedQuestions, user, guess => guess && !guess.correct && isUserActive(user, guess.day))};
      }
   });

   ret.push({
      name: 'Only Rights',
      getUserScore: function(gradedQuestions, user) {
         return { value: getOnlyRights(gradedQuestions, user)};
      }
   });
   
   ret.push({
      name: 'Only Wrongs',
      getUserScore: function(gradedQuestions, user) {
         return { value: getOnlyWrongs(gradedQuestions, user)};
      }
   });
   
   if (year < 2022) {
      ret.push({
         name: 'Mondays',
         getUserScore: function(gradedQuestions, user) {
            return getMondaysScore(gradedQuestions, user);
         }
      });
   }
   
   
   return ret;
   
}


