import { RootState } from '../../store'; // vagy a te store elérési utad

export const selectAuthState = (state: RootState) => state.auth;

export const selectUser = (state: RootState) => selectAuthState(state).user;

export const selectAccessToken = (state: RootState) => selectAuthState(state).accessToken;

export const selectRefreshToken = (state: RootState) => selectAuthState(state).refreshToken;

export const selectIsAuthenticated = (state: RootState) => Boolean(selectAccessToken(state));

export const selectLoading = (state: RootState) => selectAuthState(state).loading;

export const selectError = (state: RootState) => selectAuthState(state).error;

export const selectRequires2FA = (state: RootState) => selectAuthState(state).requires2FA;

export const selectTempToken = (state: RootState) => selectAuthState(state).tempToken;
