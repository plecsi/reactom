import { CustomFormats, IntlConfig } from 'react-intl';

export type Locale = IntlConfig['locale'];

/**
 * Object containing the messages of one language
 */
export type Messages = IntlConfig['messages'];

/**
 * Object containing the messages of all available languages
 */
export type Translations = Record<Locale, Messages>;

/**
 * Function that fetches the translations for the given locales
 */
export type TranslationFetcher = (locale: Locale) => Promise<Messages>;

export interface LocaleConfig {
  /**
   * The language used by the application by default.
   */
  defaultLocale: Locale;
  /**
   * Intl format options per language code.
   */
  formats?: CustomFormats;
  /**
   * Supported locales of the application
   */
  locales: Locale[];
  /**
   * The pattern of the files in which the messages are located.
   * It starts from the current working directory, e.g.: 'src/components/messages.ts'
   */
  messageFilePattern: string;
  /**
   * The output directory in which the JSON files with the translations are placed.
   * The path start from the current working directory, e.g.: 'src/i18n/translations'
   */
  outDir: string;
  /**
   * The language of the default messages in the code.
   */
  sourceLocale?: Locale;
}