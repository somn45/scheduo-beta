import {
  FollowerSearchItem,
  IFollowers,
} from '@/types/interfaces/users.interface';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

const initialState: IFollowers[] = [];

const followerSlice = createSlice({
  name: 'followers',
  initialState,
  reducers: {
    initFollowerReducer: (state, action: PayloadAction<IFollowers[]>) => {
      return action.payload;
    },
    addFollowerReducer: (state, action: PayloadAction<IFollowers>) => {
      return [...state, action.payload];
    },
    deleteFollowerReducer: (state, action: PayloadAction<IFollowers>) => {
      return state.filter(
        (follower) => follower.userId !== action.payload.userId
      );
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return action.payload.followers;
    },
  },
});

export default followerSlice;
