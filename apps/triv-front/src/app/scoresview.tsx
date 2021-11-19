import { QuestionsTable } from './components/scores/questionstable';
import { TotalScoresTable } from './components/scores/totalscorestable';
import React from 'react';
import { hot } from 'react-hot-loader/root';
import { Route, Routes, useParams as useRouteParams } from 'react-router-dom';
import { NotFoundView } from './notfoundview';

function ScoresViewBase() {
   const { year: yearParam } = useRouteParams() as { year: string|undefined };
   const thisYear = new Date().getFullYear();
   let year = +(yearParam||0) || thisYear;
   year = Math.max(Math.min(year, thisYear), 2017);
   return ( 
      <div className="p-5">
         <TotalScoresTable year={year} />
         <QuestionsTable year={year} />
      </div>
   );
};

export function ScoresView() {
   return (
      <Routes>
         <Route path="/" element={<ScoresViewBase/>} />
         <Route path="year/:year" element={<ScoresViewBase/>} />
         <Route path="*" element={<NotFoundView/>} />
      </Routes>
   );
}
