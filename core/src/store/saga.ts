// core/src/store/saga.ts
import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchStart, fetchSuccess, fetchError } from './slice';
import { Entity } from './types';

function* fetchEntitiesWorker() {
  try {
    yield put(fetchStart());
    // Replace with real API call
    const response: Record<string, Entity> = yield call(() => Promise.resolve({}));
    yield put(fetchSuccess(response));
  } catch (e: any) {
    yield put(fetchError(e.message));
  }
}

export function* entitySaga() {
  yield takeLatest('entity/fetchEntities', fetchEntitiesWorker);
}