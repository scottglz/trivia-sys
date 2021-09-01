import React from 'react';
import classNames from 'classnames';
import { actions } from './action';
import { mainViews } from './mainviews';
import { connect } from 'react-redux';
import Link from './components/link';
import { userFull } from '@trivia-nx/users';
import { dispatchType, reduxState } from './reduxstore';
import { useDispatch, useSelector } from './hooks';
import { hot } from 'react-hot-loader/root';
import { logout } from './ajax';

const { setActiveUserId, setMainView } = actions;

function HeaderView() {
   const dispatch = useDispatch();
   const user = useSelector((state) => state.user);
   const mainview = useSelector((state) => state.mainview);


   function onClickLogout() {
      dispatch(logout());
   }
   
   const userViews = mainViews.filter(v => !!v.page && !!v.headerText && (user.userid || v.noUserOk || v.noUserOnly) && (!user.userid || !v.noUserOnly));
   const viewLinks = userViews.map(v => {
      const isSelected = mainview === v.name;
      return <Link isSelected={isSelected} colorClass={isSelected ? 'text-bar' : 'text-bar-link'} href={v.page} key={v.name}>{v.headerText}</Link>;
   });
   let userControls;
   if (user.userid) {
      userControls = [<span key="hello">{'Hello ' + user.username}</span>,<Link key="logout" colorClass="text-bar-link" onClick={onClickLogout}>Log out</Link>];
   }

   return <div className="bg-bar text-bar p-2 header flex justify-between">
      <div className="flex gap-4">
         {viewLinks} 
      </div>
      <div className="flex gap-4">
         {userControls}
      </div>
   </div>;
}

export default hot(HeaderView);

