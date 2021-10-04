import React from 'react';
import NavLink from './components/navlink';

function makeArray<CallbackType>(size: number, callback: (i: number) => CallbackType) {
   const ret = [];
   for (let i=0; i < size; i++) {
      ret.push(callback(i));
   }
   return ret;
}

export function ScoresHeader() {
   const yearNow = new Date().getFullYear();
   const firstYear = 2017;
   const years = makeArray(yearNow - firstYear + 1, i => yearNow - i);
   return (
      <div className="bg-transparent border-b-4 border-solid border-black text-gray-300 py-1 px-5 flex gap-4 dark-area">
         { years.map(year => <NavLink end to={year === yearNow ? '/scores' : '/scores/year/' + year} key={year}>{year}</NavLink>) }
      </div>
   );
}
