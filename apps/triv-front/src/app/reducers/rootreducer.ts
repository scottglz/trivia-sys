import * as at from '../action';
import type { action } from '../action';
import { combineReducers } from 'redux';
import { addRange, subtractRange } from '@trivia-nx/ranger';
import { getDayNumber } from '@trivia-nx/days';


function reduceUser(state = {}, action: action) {
   switch (action.type) {
      case at.SET_ACTIVE_USERID: 
         return {
            ...state, 
            userid: action.payload.userid,
            username: action.payload.username
         };
      default:
         return state;
   }

}

function reduceMainview(state = '', action: action) {
   switch (action.type) {
      case at.SET_MAINVIEW:
         return action.payload;
      default: 
         return state;   
   }
}

function reduceMessagePageMessage(state = '', action: action) {
   switch(action.type) {
      case at.SET_MESSAGE_PAGE_MESSAGE:
         return action.message;
      default:
         return state;   
   }
}

function reduceUsers(state = {}, action: action) {
   switch (action.type) {
      case at.USERS_LOADED:
         return {...state, ...action.users };
      default:
         return state;
   }
}


function reduceLoadingDays(state = [], action: action) {
   switch(action.type) {
      case at.QUESTIONS_LOADING:
         return addRange(state, getDayNumber(action.fromDay), getDayNumber(action.toDay));
      case at.QUESTIONS_LOADED:
         return subtractRange(state, getDayNumber(action.fromDay), getDayNumber(action.toDay));
      case at.SET_ACTIVE_USERID: 
         return []; 
      default: 
         return state;
   }
}

function reduceLoadedDays(state = [], action: action) {
   switch(action.type) {
      case at.QUESTIONS_LOADED:
         return addRange(state, getDayNumber(action.fromDay), getDayNumber(action.toDay));
      case at.SET_ACTIVE_USERID: 
         return []; 
      default:
         return state;
   }
}

function reduceQuestions(state = {}, action: action) {
   switch (action.type) {
      case at.QUESTIONS_LOADED:   
         return { ...state, ...action.questions };
      default:
         return state;
   }
}

function reduceComments(state = {}, action: action) {
   switch (action.type) {
      case at.COMMENTS_LOADED:
         return { ...state, [action.day]: action.comments };
      default:
         return state;   
   }
}

function reduceGuesses(state = {}, action: action) {
   switch (action.type) {
      case at.QUESTIONS_LOADED:
         return { ...state, ...action.guesses };
      default:
         return state;
   }
}

function defaultScoresState() {
   return {
      year: new Date().getFullYear()
   };
}

function reduceScoresView(state = defaultScoresState(), action: action) {
   switch (action.type) {
      case at.SCORES_SET_YEAR:
         return {
            ...state,
            year: action.year,
            loaded: false
         };
      default: return state;
   }
}

function reduceQuestionDeetsView(state = {}, action: action) {
   switch (action.type) {
      case at.QUESTION_DEETS_SET_DAY:
         return {
            ...state, 
            day: action.day,
            loaded: false
         };
      default: return state;
   }
}


export const rootReducer = combineReducers({
   messagePageMessage: reduceMessagePageMessage,
   mainview: reduceMainview,
   user: reduceUser,
   users: reduceUsers,
   loadingDays: reduceLoadingDays,
   loadedDays: reduceLoadedDays,
   questions: reduceQuestions,
   guesses: reduceGuesses,
   comments: reduceComments,
   scoresView: reduceScoresView,
   questionDeetsView: reduceQuestionDeetsView
});
