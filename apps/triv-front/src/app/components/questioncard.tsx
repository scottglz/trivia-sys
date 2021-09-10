import React, { ReactNode } from 'react';

function QuestionCard({ children, className='' }: { children: ReactNode, className?: string}) {
   return (
      <div className={`bg-wheat text-black rounded-md shadow-md text-left flex flex-col gap-4 justify-between p-4 ${className}`}>
         {children}
      </div>
   )
}

export default QuestionCard;
