import React, { ReactNode } from 'react';

function QuestionCard({ children }: { children: ReactNode}) {
   return (
      <div className="bg-wheat text-black rounded-md shadow-md text-left flex flex-col gap-4 justify-between pt-3 pr-3 pb-1 pl-5">
         {children}
      </div>
   )
}

export default QuestionCard;
