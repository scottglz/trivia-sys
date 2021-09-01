import { actions } from './action';
import { dispatchType } from './reduxstore';
import axios from 'axios';
import { grade } from './components/gradingquestion';
import { userFull } from '@trivia-nx/users';
const ajax = axios.create();

const { questionsLoading, usersLoaded, questionsLoaded, commentsLoaded, setActiveUserId } = actions;

ajax.interceptors.request.use(function (config) {
   const jwt = localStorage.getItem('jwt');
   if (jwt) {
      config.headers.Authorization = 'Bearer ' + jwt;
   }
   return config;
}, function (error) {
   return Promise.reject(error);
});

let authenticationFailureHandler: (() => void) | null  = null;

// Listen for 401 Unathorized or 403 Forbidden AJAX responses
ajax.interceptors.response.use(
   function (response) {
      return response;
   }, 
   function (error) {
      const status = error.response.status;
      if (status === 401 || status === 403) {
         if (authenticationFailureHandler) {
            authenticationFailureHandler();
         }
      }
      return Promise.reject(error);
   }
);



export function setAuthenticationFailureHandler(handler: () => void) {
   authenticationFailureHandler = handler;
}

export function getWhoAmI() {
   return (dispatch: dispatchType) => {
      ajax.get('/trivia/whoami').then(function(response) {
         const user: false | userFull = response.data;
         if (user === false)
         {
            dispatch(setActiveUserId(0, 'Guest'));
         }
         else {
            dispatch(setActiveUserId(user.userid, user.username));
         }

      }).catch(function(err) {
         console.log(err);
      });
   };
}

export function logout() {
   return (dispatch: dispatchType) => {
      ajax.post('/auth/logout').then(function() {
         dispatch(setActiveUserId(null, null));
      }).catch(function(err) {
         console.log(err);
      });
   }
}

export function loadQuestions(startDay: string, endDay: string) {
   return (dispatch: dispatchType) => {
      dispatch(questionsLoading(startDay, endDay));
      ajax.post('/trivia/questions', {
         earliestDay: startDay,
         latestDay: endDay
      }).then(function(response) {
         dispatch(usersLoaded(response.data.users));
         dispatch(questionsLoaded(startDay, endDay, response.data.questions));
      }).catch(function(err) {
         console.log(err);
      });
   };
}

export function loadQuestionDetails(day: string) {
   return (dispatch: dispatchType) => {
      //dispatch(questionsLoading(startDay, endDay));
      ajax.post('/trivia/question/details', {
         day: day
      }).then(function(response) {
         dispatch(commentsLoaded(day, response.data.comments));
         dispatch(usersLoaded(response.data.users));
         dispatch(questionsLoaded(day, day, [response.data.question]));
      }).catch(function(err) {
         console.log(err);
      });
   };
}

export function submitGuess(questionId: string, guess: string) {
   return (dispatch: dispatchType) => {
      ajax.put('/trivia/guess', {
         day: questionId,  // Gross, should fix
         guess: guess
      }).then(function(response) {
         dispatch(questionsLoaded(response.data.day, response.data.day, [response.data]))
      }).catch(function(err) {
         console.log(err);
      });
   };
}


export function submitGrades(questionId: string, answer: string, grades: grade[]) {
   return (dispatch: dispatchType) => {
      ajax.put('/trivia/grade', {
         day: questionId, // gross, for now I know they are the same but I need to fix this
         answer: answer,
         grades: grades
      }).then(function(response) {
         dispatch(questionsLoaded(response.data.day, response.data.day, [response.data]))
      }).catch(function(err) {
         console.log(err);
      });
   };
}

export function submitEndVacation(userid: number) {
   return (dispatch: dispatchType) => {
      ajax.post('/trivia/endvacation', {
         userid: userid
      }).then(function(response) {
         // Reloading entire users for now... should optimize
         dispatch(usersLoaded(response.data.users));
      }).catch(function(err) {
         console.log(err);
      });
   };
}

export function submitComment(day: string, comment: string) {
   return (dispatch: dispatchType) => {
      ajax.post('/trivia/comments/add', { day, comment }).then(function(response) {
         // todo
      }).catch(function(err) {
         console.log(err);
      });
   };
}

export function sendLoginEmailRequest(email: string) {
   return ajax.post('/auth/requestemailsignin', {
      email: email
   });
}



   


