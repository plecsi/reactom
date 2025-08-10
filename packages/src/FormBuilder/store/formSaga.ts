// packages/src/FormBuilder/store/formSaga.ts
import { takeLatest, call, put } from 'redux-saga/effects';
import {
  loadFormsRequest,
  loadFormsSuccess,
  loadFormsFailure,
  saveFormRequest,
  saveFormSuccess,
  saveFormFailure,
  editFormSuccess,
  editFormFailure,
  editFormRequest, deleteFormRequest, deleteFormSuccess, deleteFormFailure
} from './formSlice';
import { FormState } from '../types';
import { formApi } from '../api';

function* loadForms() {
  try {
    const forms: FormState = yield call(formApi.getList);
    yield put(loadFormsSuccess(forms));
  } catch (error: any) {
    yield put(loadFormsFailure(error.message));
  }
}

function* saveForm(action: ReturnType<typeof saveFormRequest>) {
  try {
    const savedForm: FormState = yield call(formApi.create, action.payload);
    yield put(saveFormSuccess(savedForm));
  } catch (error: any) {
    yield put(saveFormFailure(error.message));
  }
}

function* handleEditForm(action: ReturnType<typeof editFormRequest>) {
  console.log('KECSKE', action);
  const id = action.payload?._id; // feltételezve, hogy a payload tartalmazza az id-t
  try {
    const res: FormState = yield call(formApi.update, id, action.payload); // payload = id
//const res: FormState = yield call([formApi, formApi.update], id, action.payload);
    yield put(editFormSuccess(res));
  } catch (error: any) {
    yield put(
      editFormFailure(error.message || 'Hiba történt a lekérdezés során')
    );
  }
}

function* handleDeleteForm(action: ReturnType<typeof deleteFormRequest>) {
  const id = action.payload; // feltételezve, hogy a payload tartalmazza az id-t
  console.log('SAGA handleDeleteForm called with id:', id, action.payload);
  try {
    yield call(formApi.delete, id);
    yield put(deleteFormSuccess({} as FormState)); // sikeres törlés esetén nullázzuk az aktív elemet
  } catch (error: any) {
    yield put(
      deleteFormFailure(error.message || 'Hiba történt a törlés során')
    );
  }
}

export function* formBuilderSaga() {
  yield takeLatest(loadFormsRequest.type, loadForms);
  yield takeLatest(saveFormRequest.type, saveForm);
  yield takeLatest(saveFormSuccess.type, loadForms);
  yield takeLatest(editFormRequest.type, handleEditForm);
  yield takeLatest(editFormSuccess.type, loadForms);
  yield takeLatest(deleteFormRequest.type, handleDeleteForm);
  yield takeLatest(deleteFormSuccess.type, loadForms);
}
