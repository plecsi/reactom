import { memoize } from 'lodash-es';
import { createSelector } from '@reduxjs/toolkit';
import {
  BackendErrors,
  Entity,
  EntityDisplayContext,
  EntityEditContext,
  EntityStoreBaseSelectors,
  EntityStoreCreateSelectors,
  EntityStoreDeleteSelectors,
  EntityStoreDownloadSelectors, EntityStoreListSelectors,
  EntityStorePatchSelectors,
  EntityStoreSelectors, EntityStoreSingleSelectors,
  EntityStoreState,
  EntityStoreUpdateSelectors,
  EntityTransactionType,
  GenerateEntityStoreBaseSelectorsOptions,
  IDataSet,
  ListRequest,
  RootState
} from './types';
import { DataSet } from './utils';
import { joinKeyResolver } from './resolver';
// Package imports
// Local imports


export function generateEntityStoreBaseSelectors<
  ID extends string | number,
  Item extends Entity<ID>,
  ItemInput extends object = Omit<Item, 'id'>,
  DisplayContext extends EntityDisplayContext = EntityDisplayContext,
  EditContext extends EntityEditContext = EntityEditContext,
  State extends EntityStoreState<ID, Item, ItemInput, DisplayContext, EditContext, boolean, boolean> = EntityStoreState<
    ID,
    Item,
    ItemInput,
    DisplayContext,
    EditContext
  >,
>({
    sliceKey,
    initialState,
  }: GenerateEntityStoreBaseSelectorsOptions<ID, Item, ItemInput, DisplayContext, EditContext, State>): EntityStoreBaseSelectors<
  ID,
  Item,
  ItemInput,
  DisplayContext,
  EditContext,
  State
> {
  const selectDomain = (state: RootState): State => state[sliceKey] || initialState;
  const selectData = createSelector([selectDomain], (storeState) => storeState.data);
  const selectIsPartial = createSelector([selectData], (data) => memoize((id) => (data[id] && data[id].partial) || false));
  const selectItem = createSelector([selectData, selectIsPartial], (data, getIsPartial) =>
    memoize((id, dataSet: IDataSet[keyof IDataSet] = DataSet.Full) => {
      if (dataSet === DataSet.Full && getIsPartial(id)) {
        return null;
      }

      if (!data[id]) {
        return null;
      }

      const { partial, ...item } = data[id];
      return item as Item;
    }, joinKeyResolver),
  );
  const selectQueries = createSelector([selectDomain], (storeState) => storeState.queries);
  const selectSingleQueries = createSelector([selectDomain], (storeState) => storeState.singleQueries);
  const selectActiveItem = createSelector([selectDomain], (storeState) => storeState.draftItem);
  const selectTransactions = createSelector([selectDomain], (storeState) => storeState.transactions);

  return {
    selectDomain,
    selectIsPartial,
    selectItem,
    selectActiveItem,
    selectData,
    selectQueries,
    selectSingleQueries,
    selectTransactions,
  };
}

export function generateEntityStoreListSelectors<
  ID extends string | number,
  Item extends Entity<ID>,
  ItemInput extends object = Omit<Item, 'id'>,
  DisplayContext extends EntityDisplayContext = EntityDisplayContext,
  EditContext extends EntityEditContext = EntityEditContext,
  State extends EntityStoreState<ID, Item, ItemInput, DisplayContext, EditContext, boolean, boolean> = EntityStoreState<
    ID,
    Item,
    ItemInput,
    DisplayContext,
    EditContext
  >,
  Request extends ListRequest<Item> = ListRequest<Item>,
>({
    selectQueries,
    selectData,
  }: Pick<EntityStoreBaseSelectors<ID, Item, ItemInput, DisplayContext, EditContext, State>, 'selectQueries' | 'selectData'>): EntityStoreListSelectors<
  ID,
  Item,
  Request
> {
  const selectListQuery = createSelector([selectQueries], (storeState) => memoize((key = 'default') => storeState[key] || null));
  const selectListRequest = createSelector([selectListQuery], (getQuery) =>
    memoize((key = 'default'): (Request & Required<ListRequest<Item>>) | null => {
      const query = getQuery(key);
      if (!query) {
        return null;
      }

      const { errors, fetching, totalCount, data, paginationMode, pending, ...params } = query;

      return params as Request & Required<ListRequest<Item>>;
    }),
  );
  const selectListIsFetching = createSelector([selectListQuery], (getQuery) => memoize((key = 'default') => getQuery(key)?.fetching || false));
  const selectListIsPending = createSelector([selectListQuery], (getQuery) => memoize((key = 'default') => getQuery(key)?.pending || false));
  const selectListErrors = createSelector([selectListQuery], (getQuery) => memoize((key = 'default') => getQuery(key)?.errors || null));
  const selectListCount = createSelector([selectListQuery], (getQuery) => memoize((key = 'default') => getQuery(key)?.totalCount || 0));
  const selectListDataSet = createSelector([selectListQuery], (getQuery) => memoize((key = 'default') => getQuery(key)?.dataSet || DataSet.Full));
  const selectListPaginationMode = createSelector([selectListQuery], (getQuery) => memoize((key = 'default') => getQuery(key)?.paginationMode || 0));
  const selectList = createSelector([selectData, selectListQuery], (data, getQuery) =>
    memoize((key = 'default') =>
      (getQuery(key)?.data || []).reduce((acc, id) => {
        if (data[id]) {
          acc.push(data[id]);
        }

        return acc;
      }, [] as Item[]),
    ),
  );

  return {
    selectListRequest,
    selectListQuery,
    selectListIsFetching,
    selectListIsPending,
    selectListErrors,
    selectListCount,
    selectListDataSet,
    selectListPaginationMode,
    selectList,
  };
}

export function generateEntityStoreSingleQuerySelectors<
  ID extends string | number,
  Item extends Entity<ID>,
  ItemInput extends object = Omit<Item, 'id'>,
  DisplayContext extends EntityDisplayContext = EntityDisplayContext,
  EditContext extends EntityEditContext = EntityEditContext,
  State extends EntityStoreState<ID, Item, ItemInput, DisplayContext, EditContext, boolean, boolean> = EntityStoreState<
    ID,
    Item,
    ItemInput,
    DisplayContext,
    EditContext
  >,
>({
    selectSingleQueries,
  }: Pick<EntityStoreBaseSelectors<ID, Item, ItemInput, DisplayContext, EditContext, State>, 'selectSingleQueries'>): EntityStoreSingleSelectors<
  ID,
  Item
> {
  const selectSingleQuery = createSelector([selectSingleQueries], (singleQueries) =>
    memoize((id: ID) => singleQueries[id as string | number] || null),
  );
  const selectSingleErrors = createSelector([selectSingleQuery], (getQuery) => memoize((id: ID) => getQuery(id)?.errors || null));
  const selectSingleIsFetching = createSelector([selectSingleQuery], (getQuery) => memoize((id: ID) => getQuery(id)?.fetching || false));
  const selectSingleDataSet = createSelector([selectSingleQuery], (getQuery) => memoize((id: ID) => getQuery(id)?.dataSet || DataSet.Full));

  return {
    selectSingleQuery,
    selectSingleErrors,
    selectSingleIsFetching,
    selectSingleDataSet,
  };
}

export function generateEntityDisplayContextSelectors<
  ID extends string | number,
  Item extends Entity<ID>,
  ItemInput extends object = Omit<Item, 'id'>,
  DisplayContext extends EntityDisplayContext = EntityDisplayContext,
  EditContext extends EntityEditContext = EntityEditContext,
  State extends EntityStoreState<ID, Item, ItemInput, DisplayContext, EditContext, boolean, boolean> = EntityStoreState<
    ID,
    Item,
    ItemInput,
    DisplayContext,
    EditContext
  >,
>({ selectDomain }: Pick<EntityStoreBaseSelectors<ID, Item, ItemInput, DisplayContext, EditContext, State>, 'selectDomain'>) {
  const selectDisplayContext = createSelector([selectDomain], (storeState) => storeState.displayContext);
  const selectDisplayContextIsFetching = createSelector([selectDisplayContext], (context) => context?.fetching || false);
  const selectDisplayContextErrors = createSelector([selectDisplayContext], (context) => context?.errors || null);

  return {
    selectDisplayContext,
    selectDisplayContextIsFetching,
    selectDisplayContextErrors,
  };
}

export function generateEntityEditContextSelectors<
  ID extends string | number,
  Item extends Entity<ID>,
  ItemInput extends object = Omit<Item, 'id'>,
  DisplayContext extends EntityDisplayContext = EntityDisplayContext,
  EditContext extends EntityEditContext = EntityEditContext,
  State extends EntityStoreState<ID, Item, ItemInput, DisplayContext, EditContext, boolean, boolean> = EntityStoreState<
    ID,
    Item,
    ItemInput,
    DisplayContext,
    EditContext
  >,
>({ selectDomain }: Pick<EntityStoreBaseSelectors<ID, Item, ItemInput, DisplayContext, EditContext, State>, 'selectDomain'>) {
  const selectEditContext = createSelector([selectDomain], (storeState) => storeState.editContext);
  const selectEditContextIsFetching = createSelector([selectEditContext], (context) => context?.fetching || false);
  const selectEditContextErrors = createSelector([selectEditContext], (context) => context?.errors || null);

  return {
    selectEditContext,
    selectEditContextIsFetching,
    selectEditContextErrors,
  };
}

export function generateEntityStoreCreateSelectors<
  ID extends string | number,
  Item extends Entity<ID>,
  ItemInput extends object = Omit<Item, 'id'>,
  DisplayContext extends EntityDisplayContext = EntityDisplayContext,
  EditContext extends EntityEditContext = EntityEditContext,
  State extends EntityStoreState<ID, Item, ItemInput, DisplayContext, EditContext, boolean, boolean> = EntityStoreState<
    ID,
    Item,
    ItemInput,
    DisplayContext,
    EditContext
  >,
  Validate extends boolean = true,
>({
    selectTransactions,
    validate = true as Validate,
  }: Pick<EntityStoreBaseSelectors<ID, Item, ItemInput, DisplayContext, EditContext, State>, 'selectTransactions'> & {
  validate?: Validate;
}): EntityStoreCreateSelectors<Validate> {
  const selectIsCreating = createSelector<[typeof selectTransactions], boolean>(
    [selectTransactions],
    (transactions) => transactions[`${EntityTransactionType.Create}-new`]?.ongoing || false,
  );
  const selectCreateErrors = createSelector<[typeof selectTransactions], BackendErrors | null>(
    [selectTransactions],
    (transactions) => transactions[`${EntityTransactionType.Create}-new`]?.errors || null,
  );

  if (!validate) {
    return {
      selectIsCreating,
      selectCreateErrors,
    } as unknown as EntityStoreCreateSelectors<Validate>;
  }

  const selectIsCreateValidating = createSelector(
    [selectTransactions],
    (transactions) => transactions[`${EntityTransactionType.CreateValidate}-new`]?.ongoing || false,
  );
  const selectCreateValidationErrors = createSelector(
    [selectTransactions],
    (transactions) => transactions[`${EntityTransactionType.CreateValidate}-new`]?.errors || null,
  );

  return {
    selectIsCreating,
    selectCreateErrors,
    selectIsCreateValidating,
    selectCreateValidationErrors,
  } as EntityStoreCreateSelectors<Validate>;
}

export function generateEntityStoreUpdateSelectors<
  ID extends string | number,
  Item extends Entity<ID>,
  ItemInput extends object = Omit<Item, 'id'>,
  DisplayContext extends EntityDisplayContext = EntityDisplayContext,
  EditContext extends EntityEditContext = EntityEditContext,
  State extends EntityStoreState<ID, Item, ItemInput, DisplayContext, EditContext, boolean, boolean> = EntityStoreState<
    ID,
    Item,
    ItemInput,
    DisplayContext,
    EditContext
  >,
  Validate extends boolean = true,
>({
    selectTransactions,
    selectActiveItem,
    validate = true as Validate,
  }: Pick<EntityStoreBaseSelectors<ID, Item, ItemInput, DisplayContext, EditContext, State>, 'selectTransactions' | 'selectActiveItem'> & {
  validate?: Validate;
}): EntityStoreUpdateSelectors<Validate> {
  const selectIsUpdating = createSelector(
    [selectTransactions, selectActiveItem],
    (transactions, activeItem) =>
      ((activeItem as Item).id && transactions[`${EntityTransactionType.Update}-${(activeItem as Item).id}`]?.ongoing) || false,
  );
  const selectUpdateErrors = createSelector(
    [selectTransactions, selectActiveItem],
    (transactions, activeItem) =>
      ((activeItem as Item).id && transactions[`${EntityTransactionType.Update}-${(activeItem as Item).id}`]?.errors) || null,
  );

  if (!validate) {
    return {
      selectIsUpdating,
      selectUpdateErrors,
    } as unknown as EntityStoreUpdateSelectors<Validate>;
  }

  const selectIsUpdateValidating = createSelector(
    [selectTransactions, selectActiveItem],
    (transactions, activeItem) =>
      ((activeItem as Item).id && transactions[`${EntityTransactionType.UpdateValidate}-${(activeItem as Item).id}`]?.ongoing) || false,
  );
  const selectUpdateValidationErrors = createSelector(
    [selectTransactions, selectActiveItem],
    (transactions, activeItem) =>
      ((activeItem as Item).id && transactions[`${EntityTransactionType.UpdateValidate}-${(activeItem as Item).id}`]?.errors) || null,
  );

  return {
    selectIsUpdating,
    selectUpdateErrors,
    selectIsUpdateValidating,
    selectUpdateValidationErrors,
  } as EntityStoreUpdateSelectors<Validate>;
}

export function generateEntityStorePatchSelectors<
  ID extends string | number,
  Item extends Entity<ID>,
  ItemInput extends object = Omit<Item, 'id'>,
  DisplayContext extends EntityDisplayContext = EntityDisplayContext,
  EditContext extends EntityEditContext = EntityEditContext,
  State extends EntityStoreState<ID, Item, ItemInput, DisplayContext, EditContext, boolean, boolean> = EntityStoreState<
    ID,
    Item,
    ItemInput,
    DisplayContext,
    EditContext
  >,
  Validate extends boolean = true,
>({
    selectActiveItem,
    selectTransactions,
    validate,
  }: Pick<EntityStoreBaseSelectors<ID, Item, ItemInput, DisplayContext, EditContext, State>, 'selectTransactions' | 'selectActiveItem'> & {
  validate?: Validate;
}): EntityStorePatchSelectors<Validate> {
  const selectIsPatching = createSelector(
    [selectTransactions, selectActiveItem],
    (transactions, activeItem) => (activeItem && transactions[`${EntityTransactionType.Patch}-${(activeItem as Item).id}`]?.ongoing) || false,
  );
  const selectPatchErrors = createSelector(
    [selectTransactions, selectActiveItem],
    (transactions, activeItem) => (activeItem && transactions[`${EntityTransactionType.Patch}-${(activeItem as Item).id}`]?.errors) || null,
  );

  if (!validate) {
    return {
      selectIsPatching,
      selectPatchErrors,
    } as unknown as EntityStorePatchSelectors<Validate>;
  }

  const selectIsPatchValidating = createSelector(
    [selectTransactions, selectActiveItem],
    (transactions, activeItem) => (activeItem && transactions[`${EntityTransactionType.PatchValidate}-${(activeItem as Item).id}`]?.ongoing) || false,
  );
  const selectPatchValidationErrors = createSelector(
    [selectTransactions, selectActiveItem],
    (transactions, activeItem) => (activeItem && transactions[`${EntityTransactionType.PatchValidate}-${(activeItem as Item).id}`]?.errors) || null,
  );

  return {
    selectIsPatching,
    selectPatchErrors,
    selectIsPatchValidating,
    selectPatchValidationErrors,
  } as EntityStorePatchSelectors<Validate>;
}

export function generateEntityStoreDeleteSelectors<
  ID extends string | number,
  Item extends Entity<ID>,
  ItemInput extends object = Omit<Item, 'id'>,
  DisplayContext extends EntityDisplayContext = EntityDisplayContext,
  EditContext extends EntityEditContext = EntityEditContext,
  State extends EntityStoreState<ID, Item, ItemInput, DisplayContext, EditContext, boolean, boolean> = EntityStoreState<
    ID,
    Item,
    ItemInput,
    DisplayContext,
    EditContext
  >,
>({
    selectTransactions,
    selectActiveItem,
  }: Pick<
  EntityStoreBaseSelectors<ID, Item, ItemInput, DisplayContext, EditContext, State>,
  'selectTransactions' | 'selectActiveItem'
>): EntityStoreDeleteSelectors<ID> {
  const selectIsDeleting = createSelector([selectTransactions, selectActiveItem], (transactions, activeItem) =>
    memoize((ids?: ID[]) => {
      if (ids && Array.isArray(ids) && ids.length > 0) {
        return ids.some((id) => transactions[`${EntityTransactionType.Delete}-${id}`]?.ongoing) || false;
      }
      return (activeItem && transactions[`${EntityTransactionType.Delete}-${(activeItem as Item).id}`]?.ongoing) || false;
    }, joinKeyResolver),
  );
  const selectDeleteErrors = createSelector([selectTransactions, selectActiveItem], (transactions, activeItem) =>
    memoize((ids?: ID[]): Record<ID, BackendErrors | null> | null => {
      if (ids && Array.isArray(ids) && ids.length > 0) {
        return ids.reduce(
          (acc, id) => {
            acc[id] = transactions[`${EntityTransactionType.Delete}-${id}`]?.errors || null;
            return acc;
          },
          {} as Record<ID, BackendErrors | null>,
        );
      }

      if (!activeItem) {
        return null;
      }

      return { [(activeItem as Item).id]: transactions[`${EntityTransactionType.Delete}-${(activeItem as Item).id}`]?.errors || null } as Record<
        ID,
        BackendErrors | null
      >;
    }, joinKeyResolver),
  );

  return {
    selectIsDeleting,
    selectDeleteErrors,
  } as EntityStoreDeleteSelectors<ID>;
}

export function generateEntityStoreDownloadSelectors<
  ID extends string | number,
  Item extends Entity<ID>,
  ItemInput extends object = Omit<Item, 'id'>,
  DisplayContext extends EntityDisplayContext = EntityDisplayContext,
  EditContext extends EntityEditContext = EntityEditContext,
  State extends EntityStoreState<ID, Item, ItemInput, DisplayContext, EditContext, boolean, boolean> = EntityStoreState<
    ID,
    Item,
    ItemInput,
    DisplayContext,
    EditContext
  >,
>({
    selectTransactions,
  }: Pick<EntityStoreBaseSelectors<ID, Item, ItemInput, DisplayContext, EditContext, State>, 'selectTransactions'>): EntityStoreDownloadSelectors<
  ID,
  Item
> {
  const selectIsDownloading = createSelector([selectTransactions], (transactions) =>
    memoize((id: Item['id']) => (id && transactions[`${EntityTransactionType.Download}-${id}`]?.ongoing) || false),
  );
  const selectDownloadErrors = createSelector([selectTransactions], (transactions) =>
    memoize((id: Item['id']) => (id && transactions[`${EntityTransactionType.Download}-${id}`]?.errors) || null),
  );

  return {
    selectIsDownloading,
    selectDownloadErrors,
  };
}

export function generateEntityStoreSelectors<
  ID extends string | number,
  Item extends Entity<ID>,
  ItemInput extends object = Omit<Item, 'id'>,
  Request extends ListRequest<Item> = ListRequest<Item>,
  IncludeDisplayContext extends boolean = true,
  DisplayContext extends EntityDisplayContext = EntityDisplayContext,
  IncludeEditContext extends boolean = true,
  EditContext extends EntityEditContext = EntityEditContext,
  State extends EntityStoreState<ID, Item, ItemInput, DisplayContext, EditContext, IncludeDisplayContext, IncludeEditContext> = EntityStoreState<
    ID,
    Item,
    ItemInput,
    DisplayContext,
    EditContext,
    IncludeDisplayContext,
    IncludeEditContext
  >,
  Validate extends boolean = true,
>({
    includeDisplayContext = true as IncludeDisplayContext,
    includeEditContext = true as IncludeEditContext,
    initialState,
    sliceKey,
    validate = true as Validate,
  }: {
  includeDisplayContext?: IncludeDisplayContext;
  includeEditContext?: IncludeEditContext;
  initialState: State;
  sliceKey: string;
  validate?: Validate;
}): EntityStoreSelectors<ID, Item, ItemInput, IncludeDisplayContext, DisplayContext, IncludeEditContext, EditContext, State, Validate> {
  const baseSelectors = generateEntityStoreBaseSelectors<ID, Item, ItemInput, DisplayContext, EditContext, State>({ sliceKey, initialState });

  const result = {
    ...baseSelectors,
    ...generateEntityStoreListSelectors<ID, Item, ItemInput, DisplayContext, EditContext, State, Request>({
      selectQueries: baseSelectors.selectQueries,
      selectData: baseSelectors.selectData,
    }),
    ...generateEntityStoreSingleQuerySelectors<ID, Item, ItemInput, DisplayContext, EditContext, State>({
      selectSingleQueries: baseSelectors.selectSingleQueries,
    }),
    ...generateEntityDisplayContextSelectors<ID, Item, ItemInput, DisplayContext, EditContext, State>({
      selectDomain: baseSelectors.selectDomain,
    }),
    ...generateEntityEditContextSelectors<ID, Item, ItemInput, DisplayContext, EditContext, State>({
      selectDomain: baseSelectors.selectDomain,
    }),
    ...generateEntityStoreCreateSelectors<ID, Item, ItemInput, DisplayContext, EditContext, State, Validate>({
      selectTransactions: baseSelectors.selectTransactions,
      validate,
    }),
    ...generateEntityStoreUpdateSelectors<ID, Item, ItemInput, DisplayContext, EditContext, State, Validate>({
      selectTransactions: baseSelectors.selectTransactions,
      selectActiveItem: baseSelectors.selectActiveItem,
      validate,
    }),
    ...generateEntityStorePatchSelectors<ID, Item, ItemInput, DisplayContext, EditContext, State, Validate>({
      selectTransactions: baseSelectors.selectTransactions,
      selectActiveItem: baseSelectors.selectActiveItem,
      validate,
    }),
    ...generateEntityStoreDeleteSelectors<ID, Item, ItemInput, DisplayContext, EditContext, State>({
      selectTransactions: baseSelectors.selectTransactions,
      selectActiveItem: baseSelectors.selectActiveItem,
    }),
  } as unknown as EntityStoreSelectors<ID, Item, ItemInput, IncludeDisplayContext, DisplayContext, IncludeEditContext, EditContext, State, Validate>;

  if (includeDisplayContext) {
    Object.assign(result, {
      ...generateEntityDisplayContextSelectors<ID, Item, ItemInput, DisplayContext, EditContext, State>({
        selectDomain: baseSelectors.selectDomain,
      }),
    });
  }

  if (includeEditContext) {
    Object.assign(result, {
      ...generateEntityEditContextSelectors<ID, Item, ItemInput, DisplayContext, EditContext, State>({
        selectDomain: baseSelectors.selectDomain,
      }),
    });
  }

  result.selectAnyErrors = createSelector(
    [
      result.selectListErrors,
      result.selectSingleErrors,
      result.selectCreateErrors,
      result.selectUpdateErrors,
      result.selectPatchErrors,
      result.selectDeleteErrors,
    ],
    (getListErrors, getSingleErrors, createErrors, updateErrors, patchErrors, getDeleteErrors) =>
      memoize((queryKey = 'default', id?: ID) => {
        if (createErrors || updateErrors || patchErrors) {
          return createErrors || updateErrors || patchErrors;
        }

        if (id) {
          const singleErrors = getSingleErrors(id);
          if (singleErrors) {
            return singleErrors;
          }

          const deleteErrors = getDeleteErrors([id]) || {};
          for (const deleteErrorsKey in deleteErrors) {
            if (deleteErrors[deleteErrorsKey]) {
              return deleteErrors;
            }
          }
        }

        return getListErrors(queryKey);
      }, joinKeyResolver),
  );

  return result;
}
