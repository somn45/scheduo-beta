import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

const initialState = { userId: '', id: '' };

const loggedUserSlice = createSlice({
  name: 'loggedUser',
  initialState,
  reducers: {
    signIn: (state, action) => {
      return action.payload;
    },
    signOut: () => {
      return initialState;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return action.payload.loggedUser;
    },
  },
});

export default loggedUserSlice;
