import { Entity } from '../types';

export interface EntityDisplayContext {
  // Add properties as needed
  columns: string[];
}

export interface EntityEditContext {
  // Add properties as needed
  fields: string[];
}

export interface GenerateEntityReadApiOptions<
  IncludeContext extends boolean = true
> {
  path: string;
  includeDisplayContext?: IncludeContext;
}

export interface GenerateEntityReadApiResult<
  ID extends number | string,
  Item extends Entity<ID>,
  IncludeContext extends boolean = true,
  DisplayContext = IncludeContext extends true ? EntityDisplayContext : never
> {
  getList: (request: any) => Promise<any>;
  getItem: (id: ID, request: any) => Promise<Item>;
  getDisplayContext?: () => Promise<DisplayContext>;
}

export interface GenerateEntityWriteApiOptions<
  IncludeContext extends boolean = true,
  Validate extends boolean = true
> {
  path: string;
  includeEditContext?: IncludeContext;
  validate?: Validate;
}

export interface GenerateEntityWriteApiResult<
  ID extends number | string,
  Item extends Entity<ID>,
  ItemInput extends object = Omit<Item, 'id'>,
  IncludeContext extends boolean = true,
  EditContext = EntityEditContext,
  Validate extends boolean = true
> {
  createItem: (data: ItemInput) => Promise<Item>;
  updateItem: (item: Item) => Promise<Item>;
  patchItem: (id: ID, data: Partial<Item>) => Promise<Item>;
  deleteItem: (id: ID) => Promise<void>;
  bulkDeleteItems: (ids: ID[]) => Promise<void>;
  createValidateItem?: (
    data: ItemInput,
    abortSignal?: AbortSignal
  ) => Promise<void>;
  updateValidateItem?: (item: Item, abortSignal?: AbortSignal) => Promise<void>;
  patchValidateItem?: (
    id: ID,
    data: Partial<Item>,
    abortSignal?: AbortSignal
  ) => Promise<void>;
  getEditContext?: () => Promise<EditContext>;
}

export interface GenerateEntityApiOptions<
  IncludeDisplayContext extends boolean = true,
  IncludeEditContext extends boolean = true,
  Validate extends boolean = true
> {
  path: string;
  includeDisplayContext?: IncludeDisplayContext;
  includeEditContext?: IncludeEditContext;
  validate?: Validate;
}

export interface GenerateEntityApiResult<
  ID extends number | string,
  Item extends Entity<ID>,
  ItemInput extends object = Omit<Item, 'id'>,
  IncludeDisplayContext extends boolean = true,
  DisplayContext = EntityDisplayContext,
  IncludeEditContext extends boolean = true,
  EditContext = EntityEditContext,
  Validate extends boolean = true
> extends GenerateEntityReadApiResult<
      ID,
      Item,
      IncludeDisplayContext,
      DisplayContext
    >,
    GenerateEntityWriteApiResult<
      ID,
      Item,
      ItemInput,
      IncludeEditContext,
      EditContext,
      Validate
    > {}


export enum DataSet {
  Full = 'full',
  Minimal = 'minimal',
  // Add more as needed
}

export interface DataSetRequest {
  dataSet?: DataSet;
}

export interface ListResponse<T> {
  results: T[];
  count: number;
  // Add more fields if your API returns them
}

export interface AbortableListRequest<T> {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search_in_fields?: string[] | string;
  abortSignal?: AbortSignal;
  dataSet?: DataSet;
  [key: string]: any; // For additional filters
}