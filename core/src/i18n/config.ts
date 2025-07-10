// src/i18n/config.ts
import type { LocaleConfig } from './types';

export const i18nConfig = {
  defaultLocale: 'en',
  locales: ['en', 'hu'],
};


/**
 *	Default configuration for the i18n module.
 *	THIS IS A COMPILE TIME VARIABLE, DO NOT IMPORT IT IN RUNTIME FILES!
 */
const config: LocaleConfig = {
  defaultLocale: 'en',
  locales: ['en', 'hu'],
  messageFilePattern: './**/*[mM]essages.{js,ts}',
  outDir: 'src/i18n/translations',
  sourceLocale: 'en',
};

export default config;

