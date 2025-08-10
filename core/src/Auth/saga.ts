// core/auth/authSaga.ts
import {
  call,
  put,
  takeLatest,
  select,
  putResolve,
  takeLeading,
} from 'redux-saga/effects';
import {
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
  logoutRequest,
  logoutSuccess,
  logoutFailure,
  updateUserRequest,
  updateUserSuccess,
  updateUserFailure,
  silentLoginRequest,
} from './slice';
import authApi from './api';
import { selectIsAuthenticated, selectRefreshToken } from './selectors';
import { userProfileActions, userProfileSaga } from '../entities/userProfile';

function* loginSaga(action: ReturnType<typeof loginRequest>) {
  try {
    console.log('KECSKE', action.payload);
    const { username, password, refreshToken, silent } = action.payload;
    let data;
    if (silent) {
      const response = yield call(authApi.login, {refreshToken: refreshToken});
      data = response.data;
    } else {
      const response = yield call(authApi.login, username, password);
      data = response.data;
    }

    if (data.requires2FA) {
      yield put(loginRequires2FA({ tempToken: data.tempToken || data.token }));
    } else {
      yield put(
        loginSuccess({
          user: data.user,
          accessToken: data.accessToken || data.token,
          refreshToken: data.refreshToken,
        })
      );
      yield put(userProfileActions.userRequest({ id: data.user.id }));

      localStorage.setItem('accessToken', data.accessToken || data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
    }
  } catch (error: any) {
    yield put(
      loginFailure(
        error.response?.data?.error || error.message || 'Login failed'
      )
    );
  }
}

function* silentLoginSaga(action: ReturnType<typeof silentLoginRequest>) {
  const isAuthenticated = yield select(selectIsAuthenticated);
  console.log('SILENT', isAuthenticated)

  if (!isAuthenticated) {
    return;
  }

  const accessToken = localStorage.getItem('accessToken');

  const refreshToken = yield localStorage.getItem('refreshToken');

  if (!refreshToken) {
    return;
  }

  const refreshTokenResponse = yield call(authApi.refreshAccessToken,  refreshToken);

  yield put(loginRequest({ refreshToken, silent: true }));
  if (!refreshTokenResponse.ok) {
    return;
  }

  return yield putResolve(refreshTokenSuccess(refreshTokenResponse.data));
}

function* verify2FASaga(action: ReturnType<typeof verify2FARequest>) {
  try {
    const code = action.payload.code;
    const tempToken: string = yield select((state) => state.auth.tempToken);
    if (!tempToken) throw new Error('No temporary token for 2FA');

    const response = yield call(authApi.verify2FA, tempToken, code);
    const data = response.data;

    yield put(
      verify2FASuccess({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      })
    );
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
  } catch (error: any) {
    yield put(
      verify2FAFailure(
        error.response?.data?.error ||
          error.message ||
          '2FA verification failed'
      )
    );
  }
}

function* refreshTokenSaga() {
  try {
    const refreshToken: string = yield select(
      (state) => state.auth.refreshToken
    );
    if (!refreshToken) throw new Error('No refresh token');

    const response = yield call(authApi.refreshAccessToken, refreshToken);
    const data = response.data;

    yield put(refreshTokenSuccess({ accessToken: data.accessToken }));
    localStorage.setItem('accessToken', data.accessToken);
  } catch (error: any) {
    yield put(
      refreshTokenFailure(
        error.response?.data?.error || error.message || 'Refresh token failed'
      )
    );
    yield put(logoutRequest());
  }
}
function* logoutSaga(action: ReturnType<typeof logoutRequest>) {
  try {
    const refreshToken = yield select(selectRefreshToken);
    console.log('API LOGOUT', refreshToken);
    if (refreshToken) {
      yield call(authApi.logout, refreshToken);
    }
  } catch (error) {
    console.error('Logout API error:', error);
    yield put(logoutFailure(error.message));
  } finally {
    //Függetlenül az API válaszától, töröljük a localStorage-t és store-t
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    yield put(logoutSuccess());
  }
}

function* updateUserSaga(action: ReturnType<typeof updateUserRequest>) {
  console.log('updateSaga', action.payload);
  try {
    const response = yield call(
      authApi.updateUser,
      action.payload.id,
      action.payload.data
    );
    console.log('RESPONSE', response);
    if (response.ok) {
      yield put(updateUserSuccess(response.data));
      // Frissítsd a localStorage-t is, ha szükséges
      localStorage.setItem('user', JSON.stringify(response.data.user));
    } else {
      yield put(updateUserFailure('Frissítés sikertelen'));
    }
  } catch (error) {
    yield put(
      updateUserFailure(error.message || 'Hiba történt a frissítés során')
    );
  }
}

export function* authSaga() {
  yield takeLeading(silentLoginRequest.type, silentLoginSaga);
  yield takeLatest(loginRequest.type, loginSaga);
  yield takeLatest(verify2FARequest.type, verify2FASaga);
  yield takeLatest(refreshTokenRequest.type, refreshTokenSaga);
  yield takeLatest(logoutRequest.type, logoutSaga);
  yield takeLatest(updateUserRequest.type, updateUserSaga);
}
