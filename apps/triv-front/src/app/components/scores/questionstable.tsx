import { default as React, MouseEvent, ReactNode, useState } from 'react';
import classNames from 'classnames';
import { isUserActive, userFull } from '@trivia-nx/users';
import { ExpandedScore } from './expandedscore';
import { isDayInYear } from '@trivia-nx/days';
import { BsChatQuote } from 'react-icons/bs';
import { questionPlus } from '../../types/question';
import { useQuestionsPlus, useActiveUsers } from '../../datahooks';

interface childrenAndClassNameProps {
   className?: string,
   children?: ReactNode  
}

function ScoresTableEntry({className='', children} : childrenAndClassNameProps) {
   return (
      <div className={`h-6 truncate ${className}`}>
         {children}
      </div>
   )
}

function ScoresTableHeaderEntry({className='', children}: childrenAndClassNameProps) {
   return <ScoresTableEntry className={`pl-1 ${className}`}>{children}</ScoresTableEntry>
}

function ScoresTableBodyEntry({className='', children}: childrenAndClassNameProps) {
   return <ScoresTableEntry className={` bg-white text-black border-r border-b border-gray-800 pl-1 ${className}`}>{children}</ScoresTableEntry>
}

function UserAnswerHeader({name}: { name: string }) {
   return <div className="truncate vertical-rl text-right pb-2 h-32 w-7">{name}</div>;
}

function UserAnswerCell({className='', children}: childrenAndClassNameProps) {
   return <ScoresTableEntry className={`w-7 bg-white text-gray-600 border-r border-b border-gray-800 ${className}`}>{children}</ScoresTableEntry>
}


function UsersAnswersCells(props : {
   users: userFull[],
   question: questionPlus
}) {
   const { users, question } = props;
  
   const userCells = users.map(function(user) {
      const userid = user.userid;
      if (!isUserActive(user, question.day)) {
         return <ScoresTableEntry className="w-7" key={'?' + userid} />;
      }
      const guess = question.guessesMap[userid];
      
      if (guess) {
         const pending = typeof(guess.correct) !== 'boolean' && guess.guess.length > 0;
         const classes = classNames({
            'bg-green-200': guess.correct === true, 
            'bg-red-500': guess.correct === false
         });
         return <UserAnswerCell key={guess.guessid} className={classes}>{pending && <BsChatQuote className="bg-white w-full h-full p-1"/>}</UserAnswerCell>;
      }
      else {
         return <UserAnswerCell key={'?' + userid } />;
      }
   });
   
   // eslint-disable-next-line react/jsx-no-useless-fragment
   return <>{userCells}</>;
}


function ScoreRow(props: {
   question: questionPlus,
   users: userFull[]
}) {
   const [expanded, setExpanded] = useState(false);
   const { question, users } = props;
   if (!question.id) {
      throw new Error('no question.id');
   }
   
   function onClickExpanded(eo: MouseEvent) {
      // Collapse if we're clicking on the acual scores row
      if (eo.target === eo.currentTarget) {
          setExpanded(false);
       }
   }
   
   if (expanded) {
      return <div className="relative bg-white text-black border-r border-b border-gray-600 p-4"><ExpandedScore question={question} users={users} onClickExpanded={onClickExpanded} /></div>
   } 
   else 
   {
      return ( <div className="relative flex cursor-default" key={question.id} onClick={()=>setExpanded(true)}>
         <ScoresTableBodyEntry className="w-14">{question.day.substr(5)}</ScoresTableBodyEntry>
         <ScoresTableBodyEntry className="flex-grow-[6] flex-shrink-0 w-0">{question.q}</ScoresTableBodyEntry>
         <ScoresTableBodyEntry className="flex-grow flex-shrink-0 w-0">{question.a}</ScoresTableBodyEntry>
         <UsersAnswersCells {...props}/>
      </div>);
   }
}


export function QuestionsTable(props: {
   year: number
}) {
   const { year } = props;
   
   const { data: questions } = useQuestionsPlus(year + '-01-01', year + '-12-31');
   const { data: activeUsers } = useActiveUsers(year);
   
   if (questions && activeUsers) {
      return (
         <div>
            <div className="flex items-end sticky top-0 z-10 bg-green-950 bold">
               <ScoresTableHeaderEntry className="w-14" key="d">Date</ScoresTableHeaderEntry>
               <ScoresTableHeaderEntry className="flex-grow-[6] flex-shrink-0 w-0">Question</ScoresTableHeaderEntry>
               <ScoresTableHeaderEntry className="flex-grow flex-shrink-0 w-0">Answer</ScoresTableHeaderEntry>
               { activeUsers.map(user => <UserAnswerHeader key={user.userid} name={user.username}/>) }
            </div>   
            { 
               questions
                  .filter(question => isDayInYear(question.day, year))
                  .map(question => <ScoreRow key={question.day} users={activeUsers} question={question}/>) 
            }
         </div>
      );
   }
   return null;         
}

