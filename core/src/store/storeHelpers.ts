import { Entity, EntityDisplayContext, EntityEditContext, EntityStoreState, EntityReadStoreState } from './types';

export function generateInitialEntityReadStoreState<
  ID extends number | string,
  Item extends Entity<ID>,
  DisplayContext extends EntityDisplayContext = EntityDisplayContext,
  State extends EntityReadStoreState<
    ID,
    Item,
    DisplayContext,
    boolean
  > = EntityReadStoreState<ID, Item, DisplayContext>
>(options?: {
  additionalState?: Partial<Omit<
    State,
    keyof EntityReadStoreState<ID, Item, DisplayContext, boolean>
  >>;
  includeDisplayContext?: boolean;
}): State {
  const { additionalState = {}, includeDisplayContext = true } = options || {};

  const baseState: Omit<State, keyof typeof additionalState> = {
    data: {},
    queries: {},
    singleQueries: {},
  } as any;

  const state = {
    ...baseState,
    ...additionalState,
  } as State;

  if (includeDisplayContext) {
    state.displayContext = {
      data: null,
      errors: null,
      fetching: false,
    };
  }

  return state;
}

export function generateInitialEntityStoreState<
  ID extends number | string,
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
>(options?: {
  additionalState?: Partial<Omit<
    State,
    keyof EntityStoreState<ID, Item, ItemInput, DisplayContext, EditContext>
  >>;
  includeDisplayContext?: boolean;
  includeEditContext?: boolean;
}): State {
  const {
    additionalState = {},
    includeDisplayContext = true,
    includeEditContext = true,
  } = options || {};

  const baseState = generateInitialEntityReadStoreState<ID, Item, DisplayContext, State>({
    includeDisplayContext,
  });

  const state = {
    ...baseState,
    draftItem: null,
    transactions: {},
    ...additionalState,
  } as State;

  if (includeEditContext) {
    state.editContext = {
      data: null,
      errors: null,
      fetching: false,
    };
  }

  return state;
}
