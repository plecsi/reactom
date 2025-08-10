import { Entity } from '../store/types';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastContextValue {
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

export interface ToastMessage extends Entity {
  type: ToastType;
  message: string;
  duration?: number; // ms, alapértelmezett 3000
}

export interface ToastState {
  toasts: ToastMessage[];
}
