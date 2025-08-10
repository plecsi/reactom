import { i18nConfig } from './config';
// @ts-ignore
import en from './translations/en.json';

export const LanguageService = {
  async getDefaultLocale(): Promise<string> {
    try {
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error('No response');
      const data = await response.json();
      console.log('language data', data?.settings.module.language);
      if (data?.settings.module.language) return data.settings.module.language;
    } catch {
      if (i18nConfig?.defaultLocale) return i18nConfig.defaultLocale;
    }
    return 'en';
  },

  async getTranslations(locale: string): Promise<Record<string, string>> {
    try {
      //console.log('BEJÖN!!!')
      const messages = await import(`./translations/${locale}.json`);
     // console.log("KECSKE translation", messages, locale)
      return messages.default || messages;
    } catch {
      return en.default || en;
    }
  },

  getAvailableLocales(): string[] {
    return ['en', 'hu'];
  },
};
