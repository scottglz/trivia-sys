import React, { ReactNode } from 'react';
import { NavLink as RouterLink  } from 'react-router-dom';

interface props {
   children: ReactNode,
   to: string,
   end?: boolean,
   className?: string,
   title?: string
}

function NavLink({
   children,
   to,
   end = false,
   className,
   title
} : props) {

   return (
      <RouterLink to={to} end={end} title={title} className={({isActive}) => `no-underline hover:text-link-hover-color hover:underline ${className} ${isActive ? 'text-plain-color pointer-events-none' : 'text-link-color cursor-pointer'}`} >
         {children}
      </RouterLink>
   );
}

export default NavLink;