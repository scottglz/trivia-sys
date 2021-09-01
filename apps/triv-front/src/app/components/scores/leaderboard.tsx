import React from 'react';
import { CategoryTable } from './categorytable';
import Link from '../link';
import { userFull } from '@trivia-nx/users';
import { questionPlus } from '../../types/question';
import { processedScore } from '../../processscores';

export function Leaderboard(props: {
   scoresData: processedScore[],
   activeUsers: userFull[],
   questionsArray: questionPlus[]
}) {
   const { scoresData, activeUsers, questionsArray } = props;

   const leaderboardCategories = scoresData.filter(category => category.inLeaderboard);
   if (!leaderboardCategories.length) {
      return null;
   }
   return (
      <div className="flex flex-col gap-2 items-center lg:text-gray-300 xl:fixed xl:right-10 xl:top-16">
         <h2 className="font-bold text-black xl:text-current">Leaderboards</h2>
         <div className="flex gap-4 xl:flex-col xl:items-stretch">
            {
               leaderboardCategories.map(category => (
                  <CategoryTable key={category.name} category={category} activeUsers={activeUsers} questionsArray={questionsArray} />
               ))
            }
         </div>
         <Link href="/scores">All Scores and Stats</Link>
      </div>
   );
}
