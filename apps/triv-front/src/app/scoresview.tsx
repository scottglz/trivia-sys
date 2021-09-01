import { actions } from './action';
import { loadQuestions } from './ajax';
import { QuestionsTable } from './components/scores/questionstable';
import { TotalScoresTable } from './components/scores/totalscorestable';
import * as selectors from './selectors/selectors';
import { today, firstDay } from '@trivia-nx/days';
import React, { useEffect } from 'react';
import { hot } from 'react-hot-loader/root';
import { useSelector, useDispatch } from './hooks';
import { dispatchType } from './reduxstore';

const { scoresSetYear, setMainView } = actions;

function ScoresView()
{
   const dispatch = useDispatch();

   const year = useSelector((state) => state.scoresView.year);
   const needsReload = useSelector((state) => selectors.needsReload(state,  state.scoresView.year + '-01-01', today()));
   const isReloading = useSelector((state) => selectors.isReloading(state,  state.scoresView.year + '-01-01', today()));
   const scoresData = useSelector(selectors.scoresData);
   const activeUsers = useSelector(selectors.activeUsers);
   const questionsArray = useSelector(selectors.questionsArray);

   useEffect(function() {
      if (needsReload) {
         const fromDay = year + '-01-01';
         const toDay = firstDay(today(), year + '-12-31');
         dispatch(loadQuestions(fromDay, toDay));
      }
   }, [needsReload, year, dispatch]);

   if (questionsArray.length) {
      return ( 
         <div className="flex flex-col gap-8 p-5">
            <TotalScoresTable scoresData={scoresData} activeUsers={activeUsers} questionsArray={questionsArray}/>
            <QuestionsTable year={year} questions={questionsArray} activeUsers={activeUsers} />
         </div>
      );
      
   }
   else {
      return <div>{isReloading ? 'Loading...' : 'No scores yet.'}</div>;
   }

};

ScoresView.addRoutes = function(page: PageJS.Static, dispatch: dispatchType) {
   page('/scores/year/:year', function(context) {
      dispatch(setMainView('scores'));
      const thisYear = new Date().getFullYear();
      let year = (+context.params.year) || thisYear;
      year = Math.max(Math.min(year, thisYear), 2017);
      dispatch(scoresSetYear(year));
   });   
};

const moduleObj = hot(ScoresView);
export { moduleObj as ScoresView };

