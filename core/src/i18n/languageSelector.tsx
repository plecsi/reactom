// src/i18n/LanguageSelector.tsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LanguageService } from './languageService';
import { selectLocale, setLocale } from './languageStore';

export const LanguageSelector: React.FC = () => {
  const dispatch = useDispatch();
  const locale = useSelector(selectLocale);
  const availableLocales = LanguageService.getAvailableLocales();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log('Selected locale:', e.target.value);
    dispatch(setLocale(e.target.value));
  };

  console.log('SELECTOR LOCALE:',availableLocales, locale);

  return (
    <select value={locale} onChange={handleChange} data-testid="language-select">
      {availableLocales.map((loc) => (
        <option key={loc} value={loc}>
          {loc.toUpperCase()}
        </option>
      ))}
    </select>
  );
};
