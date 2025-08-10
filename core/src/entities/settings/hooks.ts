import {
  Settings,
  SettingsDisplayContext,
  SettingsEditContext,
  SettingsInput,
  SettingsListRequest,
  SettingsStoreState,
} from './types';
import { SettingsSaga } from './saga';
import { fetchList, SettingsActions, SettingsReducer, SettingsSliceKey } from './slice';
import { SettingsSelectors } from './selectors';
import { useEntityList } from '../../store/hooksHelpers';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { PaginationMode } from 'core/src/store/types';
import { useInjectReducer, useInjectSaga } from 'redux-injectors';
import { useEffect, useRef } from 'react';
import { defaultSettingsQuery } from './config';
import { useDispatch, useSelector } from 'react-redux';

export function useSettings(props?: {
  initialRequest?: Partial<SettingsListRequest>;
  paginationMode?: PaginationMode[keyof PaginationMode];
}) {
  const { initialRequest, paginationMode } = props || {};
  useInjectReducer({ key: SettingsSliceKey, reducer: SettingsReducer });
  useInjectSaga({ key: SettingsSliceKey, saga: SettingsSaga });

  const dispatch = useDispatch();

  const items = useSelector(SettingsSelectors.selectList);


  console.log('SETTINGS HOOK saga:',SettingsSaga )

  const request = useRef({
    ...defaultSettingsQuery,
    ...initialRequest,
  });
  useEffect(() => {
      dispatch(fetchList(request));
  }, [dispatch, items, paginationMode]);

  return {
    items,
  };
  /*

  return useEntityList({
    actions: SettingsActions,
    initialRequest: request.current,
    paginationMode: 'page',
    selectors: SettingsSelectors,
    queryKey: request.current.queryKey,
  });*/
}

export default useSettings;
