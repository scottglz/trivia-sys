import React, { ChangeEvent } from 'react';
import { UpDownThumbs } from './updownthumbs';
import { formatDateFancy } from '@trivia-nx/days'
import Button from './button';
import TextInput from './textinput';
import QuestionCard from './questioncard';
import { guessesMap, questionPlus } from '../types/question';
import { GuessWire } from '@trivia-nx/types';

function GradingGuess(props: {
   guess: GuessWire,
   correct: boolean,
   onChangeGrade: (guess: GuessWire, correct: boolean) => void
}) {
   const correct = props.correct;
   const guess = props.guess;
   return (
      <div className="guess">
         <UpDownThumbs value={correct} onChange={correct => props.onChangeGrade(guess, correct)}/>
         <span className="ml-3">{guess.guess}</span>  
      </div>        
   );
}

export interface grade {
   userid: number,
   correct: boolean
}

export interface gradingQuestionProps {
   question: questionPlus,
   guesses: guessesMap,
   onSubmit: (question: questionPlus, answer: string, grades: grade[]) => void
}

interface state {
   answer: string,
   gradesById: {
      [id: string]: boolean
   },
   submitting: boolean
}
   
export class GradingQuestion extends React.Component<gradingQuestionProps, state>
{
   constructor(props: gradingQuestionProps) {
      super(props);
      this.state = {
         answer: '',
         gradesById: {
         },
         submitting: false
      };
      
      this.onEditInput = this.onEditInput.bind(this);
      this.onChangeGrade = this.onChangeGrade.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
   }
   
   onEditInput(ev: ChangeEvent) {
      this.setState({
         answer: (ev.target as HTMLInputElement).value
      });
   }
   
   onChangeGrade(guess: GuessWire, correct: boolean) {
      this.setState(state => {
         const newState = {} as state;
         if (!state.answer && correct) {
            // If an answer hasn't been entered yet and we marked something correct,
            // set that guess as the answer
            newState.answer = guess.guess;
         }

         const mods = {} as {[guessid: string]: boolean};
         mods[guess.guessid] = correct;
         newState.gradesById = Object.assign({}, state.gradesById, mods);
         

         return newState;
      });
   }
   
   onSubmit() {
      const guesses = this.props.guesses;
      const gradesById = this.state.gradesById;
      const grades = Object.keys(gradesById).map(guessId => ({
         userid: guesses[guessId].userid,
         correct: gradesById[guessId]
      }));

      this.props.onSubmit(this.props.question, this.state.answer.trim(), grades);
      this.setState({
         submitting: true
      });
   }
   
   render() {
      
      const question = this.props.question;
      const answer = this.state.answer;
      const guesses = Object.values(question.guessesMap);
      const ready = !!answer.trim() && !this.state.submitting && guesses.every(guess =>
         Object.prototype.hasOwnProperty.call(this.state.gradesById, guess.guessid)
      );

      return (
         <QuestionCard key={question.day}>
            <div>
               <div className="font-bold text-sm mb-1">{formatDateFancy(question.day)}</div>
               <div>{question.q}</div> 
            </div>
            <div>
               Correct Answer:
               <TextInput className="ml-3" value={answer} onChange={this.onEditInput}/>
            </div>    
            <div>
               {guesses.map(guess => <GradingGuess key={guess.guessid} guess={guess} correct={this.state.gradesById[guess.guessid]} onChangeGrade={this.onChangeGrade}/>)}
            </div>
            <div>
               <Button disabled={!ready} onClick={this.onSubmit}>Submit Grades</Button>
            </div>
         </QuestionCard>    
      );
   }
};
