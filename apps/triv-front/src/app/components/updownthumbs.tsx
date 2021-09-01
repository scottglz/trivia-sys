import React from 'react';
import classNames from 'classnames';

function Thumb(props: {
   type: boolean,
   value: boolean | undefined,
   onChange: (type: boolean) => void
}) {
   const { type, value, onChange } = props;
   const chosen = value === type;
   const anyChosen = value === true || value === false;
   const className = classNames('inline-block text-2xl cursor-pointer', {
      'opacity-100': chosen,
      'opacity-30': !chosen && !anyChosen,
      'opacity-10': !chosen && anyChosen
   });
   return <div className={className} onClick={() => onChange(type)}>{type ? '👍' : '👎'}</div>;
}
   
export function UpDownThumbs(props: {
   value: boolean | undefined,
   onChange: (type: boolean) => void
}) {

   const { onChange } = props;
   return (
      <div className="inline-block">
         <Thumb type={true} value={props.value} onChange={onChange}/>  
         <Thumb type={false} value={props.value} onChange={onChange}/>  
      </div>
   );
}