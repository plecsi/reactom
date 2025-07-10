import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile } from './types';

interface UserProfileState {
  data?: UserProfile[];
  loading: boolean;
  error?: string;
}

const initialState: UserProfileState = { data: undefined, loading: false };

export const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    fetchStart(state) {
      state.loading = true;
      state.error = undefined;
    },
    fetchSuccess(state, action: PayloadAction<UserProfile>) {
      console.log('HOPP success', action.payload);
      state.data = [action.payload];
      state.loading = false;
    },
    fetchError(state, action: PayloadAction<string>) {
      console.log('HOPP error', action.payload);
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const userProfileActions = userProfileSlice.actions;
export default userProfileSlice.reducer;