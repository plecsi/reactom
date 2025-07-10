// packages/src/FormBuilder/store/formsSlice.ts
import { createSlice, createEntityAdapter, PayloadAction } from '@reduxjs/toolkit';
import { FormConfig } from '../types';

const formsAdapter = createEntityAdapter<FormConfig>({
  selectId: (form) => form.id,
});

export interface FormsState {
  loading: boolean;
  error: string | null;
}

const initialState = formsAdapter.getInitialState<FormsState>({
  loading: false,
  error: null,
});

const formsSlice = createSlice({
  name: 'formBuilder', // egységes kulcs a store-ban
  initialState,
  reducers: {
    loadFormsRequest(state) {
      state.loading = true;
      state.error = null;
    },
    loadFormsSuccess(state, action: PayloadAction<FormConfig[]>) {
      formsAdapter.setAll(state, action.payload);
      state.loading = false;
    },
    loadFormsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    saveFormRequest(state, action: PayloadAction<FormConfig>) {
      state.loading = true;
      state.error = null;
    },
    saveFormSuccess(state, action: PayloadAction<FormConfig>) {
      formsAdapter.upsertOne(state, action.payload);
      state.loading = false;
    },
    saveFormFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  loadFormsRequest,
  loadFormsSuccess,
  loadFormsFailure,
  saveFormRequest,
  saveFormSuccess,
  saveFormFailure,
} = formsSlice.actions;

export default formsSlice.reducer; // default export a reducer

export const formsSelectors = formsAdapter.getSelectors(
  (state: any) => state.formBuilder
);
