import { RefObject, useEffect } from 'react';

export function useDocumentMouseDown(callback: (ev: MouseEvent) => void) {
   return useEffect(function() {
      document.addEventListener('mousedown', callback);
      return () => document.removeEventListener('mousedown', callback);
   });
}

export function isMouseEventInElementRef(ev: MouseEvent, ref: RefObject<HTMLElement>) {
   return ref.current && ev.target && ref.current.contains(ev.target as HTMLElement);
}