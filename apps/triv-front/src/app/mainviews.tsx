import { MessageView} from './messageview';
//import { QuestionDeetsView } from './questiondeetsview';
import { ScoresView } from './scoresview';
import { ScoresHeader } from './scoresheader';
import { SigninView } from './signinview';
import { NotFoundView } from './notfoundview';
import { MainStreamView } from './mainstreamview';
import { dispatchType } from './reduxstore';

interface mainViewDef {
   readonly name: string,
   readonly component: React.ComponentType,
   readonly headerComponent?: React.ComponentType,
   readonly page?: string,
   readonly headerText?: string,
   readonly contentClass?: string,
   readonly noUserOnly?: boolean,
   readonly noUserOk?: boolean,
   readonly addRoutes?: (page: PageJS.Static, dispatch: dispatchType) => void;
};

const views: mainViewDef[] = [
   {
      name: 'message',
      component: MessageView,
      page: '/message'
   },
   {
      name: 'mainstream',
      component: MainStreamView,
      page: '/',
      headerText: 'Home',
      noUserOk: true,
      contentClass: 'overflow-auto h-full'
   },
   {
      name: 'scores',
      component: ScoresView,
      headerComponent: ScoresHeader,
      addRoutes: ScoresView.addRoutes,
      page: '/scores',
      headerText: 'Scores',
      noUserOk: true,
      contentClass: 'overflow-auto h-full'
   },
   /*
   {
      name: 'questiondeets',
      component: QuestionDeetsView,
      addRoutes: QuestionDeetsView.addRoutes
   },*/
   {
      name: 'notfound',
      noUserOk: true,
      component: NotFoundView
   }
];

const index: {[name: string]: mainViewDef} = {};
views.forEach(function(view) {
   index[view.name] = view; 
});

export {views as mainViews, index as mainViewsIndex};
