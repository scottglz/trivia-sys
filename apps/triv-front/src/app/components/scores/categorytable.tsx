import { default as React, lazy, Suspense, ReactNode, useState} from 'react';
import { createPortal } from 'react-dom';
import { MdShowChart } from 'react-icons/md';
import { userFull } from '@trivia-nx/users';
import { processedScore } from '../../processscores';
import { questionPlus } from '../../types/question';
import { graphDatum } from '../../scorecategories';


const ScoresGraph = lazy(() => 
   import(/* webpackChunkName: "scoresgraph" */ './scoresgraph')
   .then(module => ({default: module.ScoresGraph})));

function MyModal({onClose, children} : {onClose: () => void, children: ReactNode }) {
   const element = document.getElementById('root');
   
   return element ? createPortal(
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-60 flex justify-center items-center z-20" onClick={onClose}>
         <div className="bg-white border-8 border-gray-900 p-2.5 z-30">{children}</div>
      </div>
      , element 
   ) : null;
}

function asBattingAverage(numerator: number, denominator: number) {
   let s = (numerator / denominator).toFixed(3);
   if (s.charAt(0) === '0') {
      s = s.substr(1);
   }
   return s;
}

type props = {
   category: processedScore,
   activeUsers: userFull[],
   questionsArray: questionPlus[]
};


export function CategoryTable(props: props)  {
   const [graphData, setGraphData] = useState<graphDatum[]|null>(null);

   const { category, activeUsers, questionsArray }  = props;

   function onClickShowGraph() {
      if (category.getGraphData) {
         setGraphData(category.getGraphData(questionsArray, activeUsers));
      }
   }

   function onCloseGraph() {
      setGraphData(null);   
   }

   const scores = category.scores();
   const userRows = activeUsers.map(function(user, i) {
      const score = scores[i];
      if (!score) {
         return <div className="flex justify-between py-0 px-1 bg-white text-black even:bg-green-200 leading-snug" key={user.userid}>&nbsp;</div>;
      }
      else {
         const value = score.score.value;
         const outOf = score.score.outOf;
         return <div className="flex gap-1 justify-between py-0 px-2 bg-white text-black even:bg-green-200 leading-snug" key={user.userid}>
            <span>{score.username}</span>
            <span className="text-right w-20" title={outOf ? `${value} of ${outOf} attempts` : ''}>{value}{outOf ? ' (' + asBattingAverage(value, outOf) + ')' : ''}</span>
         </div>;
      }
   });

   return <div>
      <div className="bg-black text-gray-300 font-semibold pl-2 py-0.5 border-r border-gray-500 rounded-t-lg">
         {category.name}
         {category.graphable && <span className="text-white float-right mr-2 mt-1 cursor-pointer" title="Open Graph" onClick={onClickShowGraph}><MdShowChart /></span>}
      </div>
      {userRows}
      { 
         graphData && (
            <MyModal onClose={onCloseGraph}>
               <Suspense fallback={<div>Loading...</div>}>
                  <ScoresGraph graphData={graphData} users={activeUsers} />
               </Suspense>
            </MyModal>
         ) 
      } 
   </div>;
}

CategoryTable.Skeleton = function() {
   return (
      <div className="animate-skeleton">
         <div className="bg-black text-gray-200 font-bold text-center py-0.5 border border-b-0 border-solid border-gray-500 rounded-t-xl">&nbsp;</div>
         {
            [1,2,3,4,5,6].map((key) => (
               <div className="flex justify-between py-0 px-1 bg-white text-black even:bg-green-200 leading-snug w-40" key={key}>
                  <span>&nbsp;</span>
              </div>
            ))
         }
      </div>
   );
}
