import { call, put } from 'redux-saga/effects';

// A generic API saga generator: takes an API call function, success action creator and failure action creator
export function* apiSagaGenerator(apiFn: (...args: any[]) => Promise<any>, successAction: (payload: any) => any, failureAction: (err: any) => any, ...args: any[]) {
  try {
    const res = yield call(apiFn, ...args);
    yield put(successAction(res.data));
    return res.data;
  } catch (err: any) {
    const message = err?.response?.data?.message || err.message || 'Unknown error';
    yield put(failureAction(message));
    throw err;
  }
}
