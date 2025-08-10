import { call, put, takeLatest } from 'redux-saga/effects';

import { userApi } from './api';
import { userProfileActions, userRequest } from './slice';
import { generateAuthApi, generateLoginApi } from '@react/core';

function* userRequestSaga(
  action: ReturnType<typeof userProfileActions.userRequest>
) {
  console.log('USER DATA REQUEST', action.payload);

  try {
    const response = yield call(userApi.getUser, action.payload);
    console.log('RESPONSE USER', response)
    if (response.ok) {
      yield put(userProfileActions.userRequestSuccess(response.data));
    }
  } catch (error) {
    yield put(userProfileActions.userRequestFailure);
  }
}
/*
function* updateUserSaga(action: ReturnType<typeof updateUserRequest>) {
  console.log('updateSaga', action.payload)
  try {
    const response = yield call(authApi.updateUser, action.payload.id, action.payload.data);
    console.log("RESPONSE", response)
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
}*/

export function* userProfileSaga() {
  yield takeLatest(userRequest.type, userRequestSaga);
}
