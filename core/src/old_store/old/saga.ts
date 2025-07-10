import {
  all,
  call,
  put,
  takeLatest,
  ForkEffect,
} from 'redux-saga/effects';
import fetchDataApi from './api';
import { Data } from './types';





function* fetchDataSaga(): Generator {
  try {
    const data: Data[] = yield call(fetchDataApi);
    yield put({ type: 'FETCH_DATA_SUCCESS', payload: data });
  } catch (error: any) {
    yield put({ type: 'FETCH_DATA_FAILURE', error: error.message });
  }
}

function* watchFetchData(): Generator<ForkEffect<never>, void, unknown> {
  yield takeLatest('FETCH_DATA', fetchDataSaga);
}

export default function* rootSaga(): Generator {
  yield all([watchFetchData()]);
}
