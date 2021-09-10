import React, { ReactNode } from 'react';

interface props {
   children: ReactNode,
   href?: string,
   isSelected?: boolean,
   onClick?: () => void
}

function Link({
   children,
   href,
   isSelected,
   onClick
} : props) {
   return (
      <a href={href} className={`no-underline hover:text-link-hover-color hover:animate-pulse ${isSelected ? 'text-plain-color pointer-events-none' : 'text-link-color cursor-pointer'}`} onClick={onClick}>
         {children}
      </a>
   );
}

export default Link;