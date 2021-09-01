import { userFull } from '@trivia-nx/users';
import React from 'react';
import { processedScore } from '../../processscores';
import { questionPlus } from '../../types/question';
import { CategoryTable } from './categorytable';


export function TotalScoresTable(props: {
   scoresData: processedScore[],
   questionsArray: questionPlus[],
   activeUsers: userFull[]
}) {
   const scoresData = props.scoresData;
   
   const childProps = {
      questionsArray: props.questionsArray,
      activeUsers: props.activeUsers
   };
   
   return <div className="grid template-columns-100-180 sm:template-columns-auto-180-1fr gap-4 overflow-y-hidden overflow-x-auto sm:overflow-x-hidden">
      {scoresData.map(category => <CategoryTable key={category.name} category={category} {...childProps}   />)}
   </div>;
}



