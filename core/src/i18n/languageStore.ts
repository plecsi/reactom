// src/i18n/languageStore.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LanguageState {
  locale: string;
}

const initialState: LanguageState = {
  locale: 'en',
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLocale(state, action: PayloadAction<string>) {
      state.locale = action.payload;
    },
  },
});

export const { setLocale } = languageSlice.actions;

export const selectLocale = (state: RootState) => state.language.locale;

export default languageSlice.reducer;
