import React from 'react';
import { hot } from 'react-hot-loader/root';
import { useSelector } from './hooks';

function MessageView() {
   const message = useSelector((state) => state.messagePageMessage);
   return <div className="message-section">{message}</div>;
}

const h = hot(MessageView);
export { h as MessageView }; 
