import { RestErrorError } from '@trivia-nx/types';
import React, { useState } from 'react';
import Button from './components/button';
import TextInput from './components/textinput';
import { useSendLoginEmailRequestMutation } from './datahooks';

interface state {
   email: string,
   submitting: boolean,
   submitted: boolean,
   error: string|null
}

export function SigninView() {
   const [email, setEmail] = useState('');
   const [error, setError] = useState(null);
   const sendEmailMutation = useSendLoginEmailRequestMutation();

   function onChangeInput(ev: React.ChangeEvent<HTMLInputElement>) {
      setEmail(ev.target.value);
      sendEmailMutation.reset();
   }

   function onClickSubmit(ev: React.MouseEvent|React.FormEvent) {
      ev.preventDefault();
      sendEmailMutation.mutate({email});
   }

   function getErrorMessage(err: RestErrorError|null) {
      let message = 'Error';
      if (err && err.response && err.response.data && err.response.data.message) {
         message = err.response.data.message;
      }
      return message;
   }

   if (!sendEmailMutation.isSuccess) {
      const submitting = sendEmailMutation.isLoading;
      const hasError = sendEmailMutation.isError;
      const location = window.location;
      const baseUrl = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
      const redirectUrl = baseUrl + '/auth/slackredirect';
      const slackUrl = "https://slack.com/oauth/authorize?scope=identity.basic,identity.email,identity.avatar&client_id=456894231392.459012826326&&team=TDESA6TBJ&redirect_uri="  + encodeURIComponent(redirectUrl) + '&state=' + encodeURIComponent(baseUrl);
      return <div className="text-center"><div className="inline-flex flex-col gap-2 items-center p-4 bg-green-200 light-area rounded-xl">
         <p>Send me a magic login link</p>
         <form className="flex gap-4 items-center max-w-full flex-wrap justify-center" onSubmit={onClickSubmit}>
            <TextInput className=" w-96" type="email" autoFocus placeholder="My Email Address" value={email} onChange={onChangeInput} readOnly={submitting}/>
            <Button type="submit" disabled={!email.trim() || submitting || hasError} onClick={onClickSubmit}>Send My Magic Link</Button>
            </form>
            {hasError && <div className="my-1 py-1 px-2 border border-orange">{getErrorMessage(sendEmailMutation.error)}</div>}
            <p>Or...</p>
            <a href={slackUrl}><img alt="Sign in with Slack" height="40" width="172" src="https://platform.slack-edge.com/img/sign_in_with_slack.png" srcSet="https://platform.slack-edge.com/img/sign_in_with_slack.png 1x, https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x"/></a>
      </div></div>;
   }
   else {
      return <div className="p-8">Thank you! Your email is on its way. The login link in your email will be valid for the next five minutes.</div>;
   }
}
