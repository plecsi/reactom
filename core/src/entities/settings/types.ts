// settings/types.ts

import {
  createEntityType,
  createEntityInputType,
  createEntityFiltersType,
  createEntityListRequestType,
  createEntityDisplayContextType,
  createEntityEditContextType,
  createEntityStoreStateType
} from '../../store/typeHelpers';
import { 
  UserGeneralInput,
  UserHasRoles,
  UserHasStatus
} from '../../store/types';

export type SettingsInput = createEntityInputType<UserGeneralInput & UserHasStatus & UserHasRoles>;

export type Settings = createEntityType<number, SettingsInput>;

export type SettingsFilters = createEntityFiltersType<Settings>;

export type SettingsListRequest = createEntityListRequestType<Settings>;

export type SettingsDisplayContext = createEntityDisplayContextType;

export type SettingsEditContext = createEntityEditContextType;

export type SettingsStoreState = createEntityStoreStateType<
  Settings, 
  SettingsInput, 
  SettingsDisplayContext, 
  SettingsEditContext, 
  true, // includeDisplayContext 
  true  // includeEditContext
>;
