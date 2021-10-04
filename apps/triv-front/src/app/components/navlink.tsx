import React, { ReactNode } from 'react';
import { NavLink as RouterLink  } from 'react-router-dom';

interface props {
   children: ReactNode,
   to: string,
   end?: boolean
}

function NavLink({
   children,
   to,
   end = false
} : props) {

   return (
      <RouterLink to={to} end={end} className={({isActive}) => `no-underline hover:text-link-hover-color hover:animate-pulse ${isActive ? 'text-plain-color pointer-events-none' : 'text-link-color cursor-pointer'}`} >
         {children}
      </RouterLink>
   );
}

export default NavLink;