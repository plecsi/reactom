import { useSelector, useDispatch } from 'react-redux';
import {
  selectAuth,
  selectIsLoggedIn,
  selectCsrfToken,
  isAuthResolved,
} from './auth.selectors';
import { loginRequest, silentRefreshRequest, logoutRequest } from './auth.slice';
import { useCallback } from 'react';

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector(selectAuth);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isAuth = useSelector(isAuthResolved);

  const csrf = useSelector(selectCsrfToken);

  const login = (payload: { username: string; password: string; totp?: string }) =>
    dispatch(loginRequest(payload));
  const silentLogin = useCallback(() => {
    dispatch(silentRefreshRequest());
  }, [dispatch]);
  const doLogout = () => dispatch(logoutRequest());

  return { auth, isLoggedIn,isAuth, csrf, login, silentLogin, doLogout };
};
