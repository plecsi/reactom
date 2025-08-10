// settings/api.ts
import { Settings, SettingsDisplayContext, SettingsEditContext, SettingsInput } from './types';
import { generateEntityApi } from '../../store/api';

export const settingsApi = generateEntityApi<
  Settings,
  SettingsInput,
  SettingsDisplayContext,
  SettingsEditContext
>({
  path: '/data', // az API végpont tényleges útvonala
  validate: false,
});