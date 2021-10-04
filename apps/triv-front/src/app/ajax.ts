import { EditAnswerData, EditGradeData, GetQuestionsData, QuestionWire, SendLoginEmailRequestData, SubmitGradesData, SubmitGuessData } from '@trivia-nx/types';
import { userFull } from '@trivia-nx/users';
import axios, { AxiosInstance } from 'axios';
export const ajax = axios.create();

let authenticationFailureHandler: (() => void) | null  = null;

// Listen for 401 Unathorized or 403 Forbidden AJAX responses
ajax.interceptors.response.use(
   function (response) {
      // Make data the promise payload
      return response.data;
   }, 
   function (error) {
      // Listen for 401 Unathorized or 403 Forbidden AJAX responses
      const status = error?.response?.status;
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


export class DAO {
   readonly ajax: AxiosInstance;
   constructor(ajax: AxiosInstance) {
      this.ajax = ajax;
   }

   logout() : Promise<void> {
      return this.ajax.post('/auth/logout');
   }

   submitEndVacation(): Promise<void> {
      return this.ajax.post('/trivia/endvacation');
   }

   getWhoAmI(): Promise<userFull|false> {
      return this.ajax.get('/trivia/whoami');
   }

   getUsers(): Promise<userFull[]> {
      return this.ajax.get('/trivia/users');
   }

   getQuestions(vars: GetQuestionsData): Promise<QuestionWire[]> {
      return this.ajax.post('/trivia/questions', vars);
   }  

   loadQuestionDetails(day: string) {
      return this.ajax.post('/trivia/question/details');
   }

   submitGuess(data: SubmitGuessData): Promise<QuestionWire> {
      return this.ajax.put('/trivia/guess', data);
   }

   submitGrades(vars: SubmitGradesData): Promise<QuestionWire> {
      return this.ajax.put('/trivia/grade', vars);
   }

   editAnswer(data: EditAnswerData): Promise<QuestionWire> {
      return this.ajax.put('/trivia/editanswer', data);
   }

   editGrade(data: EditGradeData): Promise<QuestionWire> {
      return this.ajax.put('/trivia/editgrade', data);
   }

   submitComment(day: string, comment: string): Promise<void> {
      return this.ajax.post('/trivia/comments/add', { day, comment });
   }

   sendLoginEmailRequest(vars: SendLoginEmailRequestData): Promise<void> {
      return this.ajax.post('/auth/requestemailsignin', vars);
   }
}

export const dao = new DAO(ajax);