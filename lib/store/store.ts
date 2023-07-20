import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import { useDispatch } from 'react-redux';
import followerSlice from './followers';
import todaySkdSlice from './todaySchedules';
import toDoSlice from './toDos';

const reducer = combineReducers({
  todaySchedules: todaySkdSlice.reducer,
  toDos: toDoSlice.reducer,
  followers: followerSlice.reducer,
});

export const { initTodaySchedulesReducer, addTodaySkdReducer } =
  todaySkdSlice.actions;
export const {
  initToDosReducer,
  addToDoReducer,
  updateToDoReducer,
  deleteToDoReducer,
  updateToDoStateReducer,
} = toDoSlice.actions;
export const {
  initFollowerReducer,
  addFollowerReducer,
  deleteFollowerReducer,
} = followerSlice.actions;

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
