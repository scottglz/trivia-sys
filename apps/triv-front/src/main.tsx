import './app/frontend.css';
import AppView from './app/appview';
import React, { StrictMode } from 'react';
import { render } from 'react-dom';
import { io } from 'socket.io-client';
import { setAuthenticationFailureHandler} from './app/ajax';
import { QuestionWire } from '@trivia-nx/types';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools'
import { updateCacheQuestion } from './app/datahooks';
import { BrowserRouter } from 'react-router-dom';

document.addEventListener('DOMContentLoaded', function () {
   const queryClient = new QueryClient();

   setAuthenticationFailureHandler(function() {
      queryClient.setQueryData('whoami', false);
    // TODO  page.redirect('/');
   });

   render(
      <StrictMode>
         <QueryClientProvider client={queryClient}>
            <BrowserRouter>
               <AppView/>
            </BrowserRouter>
            <ReactQueryDevtools initialIsOpen={false} />
         </QueryClientProvider>   
      </StrictMode>, 
      document.getElementById('root')
   );
   
   // Startup socket.io, forcing it to use https if we're hitting azure, because it doesn't work if you don't. Microsoft documents this somewhere.
   /*
   let ioUrl;
   const host = window.location.host;
   if (host.indexOf('.net') >= 0 || host.indexOf('.com') >=0 ) {
      ioUrl = 'https://' + host;
   }
   else {
      ioUrl = 'http://' + host;
   }

   const socket = io(ioUrl + '/');

   socket.on('day_data', function(question: QuestionWire) {
      updateCacheQuestion(queryClient, question);
   });
   */

});


