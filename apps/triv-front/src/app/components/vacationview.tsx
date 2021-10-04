import React from 'react';
import Button from './button';
import { isUserActive, userFull } from '@trivia-nx/users';
import { tomorrow } from '@trivia-nx/days';
import { useEndVacationMutation } from '../datahooks';


export function VacationView(props: { user: userFull}) {
   const { user } = props;
   const mutation = useEndVacationMutation();

   function onClickEndVacation() {
      mutation.mutate();
   }

   if (isUserActive(user, tomorrow())) {
         return (
            <div className="flex flex-col gap-8 items-center">
               <h1 className="text-2xl my-2">See You Tomorrow!</h1>
               <p>Welcome back! Today's question has already been graded, but we'll see you tomorrow!</p>
            </div>
         );
   }
   else {
      return (
            <div className="flex flex-col gap-8 items-center">
               <h1 className="text-2xl my-2">You're on Vacation.</h1>
               <p>Looks like you've been taking a break. Ready to come back?</p>
               <Button disabled={!!mutation.isLoading} onClick={onClickEndVacation}>Yeah Baby, I'm back!</Button>
            </div>
         );
   }
}