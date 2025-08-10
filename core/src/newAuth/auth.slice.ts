import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState } from './types';

const initialState: AuthState & {
  twoFactorRequired: boolean;
  tempCreds?: { username: string; password: string };
} = {
  isLoggedIn: false,
  user: undefined,
  loading: false,
  error: undefined,
  isAuthResolved: false,
  csrfToken: '',
  twoFactorRequired: false,
  tempCreds: undefined
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest(
      state,
      action: PayloadAction<{ username: string; password: string; totp?: string }>
    ) {
      state.loading = true;
      state.error = undefined;
    },
    loginSuccess(state, action: PayloadAction<{ user: any; csrfToken: string }>) {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.loading = false;
      state.isAuthResolved = true;
      state.csrfToken = action.payload.csrfToken;
      state.twoFactorRequired = false;
      state.tempCreds = undefined;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.isLoggedIn = false;
      state.user = undefined;
      state.error = action.payload;
      state.loading = false;
      state.isAuthResolved = true;
      state.twoFactorRequired = false;
      state.tempCreds = undefined;
    },
    loginTwoFactorRequired(
      state,
      action: PayloadAction<{ username: string; password: string }>
    ) {
      state.loading = false;
      state.twoFactorRequired = true;
      state.tempCreds = action.payload;
    },
    silentRefreshRequest(state) {
      state.loading = true;
      state.error = undefined;
      state.isAuthResolved = false;
    },
    silentRefreshSuccess(state, action: PayloadAction<{ user: any }>) {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.loading = false;
      state.isAuthResolved = true;
    },
    logoutRequest(state) {
      state.isLoggedIn = false;
      state.user = undefined;
      state.isAuthResolved = false;
      state.csrfToken = '';
      state.twoFactorRequired = false;
      state.tempCreds = undefined;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  loginTwoFactorRequired,
  silentRefreshRequest,
  silentRefreshSuccess,
  logoutRequest,
} = authSlice.actions;

export default authSlice.reducer;
