import React, { ReactNode } from 'react';

interface props {
   children: ReactNode,
   href?: string,
   onClick?: () => void
}

function Link({
   children,
   href,
   onClick
} : props) {
   return (
      <a href={href} className="no-underline hover:text-link-hover-color hover:animate-pulse text-link-color cursor-pointer" onClick={onClick}>
         {children}
      </a>
   );
}

export default Link;