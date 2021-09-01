import './app/frontend.css';
import page from 'page';
import AppView from './app/appview';
import React, { StrictMode } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { actions } from './app/action';
import { mainViews } from './app/mainviews';
import { io } from 'socket.io-client';
import { setAuthenticationFailureHandler} from './app/ajax';
import { rootStore, dispatch, reduxState } from './app/reduxstore';
import { question, questionWithGuesses } from './app/types/question';

const localStorage = window.localStorage;
const { setActiveUserId, setMainView, setMessagePageMessage, questionsLoaded } = actions;

setAuthenticationFailureHandler(function() {
   dispatch(setActiveUserId(null, null));
   page.redirect('/');
});

document.addEventListener('DOMContentLoaded', function () {
   mainViews.forEach(function(view) {
      if (view.addRoutes) {
         view.addRoutes(page, dispatch);
      }
      if (view.page) {
         page(view.page, function() {
            dispatch(setMainView(view.name));
         });
      }
   });

   page('/auth/*', function() {
      /* none */
   });

   page('*', function() {
      dispatch(setMainView('notfound'));
   });
   
   page.start({
      click: true
   });
   
   render(
      <StrictMode>
         <Provider store={rootStore}>
            <AppView/>
         </Provider>
      </StrictMode>, 
      document.getElementById('root')
   );
   
   // Startup socket.io, forcing it to use https if we're hitting azure, because it doesn't work if you don't. Microsoft documents this somewhere.
   
   let ioUrl;
   const host = window.location.host;
   if (host.indexOf('.net') >= 0 || host.indexOf('.com') >=0 ) {
      ioUrl = 'https://' + host;
   }
   else {
      ioUrl = 'http://' + host;
   }

 
   const socket = io(ioUrl + '/');

   socket.on('day_data', function(question: questionWithGuesses) {
      dispatch(questionsLoaded(question.day, question.day, [question]));
   });

});


