// settings/slice.ts
import { SETTINGS_STORE_KEY } from './config';
import { generateInitialEntityStoreState } from '../../store/storeHelpers';
import {
  Settings,
  SettingsDisplayContext,
  SettingsEditContext,
  SettingsInput,
  SettingsListRequest,
  SettingsStoreState
} from './types';
import { createSlice } from '@reduxjs/toolkit';
import {
  generateActiveItemActions, generateCreateActions, generateDeleteActions,
  generateDisplayContextActions,
  generateEditContextActions,
  generateListActions, generatePatchActions,
  generateSingleActions, generateTransactionCleanupActions, generateUpdateActions
} from '../../store/reducers';
import { PaginationMode } from '../../store/types';

export const initialSettingsStoreState = generateInitialEntityStoreState<
  Settings,
  SettingsInput,
  SettingsDisplayContext,
  SettingsEditContext,
  SettingsStoreState
>({
  includeDisplayContext: false,
  includeEditContext: false,
});


const settingsSlice = createSlice({
  name: SETTINGS_STORE_KEY,
  initialState: initialSettingsStoreState,
  reducers: {
    fetchList: (state, action) => {
      console.log('fetchList action', action);
    },
    fetchListFailure: (state, action) => {
      console.error('fetchListFailure action', action);
     // state.error = action.payload;
    },
    fetchListSuccess: (state, action) => {
      console.log('fetchListSuccess action', action);
      //state.items = action.payload;
      //state.loading = false;
    },
  }
  /*
  reducers: (creators) => ({
    ...generateListActions<Settings['id'], Settings, SettingsListRequest,SettingsDisplayContext, SettingsStoreState>(creators, {
      defaultPaginationMode: PaginationMode.List,
      defaultQuery: initialSettingsStoreState.queries || {},
    }),
    ...generateSingleActions<Settings['id'], Settings, SettingsStoreState>(creators),
    ...generateDisplayContextActions<Settings['id'], Settings,SettingsDisplayContext, SettingsStoreState>(creators),
    ...generateEditContextActions<Settings['id'], Settings, SettingsListRequest,SettingsDisplayContext, SettingsStoreState>(creators),
    ...generateActiveItemActions<Settings['id'], Settings, SettingsListRequest,SettingsDisplayContext, SettingsStoreState>(creators),
    ...generateCreateActions<Settings['id'], Settings, SettingsListRequest,SettingsDisplayContext, SettingsStoreState, true>(creators, {
      validate: true,
    }),
    ...generateUpdateActions<Settings['id'], Settings, SettingsListRequest,SettingsDisplayContext, SettingsStoreState, true>(creators, {
      validate: true,
    }),
    ...generatePatchActions<Settings['id'], Settings, SettingsListRequest,SettingsDisplayContext, SettingsStoreState, true>(creators, {
      validate: true,
    }),
    ...generateDeleteActions<Settings['id'], Settings, SettingsListRequest,SettingsDisplayContext, SettingsStoreState>(creators),
    ...generateTransactionCleanupActions<Settings['id'], Settings, SettingsListRequest,SettingsDisplayContext, SettingsStoreState>(creators),
  }),*/
});

export const SettingsReducer = settingsSlice.reducer;
export const SettingsActions = settingsSlice.actions;
export const {fetchList} = settingsSlice.actions;
export const SettingsSliceKey = settingsSlice.name;
