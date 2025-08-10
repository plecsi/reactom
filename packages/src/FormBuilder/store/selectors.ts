// packages/src/FormBuilder/store/selectors.ts
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './augmentation';

const selectFormsDomain = (state: RootState) => state.formBuilder;

export const selectFormsEntities = createSelector(
  [selectFormsDomain],
  (formsState) => Object.values(formsState?.data?.forms ?? {})
);

export const selectFormById = (id: string) =>
  createSelector(
    [selectFormsDomain],
    (formsState) => formsState?.data?.forms?.[id] ?? null
  );

export const selectFormsLoading = (state: RootState) =>
  state.formBuilder?.loading;
export const selectFormsError = (state: RootState) => state.formBuilder?.error;
export const selectActiveItem = (state: RootState) =>
  state.formBuilder?.activeItem;
export const selectOngoing = (state: RootState) =>
  state.formBuilder?.ongoing;
