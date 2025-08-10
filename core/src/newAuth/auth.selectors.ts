import type { RootState } from '../store';

export const selectAuth = (state: RootState) => state?.auth;
export const selectIsLoggedIn = (state: RootState) => state?.auth.isLoggedIn;
export const selectCsrfToken = (state: RootState) => state?.auth.csrfToken;
export const selectAuthUser = (state: RootState) => state?.auth.user;
export const isAuthResolved = (state: RootState) => state?.auth.isAuthResolved;

