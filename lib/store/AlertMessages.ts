import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

const alertMessagesSlice = createSlice({
  name: 'alertMessages',
  initialState: { value: '' },
  reducers: {
    setAlertMessageReducer: (state, action: PayloadAction<string>) => {
      return { value: action.payload };
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return action.payload.alertMessages;
    },
  },
});

export default alertMessagesSlice;
