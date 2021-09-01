import React, { ReactNode } from 'react';

interface props {
   children: ReactNode,
   href?: string,
   colorClass?: string,
   isSelected?: boolean,
   onClick?: () => void
}

function Link({
   children,
   href,
   colorClass = '',
   isSelected,
   onClick
} : props) {
   const className = `no-underline ${colorClass} ${isSelected ? 'pointer-events-none' : 'cursor-pointer'}`;
   return (
      <a href={href} className={className} onClick={onClick}>
         {children}
      </a>
   );
}

export default Link;