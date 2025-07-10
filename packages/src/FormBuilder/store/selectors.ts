// packages/src/FormBuilder/store/selectors.ts
import { RootState } from '../../../core/src/store/store';

export const selectFormsEntities = (state: RootState) => state.formBuilder?.entities;
export const selectFormsLoading = (state: RootState) => state.formBuilder?.loading;
export const selectFormsError = (state: RootState) => state.formBuilder?.error;
