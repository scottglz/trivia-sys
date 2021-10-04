import React, { useState } from 'react';
import { formatDateFancy } from '@trivia-nx/days';
import Button from './button';
import TextInput from './textinput';
import QuestionCard from './questioncard';
import { questionPlus } from '../types/question';
import { useGuessMutation } from '../datahooks';


export function UnansweredQuestion(props: {question: questionPlus})
{
   const { question } = props;
   const [guess, setGuess] = useState('');
   const { mutate: save, isLoading: saving, isError, error } = useGuessMutation();
   
   
   function onChangeInput(ev: React.ChangeEvent<HTMLInputElement>) {
      setGuess(ev.target.value);
   }
   
   function onClickSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      const guessTrimmed = guess.trim();
      if (guessTrimmed) {
         save({
            guess: guessTrimmed,
            questionid: question.id
         });
      }
   }

   return (
      <QuestionCard key={question.day} loading={saving}>
         <div>
            <div className="font-bold text-sm mb-1">{formatDateFancy(question.day)}</div>
            <div>{question.q}</div> 
         </div>

         <form className="text-right flex gap-2 items-center max-w-full justify-end" onSubmit={onClickSubmit}>
            <TextInput className="w-72  flex-shrink" type="text" value={guess} placeholder="Your Answer" readOnly={saving} onChange={onChangeInput}/>
            <Button type="submit" disabled={!guess.trim() || saving}>OK</Button>
         </form>

         { isError && <p>Something went wrong submitting your answer. [{'' + error}]</p> }
         
      </QuestionCard>
   );
};

UnansweredQuestion.Skeleton = function() {
   return <QuestionCard className="animate-skeleton h-40" />
}
