// /core/src/store/sliceHelpers.ts
import { createSlice } from '@reduxjs/toolkit';
import {
  generateActiveItemActions,
  generateCreateActions,
  generateDeleteActions,
  generateDisplayContextActions,
  generateEditContextActions,
  generateListActions,
  generatePatchActions,
  generateSingleActions,
  generateTransactionCleanupActions,
  generateUpdateActions,
} from './reducers';
import { generateInitialEntityStoreState } from './storeHelpers';
import {
  Entity,
  EntityDisplayContext,
  EntityListRequest,
  EntityStoreState, PaginationMode
} from './types';

// Ez legyen a valódi initial state generátorod vagy egy importált érték!
export const initialEntityStoreState = generateInitialEntityStoreState();

/**
 * Egységes slice generátor entitásokhoz.
 */
export function createEntitySlice<S = typeof initialEntityStoreState>(
  options: CreateEntitySliceOptions<S>
) {
  const {
    name,
    initialState = initialEntityStoreState as S,
    reducers = {},
  } = options;

  const slice = createSlice({
    name,
    initialState,
    reducers: (creators) => ({
      ...generateListActions<Entity['id'], Entity, EntityListRequest,EntityDisplayContext, EntityStoreState>(creators, {
        defaultPaginationMode: PaginationMode.List,
        defaultQuery: initialState.list || {},
      }),
      ...generateSingleActions<Entity['id'], Entity, EntityStoreState>(creators),
      ...generateDisplayContextActions<Entity['id'], Entity,EntityDisplayContext, EntityStoreState>(creators),
      ...generateEditContextActions<Entity['id'], Entity, EntityListRequest,EntityDisplayContext, EntityStoreState>(creators),
      ...generateActiveItemActions<Entity['id'], Entity, EntityListRequest,EntityDisplayContext, EntityStoreState>(creators),
      ...generateCreateActions<Entity['id'], Entity, EntityListRequest,EntityDisplayContext, EntityStoreState, true>(creators, {
        validate: true,
      }),
      ...generateUpdateActions<Entity['id'], Entity, EntityListRequest,EntityDisplayContext, EntityStoreState, true>(creators, {
        validate: true,
      }),
      ...generatePatchActions<Entity['id'], Entity, EntityListRequest,EntityDisplayContext, EntityStoreState, true>(creators, {
        validate: true,
      }),
      ...generateDeleteActions<Entity['id'], Entity, EntityListRequest,EntityDisplayContext, EntityStoreState>(creators),
      ...generateTransactionCleanupActions<Entity['id'], Entity, EntityListRequest,EntityDisplayContext, EntityStoreState>(creators),
      ...reducers,
    }),
  });

  return {
    slice,
  };
}
