import { IToDo } from '@/models/TodaySkd';
import { PayloadAction, createSlice, current } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

const toDoSlice = createSlice({
  name: 'toDo',
  initialState: [] as IToDo[],
  reducers: {
    initToDosReducer: (state, action: PayloadAction<IToDo[]>) => {
      return action.payload;
    },
    addToDoReducer: (state, action: PayloadAction<IToDo>) => {
      return [...state, action.payload];
    },
    updateToDoReducer: (state, action: PayloadAction<IToDo>) => {
      const currentState = current(state);
      const updatedToDos = currentState.map((toDo) =>
        toDo.registeredAt === action.payload.registeredAt
          ? action.payload
          : toDo
      );
      return updatedToDos;
    },
    deleteToDoReducer: (state, action: PayloadAction<IToDo[]>) => {
      return action.payload;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return action.payload.toDos;
    },
  },
});

export default toDoSlice;
