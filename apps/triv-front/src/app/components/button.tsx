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
         className="bg-green-600 outline-none border-none py-0.5 px-4 text-white font-bold rounded-full shadow-md :hover:bg-green-400 active:bg-green-400 disabled:bg-gray-300 disabled:cursor-default disabled:shadow-none"
      >
         {children}
      </button>
   )
}

export default Button;