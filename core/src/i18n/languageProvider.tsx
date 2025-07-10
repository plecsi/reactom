// src/i18n/LanguageProvider.tsx
import React, { ReactNode, useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { LanguageService } from './languageService';
import { selectLocale, setLocale } from './languageStore';

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const locale = useSelector(selectLocale);
  const [messages, setMessages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      setLoading(true);
      if (!locale) {
        const defaultLocale = await LanguageService.getDefaultLocale();
        dispatch(setLocale(defaultLocale));
      }
      setLoading(false);
    }
    init();
  }, [dispatch, locale]);

  useEffect(() => {
    if (!locale) return;
    setLoading(true);
    LanguageService.getTranslations(locale)
      .then((msgs) => {
        console.log('Locale:', locale);
        console.log('Messages:', msgs);
        setMessages(msgs);
      })
      .finally(() => setLoading(false));
  }, [locale]);

  if (loading) return <div>Loading...</div>;

  console.log('messages',messages)

  return (
    <IntlProvider locale={locale || 'en'} messages={messages} defaultLocale="en">
      {children}
    </IntlProvider>
  );
};
