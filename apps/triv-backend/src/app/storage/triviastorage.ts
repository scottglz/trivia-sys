import { userFull } from '@trivia-nx/users';
import { QuestionWire } from '@trivia-nx/types';

export interface TriviaStorage {
    getUsers: () => Promise<userFull[]>,
    createUser: (name: string, email: string, startday: string) => Promise<userFull[]>,
    startStopUser: (userid: number, day: string) => Promise<void>,
    getFullQuestions: (earliestDay: string, latestDay: string) => Promise<QuestionWire[]>,
    upsertQuestions: (questions: {day: string, q: string}[]) => Promise<void>,
    insertGuess: (day: string, userid: number, guess: string) => Promise<void>,
    insertAnswerAndGrades: (day: string, answer: string, grades: {correct: boolean, userid: number}[]) => Promise<void>,
    getComments: (day: string) => Promise<{day: string, userid: number, comment: string}[]>,
    insertComment: (day: string, userid: number, comment: string) => Promise<void>
 }