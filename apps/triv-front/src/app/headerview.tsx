import React, { useRef, useState } from 'react';
import Link from './components/link';
import { Link as RouterLink } from 'react-router-dom'
import { useLogoutMutation, useWhoAmI } from './datahooks';
import Avatar from './components/avatar';
import { userFull } from '@trivia-nx/users';
import { isMouseEventInElementRef, useDocumentMouseDown } from './uihooks';

function UserPopup(props: {
   onKillMe: () => void,
   user: userFull
}) {
   const { onKillMe, user } = props;
   const popupRef = useRef<HTMLDivElement>(null);
   const logoutMutation = useLogoutMutation();
   
   useDocumentMouseDown(function(ev) {
      if (!isMouseEventInElementRef(ev, popupRef)) {
         onKillMe();
      }
   });

   function onClickLogout() {
      logoutMutation.mutate();
   }

   return (
      <div ref={popupRef} className="absolute right-0 top-0 bg-black p-4 pt-2 w-max">
         <div className="mb-3" onClick={onKillMe}><Avatar user={user} size="l" className="mr-3 inline" />{user.username}</div>
         <div><Link onClick={onClickLogout}>Log out</Link></div>
         <div><Link href="https://en.gravatar.com/">Edit Profile Picture</Link></div>
      </div>
   );
}

function UserControls() {
   const [isPopupUp, setPopupUp] = useState(false);
   const whoAmIQuery = useWhoAmI();
   
   if (whoAmIQuery.isLoading) {
      return <span>...</span>;
   }

   if (whoAmIQuery.isError) {
      return <span>???</span>
   }

   if (whoAmIQuery.data) {
      const user = whoAmIQuery.data;
      return (
         <div className='inline-block relative'>
            <Avatar user={user} className="mx-2 inline cursor-pointer hover:scale-125 hover:translate-y-1 transition-transform" onClick={() => setPopupUp((up) => !up)}/>
            { isPopupUp && <UserPopup user={user} onKillMe={()=> setPopupUp(false)} /> }
         </div>
      );
   }

   return null;
}

export default function HeaderView() {

   return <div className="sticky top-0 h-8 z-10 bg-bar flex justify-between items-center dark-area sm:border-r border-green-950">
      <div className="flex gap-4 items-center bg-gradient-to-r from-green-900 to-transparent px-2">
         <RouterLink title="Home Page" to="/" className="group flex items-center gap-2 text-link-color hover:text-link-hover-color hover:underline font-semibold">
            <img src="/assets/trivia-logo.png" alt="Trivia Logo" className="group-hover:scale-125 transition-transform bg-black p-1 border-4 border-[#00bc00] rounded-full"/>
            trivia.
         </RouterLink>
      </div>
      <div className="flex gap-4">
         <UserControls />
      </div>
   </div>;
}
