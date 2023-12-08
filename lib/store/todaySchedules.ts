import { PayloadAction, createSlice, current } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import {
  TodaySchedule,
  TodayScheduleWithID,
  TodaySkdWithFollowers,
} from '@/types/interfaces/todaySkds.interface';
import { IFollower } from '@/types/interfaces/users.interface';

interface TodaySkdTitleAndId {
  title: string;
  _id: string;
}

interface TodayScheduleMembersAndId {
  _id: string;
  sharingUsers: IFollower[];
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
    updateTodayScheduleMembersReducer: (
      state,
      action: PayloadAction<TodayScheduleMembersAndId>
    ) => {
      const changedTodaySkdList = state.map((todaySchedule) =>
        todaySchedule._id === action.payload._id
          ? { ...todaySchedule, sharingUsers: action.payload.sharingUsers }
          : todaySchedule
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
