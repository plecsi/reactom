// settings/saga.ts
import { createEntitySaga } from '../../store/sagaHelpers';
import {
  Settings,
  SettingsInput,
  SettingsListRequest,
  SettingsDisplayContext,
  SettingsEditContext,
} from './types';
import { settingsApi } from './api';
import { SettingsActions } from './slice';
import { all, call, put } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';

/*
export const SettingsSaga = createEntitySaga<
  Settings,
  SettingsInput,
  SettingsListRequest,
  SettingsDisplayContext,
  SettingsEditContext
>({
  actions: SettingsActions,
  api: settingsApi,
  includeDisplayContext: true,
  includeEditContext: true,
  validate: true,
});*/

export function* SettingsSaga() {
  return yield all([
    function* fetchList(
      action: PayloadAction
    ): Generator<any, void, any> {
      try {
        const response = yield call(settingsApi.getList, action.payload);
        console.log('API SAGÁBAN', action);
        if (response.ok) {
          yield put(SettingsActions.fetchList(response.data));
        } else {
          yield put(SettingsActions.fetchListFailure(response.problem));
        }
      } catch (error) {
        console.log('ERROR SAGÁBAN: ', error);
        yield put(SettingsActions.fetchListFailure(error));
      }
    }
  ]);
}
