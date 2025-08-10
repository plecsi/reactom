import { Draft, PayloadAction, ReducerCreators } from '@reduxjs/toolkit';

import {
  BackendErrors,
  Entity,
  EntityDisplayContext,
  EntityEditContext,
  EntityListRequest, EntityListResponse,
  EntityStoreState, GenerateListActionsOptions,
  PaginationMode,
} from './types';
import { createEntityListQuery, DataSet, wrapReducerWithPlugins } from './utils';
import { uniq } from 'lodash';

/**
 * Lista akciók generálása
 *
 * @param creators - Action creator objektum
 * @param options - Opciók a lista akciókhoz
 * @returns - Lista akciók object
 */
export const generateListActions = <
  ID extends string | number = number | string,
  Item extends Entity<ID> = Entity<ID>,
  Request extends EntityListRequest<ID, Item> = EntityListRequest<ID, Item>,
  DisplayContext extends EntityDisplayContext = EntityDisplayContext,
  State extends EntityStoreState<ID, any> = any
>(
  creators: ReducerCreators<State>,
  options?: GenerateListActionsOptions<ID, Item, Request, DisplayContext, State>,
) => {
  const {
    defaultPaginationMode = PaginationMode.Page,
    defaultQuery = {} as Request,
    plugins = {},
  } = options || {};
  const defaultEntityQuery = {
    ...defaultQuery,
    paginationMode: defaultPaginationMode,
  };

  return {
    // Lista lekérés
    //fetchList: creators.preparedReducer((payload: TListRequest) => ({ payload })),
    fetchList: creators.preparedReducer(
      (queryKey = 'default', appendResults) =>
        typeof appendResults === 'boolean'
          ? {
            payload: { appendResults, queryKey },
          }
          : {
            payload: { queryKey, appendResults: defaultPaginationMode !== PaginationMode.Page },
          },
      (state, action) => {
        console.log('fetchList action:', action);
        wrapReducerWithPlugins(state, action, plugins.listRequest || {}, function (state, action) {
          const queryKey = action.payload.queryKey;
          if (!state.queries[queryKey]) {
            state.queries[queryKey] = createEntityListQuery<ID, Item, Request>(defaultEntityQuery);
          }

          state.queries[queryKey].fetching = true;
          state.queries[queryKey].pending = false;
        });
      },
    ),
    listFailure: creators.reducer<{ queryKey: string; errors: BackendErrors }>((state, action) => {
      wrapReducerWithPlugins(state, action, plugins.listFailure || {}, function (state, action) {
        const queryKey = action.payload.queryKey;
        if (state.queries[queryKey]) {
          state.queries[queryKey].fetching = false;
          state.queries[queryKey].pending = false;
          state.queries[queryKey].errors = action.payload.errors;
        }
      });
    }),
    fetchListFailure: creators.reducer<{ queryKey: string; errors: BackendErrors }>((state, action) => {
      wrapReducerWithPlugins(state, action, plugins.listFailure || {}, function (state, action) {
        const queryKey = action.payload.queryKey;
        if (state.queries[queryKey]) {
          state.queries[queryKey].fetching = false;
          state.queries[queryKey].pending = false;
          state.queries[queryKey].errors = action.payload.errors;
        }
      });
    }),
    fetchListSuccess: creators.reducer<EntityListResponse<ID, Item>>((state, action) => {
      wrapReducerWithPlugins(state, action, plugins.listSuccess || {}, function (state, action) {
        const query = state.queries[action.payload.queryKey];
        if (query) {
          const ids = action.payload.data.map((item) => item.id);

          if (action.payload.appendResults) {
            query.data = uniq(query.data.concat(ids as Draft<ID>[]));
          } else {
            query.data = ids as Draft<ID>[];
          }

          query.errors = null;
          query.fetching = false;
          query.pending = false;
          query.totalCount = action.payload.totalCount;
        }

        action.payload.data.forEach((item) => {
          state.data[item.id as number] = {
            ...state.data[item.id as number],
            ...item,
            partial: query.dataSet !== DataSet.Full && query.dataSet !== undefined,
          };
        });

        state.queries[action.payload.queryKey] = query;
      });
    }),
    resetList: creators.preparedReducer(
      (queryKey = 'default', initialValue) => ({
        payload: { queryKey, ...initialValue } as ResetListPayload<ID, Item, Request>,
      }),
      (state, action) => {
        wrapReducerWithPlugins(state, action, plugins.resetList || {}, function (state, action) {
          const { queryKey, ...initialValues } = action.payload;
          // Trimming is necessary to prevent overriding the default query values with undefined.
          state.queries[queryKey] = createEntityListQuery<ID, Item, Request>({ ...defaultEntityQuery, ...trimUndefinedFields(initialValues) });
          state.queries[queryKey].pending = true;
        });
      },
    ),
    setPaginationMode: creators.preparedReducer(
      ({ queryKey = 'default', paginationMode }) => ({
        payload: { queryKey, paginationMode },
      }),
      (state, action) => {
        wrapReducerWithPlugins(state, action, plugins.setPaginationMode || {}, function (state, action) {
          const { queryKey, paginationMode } = action.payload;

          if (state.queries[queryKey]) {
            state.queries[queryKey].paginationMode = paginationMode;
          }
        });
      },
    ),
    updateListPaging: creators.preparedReducer(
      ({ queryKey = 'default', ...rest }) => ({
        payload: { queryKey, ...rest },
      }),
      (state, action) => {
        wrapReducerWithPlugins(state, action, plugins.updateListPaging || {}, function (state, action) {
          const { queryKey, limit, offset } = action.payload;

          let query = state.queries[queryKey] || createEntityListQuery<ID, Item, Request>(defaultEntityQuery);

          /**
           * It the limit is changed, we reset the query.
           */
          if (limit !== undefined && limit !== query.limit) {
            query.limit = limit;
            query = resetEntityListQueryState(query);
            query.pending = true;
          }

          if (offset !== undefined && offset !== query.offset) {
            if (query.offset !== null && offset !== null && query.offset > offset && query.paginationMode === PaginationMode.List) {
              /**
               * Stepping back in the list pagination mode is not a valid use case, so we reset the query.
               */
              query = resetEntityListQueryState(query);
            }

            query.offset = offset;
            query.pending = true;
          }

          state.queries[queryKey] = query;
        });
      },
    ),
    updateListSearch: creators.preparedReducer(
      ({ queryKey = 'default', ...rest }) => ({
        payload: { queryKey, ...rest },
      }),
      (state, action) => {
        wrapReducerWithPlugins(state, action, plugins.updateListSearch || {}, function (state, action) {
          const { queryKey, search, search_in_fields } = action.payload;

          let shouldReset = false;

          const query = state.queries[queryKey] || createEntityListQuery<ID, Item, Request>(defaultEntityQuery);

          if (search !== undefined && search !== query.search) {
            query.search = search;
            shouldReset = search === null || search.length >= minSearchLength;
          }

          if (search_in_fields !== undefined && !isEqual(search_in_fields, query.search_in_fields)) {
            query.search_in_fields = search_in_fields;
            shouldReset = true;
          }

          state.queries[queryKey] = shouldReset ? resetEntityListQueryState(query) : query;
          state.queries[queryKey].pending = state.queries[queryKey].pending || shouldReset;
        });
      },
    ),
    updateListSorting: creators.preparedReducer(
      ({ queryKey = 'default', ...rest }) => ({
        payload: { queryKey, ...rest },
      }),
      (state, action) => {
        wrapReducerWithPlugins(state, action, plugins.updateListSorting || {}, function (state, action) {
          const { queryKey, sortBy, sortOrder } = action.payload;

          let shouldReset = false;

          const query = state.queries[queryKey] || createEntityListQuery<ID, Item, Request>(defaultEntityQuery);

          if (sortBy !== undefined && sortBy !== query.sortBy) {
            query.sortBy = sortBy;
            query.pending = true;
            shouldReset = true;
          }

          if (sortOrder !== undefined && sortOrder !== query.sortOrder) {
            query.sortOrder = sortOrder;
            // If the sort order is changed, but we have all the data, we don't need to reset the query, we can reverse the data order.
            shouldReset = shouldReset || query.totalCount === 0 || query.data.length < query.totalCount;
            query.pending = shouldReset;
            if (!shouldReset) {
              query.offset = 0;
              query.data.reverse();
            }
          }

          state.queries[queryKey] = shouldReset ? resetEntityListQueryState(query) : query;
        });
      },
    ),
    updateListFilters: creators.preparedReducer(
      ({ queryKey = 'default', keepQueryParams = true, keepQueryState = false, ...rest }) => ({
        payload: { queryKey, keepQueryParams, keepQueryState, ...rest },
      }),
      (state, action) => {
        wrapReducerWithPlugins(state, action, plugins.updateListFilters || {}, function (state, action) {
          const { queryKey, keepQueryParams, keepQueryState, filter } = action.payload;

          let query = state.queries[queryKey] || createEntityListQuery<ID, Item, Request>(defaultEntityQuery);

          if (filter !== undefined && !isEqual(filter, query.filter)) {
            if (keepQueryParams) {
              query.offset = 0;
            } else {
              query = resetEntityListQueryParams<ID, Item>(query, defaultEntityQuery);
            }

            if (keepQueryState) {
              query.offset = 0;
            }

            query.filter = filter as Draft<FilterQuery<Item>>;
            query.pending = true;
            state.queries[queryKey] = query;
          }
        });
      },
    ),
    updateListExport: creators.preparedReducer(
      ({ queryKey = 'default', export_type = null }) => ({
        payload: { queryKey, export_type },
      }),
      (state, action) => {
        wrapReducerWithPlugins(state, action, plugins.updateListExport || {}, function (state, action) {
          const { queryKey, export_type } = action.payload;

          const query = state.queries[queryKey] || createEntityListQuery<ID, Item, Request>(defaultEntityQuery);

          if (export_type !== undefined && export_type !== query.export_type) {
            query.export_type = export_type;
            query.offset = 0;
            query.limit = null;
            query.pending = true;
            state.queries[queryKey] = query;
          }
        });
      },
    ),
    updateListDataSet: creators.preparedReducer(
      ({ queryKey = 'default', ...rest }) => ({
        payload: {
          queryKey,
          ...rest,
        },
      }),
      (state, action) => {
        wrapReducerWithPlugins(state, action, plugins.updateListDataSet || {}, function (state, action) {
          const { queryKey, dataSet } = action.payload;

          let query = state.queries[queryKey] || createEntityListQuery<ID, Item, Request>(defaultEntityQuery);

          if (query.dataSet !== dataSet) {
            query = resetEntityListQueryState(query);
            query.dataSet = dataSet;
            query.pending = true;
          }

          state.queries[queryKey] = query;
        });
      },
    ),
    updateListAdditionalProperty: creators.preparedReducer(
      ({ queryKey = 'default', ...rest }) => ({
        payload: {
          queryKey,
          ...rest,
        },
      }),
      (state, action) => {
        wrapReducerWithPlugins(state, action, plugins.updateListAdditionalProperty || {}, function (state, action) {
          const { queryKey, key, value } = action.payload;

          const query = state.queries[queryKey] || createEntityListQuery<ID, Item, Request>(defaultEntityQuery);

          query[key] = value;

          if (action.payload.shouldTriggerRequest) {
            query.pending = true;
          }

          state.queries[queryKey] = query;
        });
      },
    ),
  };
};

/**
 * Egyedi elem akciók generálása
 *
 * @param creators - Action creator objektum
 * @returns - Egyedi elem akciók object
 */
export const generateSingleActions = <
  ID extends string | number = number | string,
  T extends Entity<ID> = Entity<ID>,
  TState = any
>(
  creators: any
) => {
  return {
    // Egy elem lekérése
    fetchById: creators.preparedReducer((payload: ID) => ({ payload })),
    fetchByIdSuccess: creators.preparedReducer(
      (payload: { id: ID; data: T }) => ({ payload })
    ),
    // Elem törlése a store-ból
    removeFromStore: creators.preparedReducer((payload: ID) => ({ payload })),
    // Összes elem törlése a store-ból
    clearStore: creators.preparedReducer(() => ({ payload: {} })),
  };
};

/**
 * Megjelenítési kontextus akciók generálása
 *
 * @param creators - Action creator objektum
 * @returns - Megjelenítési kontextus akciók object
 */
export const generateDisplayContextActions = <
  ID extends string | number = number | string,
  T extends Entity<ID> = Entity<ID>,
  TDisplayContext extends EntityDisplayContext = EntityDisplayContext,
  TState = any
>(
  creators: any
) => {
  return {
    // Megjelenítési kontextus lekérése
    fetchDisplayContext: creators.preparedReducer((payload: ID) => ({
      payload,
    })),
    fetchDisplayContextSuccess: creators.preparedReducer(
      (payload: { id: ID; data: T }) => ({ payload })
    ),
    fetchDisplayContextFailure: creators.preparedReducer(
      (payload: { id: ID; error: string }) => ({ payload })
    ),
    // Megjelenítési kontextus törlése
    clearDisplayContext: creators.preparedReducer((payload: ID) => ({
      payload,
    })),
    // Összes megjelenítési kontextus törlése
    clearAllDisplayContexts: creators.preparedReducer(() => ({ payload: {} })),
  };
};

/**
 * Szerkesztési kontextus akciók generálása
 *
 * @param creators - Action creator objektum
 * @returns - Szerkesztési kontextus akciók object
 */
export const generateEditContextActions = <
  ID extends string | number = number | string,
  T extends Entity<ID> = Entity<ID>,
  TInput = Partial<T>,
  TEditContext extends EntityEditContext = EntityEditContext,
  TState = any
>(
  creators: any
) => {
  return {
    // Szerkesztési kontextus lekérése
    fetchEditContext: creators.preparedReducer((payload: ID) => ({ payload })),
    fetchEditContextSuccess: creators.preparedReducer(
      (payload: { id: ID; data: TEditContext }) => ({ payload })
    ),
    fetchEditContextFailure: creators.preparedReducer(
      (payload: { id: ID; error: string }) => ({ payload })
    ),

    // Szerkesztési kontextus törlése
    clearEditContext: creators.preparedReducer((payload: ID) => ({ payload })),

    // Összes szerkesztési kontextus törlése
    clearAllEditContexts: creators.preparedReducer(() => ({ payload: {} })),
  };
};

/**
 * Aktív elem akciók generálása
 *
 * @param creators - Action creator objektum
 * @returns - Aktív elem akciók object
 */
export const generateActiveItemActions = <
  ID extends string | number = number | string,
  T extends Entity<ID> = Entity<ID>,
  TInput = Partial<T>,
  TEditContext extends EntityEditContext = EntityEditContext,
  TState = any
>(
  creators: any
) => {
  return {
    // Aktív elem beállítása
    setActiveItem: creators.preparedReducer(
      (payload: { id: ID; data?: T }) => ({
        payload,
      })
    ),
    // Aktív elem törlése
    clearActiveItem: creators.preparedReducer(() => ({ payload: {} })),
    // Validációs hibák beállítása
    setValidationErrors: creators.preparedReducer(
      (payload: Record<string, string> | null) => ({ payload })
    ),
    // Validációs hibák törlése
    clearValidationErrors: creators.preparedReducer(() => ({ payload: {} })),
  };
};

/**
 * Létrehozási akciók generálása
 *
 * @param creators - Action creator objektum
 * @param options - Opciók a létrehozási akciókhoz
 * @returns - Létrehozási akciók object
 */
export const generateCreateActions = <
  ID extends string | number = number | string,
  T extends Entity<ID> = Entity<ID>,
  TInput = Partial<T>,
  TEditContext extends EntityEditContext = EntityEditContext,
  TState = any,
  TValidate extends boolean = false
>(
  creators: any,
  options: {
    validate?: TValidate;
  } = {}
) => {
  const { validate = false } = options;

  return {
    // Létrehozás
    create: creators.preparedReducer(
      (payload: { data: TInput; transactionId?: string }) => ({ payload })
    ),
    createSuccess: creators.preparedReducer(
      (payload: { data: T; transactionId?: string }) => ({ payload })
    ),
    createFailure: creators.preparedReducer(
      (payload: {
        error: string;
        validationErrors?: Record<string, string> | null;
        transactionId?: string;
      }) => ({ payload })
    ),

    // Létrehozási űrlap tisztítása
    clearCreateForm: creators.preparedReducer(() => ({ payload: {} })),

    // Validálás (ha engedélyezve van)
    ...(validate
      ? {
          validateCreate: creators.preparedReducer((payload: TInput) => ({
            payload,
          })),
          validateCreateSuccess: creators.preparedReducer(
            (payload: { id: ID; data: TInput }) => ({ payload })
          ),
          validateCreateFailure: creators.preparedReducer(
            (payload: { id: ID; data: TInput }) => ({ payload })
          ),
        }
      : {}),
  };
};

/**
 * Frissítési akciók generálása
 *
 * @param creators - Action creator objektum
 * @param options - Opciók a frissítési akciókhoz
 * @returns - Frissítési akciók object
 */
export const generateUpdateActions = <
  ID extends string | number = number | string,
  T extends Entity<ID> = Entity<ID>,
  TInput = Partial<T>,
  TEditContext extends EntityEditContext = EntityEditContext,
  TState = any,
  TValidate extends boolean = false
>(
  creators: any,
  options: {
    validate?: TValidate;
  } = {}
) => {
  const { validate = false } = options;

  return {
    // Frissítés
    update: creators.preparedReducer(
      (payload: { id: ID; data: TInput; transactionId?: string }) => ({
        payload,
      })
    ),
    updateSuccess: creators.preparedReducer(
      (payload: { id: ID; data: T; transactionId?: string }) => ({ payload })
    ),
    updateFailure: creators.preparedReducer(
      (payload: {
        id: ID;
        error: string;
        validationErrors?: Record<string, string> | null;
        transactionId?: string;
      }) => ({ payload })
    ),

    // Frissítési állapot tisztítása
    clearUpdate: creators.preparedReducer((payload: ID) => ({ payload })),

    // Validálás (ha engedélyezve van)
    ...(validate
      ? {
          validateUpdate: creators.preparedReducer(
            (payload: { id: ID; data: T }) => ({ payload })
          ),
          validateUpdateSuccess: creators.preparedReducer(
            (payload: { id: ID; data: TInput }) => ({ payload })
          ),
          validateUpdateFailure: creators.preparedReducer(
            (payload: {
              id: ID;
              error: string;
              validationErrors: Record<string, string> | null;
            }) => ({ payload })
          ),
        }
      : {}),
  };
};

/**
 * Részleges frissítési akciók generálása
 *
 * @param creators - Action creator objektum
 * @param options - Opciók a részleges frissítési akciókhoz
 * @returns - Részleges frissítési akciók object
 */
export const generatePatchActions = <
  ID extends string | number = number | string,
  T extends Entity<ID> = Entity<ID>,
  TInput = Partial<T>,
  TEditContext extends EntityEditContext = EntityEditContext,
  TState = any,
  TValidate extends boolean = false
>(
  creators: any,
  options: {
    validate?: TValidate;
  } = {}
) => {
  const { validate = false } = options;

  return {
    // Részleges frissítés
    patch: creators.preparedReducer(
      (payload: { id: ID; data: Partial<TInput>; transactionId?: string }) => ({
        payload,
      })
    ),
    patchSuccess: creators.preparedReducer(
      (payload: { id: ID; data: T; transactionId?: string }) => ({ payload })
    ),
    patchFailure: creators.preparedReducer(
      (payload: {
        id: ID;
        error: string;
        validationErrors?: Record<string, string> | null;
        transactionId?: string;
      }) => ({ payload })
    ),

    // Részleges frissítési állapot tisztítása
    clearPatch: creators.preparedReducer((payload: ID) => ({ payload })),

    // Validálás (ha engedélyezve van)
    ...(validate
      ? {
          validatePatch: creators.preparedReducer(
            (payload: { id: ID; data: Partial<TInput> }) => ({ payload })
          ),
          validatePatchSuccess: creators.preparedReducer(
            (payload: { id: ID; data: Partial<TInput> }) => ({ payload })
          ),
          validatePatchFailure: creators.preparedReducer(
            (payload: {
              id: ID;
              error: string;
              validationErrors: Record<string, string> | null;
            }) => ({ payload })
          ),
        }
      : {}),
  };
};

/**
 * Törlési akciók generálása
 *
 * @param creators - Action creator objektum
 * @returns - Törlési akciók object
 */
export const generateDeleteActions = <
  ID extends string | number = number | string,
  T extends Entity<ID> = Entity<ID>,
  TInput = Partial<T>,
  TEditContext extends EntityEditContext = EntityEditContext,
  TState = any
>(
  creators: any
) => {
  return {
    // Törlés
    delete: creators.preparedReducer(
      (payload: { id: ID; transactionId?: string }) => ({ payload })
    ),
    deleteSuccess: creators.preparedReducer(
      (payload: { id: ID; transactionId?: string }) => ({ payload })
    ),
    deleteFailure: creators.preparedReducer(
      (payload: { id: ID; error: string; transactionId?: string }) => ({
        payload,
      })
    ),

    // Törlési állapot tisztítása
    clearDelete: creators.preparedReducer((payload: ID) => ({ payload })),
  };
};

/**
 * Tranzakció tisztító akciók generálása
 *
 * @param creators - Action creator objektum
 * @returns - Tranzakció tisztító akciók object
 */
export const generateTransactionCleanupActions = <
  ID extends string | number = number | string,
  T extends Entity<ID> = Entity<ID>,
  TInput = Partial<T>,
  TEditContext extends EntityEditContext = EntityEditContext,
  TState = any
>(
  creators: any
) => {
  return {
    // Tranzakció tisztítás
    cleanupTransaction: creators.preparedReducer(
      (payload: { transactionId: string }) => ({ payload })
    ),
    cleanupTransactionSuccess: creators.preparedReducer(
      (payload: { transactionId: string }) => ({ payload })
    ),
    cleanupTransactionFailure: creators.preparedReducer(
      (payload: { transactionId: string; error: string }) => ({ payload })
    ),
  };
};
