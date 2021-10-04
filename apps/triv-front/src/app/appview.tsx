import React  from 'react';
import HeaderView from './headerview';
import { hot } from 'react-hot-loader/root';
import { Route, Routes } from 'react-router-dom';
import { ScoresView } from './scoresview';
import { MainStreamView } from './mainstreamview';
import { NotFoundView } from './notfoundview';
import { ScoresHeader } from './scoresheader';

function AppView() {
   return (
      <>
         <HeaderView/>
         <Routes>
            <Route path="/" element = {<div className="overflow-auto h-full p-5">
                  <MainStreamView />
               </div>} />
            <Route path="/scores/*" element={<><ScoresHeader />
               <div className="overflow-auto h-full">
                  <ScoresView />
               </div></>} />
            <Route path="*" element={<div className="overflow-auto h-full p-5">
                  <NotFoundView />
               </div>} />
         </Routes>
      </>
   );
   
}

export default hot(AppView);
