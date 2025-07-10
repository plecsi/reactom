import { call, put, takeLatest } from 'redux-saga/effects';
import fetchLanguageApi from './api';
import { languageActions } from './slice';
import { Language } from './types';

function* fetchLanguageWorker() {
  try {
    yield put(languageActions.fetchStart());
    const data: Language = yield call(fetchLanguageApi);
    console.log('SAGA data: ', data);
    yield put(languageActions.fetchSuccess(data));
    localStorage.setItem('language', JSON.stringify(data));
  } catch (e: any) {
    yield put(languageActions.fetchError(e.message));
  }
}

function* setLanguageWorker(action: ReturnType<typeof languageActions.set>) {
  localStorage.setItem('language', JSON.stringify(action.payload));
}

export function* languageSaga() {
  yield takeLatest('language/fetch', fetchLanguageWorker);
  yield takeLatest('language/set', setLanguageWorker);
}
