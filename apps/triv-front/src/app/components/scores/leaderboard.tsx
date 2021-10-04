import React from 'react';
import { CategoryTable } from './categorytable';
import { useScoresData, useQuestionsPlus, useActiveUsers } from '../../datahooks';
import NavLink from '../navlink';

export function Leaderboard(props: {
   year: number
}) {
   const { year } = props;
   const { data: scoresData, isLoading: isLoadingScores } = useScoresData(year);
   const { data: questionsArray, isLoading: isLoadingQuestions } = useQuestionsPlus(year + '-01-01', year + '-12-31');
   const { data: activeUsers, isLoading: isLoadingUsers } = useActiveUsers(year);

   if (isLoadingScores || isLoadingUsers || isLoadingQuestions) {
      return (
         <div className="flex flex-col gap-2 items-center xl:fixed xl:right-10 xl:top-16 xl:dark-area">
            <h2 className="font-bold text-plain-color">Leaderboards</h2>
            <div className="flex gap-4 xl:flex-col xl:items-stretch overflow-x-auto max-w-full">
               { [1,2].map((key) => <CategoryTable.Skeleton key={key} />) }
            </div>
         </div>
      );
   }

   if (scoresData && questionsArray && activeUsers) {
      const leaderboardCategories = scoresData.filter(category => category.inLeaderboard);
      if (!leaderboardCategories.length) {
         return null;
      }
      return (
         <div className="flex flex-col gap-2 items-center xl:fixed xl:right-10 xl:top-16 xl:dark-area">
            <h2 className="font-bold text-plain-color">Leaderboards</h2>
            <div className="flex gap-4 xl:flex-col xl:items-stretch overflow-x-auto max-w-full">
               {
                  leaderboardCategories.map(category => (
                     <CategoryTable key={category.name} category={category} activeUsers={activeUsers} questionsArray={questionsArray} />
                  ))
               }
            </div>
            <NavLink to="/scores">All Scores and Stats</NavLink>
         </div>
      );
   }
   else {
      return null;
   }
}
