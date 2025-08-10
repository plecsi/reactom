import { Draft, PayloadAction } from '@reduxjs/toolkit';
import { Action, UnknownAction } from '@redux-saga/core';
import { languageSliceKey } from '../entities/language/slice';
import { LanguageState } from '../entities/language/types';
import { ToastState } from '../Toast/types';
import { toastSliceKey } from '../Toast/slice';

/**
 * The generic entity interface. It is used to define the shape of an object that can be stored in the entity store.
 *
 * @template ID The type of the entity id.
 */
export interface Entity<ID extends number | string = number | string> {
  readonly id: ID;

  [key: string]: unknown;
}
export interface EntityState<
  T = Entity,
  ID extends number | string = number | string
> {
  items: Record<ID extends number ? string : ID, T>;
  loading: boolean;
  error?: string;
  totalCount?: number;
}

// Feltételezett típuskiegészítések:
export interface BackendErrors {
  [field: string]: string[] | undefined;
}

export interface Timestamps {
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface UserTimestamps {
  createdBy?: string | null;
  updatedBy?: string | null;
}

export interface UserGeneralInput {
  name: string;
  description?: string | null;
}

export interface UserHasStatus {
  status: 'active' | 'inactive' | 'pending';
}

export interface UserHasRoles {
  roles?: string[] | null;
}

// Listázási és szűrési típusok
export interface FilterQuery<T> {
  [key: string]: any;
}

export interface SortQuery<T> {
  field: keyof T;
  direction: 'asc' | 'desc';
}

export interface EntityListRequest<ID = number | string, T = any> {
  offset?: number;
  limit?: number;
  sort?: SortQuery<T>[];
  filter?: FilterQuery<T> | null;
  search?: string;
  queryKey?: string;
}

export interface ListRequest {
  offset?: number;
  limit?: number;
  search?: string;
  queryKey?: string;
}

// Megjelenítési és szerkesztési kontextusok

// Bővíthető az entitás specifikus megjelenítési adatokkal
export type EntityDisplayContext = object;

// Bővíthető az entitás specifikus szerkesztési adatokkal
export type EntityEditContext = object;

// Tárolási állapot típusok
export enum PaginationMode {
  List = 'list',
  Page = 'page',
}

export interface EntityReadStoreState<
  ID extends number | string,
  Item extends Entity<ID>,
  DisplayContext extends EntityDisplayContext = EntityDisplayContext,
  Fetching extends boolean = boolean
> {
  data: Record<ID, Item>;
  queries: Record<string, any>;
  singleQueries: Record<string, any>;
  displayContext?: {
    data: any | null;
    errors: any | null;
    fetching: Fetching;
  } | null;
}

/**
 * The generic entity store state.
 *
 * It is used to store entities in a normalized way, along with their queries and transactions.
 * It only allows for one create transaction at a time.
 * It also only allows for one actively selected entity, which can be used for viewing and one draft entity, which can be used for editing.
 * The active item can be either an existing entity or an entity input object.
 * The entity input object is used for creating new entities.
 *
 * @template ID The type of the entity id.
 * @template Item The type of the entity.
 * @template ItemInput The type of the entity input object. Usually, it is the entity type without the id field.
 */
export interface EntityStoreState<
  ID extends number | string,
  Item extends Entity<ID>,
  ItemInput extends object = Omit<Item, 'id'>,
  DisplayContext extends EntityDisplayContext = EntityDisplayContext,
  EditContext extends EntityEditContext = EntityEditContext,
  IncludeDisplayContext extends boolean = true,
  IncludeEditContext extends boolean = true
> extends EntityReadStoreState<ID, Item, DisplayContext, IncludeDisplayContext>,
    EntityStoreTransactionState<
      ID,
      Item,
      ItemInput,
      EditContext,
      IncludeEditContext
    > {}

export type VoidReducer<State = any, A extends Action = UnknownAction> = (
  state: Draft<State>,
  action: A
) => void;

export interface ReducerPlugins<
  State = object,
  Action extends PayloadAction<unknown> = PayloadAction
> {
  before?: VoidReducer<State, Action>;
  around?: (
    state: Draft<State>,
    action: Action,
    originalFn: VoidReducer<State, Action>
  ) => void;
  after?: VoidReducer<State, Action>;
}

export interface GenerateListActionsOptions<
  ID extends string | number,
  Item extends Entity<ID>,
  Request extends EntityListRequest<ID, Item>,
  DisplayContext extends EntityDisplayContext = EntityDisplayContext,
  State extends EntityStoreQueryState<ID, Item, DisplayContext> = EntityStoreQueryState<ID, Item, DisplayContext>,
> {
  /**
   * Default query to use when resetting the list.
   *
   * This will be used as the base query when resetting the list. The reset list action also accepts a partial query to merge with this default query.
   */
  defaultQuery?: Request;
  /**
   * Default pagination mode to use for queries.
   *
   * @default 'pages'
   */
  defaultPaginationMode?: PaginationMode[keyof PaginationMode];
  /**
   * Plugins for each list action.
   *
   * @see ReducerPlugins
   */
  plugins?: {
    listRequest?: ReducerPlugins<State, PayloadAction<EntityQueryRequest & { appendResults: boolean }>>;
    listFailure?: ReducerPlugins<State, PayloadAction<{ errors: BackendErrors; queryKey: string }>>;
    listSuccess?: ReducerPlugins<State, PayloadAction<EntityListResponse<ID, Item>>>;
    resetList?: ReducerPlugins<State, PayloadAction<ResetListPayload<ID, Item, Request>>>;
    setPaginationMode?: ReducerPlugins<State, PayloadAction<EntityQueryRequest & Pick<EntityQueryOptions, 'paginationMode'>>>;
    updateListPaging?: ReducerPlugins<State, PayloadAction<UpdateListPagingPayload>>;
    updateListSearch?: ReducerPlugins<State, PayloadAction<UpdateListSearchPayload>>;
    updateListSorting?: ReducerPlugins<State, PayloadAction<UpdateListSortingPayload>>;
    updateListExport?: ReducerPlugins<State, PayloadAction<UpdateListExportPayload>>;
    updateListFilters?: ReducerPlugins<State, PayloadAction<UpdateListFiltersPayload<ID, Item>>>;
    updateListDataSet?: ReducerPlugins<State, PayloadAction<UpdateListDataSetPayload>>;
    updateListAdditionalProperty?: ReducerPlugins<State, PayloadAction<UpdateListAdditionalPropertyPayload>>;
  };

}
  /**
   * The generic entity store query state.
   *
   * Responsible for storing the queries and the display context of the entities.
   * It extends the base state with the queries store and the display context.
   */
  export interface EntityStoreQueryState<
    ID extends number | string,
    Item extends Entity<ID>,
    DisplayContext extends EntityDisplayContext = EntityDisplayContext,
    IncludeDisplayContext extends boolean = true,
  > extends EntityStoreBaseState<ID, Item> {
  /**
   * The entity query store, which stores the results of get queries to the backend.
   * @see EntityQueryStore
   */
  queries: EntityQueryStore<ID, Item>;
  /**
   * The context of listing the entities. It contains information about the available sorting, filters, search and export options.
   */
  displayContext: IncludeDisplayContext extends true
    ? {
      data: DisplayContext | null;
      errors: BackendErrors | null;
      fetching: boolean;
    }
    : never;
}



export interface EntityQueryRequest {
  /**
   * The key of the query.
   * It should be a short kebab-case string that describes the query.
   */
  queryKey: string;
}

/**
 * The generic entity query interface.
 * It is used to track and store the result of a query to the backend.
 *
 * @template ID The type of the entity id.
 */
export interface EntityQuery<
  ID extends number | string,
  Item extends Entity<ID>
> extends Required<ListRequest>,
    EntityQueryOptions {
  /**
   * The resulting data of the query, stored as an array of entity ids.
   * The actual entities are stored in the entity store.
   */
  data: ID[];
  /**
   * The errors resulting from the query.
   */
  errors: BackendErrors | null;
  /**
   * The flag that indicates if the query is ongoing.
   */
  fetching: boolean;
  /**
   * The flag that indicates if the query is pending, i.e. if some of the query params are changed, but the query request is not yet sent.
   */
  pending: boolean;
  /**
   * The total count of the entities that match the query.
   * This is normally received from the backend.
   */
  totalCount: number;
}

export interface EntityQueryOptions {
  /**
   * The mode of the pagination.
   *
   * @see IPaginationMode
   */
  paginationMode: PaginationMode[keyof PaginationMode];
}

export interface IDataSet {
  Full: 'full';
  Minimal: 'minimal';
}

export type EntityQueryStore<
  ID extends number | string,
  Item extends Entity<ID>
> = Record<string, EntityQuery<ID, Item>>;

export interface EntityStoreBaseSelectors<
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
> {
  selectDomain: (state: RootState) => State;
  selectIsPartial: (state: RootState) => (id: ID) => boolean;
  selectItem: (
    state: RootState
  ) => (id: ID, dataSet?: IDataSet[keyof IDataSet]) => Item | null;
  selectActiveItem: (state: RootState) => Item | ItemInput | null;
  selectData: (state: RootState) => State['data'];
  selectQueries: (state: RootState) => State['queries'];
  selectSingleQueries: (state: RootState) => State['singleQueries'];
  selectTransactions: (state: RootState) => State['transactions'];
}

export interface EntityStoreListSelectors<
  ID extends string | number,
  Item extends Entity<ID>,
  Request extends ListRequest = ListRequest
> {
  selectListRequest: (
    state: RootState
  ) => (key?: string) => (Request & Required<ListRequest>) | null;
  selectListQuery: (
    state: RootState
  ) => (key?: string) => EntityQuery<ID, Item> | null;
  selectListIsFetching: (state: RootState) => (key?: string) => boolean;
  selectListIsPending: (state: RootState) => (key?: string) => boolean;
  selectListErrors: (
    state: RootState
  ) => (key?: string) => BackendErrors | null;
  selectListCount: (state: RootState) => (key?: string) => number;
  selectListDataSet: (
    state: RootState
  ) => (key?: string) => IDataSet[keyof IDataSet];
  selectListPaginationMode: (
    state: RootState
  ) => (key?: string) => PaginationMode[keyof PaginationMode] | null;
  selectList: (state: RootState) => (key?: string) => Item[];
}

export interface GenerateEntityStoreBaseSelectorsOptions<
  ID extends string | number,
  Item extends Entity<ID>,
  ItemInput extends object = Omit<Item, 'id'>,
  DisplayContext extends EntityDisplayContext = EntityDisplayContext,
  EditContext extends EntityEditContext = EntityEditContext,
  State extends EntityStoreState<ID, Item, ItemInput> = EntityStoreState<
    ID,
    Item,
    ItemInput,
    DisplayContext,
    EditContext
  >
> {
  sliceKey: string;
  initialState: State;
}

export interface RootState {
  [languageSliceKey]: LanguageState;
  [toastSliceKey]: ToastState;
}

/**
 * The generic entity store transaction state.
 * Responsible for storing the transactions of the entities.
 * It extends the base state with the transactions store and the active and draft entities.
 * The active entity is the currently viewed or otherwise used entity.
 * The draft entity is the currently created or edited entity. Contains modifications that are not yet saved.
 * The edit context is the context of the entity store. It contains the context variables for the entities, which are received from the backend.
 */
export interface EntityStoreTransactionState<
  ID extends number | string,
  Item extends Entity<ID>,
  ItemInput extends object = Omit<Item, 'id'>,
  EditContext extends EntityEditContext = EntityEditContext,
  IncludeEditContext extends boolean = true
> extends EntityStoreBaseState<ID, Item> {
  /**
   * The currently edited or created entity.
   */
  draftItem: Item | ItemInput | null;
  /**
   * The context of the entity store. It contains the context variables for the entities, which are received from the backend.
   */
  editContext: IncludeEditContext extends true
    ? {
        data: EditContext | null;
        errors: BackendErrors | null;
        fetching: boolean;
      }
    : never;
  /**
   * The entity transaction store, which stores the ongoing transactions for the entities.
   * @see EntityTransactionStore
   */
  transactions: EntityTransactionStore<Item | ItemInput>;
}

/**
 * The generic entity store base state.
 * Defines the basic structure of the stored entities.
 * Useless by itself, it is used to extend the other entity store states.
 */
interface EntityStoreBaseState<
  ID extends number | string,
  Item extends Entity<ID>
> {
  /**
   * The entity store, which stores the entities in a normalized way.
   * @see EntityStore
   */
  data: EntityStore<ID, Item>;
}

/**
 * The generic entity store. It is used to store entities in a normalized way.
 *
 * @template ID The type of the entity id.
 * @template Item The type of the entity.
 */
export type EntityStore<
  ID extends number | string,
  Item extends Entity<ID>
> = Record<ID, Item & { partial?: boolean }>;

/**
 * The collection of transactions for an entity.
 * The key is a composite of the transaction type and the entity id.
 * For create and create-validate transactions, the entity id is 'new'.
 *
 * @template Item The type of the entity, on which the transactions are performed.
 */
export type EntityTransactionStore<Item extends object> = Partial<
  Record<
    EntityTransactionRequestKey<
      Item extends Entity<string | number> ? Item['id'] : never
    >,
    EntityTransaction<Item>
  >
>;

export type EntityTransactionRequestKey<ID extends string | number> =
  | `${EntityTransactionType[Exclude<
      keyof EntityTransactionType,
      'Create' | 'CreateValidate'
    >]}-${ID}`
  | `${
      | EntityTransactionType['Create']
      | EntityTransactionType['CreateValidate']}-new`;

/**
 * The collection of possible transactions for a single entity.
 */
export interface EntityTransactionType {
  Create: 'create';
  CreateValidate: 'create-validate';
  Update: 'update';
  UpdateValidate: 'update-validate';
  Patch: 'patch';
  PatchValidate: 'patch-validate';
  Download: 'download';
  Delete: 'delete';
}
export const EntityTransactionType: EntityTransactionType = {
  Create: 'create',
  CreateValidate: 'create-validate',
  Update: 'update',
  UpdateValidate: 'update-validate',
  Patch: 'patch',
  PatchValidate: 'patch-validate',
  Download: 'download',
  Delete: 'delete',
};

/**
 * The transaction for a single entity.
 *
 * @template Item The type of the entity. It does not have to be an entity, but it should be an object.
 */
export interface EntityTransaction<Data extends object> {
  /**
   * The data of the transaction.
   * It can be an object for creation or modification, or it can be null, in case of deletion or download.
   */
  data: Data | null;
  /**
   * The flag that indicates if the transaction is ongoing.
   */
  ongoing: boolean;
  /**
   * The errors of the transaction.
   */
  errors: BackendErrors | null;
  /**
   * The type of the transaction.
   */
  type: EntityTransactionType[keyof EntityTransactionType];
}

export interface GenerateEntityStoreBaseSelectorsOptions<
  ID extends string | number,
  Item extends Entity<ID>,
  ItemInput extends object = Omit<Item, 'id'>,
  DisplayContext extends EntityDisplayContext = EntityDisplayContext,
  EditContext extends EntityEditContext = EntityEditContext,
  State extends EntityStoreState<ID, Item, ItemInput> = EntityStoreState<
    ID,
    Item,
    ItemInput,
    DisplayContext,
    EditContext
  >
> {
  sliceKey: string;
  initialState: State;
}

export interface EntityStoreBaseSelectors<
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
> {
  selectDomain: (state: RootState) => State;
  selectIsPartial: (state: RootState) => (id: ID) => boolean;
  selectItem: (
    state: RootState
  ) => (id: ID, dataSet?: IDataSet[keyof IDataSet]) => Item | null;
  selectActiveItem: (state: RootState) => Item | ItemInput | null;
  selectData: (state: RootState) => State['data'];
  selectQueries: (state: RootState) => State['queries'];
  selectSingleQueries: (state: RootState) => State['singleQueries'];
  selectTransactions: (state: RootState) => State['transactions'];
}

export interface EntityStoreSingleSelectors<
  ID extends string | number,
  Item extends Entity<ID>
> {
  selectSingleQuery: (
    state: RootState
  ) => (id: Item['id']) => EntitySingleQuery | null;
  selectSingleErrors: (
    state: RootState
  ) => (id: Item['id']) => BackendErrors | null;
  selectSingleIsFetching: (state: RootState) => (id: Item['id']) => boolean;
  selectSingleDataSet: (
    state: RootState
  ) => (id: Item['id']) => IDataSet[keyof IDataSet];
}

export interface EntityStoreDisplayContextSelectors<
  DisplayContext extends EntityDisplayContext
> {
  selectDisplayContext: (state: RootState) => DisplayContext | null;
  selectDisplayContextIsFetching: (state: RootState) => boolean;
  selectDisplayContextErrors: (state: RootState) => BackendErrors | null;
}

export interface EntityStoreEditContextSelectors<
  EditContext extends EntityEditContext
> {
  selectEditContext: (state: RootState) => EditContext | null;
  selectEditContextIsFetching: (state: RootState) => boolean;
  selectEditContextErrors: (state: RootState) => BackendErrors | null;
}

export type EntityStoreCreateSelectors<Validate extends boolean = true> = {
  selectIsCreating: (state: RootState) => boolean;
  selectCreateErrors: (state: RootState) => BackendErrors | null;
} & (Validate extends true
  ? {
      selectIsCreateValidating: (state: RootState) => boolean;
      selectCreateValidationErrors: (state: RootState) => BackendErrors | null;
    }
  : NonNullable<unknown>);

export type EntityStoreUpdateSelectors<Validate extends boolean = true> = {
  selectIsUpdating: (state: RootState) => boolean;
  selectUpdateErrors: (state: RootState) => BackendErrors | null;
} & (Validate extends true
  ? {
      selectIsUpdateValidating: (state: RootState) => boolean;
      selectUpdateValidationErrors: (state: RootState) => BackendErrors | null;
    }
  : NonNullable<unknown>);

export type EntityStorePatchSelectors<Validate extends boolean = true> = {
  selectIsPatching: (state: RootState) => boolean;
  selectPatchErrors: (state: RootState) => BackendErrors | null;
} & (Validate extends true
  ? {
      selectIsPatchValidating: (state: RootState) => boolean;
      selectPatchValidationErrors: (state: RootState) => BackendErrors | null;
    }
  : NonNullable<unknown>);

export interface EntityStoreDeleteSelectors<ID extends string | number> {
  selectIsDeleting: (state: RootState) => (ids?: ID[]) => boolean;
  selectDeleteErrors: (
    state: RootState
  ) => (ids?: ID[]) => Record<ID, BackendErrors | null> | null;
}

export interface EntityStoreDownloadSelectors<
  ID extends string | number,
  Item extends Entity<ID>
> {
  selectIsDownloading: (state: RootState) => (id: Item['id']) => boolean;
  selectDownloadErrors: (
    state: RootState
  ) => (id: Item['id']) => BackendErrors | null;
}

export type EntityStoreSelectors<
  ID extends string | number,
  Item extends Entity<ID>,
  ItemInput extends object = Omit<Item, 'id'>,
  IncludeDisplayContext extends boolean = true,
  DisplayContext extends EntityDisplayContext = EntityDisplayContext,
  IncludeEditContext extends boolean = true,
  EditContext extends EntityEditContext = EntityEditContext,
  State extends EntityStoreState<
    ID,
    Item,
    ItemInput,
    DisplayContext,
    EditContext,
    IncludeDisplayContext,
    IncludeEditContext
  > = EntityStoreState<
    ID,
    Item,
    ItemInput,
    DisplayContext,
    EditContext,
    IncludeDisplayContext,
    IncludeEditContext
  >,
  Validate extends boolean = true
> = EntityStoreBaseSelectors<
  ID,
  Item,
  ItemInput,
  DisplayContext,
  EditContext,
  State
> & {
  selectAnyErrors: (
    state: RootState
  ) => (queryKey?: string, id?: ID) => BackendErrors | null;
} & EntityStoreListSelectors<ID, Item> &
  EntityStoreSingleSelectors<ID, Item> &
  EntityStoreCreateSelectors<Validate> &
  EntityStoreUpdateSelectors<Validate> &
  EntityStorePatchSelectors<Validate> &
  EntityStoreDeleteSelectors<ID> &
  // EntityStoreDownloadSelectors<ID, Item> & // TODO Add this along with the actual implementation
  (IncludeDisplayContext extends true
    ? EntityStoreDisplayContextSelectors<DisplayContext>
    : NonNullable<unknown>) &
  (IncludeEditContext extends true
    ? EntityStoreEditContextSelectors<EditContext>
    : NonNullable<unknown>);

export interface EntitySingleQuery extends DataSetRequest {
  /**
   * The errors resulting from the query.
   */
  errors: BackendErrors | null;
  /**
   * The flag that indicates if the query is ongoing.
   */
  fetching: boolean;
}

export interface DataSetRequest {
  /**
   * The dataset to use for the request
   *
   * Determines how much data is returned for the requested entity.
   * Defaults to `undefined` or `'full'`, both of which return all available data.
   * Can have values other than `'full'` and `'minimal'`, these are defined on a per-project basis.
   */
  dataSet?: IDataSet[keyof IDataSet];
}


export interface ListResponse<T> {
  data: T[];
  totalCount: number;
}


/**
 * The entity list response interface.
 * @see EntityListRequest
 */
export interface EntityListResponse<ID extends number | string, Item extends Entity<ID>> extends ListResponse<Item> {
  /**
   * The key of the query.
   */
  queryKey: string;
  /**
   * Used to control whether the response should be concatenated with the previous results.
   */
  appendResults?: boolean;
}
