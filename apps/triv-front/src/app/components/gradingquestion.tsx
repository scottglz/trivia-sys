import React, { ChangeEvent, useState } from 'react';
import { UpDownThumbs } from './updownthumbs';
import { formatDateFancy } from '@trivia-nx/days'
import Button from './button';
import TextInput from './textinput';
import QuestionCard from './questioncard';
import { questionPlus } from '../types/question';
import { GuessWire } from '@trivia-nx/types';
import { useGradeMutation } from '../datahooks';

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
   question: questionPlus
}
   
export function GradingQuestion(props: gradingQuestionProps) {
   const { question } = props;
   const [answer, setAnswer] = useState('');
   const [gradesByUserId, setGradesByUserId] = useState({} as Record<number, boolean>);
   const  { mutate: save, isLoading: saving, isError, error } = useGradeMutation();

   function onEditInput(ev: ChangeEvent<HTMLInputElement>) {
      setAnswer(ev.target.value);
   }
   
   function onChangeGrade(guess: GuessWire, correct: boolean) {
      if (!answer && correct) {
         // If an answer hasn't been entered yet and we marked something correct,
         // set that guess as the answer
         setAnswer(guess.guess);
      }
      setGradesByUserId(oldMap => {
         return { ...oldMap, [guess.userid]: correct};
      });
   }
   
   function onClickSubmit() {

      const grades = Object.keys(gradesByUserId).map(userid => ({
         userid: +userid,
         correct: gradesByUserId[+userid]
      }));

      save({
         questionid: question.id,
         answer: answer.trim(),
         grades: grades
      }); 
   }
   
   const guesses = Object.values(question.guessesMap);
   const ready = !!answer.trim() && !saving && guesses.every(guess =>
      typeof gradesByUserId[guess.userid] === 'boolean'
   );

   return (
      <QuestionCard key={question.day} loading={saving}>
         <div>
            <div className="font-bold text-sm mb-1">{formatDateFancy(question.day)}</div>
            <div>{question.q}</div> 
         </div>
         <div>
            Correct Answer:
            <TextInput className="ml-3" value={answer} onChange={onEditInput} readOnly={saving}/>
         </div>    
         <div>
            {guesses.map(guess => <GradingGuess key={guess.guessid} guess={guess} correct={gradesByUserId[guess.userid]} onChangeGrade={onChangeGrade}/>)}
         </div>
         <div>
            <Button disabled={!ready} onClick={onClickSubmit}>Submit Grades</Button>
         </div>
         { isError && <p>Something went wrong submitting the grades. [{'' + error}]</p> }
      </QuestionCard>    
   );
};
