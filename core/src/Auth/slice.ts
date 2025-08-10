// core/auth/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: any | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  requires2FA: boolean;
  tempToken: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
  requires2FA: false,
  tempToken: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    silentLoginRequest(state, action) {
      state.loading = true;
      state.error = null;
    },
    setTokens(state, action: PayloadAction<{ accessToken: string | null; refreshToken: string | null }>) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    loginRequest(state, action: PayloadAction<{ username: string; password: string,refreshToken?: string,silent: boolean }>) {
      state.loading = true;
      state.error = null;
    },
    loginRequires2FA(state, action: PayloadAction<{ tempToken: string }>) {
      state.loading = false;
      state.requires2FA = true;
      state.tempToken = action.payload.tempToken;
    },
    loginSuccess(state, action: PayloadAction<{ user: any; accessToken: string; refreshToken: string }>) {
      console.log('login Success')
      state.loading = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.requires2FA = false;
      state.tempToken = null;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.requires2FA = false;
      state.tempToken = null;
    },
    verify2FARequest(state, action: PayloadAction<{ code: string }>) {
      state.loading = true;
      state.error = null;
    },
    verify2FASuccess(state, action: PayloadAction<{ user: any; accessToken: string; refreshToken: string }>) {
      state.loading = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.requires2FA = false;
      state.tempToken = null;
    },
    verify2FAFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    refreshTokenRequest(state) {
      state.loading = true;
      state.error = null;
    },
    refreshTokenSuccess(state, action: PayloadAction<{ accessToken: string }>) {
      state.loading = false;
      state.accessToken = action.payload.accessToken;
    },
    refreshTokenFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    logoutRequest(state) {
      state.loading = true;
      state.error = null;
    },
    logoutSuccess(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.loading = false;
      state.error = null;
      state.requires2FA = false;
      state.tempToken = null;
    },
    logoutFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    updateUserRequest(state, action) {
      state.loading = false;
      state.error = null
    },
    updateUserSuccess(state, action) {
      console.log('USER SUCCESS', action.payload)
      state.user = action.payload.user

    },
    updateUserFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const {
  silentLoginRequest,
  setTokens,
  loginRequest,
  loginRequires2FA,
  loginSuccess,
  loginFailure,
  verify2FARequest,
  verify2FASuccess,
  verify2FAFailure,
  refreshTokenRequest,
  refreshTokenSuccess,
  refreshTokenFailure,
  logoutRequest, logoutSuccess,
  logoutFailure,
  updateUserRequest,
  updateUserFailure,
  updateUserSuccess
} = authSlice.actions;

export default authSlice.reducer;
export const authSliceKey = authSlice.name;