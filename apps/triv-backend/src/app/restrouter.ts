import { json, Request, Response, urlencoded } from 'express';
import routerMaker from 'express-promise-router';
import axios from 'axios';
import { environment as config } from '../environments/environment';

import tuesdayTriviaAnalyzer from './tuesday-trivia-analyzer';
import { makeUsersCache } from './userscache';
import RestError from './resterror';
import * as days from '@trivia-nx/days';
import { isUserActive, userFull } from '@trivia-nx/users';
import shareSocketIo from './sharesocketio';
import { EditAnswerData, EditGradeData, GetQuestionsData, QuestionWire, SubmitGradesData, SubmitGuessData } from '@trivia-nx/types';
import { TriviaStorage } from './storage/triviastorage';

const router = routerMaker();
const storage = config.storage as TriviaStorage;
const usersCache = makeUsersCache(storage);

const MILLIS_IN_HOUR = 60 * 60 * 1000;

const dayNames = days.dayNames;

function allGraded(question: QuestionWire) {
   return question.guesses.every(guess => guess.correct === true || guess.correct === false);
}

function hasUserGuessed(question: QuestionWire, userid: number) {
   return question.guesses.some(guess => guess.userid === userid && !!guess.guess);
}

function allUsersGuessed(question: QuestionWire, users: userFull[]) {
   return users.every(user => !isUserActive(user, question.day) || hasUserGuessed(question, user.userid)); 
}

async function getFullQuestions(earliestDay: string, latestDay: string) {
   const today = days.today();
   if (latestDay > today) {
      latestDay = today;
   }
   const questions = await storage.getFullQuestions(earliestDay, latestDay);
   
   
   return questions;
}

router.use(json()); 
router.use(urlencoded({extended: false}));

router.get('/whoami', function(request: RequestFor<void>, response: Response) {
   if (request.user) {
      response.json(request.user);
   }
   else {
      response.json(false);
   }
});

router.post('/slack', async function(request, response) {
   response.json({
      response_type: 'in_channel',
      text: 'One moment please...'
   });
   
   const message = request.body.text;
   const responseUrl = request.body.response_url;
   const count = Math.abs(parseInt(message.trim(), 10)) || 0;
   const millis = new Date().getTime() - 8 * MILLIS_IN_HOUR - count * 24 * MILLIS_IN_HOUR;
   const day = days.daysAgo(count);
   const dayDisplay = days.formatDateFancy(new Date(millis));
   
   const questions = await getFullQuestions(day, day);

   if (!questions.length) {
      axios.post(responseUrl, {
         response_type: 'in_channel', 
         text: 'I don\'t have any trivia for ' + dayDisplay + ' (disapproval)'
      });
   }
   else {
      const message = 'Trivia for ' + dayDisplay + ': ' + questions[0].q;
      axios.post(responseUrl, {
         response_type: 'in_channel', 
         text: message
      });
   }
});



router.put('/email', async function(request, response) {
   const body = request.body;
   const dateNum = body.date;
   const emailBody = body.body;
   const questions = tuesdayTriviaAnalyzer(dateNum, emailBody);
   await storage.upsertQuestions(questions);
   response.json(questions);
});

router.post('/crasho', async function() {
   const x = null;
   const y = x.die;
   return y;
});

router.get('/users', async function(_request, response) {
   const users = await usersCache.getUsers(); 
   response.json(users);
});

router.post('/questions', async function(request: RequestFor<GetQuestionsData>, response) {
   const body = request.body;
   const user = request.user;
   if (!body.earliestDay || !body.latestDay) {
      throw new RestError(400, 'earliestDay and latestDay Required');
   }

   const questions = await getFullQuestions(body.earliestDay, body.latestDay);
   const users = await usersCache.getUsers();

   // Eliminate the data the user isn't allowed to know if they haven't guessed yet or aren't
   // logged in
   for (const question of questions) {
      const userCouldAnwerThisQuestion = user && isUserActive(user, question.day);
      const canSeeAnswers = userCouldAnwerThisQuestion ? hasUserGuessed(question, user.userid) : question.a && allUsersGuessed(question, users);
      if (!canSeeAnswers) {
         question.a = null;
         question.guesses = [];
      }
   }
  
   response.json(questions);
});

router.post('/question/details', userRequired, async function(request, response) {
   const day = request.body.day;

   const questions = await getFullQuestions(day, day);
   const question = questions[0];
   const users = await usersCache.getUsers();
   const comments = await storage.getComments(day);

   response.json({question, users, comments});
});

function userRequired(request) {
   if (!request.user) {
      throw new RestError(401, 'User Required');
   }
   else {
      return Promise.resolve('next');
   }
}

interface RequestFor<T> extends Request {
   body: T
}

router.put('/guess', userRequired, async function(request: RequestFor<SubmitGuessData>, response) {
   const { questionid: day, guess } = request.body;
   if (!guess) {
      throw new RestError(400, "Guess Required");
   }
   await storage.insertGuess(day, request.user.userid, guess);
   const question = await afterGuess(day, request.user.userid);
   response.json(question);
});

router.post('/comments/add', userRequired, async function(request, response) {
   const body = request.body;
   await storage.insertComment(body.day, request.user.userid, body.comment);
   response.json({});
});

function messageSlack(message: string) {
   const data = {
      text: message
   };
   axios.post(config.slackChannel, data);
}



async function afterGuess(day: string, userGuessing: number) {
   const questions = await getFullQuestions(day, day);
   if (!questions.length) {
      return;
   }
   const question = questions[0];
   const users = await usersCache.getUsers();
   
   sendSocketUpdates(question, userGuessing);

   if (allUsersGuessed(question, users)) {
      const guessesMsg = question.guesses.map(function(guess) {
         return '"' + guess.guess + '"';
      }).join(', ');
      
      const msg = 'All guesses are in for ' + dayNames[days.dayStringToDate(day).getDay()]  + '. ' + guessesMsg;
      messageSlack(msg);
   }

   return question;
}


const questionWrapupsAllMissed = 'Nobody got "%A%" on %DAY%. So sad.';
const questionWrapupsOneRight = 'Only %WHORIGHT% got "%A%" right on %DAY%. Everyone else is terrible.';
const questionWrapupsOneWrong = 'Everyone except poor old %WHOWRONG% got "%A%" right on %DAY%.';
const questionWrapupsAllRight = 'Everybody got "%A%" on %DAY%. Congratulations (?)';
const questionWrapupsOther = '%WHORIGHT% got "%A%" right on %DAY%. %WHOWRONG% missed it.';


function joinNames(names: string[]) {
   const last = names.length-1;
   const s = last > 0 ? names.slice(0, last).join(', ') + ' and ' : '';
   return s + names[last];
}

function sendSocketUpdates(question: QuestionWire, skipUserId: number)
{
   const hasGuessed = new Set(question.guesses.map(g => g.userid));
   
   for (const socket of shareSocketIo.io.of('/').sockets.values()) {
      const socketUserid = socket.userid;
      if (socketUserid && socketUserid !== skipUserId && hasGuessed.has(socketUserid)) {
         socket.emit('day_data', question);
      }
   }
}

async function getUserIdsToNamesMap(): Promise<Map<number, string>> {
   const usersArray = await usersCache.getUsers();
   return new Map(usersArray.map(user => [user.userid, user.username]));
}

async function afterGrading(day: string, gradingUserid: number) {
   const questions = await getFullQuestions(day, day);
   if (questions.length === 1) {
      const question = questions[0];
      sendSocketUpdates(question, gradingUserid);
      if (question.a && allGraded(question)) {
         const guesses = question.guesses;
         const userNames = await getUserIdsToNamesMap();
         const rightNames = guesses.filter(guess => guess.correct).map(guess => userNames.get(guess.userid));
         const wrongNames = guesses.filter(guess => !guess.correct).map(guess =>  userNames.get(guess.userid));
         const numberCorrect = rightNames.length;
         const numGuesses = guesses.length;
         let msg: string;
         if (numberCorrect === 0) {
            msg = questionWrapupsAllMissed;
         }
         else if (numberCorrect === 1) {
            msg = questionWrapupsOneRight;
         }
         else if (numberCorrect === numGuesses-1) {
            msg = questionWrapupsOneWrong;
         }
         else if (numberCorrect === numGuesses) {
            msg = questionWrapupsAllRight;
         }
         else {
            msg = questionWrapupsOther;
         }
         
         const whoRight = joinNames(rightNames);
         const whoWrong = joinNames(wrongNames);
         const dayDisplay = dayNames[days.dayStringToDate(day).getDay()];
         
         msg = msg.replace('%A%', question.a).replace('%DAY%', dayDisplay).replace('%WHORIGHT%', whoRight).replace('%WHOWRONG%', whoWrong);
         messageSlack(msg);
      }
      return question;
   }
}

router.put('/grade', userRequired, async function(request: RequestFor<SubmitGradesData>, response) {
   const { questionid: day, answer, grades } = request.body;
   await storage.insertAnswerAndGrades(day, answer, grades);
   const question = await afterGrading(day,  request.user.userid);
   response.json(question);
});

router.put('/editanswer', userRequired, async function(request: RequestFor<EditAnswerData>, response) {
   const { questionid: day, answer } = request.body;
   const question = (await getFullQuestions(day, day))[0];
   if (!question) {
      throw new RestError(404, 'No Question For That Day');
   }
   if (!question.a) {
      throw new RestError(400, 'Question has not been graded yet');
   }

   if (answer === question.a) {
      response.json(question);
      return;
   }

   await storage.updateAnswer(day, answer);
   const updatedQuestion = (await getFullQuestions(day, day))[0];

   messageSlack(`Answer for ${question.day} changed from "${question.a}" to "${updatedQuestion.a}". (Changed by ${request.user.username})`);

   response.json(updatedQuestion);
   
});

router.put('/editgrade', userRequired, async function(request: RequestFor<EditGradeData>, response) {
   const { questionid: day, userid, correct } = request.body;
   await storage.updateGrade(day, userid, correct);
   const questions = await getFullQuestions(day, day);
   const question = questions[0];
   if (question) {
      const guess = question.guesses.find(guess => guess.userid === userid);
      if (guess) {
         sendSocketUpdates(question, request.user.userid);
         const userNames = await getUserIdsToNamesMap();
         const userName = userNames.get(userid);
         messageSlack(`Scoring correction for ${question.day}: ${userName}'s answer of "${guess.guess}" is ${correct ? 'right' : 'wrong'}. (Changed by ${request.user.username})`);
      }
   }
   response.json(question);
});

router.post('/endvacation', userRequired, async function(request: RequestFor<void>, response) {
   const user = request.user;
   
   const today = days.today();
   // If today's question has already been graded, then the user can start tomorrow.
   // If not, then they can start today
   const questions = await storage.getFullQuestions(today, today);
   let restartWhen = today;
   if (questions && questions[0] && questions[0].a) {
      // Today's is already graded
      restartWhen = days.tomorrow();
   }

   await storage.startStopUser(user.userid, restartWhen); 
   usersCache.invalidate();
   response.json({users: await usersCache.getUsers()});
});


export default router;
