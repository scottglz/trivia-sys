import React from 'react';
import { CategoryTable } from './categorytable';
import { useScoresData, useQuestionsPlus, useActiveUsers } from '../../datahooks';



export function TotalScoresTable({ year }: {
   year: number
}) {

   const { data: scoresData } = useScoresData(year);
   const { data: questionsArray } = useQuestionsPlus(year + '-01-01', year + '-12-31');
   const { data: activeUsers } = useActiveUsers(year);

   if (scoresData && questionsArray && activeUsers) {
      return <div className="grid template-columns-100-180 sm:template-columns-auto-180-1fr gap-4 overflow-y-hidden overflow-x-auto sm:overflow-x-hidden">
         {scoresData.map(category => <CategoryTable key={category.name} category={category} questionsArray={questionsArray} activeUsers={activeUsers}   />)}
      </div>;
   }
   else {
      return null;
   }
}



