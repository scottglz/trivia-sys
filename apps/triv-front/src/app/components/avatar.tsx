import { userFull } from '@trivia-nx/users';
import React from 'react';

interface Props {
   user: Pick<userFull, 'avatarUrl' | 'username'>
   size?: 'l' | 'm' | 's',
   className?: string,
   onClick?: () => void
}

export default function(props: Props) {
   const { user, className, size='m', onClick } = props;
   const sizeStyles = {
      l: 'w-12 h-12',
      m: 'w-9 h-9',
      s: 'w-6 h-6'
   }[size];
   
   return <img 
      src={user.avatarUrl}
      alt={user.username}
      title={user.username}
      onClick={onClick}
      className={`${sizeStyles} bg-white rounded-full ${className}`}
   />;
}