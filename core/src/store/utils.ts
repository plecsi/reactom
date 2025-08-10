import {
  IDataSet,
  Entity,
  EntityListRequest, EntityQuery, EntityQueryOptions,
  PaginationMode,
  ReducerPlugins,
  VoidReducer
} from './types';
import { Draft, PayloadAction } from '@reduxjs/toolkit';


export const DataSet: IDataSet = {
  Full: 'full',
  Minimal: 'minimal',
}

/**
 * Wraps the original reducer function with the given plugins.
 *
 * The plugins are called in the following order:
 * 1. before
 * 2. The original reducer function
 * 3. after
 *
 * If the `around` plugin is provided, it will be called instead of the `before` and `after` plugins.
 * The original reducer function is passed as the last argument to the `around` plugin, and it is the responsibility of the plugin to call it.
 * This can be useful when you want to wrap the original reducer function with some additional logic, or omit it completely.
 *
 * @param state
 * @param action
 * @param plugins
 * @param originalFn
 */
export function wrapReducerWithPlugins<
  State,
  Action extends PayloadAction<unknown>
>(
  state: Draft<State>,
  action: Action,
  plugins: ReducerPlugins<State, Action>,
  originalFn: VoidReducer<State, Action>
) {
  if (plugins.around) {
    plugins.around(state, action, originalFn);
    return;
  }

  if (plugins.before) {
    plugins.before(state, action);
  }

  originalFn(state, action);

  if (plugins.after) {
    plugins.after(state, action);
  }
}

/**
 *
 * @param defaults
 */
export function createEntityListQuery<
  ID extends string | number,
  Item extends Entity<ID>,
  Request extends EntityListRequest<ID, Item>
>(
  defaults: Partial<Request & EntityQueryOptions> = {} as Partial<
    Request & EntityQueryOptions
  >
): {
  data: never[];
  dataSet: IDataSet;
  errors: null;
  export_type: null;
  fetching: false;
  filter: null;
  limit: number;
  offset: number;
  paginationMode: any;
  pending: false;
  search: null;
  search_in_fields: null;
  sortBy: null;
  sortOrder: null;
  totalCount: number
} {
 // const sanitizedDefaults = trimUndefinedFields(defaults);

  return {
    dataSet: DataSet.Full,
    export_type: null,
    filter: null,
    offset: 0,
    limit: 25,
    search: null,
    search_in_fields: null,
    sortBy: null,
    sortOrder: null,
   // paginationMode: PaginationMode.Pages,
   // ...sanitizedDefaults,
    data: [],
    pending: false,
    totalCount: 0,
    fetching: false,
    errors: null,
  } satisfies Draft<EntityQuery<ID, Item>>;
}