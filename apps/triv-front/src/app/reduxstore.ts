import { applyMiddleware, compose, createStore } from 'redux';
import { rootReducer } from './reducers/rootreducer';
import reduxThunk from 'redux-thunk';
import { guessesMap, question } from './types/question';
import { range } from '@trivia-nx/ranger';
import { userFull } from '@trivia-nx/users';

const thunkApplied = applyMiddleware(reduxThunk);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const storeEnhancer = (window as any).__REDUX_DEVTOOLS_EXTENSION__ ? compose(thunkApplied, (window as any).__REDUX_DEVTOOLS_EXTENSION__()) : thunkApplied;
   
export const rootStore = createStore(rootReducer, storeEnhancer);
export const dispatch = rootStore.dispatch.bind(rootStore);

export type dispatchType = typeof dispatch;

export interface questionAndGuessIds extends question {
    guessIds: number[]
 }
/*
 export interface comment {
    day: string,
    commentDate: Date,
    username: string;
    text: string;
 }
 */
 
 export interface reduxState {
    messagePageMessage?: string,
    mainview: string,
    user: {
       userid: number,
       username: string
    },
    users: {[key: string]: userFull},
    loadingDays: range[],
    loadedDays: range[],
    questions: {[key: string]: questionAndGuessIds},
    guesses: guessesMap,
    scoresView: {
       year: number,
       loaded: boolean,
       graphCategory?: string
    },
    questionDeetsView: {
       day?: string
    }
 }