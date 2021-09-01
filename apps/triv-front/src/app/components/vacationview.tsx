import React from 'react';
import Button from './button';
import { isUserActive, userFull } from '@trivia-nx/users';
import { tomorrow } from '@trivia-nx/days';

interface props {
   user: userFull,
   onSubmitEndVacation: () => void
}

interface state {
   submittingEndVacation: boolean
}

export class VacationView extends React.Component<props, state>
{
   constructor(props: props) {
      super(props);
      this.state = {
         submittingEndVacation: false
      };
      this.onClickEndVacation = this.onClickEndVacation.bind(this);
   }
   
   render() {
      if (isUserActive(this.props.user, tomorrow())) {
          return (
               <div className="flex flex-col gap-8 items-center">
                  <h1 className="text-2xl my-2">See You Tomorrow!</h1>
                  <p>Welcome back! Today's question has already been graded, but we'll see you tomorrow!</p>
               </div>
            );
      }
      else {
         const submitting = this.state.submittingEndVacation;
         return (
               <div className="flex flex-col gap-8 items-center">
                  <h1 className="text-2xl my-2">You're on Vacation.</h1>
                  <p>Looks like you've been taking a break. Ready to come back?</p>
                  <Button disabled={!!submitting} onClick={this.onClickEndVacation}>Yeah Baby, I'm back!</Button>
               </div>
            );
      }
   }

   onClickEndVacation() {
      this.props.onSubmitEndVacation();
      this.setState({
         submittingEndVacation: true
      });
   }
   
}