import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile, UserState } from './types';

const initialState: UserState = { user: null, loading: false, error: null };

export const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    userRequest(state: Draft<UserState>) {
      state.loading = true;
      state.error = null;
    },
    userRequestSuccess(
      state: Draft<UserState>,
      action: PayloadAction<UserProfile>
    ) {
      console.log('HOPP success', action.payload);
      state.user = [action.payload];
      state.loading = false;
      state.error = null;
    },
    userRequestFailure(state: Draft<UserState>, action: PayloadAction<string>) {
      console.log('HOPP error', action.payload);
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const userProfileActions = userProfileSlice.actions;
export const {userRequest,userRequestSuccess, userRequestFailure } = userProfileSlice.actions
export default userProfileSlice.reducer;
