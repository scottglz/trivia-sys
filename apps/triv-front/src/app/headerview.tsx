import React from 'react';
import Link from './components/link';
import { hot } from 'react-hot-loader/root';
import { useLogoutMutation, useWhoAmI } from './datahooks';
import NavLink from './components/navlink';

function HeaderView() {
   const whoAmIQuery = useWhoAmI();
   const logoutMutation = useLogoutMutation();

   function onClickLogout() {
      logoutMutation.mutate();
   }
   
   let userControls;
   if (whoAmIQuery.isLoading) {
      userControls = <span key="hello">...</span>;
   }
   else if (whoAmIQuery.data) {
      userControls = [<span key="hello">{'Hello ' + whoAmIQuery.data.username}</span>,<Link key="logout" onClick={onClickLogout}>Log out</Link>];
   }

   return <div className="bg-bar p-2 flex justify-between dark-area">
      <div className="flex gap-4">
         <NavLink to="/" end key="main">Main</NavLink>
         <NavLink to="/scores" key="scores">Scores</NavLink>
      </div>
      <div className="flex gap-4">
         {userControls}
      </div>
   </div>;
}

export default hot(HeaderView);

