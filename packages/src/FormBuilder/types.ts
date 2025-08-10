// packages/src/FormBuilder/types.ts
import {
  BackendErrors,
  DataSetRequest,
  Entity,
  EntityQuery,
} from '@react/core';

/**
 * The collection of entity queries.
 * The key is the query key, which is used to identify the query in the store.
 * The query key should be a short kebab-case string that describes the query.
 *
 * @template ID The type of the entity id.
 */
export type EntityQueryStore<
  ID extends number | string,
  Item extends Entity<ID>
> = Record<string, EntityQuery<ID, Item>>;

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

/**
 * The collection of single entity queries.
 * The key is the entity id.
 *
 * @template ID The type of the entity id.
 */
export type EntitySingleQueryStore = Record<string, EntitySingleQuery>;

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
 * The generic entity store single state.
 *
 * Responsible for storing the single entity queries.
 * It extends the base state with the single queries store.
 */
export interface EntityStoreSingleState<
  ID extends number | string,
  Item extends Entity<ID>
> extends EntityStoreBaseState<ID, Item> {
  /**
   * The entity single query store, which stores the results of single entity queries to the backend.
   * @see EntitySingleQueryStore
   */
  singleQueries: EntitySingleQueryStore;
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
  // DisplayContext extends EntityDisplayContext = EntityDisplayContext,
  IncludeDisplayContext extends boolean = true
> extends EntityStoreBaseState<ID, Item> {
  /**
   * The entity query store, which stores the results of get queries to the backend.
   * @see EntityQueryStore
   */
  queries: EntityQueryStore<ID, Item>;
  /**
   * The context of listing the entities. It contains information about the available sorting, filters, search and export options.
   */
  /*displayContext: IncludeDisplayContext extends true
    ? {
      data: DisplayContext | null;
      errors: BackendErrors | null;
      fetching: boolean;
    }
    : never;*/
}

/**
 * The generic entity store read state.
 *
 * Composes the single and query states.
 */
export interface EntityReadStoreState<
  ID extends number | string,
  Item extends Entity<ID>
  //DisplayContext extends EntityDisplayContext = EntityDisplayContext,
  //IncludeDisplayContext extends boolean = true,
> extends EntityStoreSingleState<ID, Item> {}
//EntityStoreQueryState<ID, Item, DisplayContext, IncludeDisplayContext> {}

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
  //DisplayContext extends EntityDisplayContext = EntityDisplayContext,
  //EditContext extends EntityEditContext = EntityEditContext,
  //IncludeDisplayContext extends boolean = true,
  //IncludeEditContext extends boolean = true,
> extends EntityReadStoreState<ID, Item> {}
/*DisplayContext, IncludeDisplayContext
 // EntityStoreTransactionState<ID, Item, ItemInput, IncludeEditContext> {} /*EditContext*/

export interface FormBuilderInput {}
export interface FormBuilder extends Entity<number>, FormBuilderInput {}

export interface FormBuilderStoreState
  extends EntityStoreState<
    EntityStoreState['id'],
    FormBuilder,
    FormBuilderInput
  > {}

export interface FormState {
  data: Record<FormConfig,string | number >;
  loading: boolean;
  error: string | null;
  activeItem? : FormConfig | null;
  ongoing: boolean;
}

export type FieldType = 'text' | 'number' | 'email';

export const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  text: 'Text',
  number: 'Number',
  email: 'Email',
};

export interface FieldConfig extends Entity {
  type: FieldType;
  name: string;
  label?: string;
  readonly: boolean;
  value: string;
}

export interface FormConfig extends Entity {
  name: string;
  fields: FieldConfig[];
}
