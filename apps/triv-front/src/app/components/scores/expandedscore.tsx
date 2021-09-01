import { default as React, Fragment, MouseEvent, useState } from 'react';
import classNames from 'classnames';
import { formatDateFancy } from '@trivia-nx/days';
import { isUserActive, userFull } from '@trivia-nx/users';
import { guess, question, questionPlus } from '../../types/question';


function UserAnswerDetails(props: {
   user: userFull,
   guess: guess
}) {
   const {user, guess} = props;
   const classes = classNames('rounded shadow-md py-1 px-4 text-right', guess.correct === true && 'text-black bg-green-200', guess.correct === false && 'text-white bg-red-500');
   return (
      <div className={classes} key={guess.guessid}>
         <span className="font-bold float-left block mr-4">{user.username}</span>
         <span>{guess.guess}</span>
      </div>
   );
}

function QuestionDetails(props: {
   question: question
}) {
   const { question } = props;
   return ( 
      <div className="flex flex-col justify-between text-black bg-wheat text-left rounded shadow-md p-4 col-start-1 col-span-2 row-start-1 row-span-3">
         <div>
            <div className="font-bold text-sm mb-2">{formatDateFancy(question.day)}</div>
            <div>{question.q}</div>
         </div>
         <div className="self-end italic text-right">{question.a}</div>
      </div>   
   );
}

function UsersWithNoAnswer(props: {
   users: userFull[]
}) {
   const { users } = props;
   return (
      <div>
      { 'Waiting on ' + users.map(user => user.username).join(', ') }
      </div>   
   );
}

export function ExpandedScore(props: {
   users: userFull[],
   question: questionPlus,
   onClickExpanded?: (event: MouseEvent) => void
}) {
   const { users, question, onClickExpanded } = props;
   const usersWithNoAnswer = users.filter(user =>  !question.guessesMap[user.userid] && isUserActive(user, question.day));
   return ( 
      <div className="grid gap-4 template-columns-auto-180-1fr" onClick={onClickExpanded}>
         <QuestionDetails question={question} />
         {
            users.map(user => {
               const guess = question.guessesMap[user.userid];
               return guess && <UserAnswerDetails key={user.userid} user={user} guess={guess} />
            })
         }
         {
            !!usersWithNoAnswer.length && <UsersWithNoAnswer users={usersWithNoAnswer} /> 
         }
      </div>
   );
}

