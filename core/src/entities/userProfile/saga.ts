import { call, put, takeLatest } from 'redux-saga/effects';
import fetchUserProfileApi from './api';
import { userProfileActions } from './slice';
import { UserProfile } from './types';

function* fetchUserProfileWorker() {
  try {
    yield put(userProfileActions.fetchStart());
    const data: UserProfile[] = yield call(fetchUserProfileApi);
    console.log('HOPP', data);
    yield put(userProfileActions.fetchSuccess([data]));
  } catch (e) {
    console.log('HOPP ERROR', e.message);
    yield put(userProfileActions.fetchError(e.message));
  }
}

export function* userProfileSaga() {
  yield takeLatest('userProfile/fetch', fetchUserProfileWorker);
}
