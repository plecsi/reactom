import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface EntityState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

const initialState: EntityState<any> = {
  data: null,
  loading: false,
  error: null,
};

const entitySlice = createSlice({
  name: 'entity',
  initialState,
  reducers: {
    fetchEntityRequest(state: EntityState<any>) {
      state.loading = true;
      state.error = null;
    },
    fetchEntitySuccess<T>(state: EntityState<any>, action: PayloadAction<T>) {
      state.data = action.payload;
      state.loading = false;
    },
    fetchEntityFailure(state: EntityState<any>, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { fetchEntityRequest, fetchEntitySuccess, fetchEntityFailure } = entitySlice.actions;
export default entitySlice.reducer;