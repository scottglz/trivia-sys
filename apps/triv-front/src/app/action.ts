import { userFull } from '@trivia-nx/users';
import { questionAndGuessIds } from './reduxstore';
import { guessesMap, questionWithGuesses } from './types/question';

export const SET_MESSAGE_PAGE_MESSAGE =  'SET_MESSAGE_PAGE_MESSAGE';
export const SET_ACTIVE_USERID = 'SET_ACTIVE_USERID';   
export const SET_MAINVIEW = 'SET_MAINVIEW';
export const USERS_LOADED = 'USERS_LOADED';
export const SCORES_SET_YEAR = 'SCORES_SET_YEAR';
export const QUESTION_DEETS_SET_DAY = 'QUESTION_DEETS_SET_DAY';
export const QUESTIONS_LOADING = 'QUESTIONS_LOADING';
export const QUESTIONS_LOADED = 'QUESTIONS_LOADED';
export const COMMENTS_LOADED = 'COMMENTS_LOADED';

interface usersMap {
   [userid: number]: userFull
}

function normalizeUsers(users: userFull[]): usersMap {
   const obj = {} as usersMap;
   users.forEach(function(user) {
      obj[user.userid] = user;
   });
   return obj;
}

function normalizeQuestionsWithGuesses(questions: questionWithGuesses[]) {
   
   const guessesObj = {} as guessesMap;
   const questionsObj = {} as { [day: string]: questionAndGuessIds };
   
   questions.forEach(function(question) {
      const guesses = question.guesses || [];
      guesses.forEach(function(guess) {
         guessesObj[guess.guessid] = {
            ...guess,
            day: question.day 
         };
      });
      
      questionsObj[question.day] = {
         day: question.day,
         q: question.q,
         a: question.a,
         id: question.day,
         guessIds: guesses.map(g => g.guessid),
      };
   });
   
   return {
      questions: questionsObj,
      guesses: guessesObj
   };
}
export const actions = {

   setMessagePageMessage(message: string) {
      return {
         type: SET_MESSAGE_PAGE_MESSAGE as typeof SET_MESSAGE_PAGE_MESSAGE,
         message: message
      };
   },
   
   
   setActiveUserId(userid: number|null, username: string|null) {
      return {
         type: SET_ACTIVE_USERID as typeof SET_ACTIVE_USERID,
         payload: {
            userid: userid,
            username: username
         }
      };
   },
   
   setMainView(viewName: string) {
      return {
         type: SET_MAINVIEW as typeof SET_MAINVIEW,
         payload: viewName
      };
   },
   
   usersLoaded(users: userFull[]) {
      return {
         type: USERS_LOADED as typeof USERS_LOADED,
         users: normalizeUsers(users)
      };
      
   },
     
   scoresSetYear(year: number) {
      return {
         type: SCORES_SET_YEAR as typeof SCORES_SET_YEAR,
         year: year
      };
   },
   
   
   setQuestionDeetsDay(day: string) {
      return {
         type: QUESTION_DEETS_SET_DAY as typeof QUESTION_DEETS_SET_DAY,
         day: day
      };
   },

    questionsLoading(fromDay: string, toDay: string) {
      return {
         type: QUESTIONS_LOADING as typeof QUESTIONS_LOADING,
         fromDay: fromDay,
         toDay: toDay
         
      };
   },

   questionsLoaded(fromDay: string, toDay: string, questionsWithGuesses: questionWithGuesses[]) {
      const {questions, guesses} = normalizeQuestionsWithGuesses(questionsWithGuesses);
      return {
         type: QUESTIONS_LOADED as typeof QUESTIONS_LOADED,
         fromDay: fromDay,
         toDay: toDay,
         questions: questions,
         guesses: guesses
      };
   },

   commentsLoaded(day: string, comments: string) {
      return {
         type: COMMENTS_LOADED as typeof COMMENTS_LOADED,
         day: day,
         comments: comments
      }
   }

}

type actionsType = typeof actions;

export type action = {
   [k in keyof actionsType]: ReturnType<actionsType[k]>
}[keyof actionsType];

