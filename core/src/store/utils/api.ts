// core/src/store/utils/api.ts
import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from '../../api/apiServices';
import {
  AbortableListRequest, DataSet, DataSetRequest,
  EntityDisplayContext,
  EntityEditContext,
  GenerateEntityApiOptions,
  GenerateEntityApiResult,
  GenerateEntityReadApiOptions,
  GenerateEntityReadApiResult,
  GenerateEntityWriteApiOptions,
  GenerateEntityWriteApiResult, ListResponse
} from './types';
import { Entity } from '../types';

export function generateEntityReadApis<
  ID extends number | string,
  Item extends Entity<ID>,
  IncludeContext extends boolean = true,
  DisplayContext extends EntityDisplayContext = IncludeContext extends true ? EntityDisplayContext : never,
  Request extends AbortableListRequest<Item> = AbortableListRequest<Item>,
>({
    path,
    includeDisplayContext,
  }: GenerateEntityReadApiOptions<IncludeContext>): GenerateEntityReadApiResult<ID, Item, IncludeContext, DisplayContext> {
  const prefixedPath = path.startsWith('/') ? path : `/${path}`;

  const result = {
    getList: ({ sortBy, sortOrder, search_in_fields, abortSignal, dataSet, ...rest }: Request) =>
      apiGet<ListResponse<Item>>(
        prefixedPath,
        {
          ...rest,
          orderby_field: sortBy,
          orderby_dir: sortOrder,
          search_in_fields: Array.isArray(search_in_fields) ? search_in_fields?.join(',') : search_in_fields,
          data_set: dataSet || DataSet.Full,
        },
        { signal: abortSignal },
      ),
    getItem: (id: ID, { dataSet }: DataSetRequest) =>
      apiGet<Item>(
        `${prefixedPath}/${id}`,
        dataSet === undefined || dataSet === DataSet.Full ? undefined : { data_set: dataSet },
      ),
  };

  if (includeDisplayContext) {
    (result as GenerateEntityReadApiResult<ID, Item, true, DisplayContext>).getDisplayContext = () =>
      apiGet<DisplayContext>(`${prefixedPath}/table-context`);
  }

  return result as GenerateEntityReadApiResult<ID, Item, IncludeContext, DisplayContext>;
}

export function generateEntityWriteApis<
  ID extends number | string,
  Item extends Entity<ID>,
  ItemInput extends object = Omit<Item, 'id'>,
  IncludeContext extends boolean = true,
  EditContext extends EntityEditContext = EntityEditContext,
  Validate extends boolean = true,
>({
    path,
    includeEditContext,
    validate,
  }: GenerateEntityWriteApiOptions<IncludeContext, Validate>): GenerateEntityWriteApiResult<
  ID,
  Item,
  ItemInput,
  IncludeContext,
  EditContext,
  Validate
> {
  const prefixedPath = path.startsWith('/') ? path : `/${path}`;
  const result = {
    createItem: (data: ItemInput) => apiPost<Item>(prefixedPath, data),
    updateItem: ({ id, ...data }: Item) => apiPut<Item>(`${prefixedPath}/${id}`, data),
    patchItem: (id: ID, data: Partial<Item>) => apiPatch<Item>(`${prefixedPath}/${id}`, data),
    deleteItem: (id: ID) => apiDelete<never>(`${prefixedPath}/${id}`),
    bulkDeleteItems: (ids: ID[]) => apiDelete<never>(`${prefixedPath}/`, { id: ids }),
  };

  if (validate) {
    (result as GenerateEntityWriteApiResult<ID, Item, ItemInput, IncludeContext, EditContext, true>).createValidateItem = (
      data: ItemInput,
      abortSignal,
    ) => apiPost<never>(`${prefixedPath}/validate`, data, { signal: abortSignal });
    (result as GenerateEntityWriteApiResult<ID, Item, ItemInput, IncludeContext, EditContext, true>).updateValidateItem = (
      { id, ...data }: Item,
      abortSignal,
    ) => apiPut<never>(`${prefixedPath}/${id}/validate`, data, { signal: abortSignal });
    (result as GenerateEntityWriteApiResult<ID, Item, ItemInput, IncludeContext, EditContext, true>).patchValidateItem = (
      id: ID,
      data: Partial<Item>,
      abortSignal,
    ) => apiPatch<never>(`${prefixedPath}/${id}/validate`, data, { signal: abortSignal });
  }

  if (includeEditContext) {
    (result as GenerateEntityWriteApiResult<ID, Item, ItemInput, true, EditContext, Validate>).getEditContext = () =>
      apiGet<EditContext>(`${prefixedPath}/form-context`);
  }

  return result as GenerateEntityWriteApiResult<ID, Item, ItemInput, IncludeContext, EditContext, Validate>;
}

export function generateEntityApi<
  ID extends number | string,
  Item extends Entity<ID>,
  ItemInput extends object = Omit<Item, 'id'>,
  IncludeDisplayContext extends boolean = true,
  DisplayContext extends EntityDisplayContext = EntityDisplayContext,
  IncludeEditContext extends boolean = true,
  EditContext extends EntityEditContext = EntityEditContext,
  Validate extends boolean = true,
>({
    path,
    validate = true as Validate,
    includeEditContext = true as IncludeEditContext,
    includeDisplayContext = true as IncludeDisplayContext,
  }: GenerateEntityApiOptions<IncludeDisplayContext, IncludeEditContext, Validate>): GenerateEntityApiResult<
  ID,
  Item,
  ItemInput,
  IncludeDisplayContext,
  DisplayContext,
  IncludeEditContext,
  EditContext,
  Validate
> {
  return {
    ...generateEntityReadApis<ID, Item, IncludeDisplayContext, DisplayContext>({ includeDisplayContext, path }),
    ...generateEntityWriteApis<ID, Item, ItemInput, IncludeEditContext, EditContext, Validate>({ includeEditContext, path, validate }),
  };
}