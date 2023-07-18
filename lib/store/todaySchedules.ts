import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { RootState } from './store';
import TodaySkd, { DBTodaySkd, IToDo, ITodaySkd } from '@/models/TodaySkd';

interface ToDoPayloadAction extends IToDo {
  author: string;
}

const initialState: ITodaySkd[] = [];

const todaySkdSlice = createSlice({
  name: 'todaySchedules',
  initialState,
  reducers: {
    initTodaySchedulesReducer: (state, action: PayloadAction<DBTodaySkd[]>) => {
      return action.payload;
    },
    addTodaySkdReducer: (state, action: PayloadAction<DBTodaySkd>) => {
      return [...state, action.payload];
    },
    //updateToDoReducer: (state, action) => {},
    //deleteToDoReducer: (state, action) => {},
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return action.payload.todaySchedules;
    },
  },
});

export default todaySkdSlice;
