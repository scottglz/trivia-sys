/* eslint-disable jsx-a11y/anchor-is-valid */
import { default as React, lazy, Suspense, ReactNode} from 'react';
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

type state = {
   graphData: graphDatum[]|null
}

export class CategoryTable extends React.Component<props, state> {


   constructor(props: props) {
      super(props);
      this.state = {
         graphData: null
      };
      
      this.onClickShowGraph = this.onClickShowGraph.bind(this);
      this.onCloseGraph = this.onCloseGraph.bind(this);
   }

   render() {
      const { category, activeUsers }  = this.props;
      const scores = category.scores();
      const userRows = activeUsers.map(function(user, i) {
         const score = scores[i];
         if (!score) {
            return <div className="flex justify-between py-0 px-1 bg-white text-black even:bg-green-200 leading-snug" key={user.userid}>&nbsp;</div>;
         }
         else {
            const value = score.score.value;
            const outOf = score.score.outOf;
            return <div className="flex justify-between py-0 px-1 bg-white text-black even:bg-green-200 leading-snug" key={user.userid}>
               <span>{score.username}</span>
               <span className="text-right w-20" title={outOf ? `${value} of ${outOf} attempts` : ''}>{value}{outOf ? ' (' + asBattingAverage(value, outOf) + ')' : ''}</span>
            </div>;
         }
      });

      return <div>
         <div className="bg-black text-gray-200 font-bold text-center py-0.5 border border-b-0 border-solid border-gray-500 rounded-t-xl">
            {category.name}
            {category.graphable && <a className="text-white float-right mr-2 cursor-pointer" title="Open Graph" onClick={this.onClickShowGraph}><MdShowChart /></a>}
         </div>
         {userRows}
         { 
            this.state.graphData && (
               <MyModal onClose={this.onCloseGraph}>
                  <Suspense fallback={<div>Loading...</div>}>
                     <ScoresGraph graphData={this.state.graphData} users={activeUsers} />
                  </Suspense>
               </MyModal>
            ) 
         } 
      </div>;
   }

   onClickShowGraph() {
      const { category, activeUsers, questionsArray } = this.props;
      if (category.getGraphData) {
         this.setState({
            graphData: category.getGraphData(questionsArray, activeUsers)
         });
      }
   }

   onCloseGraph() {
      this.setState({
         graphData: null
      });   
   }
}