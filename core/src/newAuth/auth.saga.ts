import { takeLatest, call, put, select } from 'redux-saga/effects';
import client from './clients';
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  silentRefreshRequest,
  logoutRequest,
  loginTwoFactorRequired,
} from './auth.slice';
import { apiSagaGenerator } from './apiGenerator';
import { PayloadAction } from '@reduxjs/toolkit';
import { fetchProfileRequest, resetProfile } from './user.slice';
import { selectAuthUser } from './auth.selectors';
import { selectUserProfileLoaded } from './user.selectors';
import authApi from './api';
import apiClient from './apiClient';

function loginApi(payload: { email: string; password: string; totp?: string }) {
  return apiClient.post('/auth/login', payload);
}

function silentRefreshApi() {
  return apiClient.post('/auth/silent-refresh', {}, { withCredentials: true });
}

function logoutApi() {
  return apiClient.post('/auth/logout');
}

/*function* handleLogin(action: PayloadAction<{ email: string; password: string; totp?: string }>) {
  console.log('authSaga: handleLogin', action.payload);
  try {
/!*    const data = yield call(
      apiSagaGenerator,
      loginApi,
      (d: any) => loginSuccess(d),
      (e: any) => loginFailure(e),
      action.payload
    );*!/

    const { data } = yield call(loginApi, action.payload);
    console.log('authSaga: handleLogin response', data);

    if (data?.user?.id) {
      yield put(loginSuccess(data));
      yield put(fetchProfileRequest({ userId: data.user.id }));
    }
  } catch (err) {}
}*/

function* handleLogin(action: ReturnType<typeof loginRequest>) {
  try {
    const { username, password, totp } = action.payload;
    const res = yield call(authApi.login, username, password, totp);

    // Ha 2FA szükséges
    if (res.status === 206 && res.data?.twoFactorRequired) {
      yield put(loginTwoFactorRequired({ username, password }));
      return;
    }

    // Ha teljes a login
    if (res.ok) {
      yield put(loginSuccess({
        user: res.data.user,
        csrfToken: res.data.csrfToken // 🔹 itt kerül a token Reduxba
      }));
    } else {
      yield put(loginFailure(res.data?.message || 'Login failed'));
    }
  } catch (err: any) {
    yield put(loginFailure(err.message || 'Unexpected error'));
  }
}


function* handleSilentRefresh() {
  try {
    const loaded = yield select(selectUserProfileLoaded);
    if (loaded) return;

    const res = yield call(authApi.silentRefreshApi);

    if (res.status === 200) {
      yield put(loginSuccess({
        user: res.data.user,
        csrfToken: res.data.csrfToken
      }));

      yield put(fetchProfileRequest({ userId: res.data.user.id }));
    } else {
      yield put(loginFailure(res.data?.message || 'Silent refresh failed'));
    }
  } catch (err: any) {
    yield put(loginFailure(err.message || 'Unexpected error'));
  }
}

function* handleLogout() {
  try {
    yield call(logoutApi);
  } catch (err) {
    // ignore
  } finally {
    yield put(resetProfile());
  }
}

export function* authSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
  yield takeLatest(silentRefreshRequest.type, handleSilentRefresh);
  yield takeLatest(logoutRequest.type, handleLogout);
}
