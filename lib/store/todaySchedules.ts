import { PayloadAction, createSlice, current } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import {
  TodaySchedule,
  TodayScheduleWithID,
  TodaySkdWithFollowers,
} from '@/types/interfaces/todaySkds.interface';

interface TodaySkdTitleAndId {
  title: string;
  _id: string;
}

const initialState: TodayScheduleWithID[] = [];

const todaySkdSlice = createSlice({
  name: 'todaySchedules',
  initialState,
  reducers: {
    initTodaySchedulesReducer: (
      state,
      action: PayloadAction<TodaySkdWithFollowers[]>
    ) => {
      return action.payload;
    },
    addTodaySkdReducer: (
      state,
      action: PayloadAction<TodaySkdWithFollowers>
    ) => {
      return [...state, action.payload];
    },
    updateTitleTodaySkdReducer: (
      state,
      action: PayloadAction<TodaySkdTitleAndId>
    ) => {
      const changedTodaySkdList = state.map((todaySkd) =>
        todaySkd._id === action.payload._id
          ? { ...todaySkd, title: action.payload.title }
          : todaySkd
      );
      return changedTodaySkdList;
    },
    deleteScheduleReducer: (state, action: PayloadAction<{ _id: string }>) => {
      return state.filter((todaySkd) => todaySkd._id !== action.payload._id);
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return action.payload.todaySchedules;
    },
  },
});

export default todaySkdSlice;
