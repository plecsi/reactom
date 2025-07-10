// packages/src/FormBuilder/store/formSaga.ts
import { takeLatest, call, put } from 'redux-saga/effects';
import {
  loadFormsRequest,
  loadFormsSuccess,
  loadFormsFailure,
  saveFormRequest,
  saveFormSuccess,
  saveFormFailure,
} from './formSlice';
import { FormConfig } from '../types';

// Példa API hívások (helyettesítsd a saját implementációddal)
function fetchFormsApi() {
  return Promise.resolve<FormConfig[]>([]); // pl. üres lista
}

function saveFormApi(form: FormConfig) {
  return Promise.resolve(form);
}

function* loadForms() {
  try {
    const forms: FormConfig[] = yield call(fetchFormsApi);
    yield put(loadFormsSuccess(forms));
  } catch (error: any) {
    yield put(loadFormsFailure(error.message));
  }
}

function* saveForm(action: ReturnType<typeof saveFormRequest>) {
  try {
    const savedForm: FormConfig = yield call(saveFormApi, action.payload);
    yield put(saveFormSuccess(savedForm));
  } catch (error: any) {
    yield put(saveFormFailure(error.message));
  }
}

export function* formBuilderSaga() {
  yield takeLatest(loadFormsRequest.type, loadForms);
  yield takeLatest(saveFormRequest.type, saveForm);
}
