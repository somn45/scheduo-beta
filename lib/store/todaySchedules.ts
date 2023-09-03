import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import {
  TodaySchedule,
  TodayScheduleWithID,
} from '@/types/interfaces/todaySkds.interface';

const initialState: TodayScheduleWithID[] = [];

const todaySkdSlice = createSlice({
  name: 'todaySchedules',
  initialState,
  reducers: {
    initTodaySchedulesReducer: (
      state,
      action: PayloadAction<TodaySchedule[]>
    ) => {
      return action.payload;
    },
    addTodaySkdReducer: (state, action: PayloadAction<TodaySchedule>) => {
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
