// core/src/store/entitySaga.ts
import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchEntityRequest, fetchEntitySuccess, fetchEntityFailure } from './entitySlice';

function* fetchEntityWorker(action: any): Generator<any, void, any> {
  try {
    const response = yield call(fetch, action.payload.url);
    const data = yield response.json();
    yield put(fetchEntitySuccess(data));
  } catch (error: any) {
    yield put(fetchEntityFailure(error.message));
  }
}

export function* entitySaga() {
  yield takeLatest(fetchEntityRequest.type, fetchEntityWorker);
}