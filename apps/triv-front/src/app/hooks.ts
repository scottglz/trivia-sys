import { Dispatch } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { ThunkAction } from 'redux-thunk';
import { action } from './action';
import type { reduxState } from './reduxstore'

type dispatchType = Dispatch<action|ThunkAction<unknown, reduxState, unknown, action>>

// Use throughout your app instead of plain `useDispatch` and `useSelector`
const useMainDispatch = () => useDispatch<dispatchType>();
const useMainSelector: TypedUseSelectorHook<reduxState> = useSelector;

export { useMainDispatch as useDispatch };
export { useMainSelector as useSelector };