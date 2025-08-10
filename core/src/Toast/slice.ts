// src/store/toastSlice.ts
import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';
import { ToastMessage, ToastState } from './types';

const initialState: ToastState = {
  toasts: [],
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    addToast(state: Draft<ToastState>, action: PayloadAction<ToastMessage>) {
      const id = uuid();
      state.toasts.push({
        id ,
        ...action.payload,
      });
    },
    removeToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter(
        (toast) => toast.id !== action.payload
      );
    },
    clearToasts(state) {
      state.toasts = [];
    },
  },
});

export const { addToast, removeToast, clearToasts } = toastSlice.actions;
export default toastSlice.reducer;
export const toastSliceKey = toastSlice.name;
