import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { reduxState } from './reduxstore';


function makeArray<CallbackType>(size: number, callback: (i: number) => CallbackType) {
   const ret = [];
   for (let i=0; i < size; i++) {
      ret.push(callback(i));
   }
   return ret;
}

function ScoresHeader(props: {
   year: number
}) {
   const selectedYear = props.year;
   const yearNow = new Date().getFullYear();
   const firstYear = 2017;
   const years = makeArray(yearNow - firstYear + 1, i => yearNow - i);
   const links = years.map(year => <a className={classNames({active: year === selectedYear})} href={'/scores/year/' + year} key={year}>{year}</a>);   
   return <div className="bg-transparent border-b-4 border-solid border-black text-gray-300 py-1 px-5 flex gap-4">{links}</div>;
}

function mapStateToProps(state: reduxState) {
   return {
      year: state.scoresView.year
   };
}

const c = connect(mapStateToProps)(ScoresHeader);
export { c as ScoresHeader };