import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import { useDispatch } from 'react-redux';
import followerSlice from './followers';
import todaySkdSlice from './todaySchedules';
import toDoSlice from './toDos';
import errorMessagesSlice from './ErrorMessages';
import alertMessagesSlice from './AlertMessages';
import loggedUserSlice from './loggedUser';

const reducer = combineReducers({
  todaySchedules: todaySkdSlice.reducer,
  toDos: toDoSlice.reducer,
  followers: followerSlice.reducer,
  alertMessages: alertMessagesSlice.reducer,
  errorMessages: errorMessagesSlice.reducer,
  loggedUser: loggedUserSlice.reducer,
});

export const {
  initTodaySchedulesReducer,
  addTodaySkdReducer,
  updateTitleTodaySkdReducer,
  deleteScheduleReducer,
} = todaySkdSlice.actions;
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
export const { setErrorMessageReducer } = errorMessagesSlice.actions;
export const { setAlertMessageReducer } = alertMessagesSlice.actions;
export const { signIn, signOut } = loggedUserSlice.actions;
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
