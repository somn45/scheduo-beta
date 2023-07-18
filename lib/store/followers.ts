import { FollowerProps } from '@/components/Follower';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

const initialState: FollowerProps[] = [];

const followerSlice = createSlice({
  name: 'followers',
  initialState,
  reducers: {
    initFollowerReducer: (state, action: PayloadAction<FollowerProps[]>) => {
      return action.payload;
    },
    addFollowerReducer: (state, action: PayloadAction<FollowerProps>) => {
      return [...state, action.payload];
    },
    deleteFollowerReducer: (state, action: PayloadAction<FollowerProps>) => {
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
