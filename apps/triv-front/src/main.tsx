import AppView from './app/appview';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { setAuthenticationFailureHandler} from './app/ajax';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools'
import { BrowserRouter } from 'react-router-dom';
import { updateCacheQuestion } from './app/datahooks';

document.addEventListener('DOMContentLoaded', function () {
   const queryClient = new QueryClient();

   setAuthenticationFailureHandler(function() {
      queryClient.setQueryData('whoami', false);
    // TODO  page.redirect('/');
   });
   const rootElement = document.getElementById('root');
   if (!rootElement) {
      throw new Error('Could not find #root element');
   }
   createRoot(rootElement).render(
      <StrictMode>
         <QueryClientProvider client={queryClient}>
            <BrowserRouter>
               <AppView/>
            </BrowserRouter>
            <ReactQueryDevtools initialIsOpen={false} />
         </QueryClientProvider>   
      </StrictMode>
   );

   const sse = new EventSource('/trivia/sse');
   sse.addEventListener('message', ({ data }) => {
      const question = JSON.parse(data);
      updateCacheQuestion(queryClient, question);
   });
});


