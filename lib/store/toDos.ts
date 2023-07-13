import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { RootState } from './store';
import { DBTodaySkd } from '@/models/TodaySkd';

const initialState: DBTodaySkd[] = [];

const toDosSlice = createSlice({
  name: 'toDos',
  initialState,
  reducers: {
    initToDoReducer: (state, action: PayloadAction<DBTodaySkd[]>) => {
      return action.payload;
    },
    addToDoReducer: (state, action: PayloadAction<DBTodaySkd>) => {
      return [...state, action.payload];
    },
    //updateToDoReducer: (state, action) => {},
    //deleteToDoReducer: (state, action) => {},
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return action.payload.toDos;
    },
  },
});

export default toDosSlice;
