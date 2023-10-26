import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

const errorMessagesSlice = createSlice({
  name: 'errorMessages',
  initialState: { value: '' },
  reducers: {
    setErrorMessageReducer: (state, action: PayloadAction<string>) => {
      return { value: action.payload };
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return action.payload.errorMessages;
    },
  },
});

export default errorMessagesSlice;
