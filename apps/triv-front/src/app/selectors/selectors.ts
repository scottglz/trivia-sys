import { createSelector } from 'reselect';
import { getScoreCategories } from '../scorecategories';
import { processScores } from '../processscores';
import { rangesContain, rangesOverlap } from '@trivia-nx/ranger';
import { getDayNumber } from '@trivia-nx/days';
import { userFull, isUserActive, isUserActiveInYear } from '@trivia-nx/users';
import { guessesMap, questionPlus } from '../types/question';
import { reduxState } from '../reduxstore';
import { GuessWire } from '@trivia-nx/types';

const currentUserId = (state: reduxState) => state.user.userid;
const rawQuestionsIndex = (state: reduxState) => state.questions;
const guessesIndex = (state: reduxState) => state.guesses;
const usersIndex = (state: reduxState) => state.users;
const scoresYear = (state: reduxState) => state.scoresView.year;

function objectValues<Type>(obj: Record<string, Type>) {
   return Object.keys(obj).map(key => obj[key]);
}

function objectMap<Type, TransformedType>(object: Record<string, Type>, mapFn: (value: Type) => TransformedType ) {
   return Object.keys(object).reduce(function(result, key) {
     result[key] = mapFn(object[key]);
     return result;
   }, {} as Record<string, TransformedType>)
 }

function sortByDay<Type extends {day:string}>(array: Type[]) {
   array = array.slice(0);
   array.sort((a,b) => b.day.localeCompare(a.day));
   return array;
}

// An array of all system users, sorted alphabetically
const usersArray = createSelector(usersIndex, function(usersIndex) {
   const usersArray = objectValues(usersIndex);
   usersArray.sort((a,b) => a.username.localeCompare(b.username));
   return usersArray;
});

// An array of the users who were active at any time during the year state.scoresView.year. They are sorted with
// users inactive at the end of the year last, then alphabetically
const activeUsers = createSelector(usersArray, scoresYear, function(usersArray, scoresYear) {
   const activeUsers = usersArray.filter(user => isUserActiveInYear(user, scoresYear));

   // Re-sort active users, sorting anybody not active on the last day of this year to the end
   activeUsers.sort((a,b) => {
      // TODO this is a lot of calculation that could be repeated too many times -- move out of sort somehow
      const aActive = isUserActive(a, scoresYear + '-12-31');
      const bActive = isUserActive(b, scoresYear + '-12-31');
      if (aActive !== bActive) {
         return aActive ? -1 : 1;
      }
      return a.username.localeCompare(b.username);
   });
   return activeUsers;
});


function userGraded(guessesMap: guessesMap, user: userFull) {
   const guess = guessesMap[user.userid];
   return guess && typeof(guess.correct) === 'boolean';
}

function areAllGraded(guessesMap: guessesMap, users: userFull[], day: string) { 
   return users.every(user => !isUserActive(user, day) || userGraded(guessesMap, user));
}

function areAllGuessed(guessesMap: guessesMap, users: userFull[], day: string) { 
   return users.every(user => !isUserActive(user, day) || guessesMap[user.userid]);
}


// The questions index, processed to give each an array of actual guesses, and a map of userIds -> guesses, and an allGraded flag
const questionsIndex = createSelector(rawQuestionsIndex, guessesIndex, usersArray, function(rawQuestionsIndex, guessesIndex, usersArray) {
   return objectMap(rawQuestionsIndex, question => {
      const guessesMap = {} as Record<string, GuessWire>;
      question.guessIds.forEach(guessId => { 
         const guess = guessesIndex[guessId];
         guessesMap['' + guess.userid] = guess;
      });
      return {
         ...question,
         allGraded: !!question.a && areAllGraded(guessesMap, usersArray, question.day),
         guessesMap
      } as questionPlus;
   });
});


const questionsArray = createSelector(questionsIndex, function(questionsIndex) {
   return sortByDay(objectValues(questionsIndex));
});

const unansweredQuestions = createSelector(currentUserId, questionsArray, usersIndex, function(currentUserId, questionsArray, users) {
   // Return every question where the user doesn't have a guess, sorted by day
   const user = users[currentUserId];
   if (!user) {
      return [];
   }
   return questionsArray.filter(question => isUserActive(user, question.day) && !question.guessesMap[currentUserId]);
});


const gradingQuestions = createSelector([questionsArray, usersArray], function(questionsArray, usersArray) {
   // Return every question where everybody has a guess and (the question doesn't have an answer or at least one guess isn't graded)
   return questionsArray
      .filter(question => areAllGuessed(question.guessesMap, usersArray, question.day))
      .filter(question => !question.a); 
});

const recentQuestions = createSelector([questionsArray, usersArray, currentUserId], function(questionsArray, usersArray, currentUserId) {
   // Last 30 questions where the current user has a guess, and it's either all graded or not everybody has guessed yet
   return questionsArray
      .filter(question => question.guessesMap[currentUserId])
      .filter(question => question.allGraded || !areAllGuessed(question.guessesMap, usersArray, question.day))
      .slice(0, 30);
});



const scoresData = createSelector([activeUsers, questionsArray, scoresYear], function(activeUsers, questionsArray, year) {
   const syear = '' + year;
   const yearQuestions = questionsArray.filter(q => q.day.indexOf(syear) === 0);
   return processScores(activeUsers, yearQuestions,  getScoreCategories(year));
});



const graphCategory = (state: reduxState) => state.scoresView.graphCategory;

const graphData = createSelector([scoresYear, activeUsers, questionsArray, graphCategory], function(year, activeUsers, questionsArray, graphCategory) {
   const scoreCategory = getScoreCategories(year).find(cat => cat.name === graphCategory);
   return scoreCategory && scoreCategory.getGraphData ? scoreCategory.getGraphData(questionsArray, activeUsers) : [];
});

const questionDeetsDay = (state: reduxState) => state.questionDeetsView.day;

const questionDeetsData = createSelector([questionsArray, questionDeetsDay], function(questionsArray, questionDeetsDay) {
   return questionsArray.filter(q => q.day === questionDeetsDay)[0];
});


function needsReload(state: reduxState, firstDay: string, lastDay: string) {
   const firstDayNumber = getDayNumber(firstDay);
   const lastDayNumber = getDayNumber(lastDay);
   return !rangesContain(state.loadingDays, firstDayNumber, lastDayNumber) 
       && !rangesContain(state.loadedDays, firstDayNumber, lastDayNumber);
      
}

function isReloading(state: reduxState, firstDay: string, lastDay: string) {
   const firstDayNumber = getDayNumber(firstDay);
   const lastDayNumber = getDayNumber(lastDay);
   return rangesOverlap(state.loadingDays, firstDayNumber, lastDayNumber);
 }
   
export {
   usersArray,
   activeUsers,
   questionsArray, // All loaded questions
   unansweredQuestions,
   gradingQuestions,
   recentQuestions,
   scoresData,
   graphData,
   questionDeetsData,
   needsReload,
   isReloading
};


