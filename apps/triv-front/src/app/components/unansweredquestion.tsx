import React from 'react';
import { daysAgo, today, formatDateFancy } from '@trivia-nx/days';
import Button from './button';
import TextInput from './textinput';
import QuestionCard from './questioncard';
import { guess, question } from '../types/question';

interface props {
   question: question,
   onSubmit: (question: question, guess: string) => void
}

interface state {
   guess: string,
   submitting: boolean
}

export class UnansweredQuestion extends React.Component<props, state>
{
   constructor(props: props) {
      super(props);
      this.state = {
         guess: '',
         submitting: false
      };
      
      this.onChangeInput = this.onChangeInput.bind(this);
      this.onClickSubmit = this.onClickSubmit.bind(this);
   }
   
   onChangeInput(ev: React.ChangeEvent<HTMLInputElement>) {
      this.setState({
         guess: ev.target.value
      });
   }
   
   onClickSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      const guess = this.state.guess.trim();
      if (guess) {
         this.props.onSubmit(this.props.question, this.state.guess.trim());
         this.setState({
            submitting: true
         });
      }
   }

   render() {
      const { question } = this.props;
      const { guess, submitting } = this.state;

      return (
         <QuestionCard key={question.day}>
            <div>
               <div className="font-bold text-sm mb-1">{formatDateFancy(question.day)}</div>
               <div>{question.q}</div> 
            </div>

            <form className="text-right flex gap-2 flex-wrap items-center max-w-full justify-end" onSubmit={this.onClickSubmit}>
               <TextInput className="w-72 max-w-full" type="text" value={this.state.guess} placeholder="Your Answer" onChange={this.onChangeInput}/>
               <Button type="submit" disabled={ !this.state.guess.trim()}>Ok</Button>
            </form>
            
         </QuestionCard>
      );
   }
};
