import { createSelector } from '@reduxjs/toolkit';
import memoize from 'lodash/memoize'; // vagy a megfelelő memoizáló
import {
  Entity,
  EntityDisplayContext,
  EntityEditContext,
  EntityStoreState,
  ListRequest,
  EntityStoreBaseSelectors,
  RootState,
  GenerateEntityStoreBaseSelectorsOptions,
  IDataSet,
} from './types';
import { DataSet } from './utils';
import { joinKeyResolver } from './resolver';

/**
 * Alap selectorok generátora,
 * ezek kellenek a helperhez, és a többi generátorhoz.
 */
export function generateEntityStoreBaseSelectors<
  ID extends string | number,
  Item extends Entity<ID>,
  ItemInput extends object = Omit<Item, 'id'>,
  DisplayContext extends EntityDisplayContext = EntityDisplayContext,
  EditContext extends EntityEditContext = EntityEditContext,
  State extends EntityStoreState<
    ID,
    Item,
    ItemInput,
    DisplayContext,
    EditContext,
    boolean,
    boolean
  > = EntityStoreState<ID, Item, ItemInput, DisplayContext, EditContext>
>({
  sliceKey,
  initialState,
}: GenerateEntityStoreBaseSelectorsOptions<
  ID,
  Item,
  ItemInput,
  DisplayContext,
  EditContext,
  State
>): EntityStoreBaseSelectors<
  ID,
  Item,
  ItemInput,
  DisplayContext,
  EditContext,
  State
> {
  const selectDomain = (state: RootState): State =>
    state[sliceKey] || initialState;
  const selectData = createSelector(
    [selectDomain],
    (storeState) => storeState.data
  );
  const selectIsPartial = createSelector([selectData], (data) =>
    memoize((id) => (data[id] && data[id].partial) || false)
  );
  const selectItem = createSelector(
    [selectData, selectIsPartial],
    (data, getIsPartial) =>
      memoize((id, dataSet: IDataSet[keyof IDataSet] = DataSet.Full) => {
        if (dataSet === DataSet.Full && getIsPartial(id)) {
          return null;
        }

        if (!data[id]) {
          return null;
        }

        const { partial, ...item } = data[id];
        return item as Item;
      }, joinKeyResolver)
  );
  const selectQueries = createSelector(
    [selectDomain],
    (storeState) => storeState.queries
  );
  const selectSingleQueries = createSelector(
    [selectDomain],
    (storeState) => storeState.singleQueries
  );
  const selectActiveItem = createSelector(
    [selectDomain],
    (storeState) => storeState.draftItem
  );
  const selectTransactions = createSelector(
    [selectDomain],
    (storeState) => storeState.transactions
  );

  return {
    selectDomain,
    selectData,
    selectItem,
    selectQueries,
    selectSingleQueries,
    selectActiveItem,
    selectTransactions,
  };
}

/**
 * Egyetlen entitásra vonatkozó selectorok generátora,
 * csak a szükséges property-ket várja paraméterben!
 */
export function generateEntitySingleSelectors<
  ID extends string | number,
  Item extends Entity<ID>,
  ItemInput extends object = Omit<Item, 'id'>,
  DisplayContext extends EntityDisplayContext = EntityDisplayContext,
  EditContext extends EntityEditContext = EntityEditContext,
  State extends EntityStoreState<
    ID,
    Item,
    ItemInput,
    DisplayContext,
    EditContext
  > = EntityStoreState<ID, Item, ItemInput, DisplayContext, EditContext>
>({
  selectDomain,
  selectData,
  selectQueries,
}: Pick<
  EntityStoreBaseSelectors<
    ID,
    Item,
    ItemInput,
    DisplayContext,
    EditContext,
    State
  >,
  'selectDomain' | 'selectData' | 'selectQueries'
>) {
  const selectItem = (id: ID) =>
    createSelector([selectData], (data) => data[id] || null);
  const selectItemIsFetching = (id: ID) =>
    createSelector([selectQueries], (queries) =>
      memoize((key = 'default') => queries[key]?.[id]?.fetching || false)
    );
  const selectItemIsPending = (id: ID) =>
    createSelector([selectQueries], (queries) =>
      memoize((key = 'default') => queries[key]?.[id]?.pending || false)
    );
  const selectItemErrors = (id: ID) =>
    createSelector([selectQueries], (queries) =>
      memoize((key = 'default') => queries[key]?.[id]?.errors || null)
    );
  const selectItemDisplayContext = (id: ID) =>
    createSelector([selectQueries], (queries) =>
      memoize((key = 'default') => queries[key]?.[id]?.displayContext || null)
    );
  const selectItemEditContext = (id: ID) =>
    createSelector([selectQueries], (queries) =>
      memoize((key = 'default') => queries[key]?.[id]?.editContext || null)
    );
  const selectItemDisplayContextIsFetching = (id: ID) =>
    createSelector([selectQueries], (queries) =>
      memoize(
        (key = 'default') => queries[key]?.[id]?.displayContextFetching || false
      )
    );
  const selectItemEditContextIsFetching = (id: ID) =>
    createSelector([selectQueries], (queries) =>
      memoize(
        (key = 'default') => queries[key]?.[id]?.editContextFetching || false
      )
    );
  const selectItemDisplayContextErrors = (id: ID) =>
    createSelector([selectQueries], (queries) =>
      memoize(
        (key = 'default') => queries[key]?.[id]?.displayContextErrors || null
      )
    );
  const selectItemEditContextErrors = (id: ID) =>
    createSelector([selectQueries], (queries) =>
      memoize(
        (key = 'default') => queries[key]?.[id]?.editContextErrors || null
      )
    );
  return {
    selectItem,
    selectItemIsFetching,
    selectItemIsPending,
    selectItemErrors,
    selectItemDisplayContext,
    selectItemEditContext,
    selectItemDisplayContextIsFetching,
    selectItemEditContextIsFetching,
    selectItemDisplayContextErrors,
    selectItemEditContextErrors,
  };
}

/**
 * Lista-szintű selectorok generálója (ha szükséges a helper számára).
 * Az előző példából kiindulva, ezek is csak base selectorokra épülnek.
 */
export function generateEntityStoreListSelectors<
  ID extends string | number,
  Item extends Entity<ID>,
  ItemInput extends object = Omit<Item, 'id'>,
  DisplayContext extends EntityDisplayContext = EntityDisplayContext,
  EditContext extends EntityEditContext = EntityEditContext,
  State extends EntityStoreState<
    ID,
    Item,
    ItemInput,
    DisplayContext,
    EditContext
  > = EntityStoreState<ID, Item, ItemInput, DisplayContext, EditContext>,
  Request extends ListRequest = ListRequest
>({
  selectQueries,
  selectData,
}: Pick<
  EntityStoreBaseSelectors<
    ID,
    Item,
    ItemInput,
    DisplayContext,
    EditContext,
    State
  >,
  'selectQueries' | 'selectData'
>) {
  const selectListQuery = createSelector([selectQueries], (storeState) =>
    memoize((key = 'default') => storeState[key] || null)
  );
  const selectListRequest = createSelector([selectListQuery], (getQuery) =>
    memoize((key = 'default'): (Request & Required<ListRequest>) | null => {
      const query = getQuery(key);
      if (!query) {
        return null;
      }

      const {
        errors,
        fetching,
        totalCount,
        data,
        paginationMode,
        pending,
        ...params
      } = query;

      return params as Request & Required<ListRequest>;
    })
  );
  const selectListIsFetching = createSelector([selectListQuery], (getQuery) =>
    memoize((key = 'default') => getQuery(key)?.fetching || false)
  );
  const selectListIsPending = createSelector([selectListQuery], (getQuery) =>
    memoize((key = 'default') => getQuery(key)?.pending || false)
  );
  const selectListErrors = createSelector([selectListQuery], (getQuery) =>
    memoize((key = 'default') => getQuery(key)?.errors || null)
  );
  const selectListCount = createSelector([selectListQuery], (getQuery) =>
    memoize((key = 'default') => getQuery(key)?.totalCount || 0)
  );
  const selectListDataSet = createSelector([selectListQuery], (getQuery) =>
    memoize((key = 'default') => getQuery(key)?.dataSet || DataSet.Full)
  );
  const selectListPaginationMode = createSelector(
    [selectListQuery],
    (getQuery) =>
      memoize((key = 'default') => getQuery(key)?.paginationMode || 0)
  );
  const selectList = createSelector(
    [selectData, selectListQuery],
    (data, getQuery) =>
      memoize((key = 'default') =>
        (getQuery(key)?.data || []).reduce((acc, id) => {
          if (data[id]) {
            acc.push(data[id]);
          }

          return acc;
        }, [] as Item[])
      )
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
    selectListData: selectData,
    selectQueries,
  };
}
