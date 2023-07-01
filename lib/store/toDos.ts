import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { RootState } from './store';
import { IToDo } from '@/pages/schedules/todos';

const initialState: IToDo[] = [];

const toDosSlice = createSlice({
  name: 'toDos',
  initialState,
  reducers: {
    initToDoReducer: (state, action: PayloadAction<IToDo[]>) => {
      return action.payload;
    },
    addToDoReducer: (state, action: PayloadAction<IToDo>) => {
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
