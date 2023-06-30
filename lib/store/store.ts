import { configureStore, combineReducers } from '@reduxjs/toolkit';
import toDosSlice from './toDos';
import { createWrapper } from 'next-redux-wrapper';
import { useDispatch } from 'react-redux';

const reducer = combineReducers({
  toDos: toDosSlice.reducer,
});

export const { initToDoReducer, addToDoReducer } = toDosSlice.actions;

let store: Store;

const makeStore = () => {
  const store = configureStore({ reducer });
  return store;
};

const wrapper = createWrapper(makeStore);

export type RootState = ReturnType<typeof reducer>;
export type Store = ReturnType<typeof makeStore>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export default wrapper;
