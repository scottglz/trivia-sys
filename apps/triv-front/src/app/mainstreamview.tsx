import { loadQuestions, submitEndVacation, submitGrades, submitGuess } from './ajax';
import { GradingQuestion } from './components/gradingquestion';
import { ExpandedScore } from './components/scores/expandedscore';
import { UnansweredQuestion } from './components/unansweredquestion';
import { VacationView } from './components/vacationview';
import * as selectors from './selectors/selectors';
import { daysAgo, today, firstDay } from '@trivia-nx/days';
import { isUserActive } from '@trivia-nx/users';
import { actions } from './action';
import { Leaderboard } from './components/scores/leaderboard';
import React, { ReactNode } from 'react';
import { hot } from 'react-hot-loader/root';
import { useSelector, useDispatch } from './hooks';
import { useEffect } from 'react';
import { SigninView } from './signinview';

function VerticalStream(props: { children: ReactNode }) {
   return <div className=" w-stream max-w-full bg-white text-black flex flex-col gap-12 py-7 px-1.5vw m-auto min-h-full light-area">{props.children}</div>;
}

function StreamHeadline({children}: { children: ReactNode }) {
   return <h2 className="font-bold">{children}</h2>;
}

function MainStreamView() {
   const startDay = daysAgo(30);
   const endDay = today();

   const needsReload = useSelector((state) => selectors.needsReload(state, startDay, endDay));
   const isReloading = useSelector((state) => selectors.isReloading(state, startDay, endDay));
   const questionsArray = useSelector(selectors.questionsArray);
   const questionsToAnswer = useSelector(selectors.unansweredQuestions);
   const questionsToGrade = useSelector(selectors.gradingQuestions);
   const recentQuestions = useSelector(selectors.recentQuestions);
   const usersArray = useSelector(selectors.usersArray);
   const activeUsers = useSelector(selectors.activeUsers);
   const scoresData = useSelector(selectors.scoresData);
   const guesses = useSelector((state) => state.guesses);
   const userid = useSelector((state) => state.user.userid);
   const activeUser = useSelector((state) => state.users ? state.users[state.user.userid] : null);

   const dispatch = useDispatch();

   useEffect(function() {
      const thisYear = new Date().getFullYear();
      dispatch(actions.scoresSetYear(thisYear));

      if (needsReload) {
         dispatch(loadQuestions(firstDay(daysAgo(30), thisYear + '-01-01'), today()));
      }
   }, [needsReload, dispatch]);

   
   if (!isReloading) {
      if (!activeUser) {
         return <SigninView />;
      }
   
      if (!isUserActive(activeUser, today())) {
         return <VacationView user={activeUser} onSubmitEndVacation={() => dispatch(submitEndVacation(activeUser.userid))}/>;
      }

      return <VerticalStream>
         {
            questionsToAnswer.map(question => <UnansweredQuestion
               key={question.id}
               question={question}
               onSubmit={(question, guess) => dispatch(submitGuess(question.id, guess))}
            />)
         }
         <Leaderboard scoresData={scoresData} activeUsers={activeUsers} questionsArray={questionsArray} />
         {!!questionsToGrade.length && <StreamHeadline>Questions to grade</StreamHeadline>}
         {
            questionsToGrade.map(question => <GradingQuestion
               key={question.id}
               question={question}
               guesses={guesses}
               onSubmit={(question, answer, grades) => dispatch(submitGrades(question.id, answer, grades))}
            />)
         }
         {!!recentQuestions.length && <StreamHeadline>Recent Questions</StreamHeadline>}
         {
            recentQuestions.map(question => <ExpandedScore key={question.id} question={question} users={usersArray} />)
         }
      </VerticalStream>;
   }
   else {
      return (
         <VerticalStream>
            Loading....
         </VerticalStream>
      );
   }
}

const wrapper = hot(MainStreamView);
export { wrapper as MainStreamView };

