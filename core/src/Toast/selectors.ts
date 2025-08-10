// src/store/toastSelectors.ts

import { RootState } from '../store/types';

export const selectToasts = (state: RootState) => state?.toast.toasts;
