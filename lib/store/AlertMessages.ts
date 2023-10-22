import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

const alertMessagesSlice = createSlice({
  name: 'alertMessages',
  initialState: '',
  reducers: {
    setAlertMessageReducer: (state, action: PayloadAction<string>) => {
      return action.payload;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return action.payload.alertMessages;
    },
  },
});

export default alertMessagesSlice;
