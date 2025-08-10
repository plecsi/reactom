import {
  Settings,
  SettingsDisplayContext,
  SettingsEditContext,
  SettingsInput,
  SettingsListRequest, 
  SettingsStoreState
} from './types';
import { SettingsSliceKey, initialSettingsStoreState } from './slice';
import { generateEntityStoreSelectors } from '../../store/selectorHelpers';

export const SettingsSelectors = generateEntityStoreSelectors<
  Settings,
  SettingsInput,
  SettingsListRequest,
  SettingsDisplayContext,
  SettingsEditContext,
  SettingsStoreState
>({
  sliceKey: SettingsSliceKey,
  initialState: initialSettingsStoreState,
  includeDisplayContext: true,
  includeEditContext: true,
  validate: true,
});
