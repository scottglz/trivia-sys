/*import React from 'react';
import { connect } from 'react-redux';
import { actions } from './action';
import { needsReload, isReloading, questionDeetsData } from './selectors/selectors';
import { loadQuestionDetails, submitComment } from './ajax';
import { CommentEntryArea } from './components/commententryarea';
import { questionPlus } from './types/question';
import { reduxState } from './reduxstore';

const { setQuestionDeetsDay, setMainView } = actions;


interface questionDeetsViewProps {
   day: string,
   question: questionPlus,
   comments: comment[],
   onFetchData: (day: string) => void,
   onSubmitComment: (day: string, comment: comment)
}

class QuestionDeetsView extends React.Component<questionDeetsViewProps> {
   constructor(props: questionDeetsViewProps) {
      super(props);
      this.onSubmitComment = this.onSubmitComment.bind(this);
   }
   
   componentDidMount() {
      this.props.onFetchData(this.props.day);
   }
   
   render() {
      if (!this.props.comments) {
         return '';
      }

      return (
         <div>
            <p>{this.props.day} Hello! This page is going to contain information about who graded what for this question, as well as comments about it.</p>
            <p>{this.props.question && this.props.question.q}</p>
            { this.props.comments.map(comment => <p>{JSON.stringify(comment)}</p>) }
            <CommentEntryArea onSubmit={this.onSubmitComment}/>
         </div>
         
      );
   }

   onSubmitComment(comment: comment) {
      this.props.onSubmitComment(this.props.day, comment);
   }
};

function mapStateToProps(state: reduxState) {
   var day = state.questionDeetsView.day;
   return {
      key: day, // Forces a new component when the year changes, so fetching data in componentDidMount works
      day: day,
      needsReload: needsReload(state, day, day),
      isReloading: isReloading(state, day, day),
      question: questionDeetsData(state),
      comments: state.comments[day]
   };
}

function mapDispatchToProps(dispatch) {
   return {
      onFetchData: function(day) {
         dispatch(loadQuestionDetails(day, day));
      },

      onSubmitComment: function(day, comment) {
         dispatch(submitComment(day, comment));
      }
   };
}

const wrapper = connect(mapStateToProps, mapDispatchToProps)(QuestionDeetsView);

wrapper.addRoutes = function(page, dispatch) {
   page('/question/:day', function(context) {
      dispatch(setQuestionDeetsDay(context.params.day));
      dispatch(setMainView('questiondeets'));
   });   
};

export {wrapper as QuestionDeetsView};
*/