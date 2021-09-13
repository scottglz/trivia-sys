import React from 'react';
import { hot } from 'react-hot-loader/root';
import { sendLoginEmailRequest } from './ajax';
import Button from './components/button';
import TextInput from './components/textinput';

type props = Record<string, never>;

interface state {
   email: string,
   submitting: boolean,
   submitted: boolean,
   error: string|null
}

class SigninView extends React.Component<props, state>
{
   constructor(props: props) {
      super(props);
      this.state = {
         email: '',
         submitting: false,
         submitted: false,
         error: null
      };
      
      this.onChangeInput = this.onChangeInput.bind(this);
      this.onClickSubmit = this.onClickSubmit.bind(this);
   }

   render() {
      if (!this.state.submitted) {
         const email = this.state.email;
         const submitting = !!this.state.submitting;
         const hasError = !!this.state.error;
         const location = window.location;
         const baseUrl = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
         const redirectUrl = baseUrl + '/auth/slackredirect';
         const slackUrl = "https://slack.com/oauth/authorize?scope=identity.basic,identity.email,identity.avatar&client_id=456894231392.459012826326&&team=TDESA6TBJ&redirect_uri="  + encodeURIComponent(redirectUrl) + '&state=' + encodeURIComponent(baseUrl);
         return <div className="text-center"><div className="inline-flex flex-col gap-2 items-center p-4 bg-green-200 light-area rounded-xl">
            <p>Send me a magic login link</p>
            <form className="flex gap-4 items-center max-w-full flex-wrap justify-center" onSubmit={this.onClickSubmit}>
               <TextInput className=" w-96" type="email" autoFocus placeholder="My Email Address" value={email} onChange={this.onChangeInput} readOnly={submitting}/>
               <Button type="submit" disabled={!email.trim() || submitting || hasError} onClick={this.onClickSubmit}>Send My Magic Link</Button>
             </form>
             {this.state.error && <div className="my-1 py-1 px-2 border border-orange">{this.state.error}</div>}
             <p>Or...</p>
             <a href={slackUrl}><img alt="Sign in with Slack" height="40" width="172" src="https://platform.slack-edge.com/img/sign_in_with_slack.png" srcSet="https://platform.slack-edge.com/img/sign_in_with_slack.png 1x, https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x"/></a>
         </div></div>;
      }
      else {
         return <div className="p-8">Thank you! Your email is on its way. The login link in your email will be valid for the next five minutes.</div>;
      }
   }

   onChangeInput(ev: React.ChangeEvent<HTMLInputElement>) {
      this.setState({
         email: ev.target.value,
         error: null
      });
   }

   onClickSubmit(ev: React.MouseEvent|React.FormEvent) {
      ev.preventDefault();
      this.setState({submitting: true});
      sendLoginEmailRequest(this.state.email).then(() => {
         this.setState({submitted: true});
      }).catch((err)=> {
         let message = 'Error';
         if (err && err.response && err.response.data && err.response.data.message) {
            message = err.response.data.message;
         }
         this.setState({error: message, submitting: false, submitted: false});
      });
   }
}

const h =  hot(SigninView);

export { h as SigninView } ;