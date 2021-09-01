import React, { useEffect } from 'react';
import HeaderView from './headerview';
import { mainViewsIndex } from './mainviews';
import { hot } from 'react-hot-loader/root';
import { useDispatch, useSelector } from './hooks';
import { getWhoAmI } from './ajax';

function AppView() {
   const viewName = useSelector((state) => state.mainview);
   const user = useSelector((state) => state.user);

   const dispatch = useDispatch();

   useEffect(function() {
      if (typeof user.userid !== 'number') {
         dispatch(getWhoAmI());
      }
   });

   let MainViewComponent;
   let SecondaryHeaderComponent;
   let mainView;
   if (viewName) {
      mainView = mainViewsIndex[viewName];
      if (!mainView) {
         throw Error('No view renderer registered for name "' + viewName + '"');
      }
      MainViewComponent = mainView.component;
      SecondaryHeaderComponent = mainView.headerComponent;
   }
   return (
      <>
         <HeaderView/> {}
         { SecondaryHeaderComponent && <SecondaryHeaderComponent/>}
         <div className={(mainView && mainView.contentClass) || 'overflow-auto h-full p-5'}>
            { MainViewComponent && <MainViewComponent/>}
         </div>
      </>
   );
   
}

export default hot(AppView);
