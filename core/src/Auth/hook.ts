import { useDispatch, useSelector } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'redux-injectors';
import authReducers, {
  logoutRequest,
  authSliceKey,
  setTokens,
  refreshTokenRequest,
  verify2FARequest,
  updateUserRequest,
  loginRequest,
  silentLoginRequest,
} from './slice';
import { authSaga } from './saga';
import { useCallback, useEffect } from 'react';
import {
  selectError,
  selectIsAuthenticated,
  selectLoading,
  selectRequires2FA,
  selectUser,
} from './selectors';
import { userRequest } from '../entities/userProfile';

export const useAuth = () => {
  useInjectReducer({ key: authSliceKey, reducer: authReducers });
  useInjectSaga({ key: authSliceKey, saga: authSaga });
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const requires2FA = useSelector(selectRequires2FA);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const login = useCallback(
    (username: string, password: string) => {
      dispatch({
        type: `${authSliceKey}/loginRequest`,
        payload: { username, password },
      });
    },
    [dispatch]
  );

  const verify2FA = useCallback(
    (code: string) => {
      dispatch(verify2FARequest({ code }));
    },
    [dispatch]
  );

  const updateUser = useCallback(
    (data: any) => {
      console.log('UPDATE DISPATCH', user, data);
      const id = user.id;
      dispatch(updateUserRequest({ id, data }));
    },
    [dispatch, user]
  );

  const logout = useCallback(() => {
    console.log('hook logout');
    dispatch(logoutRequest());
  }, [dispatch]);

  console.log('isAuthenticated', isAuthenticated)

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (accessToken && refreshToken) {
      // Beállítjuk a tokeneket a store-ba (ha van ilyen action)
      dispatch(setTokens({ accessToken, refreshToken }));

      // Indítjuk a silent login folyamatot, ami a refreshToken alapján bejelentkeztet
      dispatch(silentLoginRequest());
    } else if (refreshToken && !user) {
      // Ha van refreshToken, de nincs user, akkor is elindíthatod a silent login-t
      dispatch(silentLoginRequest());
    }
  }, [dispatch, user]);


  /*useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (accessToken && refreshToken) {
      //dispatch(loginRequest();
      dispatch(setTokens({ accessToken, refreshToken }));
      dispatch(silentLoginRequest({ refreshToken: refreshToken }));
      // Itt indíthatsz egy refresh token folyamatot, hogy frissítsd az access tokent
     // dispatch(refreshTokenRequest());
      // Vagy lekérheted a user adatokat az access token alapján

    }
    if( refreshToken && !user) {
      //dispatch(userRequest({ refreshToken: refreshToken }));
    }
  }, [dispatch, user]);*/

  return {
    login,
    requires2FA,
    verify2FA,
    error,
    loading,
    logout,
    isAuthenticated,
    user,
    updateUser,
  };
};
