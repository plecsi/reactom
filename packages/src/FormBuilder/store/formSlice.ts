// packages/src/FormBuilder/store/formsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormConfig, FormState } from '../types';
import formBuilderConfig from './config';

const initialState: FormState = {
  data: {},
  loading: false,
  error: null,
  activeItem: null, // Aktív elem, amelyet szerkeszteni szeretnénk
  ongoing: false,
};

const formsSlice = createSlice({
  name: formBuilderConfig.sliceKey, // egységes kulcs a store-ban
  initialState,
  reducers: {
    loadFormsRequest(state) {
      state.loading = true;
      state.error = null;
    },
    loadFormsSuccess(state, action: PayloadAction<FormState>) {
      console.log('loadFormsSuccess', action.payload);
      state.data = action.payload.data;
      state.loading = false;
      state.error = null;
      state.activeItem = null; // Sikeres betöltés után nullázzuk az aktív elemet
    },
    loadFormsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    //új form mentése
    saveFormRequest(state, action: PayloadAction<FormConfig>) {
      state.loading = true;
      state.error = null;
      state.ongoing = true; // mentés elkezdődött
    },
    saveFormSuccess(state, action: PayloadAction<FormState>) {
      state.data = {
        ...state.data,
        [action.payload._id]: action.payload.data,
      };

      state.loading = false;
      state.ongoing = false; // mentés befejeződött
    },
    saveFormFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.ongoing = false; // mentés befejeződött hibával
    },
    //szerkesztési műveletek
    editFormRequest(state, action: PayloadAction<FormConfig>) {
      state.loading = true;
      state.error = null;
      state.ongoing = true; // mentés elkezdődött
    },
    editFormSuccess(state, action: PayloadAction<FormState>) {
      console.log('editFormSuccess state', state.data);
      console.log('editFormSuccess', action.payload);
      state.data[action.payload?._id] = action.payload.data;
      state.loading = false;
      state.error = null;
      state.ongoing = false; // mentés befejeződött
    },
    editFormFailure(state, action) {
      state.error = action.payload;
      state.loading = false;
      state.activeItem = null;
      state.ongoing = false; // mentés befejeződött hibával
    },

    deleteFormRequest(state, action: PayloadAction<FormConfig>) {
      state.loading = true;
      state.error = null;
      state.ongoing = true; // törlés elkezdődött
    },
    deleteFormSuccess(state, action: PayloadAction<FormState>) {
      const id = action.payload;
      console.log('deleteFormSuccess', id);

      state.loading = false;
      state.error = null;
      state.ongoing = false; // törlés befejeződött
    },
    deleteFormFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.ongoing = false; // törlés befejeződött hibával
    },

    selectFormForEdit(state, action: PayloadAction<FormConfig>) {
      state.activeItem = action.payload;
    },
    // Sikeres szerkesztés után lehet nullázni ha kell
    clearSelectedForm(state) {
      console.log('clearSelectedForm called');
      state.activeItem = null;
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
  editFormRequest,
  editFormSuccess,
  editFormFailure,
  deleteFormRequest,
  deleteFormSuccess,
  deleteFormFailure,
  selectFormForEdit,
  clearSelectedForm,
} = formsSlice.actions;

export default formsSlice.reducer; // default export a reducer
export const formActions = formsSlice.actions; // export actions for use in components
export const formBuilderSliceKey = formsSlice.name; // export the reducer for use in the store
