
/**
 * The generic entity interface. It is used to define the shape of an object that can be stored in the entity store.
 *
 * @template ID The type of the entity id.
 */
export interface Entity<ID extends number | string = number | string> {
  readonly id: ID;

  [key: string]: unknown;
}

export interface EntityState<T = Entity> {
  items: Record<string, T>;
  loading: boolean;
  error?: string;
}