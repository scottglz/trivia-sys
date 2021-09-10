import React, { MouseEvent } from 'react';
import { ReactNode } from 'react';

function Button(props: {
   children: ReactNode,
   onClick?: (event: MouseEvent) => void,
   disabled?: boolean,
   type?: 'button'|'submit'|'reset'
}) {
   const {children, onClick, disabled, type='button'} = props;
   return (
      <button
         type={type}
         onClick={onClick}
         disabled={disabled}
         className="bg-green-700 outline-none border-none py-1.5 px-4 text-white font-bold rounded-full shadow-md :hover:bg-green-40 opacity-80 hover:opacity-100 disabled:opacity-25 transition-opacity duration-500 disabled:cursor-default disabled:shadow-none"
      >
         {children}
      </button>
   )
}

export default Button;