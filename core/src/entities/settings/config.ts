// Local imports
import { SettingsListRequest } from './types';
// settings/config.ts
export const SETTINGS_STORE_KEY = 'settings';

export const defaultSettingsQuery = {
  offset: 0,
  limit: 25,
  queryKey: 'crud',
} satisfies SettingsListRequest;
