import React from 'react';
import classNames from 'classnames';

function TextInput(props: {
   type?: 'text'|'number'|'email',
   value: string,
   placeholder?: string,
   readOnly?: boolean,
   autoFocus?: boolean,
   className?: string,
   onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}) {
   const { type = 'text', value, placeholder, readOnly=false, autoFocus=false, className='', onChange } = props;

   return <input
      type={type}
      value={value}
      placeholder={placeholder}
      readOnly={readOnly}
      autoFocus={autoFocus}
      onChange={onChange}
      className={classNames('p-1.5 bg-white text-black border border-black border-opacity-25 border-solid outline-none rounded-md placeholder-opacity-30', className)} 
   />;
}

export default TextInput;