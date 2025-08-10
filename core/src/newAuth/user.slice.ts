import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile } from './types';

interface UserState {
  profile?: UserProfile;
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  loading: false,
  loaded: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // már nem kell userId a request payloadba
    fetchProfileRequest(state) {
      state.loading = true;
      state.error = undefined;
    },
    fetchProfileSuccess(state, action: PayloadAction<UserProfile>) {
      state.profile = action.payload;
      state.loading = false;
      state.loaded = true;
      state.error = null;
    },
    fetchProfileFailure(state, action: PayloadAction<string | Error>) {
      state.loading = false;
      state.error = action.payload instanceof Error
        ? action.payload.message
        : action.payload;
    },
    updateProfileRequest(state, action: PayloadAction<Partial<UserProfile>>) {
      state.loading = true;
    },
    updateProfileSuccess(state, action: PayloadAction<UserProfile>) {
      state.loading = false;
      state.profile = action.payload;
    },
    resetProfile(state) {
      state.profile = null;
      state.loading = false;
      state.loaded = false;
      state.error = null;
    },
  }
});

export const userSliceKey = userSlice.name;

export const {
  fetchProfileRequest,
  fetchProfileSuccess,
  fetchProfileFailure,
  updateProfileRequest,
  updateProfileSuccess,
  resetProfile,
} = userSlice.actions;

export default userSlice.reducer;
