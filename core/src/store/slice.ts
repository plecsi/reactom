// core/src/store/slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EntityState, Entity } from './types';

const initialState: EntityState = {
  items: {},
  loading: false,
};

const entitySlice = createSlice({
  name: 'entity',
  initialState,
  reducers: {
    fetchStart(state) {
      state.loading = true;
      state.error = undefined;
    },
    fetchSuccess(state, action: PayloadAction<Record<string, Entity>>) {
      state.items = action.payload;
      state.loading = false;
    },
    fetchError(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    clear(state) {
      state.items = {};
      state.loading = false;
      state.error = undefined;
    },
  },
});

export const { fetchStart, fetchSuccess, fetchError, clear } = entitySlice.actions;
export default entitySlice.reducer;