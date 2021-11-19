import { GradingQuestion } from './components/gradingquestion';
import { ExpandedScore } from './components/scores/expandedscore';
import { UnansweredQuestion } from './components/unansweredquestion';
import { VacationView } from './components/vacationview';
import { today } from '@trivia-nx/days';
import { isUserActive } from '@trivia-nx/users';
import { Leaderboard } from './components/scores/leaderboard';
import React, { ReactNode } from 'react';
import { SigninView } from './signinview';
import { useGradingQuestions, useRecentQuestions, useUnansweredQuestions, useUsers, useUser, useWhoAmI } from './datahooks';

function VerticalStream(props: { children: ReactNode }) {
   return <div className="w-stream max-w-full bg-white text-black flex flex-col gap-12 py-7 px-1.5vw m-auto min-h-full light-area">{props.children}</div>;
}

function StreamHeadline({children}: { children: ReactNode }) {
   return <h2 className="font-bold">{children}</h2>;
}

function ServerErrorSection() {
   const { isError, error } = useWhoAmI();
   if (isError) {
      return (
         <div>
            <div>Something went wrong reaching the server. I'm so sorry.</div>
            <div>{'' + error}</div>
         </div>   
      );
   }
   return null;
}

function SignInSection() {
   const { data: activeUser, isLoading, isError } = useWhoAmI();
   return activeUser || isLoading || isError ? null : <SigninView />;
} 

function VacationSection() {
   const { data: activeUser } = useWhoAmI();
   if (activeUser && !isUserActive(activeUser, today())) {
      return <VacationView user={activeUser} />
   }
   return null;
}

function QuestionsToAnswerSection() {
   const { data: questions, isLoading } = useUnansweredQuestions();
   if (isLoading) {
      return <UnansweredQuestion.Skeleton />;
   }
   return questions ? <>{ questions.map(question => <UnansweredQuestion key={question.id} question={question} />)}</> : null;
}

function QuestionsToGradeSection() {
   const { data: questions } = useGradingQuestions();
   if (!questions || !questions.length) {
      return null;
   }
   
   return (
      <>
         { questions.map(question => <GradingQuestion key={question.id} question={question} />) }
      </>
   );
}

function RecentQuestionsSection() {
   const { data: questions, isLoading: isLoadingQuestions } = useRecentQuestions();
   const { data: users, isLoading: isLoadingUsers } = useUsers();
   const { data: activeUser, isLoading: isLoadingWhoAmI } = useWhoAmI();
   if (isLoadingQuestions || isLoadingUsers || isLoadingWhoAmI) {
      return (
         <>
            { [1,2,3,4,5,6].map((i) => <ExpandedScore.Skeleton key={i} />)}
         </>
      );
   }
   
   if (!users || !questions || !questions.length) {
      return null;
   }
   
   return (
      <>
         { questions.map(question => <ExpandedScore key={question.id} question={question} users={users} editable={activeUser && activeUser.userid===1}/>) }
      </>
   );
}

export function MainStreamView() {
   return (
      <VerticalStream>
         <ServerErrorSection />
         <SignInSection />
         <VacationSection />
         <QuestionsToAnswerSection />
         <Leaderboard year={new Date().getFullYear()} />
         <QuestionsToGradeSection />
         <RecentQuestionsSection />
      </VerticalStream>
   );
}
