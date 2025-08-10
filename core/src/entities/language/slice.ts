import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Language } from './types';

interface LanguageState {
  data?: Language;
  loading: boolean;
  error?: string;
}

const initialState: LanguageState = {
  data: undefined,
  loading: false,
};

export const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    fetchStart(state) {
      state.loading = true;
      state.error = undefined;
    },
    fetchSuccess(state, action: PayloadAction<Language>) {
      state.data = action.payload;
      state.loading = false;
    },
    fetchError(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    setLocale(state, action: PayloadAction<Language>) {
      state.data = action.payload;
    },
  },
});

export const languageActions = languageSlice.actions;
export default languageSlice.reducer;
export const languageSliceKey = languageSlice.name;