import { QuestionWire, SubmitGuessData, SubmitGradesData, EditAnswerData, EditGradeData, SendLoginEmailRequestData, RestErrorError } from '@trivia-nx/types';
import { userFull, isUserActiveInYear, isUserActive } from '@trivia-nx/users';
import { QueryClient, useMutation, UseMutationResult, useQuery, useQueryClient } from 'react-query';
import { dao } from './ajax';
import { questionPlus, guessesMap } from './types/question';
import { getScoreCategories } from './scorecategories';
import { processScores } from './processscores';
import { daysAgo, today } from '@trivia-nx/days';
import * as immer from 'immer';

const FIVE_MINUTES = 1000 * 60 * 5;

interface MyQueryResult<DataType> {
   isLoading: boolean,
   isError: boolean,
   data?: DataType
}

function joinQueryResults<Type1, Type2, OutputType>(results: [MyQueryResult<Type1>,  MyQueryResult<Type2>], mapData: (data1: Type1, data2: Type2) => OutputType ) : MyQueryResult<OutputType>
function joinQueryResults<Type1, Type2, Type3, OutputType>(results: [MyQueryResult<Type1>, MyQueryResult<Type2>, MyQueryResult<Type3>], mapData: (data1: Type1, data2: Type2, data3: Type3) => OutputType ) : MyQueryResult<OutputType>
function joinQueryResults(results: MyQueryResult<unknown>[], mapData: (...args: unknown[]) => unknown) : MyQueryResult<unknown> {
   return {
      isLoading: results.some(result => result.isLoading),
      isError: results.some(result => result.isError),
      data: results.every(result => result.data !== undefined) ? mapData(...results.map(result => result.data)) : undefined
   };
}

export function useWhoAmI() {
   return useQuery(['whoami'], () => dao.getWhoAmI(), { staleTime: Infinity});
}

export function useUsers(): MyQueryResult<userFull[]>
export function useUsers<T>(select: (users:userFull[]) => T): MyQueryResult<T>
export function useUsers<T>(select?: (users:userFull[]) => T): MyQueryResult<T> {
   return useQuery(['users'], () => dao.getUsers(), { select: select, staleTime: Infinity});
}

export function useUsersMap() {
   return useUsers(function(users) {
      return new Map<number, userFull>(
         users.map(user => [user.userid, user])
      );
   });
}

export function useUser(userid: number) {
   return useUsers(users => users.find(user => user.userid === userid));
}

export function useActiveUsers(year: number) {
   const query = useUsers();
   let activeUsers;
   if (query.data) {

      activeUsers = query.data.filter(user => isUserActiveInYear(user, year));

      // Re-sort active users, sorting anybody not active on the last day of this year to the end
      activeUsers.sort((a,b) => {
         // TODO this is a lot of calculation that could be repeated too many times -- move out of sort somehow
         const aActive = isUserActive(a, year + '-12-31');
         const bActive = isUserActive(b, year + '-12-31');
         if (aActive !== bActive) {
            return aActive ? -1 : 1;
         }
         return a.username.localeCompare(b.username);
      });
   }

   return {
      ...query,
      data: activeUsers
   };
}

export function useQuestions(earliestDay: string, latestDay: string): MyQueryResult<QuestionWire[]> {
   return useQuery(['questions', earliestDay, latestDay], () => dao.getQuestions({earliestDay, latestDay}), { staleTime: FIVE_MINUTES }); 
}

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

function makeQuestionGuessesMap(question: QuestionWire): guessesMap {
   const guessesMap = {} as guessesMap;
   question.guesses.forEach(guess => { 
      guessesMap['' + guess.userid] = guess;
   });
   return guessesMap;
}

function makeQuestionPlus(question: QuestionWire, users: userFull[]): questionPlus {
   const guessesMap =  makeQuestionGuessesMap(question);

   return {
      day: question.day,
      id: question.id,
      q: question.q,
      a: question.a,
      allGraded: areAllGraded(guessesMap, users, question.day),
      guessesMap
   };
}

export function useQuestionsPlus(startDay: string, endDay: string) {
   return joinQueryResults([useUsers(), useQuestions(startDay, endDay)], function(users, questions) {
      return  questions.map(question => makeQuestionPlus(question, users));
   });
}

export function useScoresData(scoresYear: number) {
   const questionQuery = useQuestionsPlus(scoresYear + '-01-01', scoresYear + '-12-31');
   const activeUsersQuery = useActiveUsers(scoresYear);
   return joinQueryResults([questionQuery, activeUsersQuery], function(questions, users) {
      return processScores(users, questions,  getScoreCategories(scoresYear) );
   });
}

export function useUnansweredQuestions()  {
   // Return every question where the user doesn't have a guess, sorted by day
   const startDay = daysAgo(30);
   const endDay = today();
   const questionsQuery = useQuestionsPlus(startDay, endDay);
   const whoAmIQuery = useWhoAmI();

   return joinQueryResults([questionsQuery, whoAmIQuery], function(questions, whoAmI) {
      if (!whoAmI) {
         return [] as questionPlus[];
      }
      else {
         return questions.filter(question => isUserActive(whoAmI, question.day) && !question.guessesMap[whoAmI.userid]);
      }
   });
}

export function useGradingQuestions() {
   const startDay = daysAgo(30);
   const endDay = today();
   const questionsQuery = useQuestionsPlus(startDay, endDay);
   const usersQuery = useUsers();
   return joinQueryResults([questionsQuery, usersQuery], function(questions, users) {
      return questions
      .filter(question => areAllGuessed(question.guessesMap, users, question.day))
      .filter(question => !question.a); 
   });
}

export function useRecentQuestions() {
   const startDay = daysAgo(30);
   const endDay = today();
   const questionsQuery = useQuestionsPlus(startDay, endDay);
   return joinQueryResults([questionsQuery, useUsers(), useWhoAmI()], function(questions, users, whoAmI) {
      if (whoAmI) {
         // Recent questions where the current user has a guess, and it's either all graded or not everybody has guessed yet
        return questions
           .filter(question => question.guessesMap[whoAmI.userid])
           .filter(question => question.allGraded || !areAllGuessed(question.guessesMap, users, question.day));
     }
     else {
        return questions.filter(question => question.allGraded);
     }
   });
}

export function updateCacheQuestion(queryClient: QueryClient, question: QuestionWire) {
   queryClient.setQueriesData<QuestionWire[]>('questions', function(data) {
      if (!data) {
         return [];
      }
      return immer.produce(data, draft => {
         const idx = draft.findIndex(cachedQuestion => question.day === cachedQuestion.day);
         if (idx >= 0) {
            draft.splice(idx, 1, question);
         }
      });
   });
}


export function useSendLoginEmailRequestMutation(): UseMutationResult<void, RestErrorError, SendLoginEmailRequestData, unknown> {
   return useMutation((vars: SendLoginEmailRequestData) => dao.sendLoginEmailRequest(vars));
}

export function useLogoutMutation() {
   const queryClient = useQueryClient();
   return useMutation(() => dao.logout(), {
      onSuccess: function() {
         queryClient.setQueryData('whoami', false);
      }
   });  
}

export function useGuessMutation() {
   const queryClient = useQueryClient();
   return useMutation((vars: SubmitGuessData) => dao.submitGuess(vars), {
      onSuccess: function(updatedQuestion) {
         updateCacheQuestion(queryClient, updatedQuestion);
      }
   });  
}

export function useGradeMutation() {
   const queryClient = useQueryClient();
   return useMutation((vars: SubmitGradesData) => dao.submitGrades(vars), {
      onSuccess: function(updatedQuestion) {
         updateCacheQuestion(queryClient, updatedQuestion);
      }
   });
}

export function useEditAnswerMutation() {
   const queryClient = useQueryClient();
   return useMutation((vars: EditAnswerData) => dao.editAnswer(vars), {
      onSuccess: function(updatedQuestion) {
         updateCacheQuestion(queryClient, updatedQuestion);
      }
   });
}

export function useEditGradeMutation() {
   const queryClient = useQueryClient();
   return useMutation((vars: EditGradeData) => dao.editGrade(vars), {
      onSuccess: function(updatedQuestion) {
         updateCacheQuestion(queryClient, updatedQuestion);
      }
   });
}

export function useEndVacationMutation() {
   const queryClient = useQueryClient();
   return useMutation(() => dao.submitEndVacation(), {
      onSuccess: function() {
         queryClient.invalidateQueries(['users']);
      }
   });
}

