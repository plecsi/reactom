import { PayloadActionCreator } from '@reduxjs/toolkit';
import {
  Entity,
  EntityDisplayContext,
  EntityEditContext,
  EntityListRequest,
  PaginationMode,
} from './types';

// Segédfüggvény a kezdeti állapot generálásához
export const generateInitialEntityStoreState = <
  ID = number | string,
  T extends Entity<ID> = Entity<ID>,
  TInput = Partial<T>,
  TDisplayContext extends EntityDisplayContext = EntityDisplayContext,
  TEditContext extends EntityEditContext = EntityEditContext,
  TState = any
>(options: {
  includeDisplayContext?: boolean;
  includeEditContext?: boolean;
  additionalState?: Partial<TState>;
}) => {
  const {
    includeDisplayContext = false,
    includeEditContext = false,
    additionalState = {},
  } = options;

  return {
    // Egyedi entitások tárhelye
    byId: {},

    // Listázás állapot
    list: {
      ids: [],
      loaded: false,
      loading: false,
      error: null,
      total: 0,
      query: {},
      paginationMode: PaginationMode.List,
    },

    // Egyedi entitás betöltési állapot
    single: {
      loading: {},
      error: {},
    },

    // Aktív elem állapot
    activeItem: {
      id: null,
      originalData: null,
      validationErrors: null,
    },

    // Opcionális kontextusok
    ...(includeDisplayContext
      ? {
          displayContext: {
            byId: {},
            loading: {},
            error: {},
          },
        }
      : {}),

    ...(includeEditContext
      ? {
          editContext: {
            byId: {},
            loading: {},
            error: {},
          },
        }
      : {}),

    // CRUD műveletek állapotai
    create: {
      loading: false,
      error: null,
      success: false,
      data: null,
      validationErrors: null,
    },

    update: {
      loading: {},
      error: {},
      success: {},
      validationErrors: {},
    },

    patch: {
      loading: {},
      error: {},
      success: {},
      validationErrors: {},
    },

    delete: {
      loading: {},
      error: {},
      success: {},
    },

    // Tranzakciók kezelése
    transactions: {
      pending: {},
      completed: {},
      failed: {},
    },

    // További állapotok
    ...additionalState,
  };
};

/**
 * Lista akciók generálása
 *
 * @param creators - Action creator objektum
 * @param options - Opciók a lista akciókhoz
 * @returns - Lista akciók object
 */
export const generateListActions = <
  ID = number | string,
  T extends Entity<ID> = Entity<ID>,
  TListRequest extends EntityListRequest<ID, T> = EntityListRequest<ID, T>,
  TDisplayContext extends EntityDisplayContext = EntityDisplayContext,
  TState = any
>(
  creators: any,
  options: {
    defaultPaginationMode?: PaginationMode;
    defaultQuery?: Partial<TListRequest>;
  } = {}
) => {
  const { defaultPaginationMode = PaginationMode.List, defaultQuery = {} } =
    options;

  return {
    // Lista lekérés
    fetchList: creators.prepareAction<TListRequest>(
      (payload: TListRequest) => ({ payload })
    ),
    fetchListSuccess: creators.prepareAction<{
      items: T[];
      total: number;
      query: TListRequest;
    }>((payload) => ({ payload })),
    fetchListFailure: creators.prepareAction<{
      error: string;
      query?: TListRequest;
    }>((payload) => ({ payload })),

    // Lista frissítés
    refreshList: creators.prepareAction(() => ({ payload: {} })),

    // Lista törlése
    clearList: creators.prepareAction(() => ({ payload: {} })),

    // Lapozás módosítása
    setPaginationMode: creators.prepareAction<PaginationMode>((payload) => ({
      payload,
    })),

    // Lekérdezés módosítása
    setQuery: creators.prepareAction<Partial<TListRequest>>((payload) => ({
      payload,
    })),
  };
};

/**
 * Egyedi elem akciók generálása
 *
 * @param creators - Action creator objektum
 * @returns - Egyedi elem akciók object
 */
export const generateSingleActions = <
  ID = number | string,
  T extends Entity<ID> = Entity<ID>,
  TState = any
>(
  creators: any
) => {
  return {
    // Egy elem lekérése
    fetchById: creators.prepareAction<ID>((payload: ID) => ({ payload })),
    fetchByIdSuccess: creators.prepareAction<{
      id: ID;
      data: T;
    }>((payload) => ({ payload })),
    fetchByIdFailure: creators.prepareAction<{
      id: ID;
      error: string;
    }>((payload) => ({ payload })),

    // Elem törlése a store-ból
    removeFromStore: creators.prepareAction<ID>((payload: ID) => ({ payload })),

    // Összes elem törlése a store-ból
    clearStore: creators.prepareAction(() => ({ payload: {} })),
  };
};

/**
 * Megjelenítési kontextus akciók generálása
 *
 * @param creators - Action creator objektum
 * @returns - Megjelenítési kontextus akciók object
 */
export const generateDisplayContextActions = <
  ID = number | string,
  T extends Entity<ID> = Entity<ID>,
  TDisplayContext extends EntityDisplayContext = EntityDisplayContext,
  TState = any
>(
  creators: any
) => {
  return {
    // Megjelenítési kontextus lekérése
    fetchDisplayContext: creators.prepareAction<ID>((payload: ID) => ({
      payload,
    })),
    fetchDisplayContextSuccess: creators.prepareAction<{
      id: ID;
      data: TDisplayContext;
    }>((payload) => ({ payload })),
    fetchDisplayContextFailure: creators.prepareAction<{
      id: ID;
      error: string;
    }>((payload) => ({ payload })),

    // Megjelenítési kontextus törlése
    clearDisplayContext: creators.prepareAction<ID>((payload: ID) => ({
      payload,
    })),

    // Összes megjelenítési kontextus törlése
    clearAllDisplayContexts: creators.prepareAction(() => ({ payload: {} })),
  };
};

/**
 * Szerkesztési kontextus akciók generálása
 *
 * @param creators - Action creator objektum
 * @returns - Szerkesztési kontextus akciók object
 */
export const generateEditContextActions = <
  ID = number | string,
  T extends Entity<ID> = Entity<ID>,
  TInput = Partial<T>,
  TEditContext extends EntityEditContext = EntityEditContext,
  TState = any
>(
  creators: any
) => {
  return {
    // Szerkesztési kontextus lekérése
    fetchEditContext: creators.prepareAction<ID>((payload: ID) => ({
      payload,
    })),
    fetchEditContextSuccess: creators.prepareAction<{
      id: ID;
      data: TEditContext;
    }>((payload) => ({ payload })),
    fetchEditContextFailure: creators.prepareAction<{
      id: ID;
      error: string;
    }>((payload) => ({ payload })),

    // Szerkesztési kontextus törlése
    clearEditContext: creators.prepareAction<ID>((payload: ID) => ({
      payload,
    })),

    // Összes szerkesztési kontextus törlése
    clearAllEditContexts: creators.prepareAction(() => ({ payload: {} })),
  };
};

/**
 * Aktív elem akciók generálása
 *
 * @param creators - Action creator objektum
 * @returns - Aktív elem akciók object
 */
export const generateActiveItemActions = <
  ID = number | string,
  T extends Entity<ID> = Entity<ID>,
  TInput = Partial<T>,
  TEditContext extends EntityEditContext = EntityEditContext,
  TState = any
>(
  creators: any
) => {
  return {
    // Aktív elem beállítása
    setActiveItem: creators.prepareAction<{
      id: ID;
      data?: T;
    }>((payload) => ({ payload })),

    // Aktív elem törlése
    clearActiveItem: creators.prepareAction(() => ({ payload: {} })),

    // Validációs hibák beállítása
    setValidationErrors: creators.prepareAction<Record<string, string> | null>(
      (payload) => ({ payload })
    ),

    // Validációs hibák törlése
    clearValidationErrors: creators.prepareAction(() => ({ payload: {} })),
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
  ID = number | string,
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
    create: creators.prepareAction<{
      data: TInput;
      transactionId?: string;
    }>((payload) => ({ payload })),
    createSuccess: creators.prepareAction<{
      data: T;
      transactionId?: string;
    }>((payload) => ({ payload })),
    createFailure: creators.prepareAction<{
      error: string;
      validationErrors?: Record<string, string> | null;
      transactionId?: string;
    }>((payload) => ({ payload })),

    // Létrehozási űrlap tisztítása
    clearCreateForm: creators.prepareAction(() => ({ payload: {} })),

    // Validálás (ha engedélyezve van)
    ...(validate
      ? {
          validateCreate: creators.prepareAction<TInput>((payload) => ({
            payload,
          })),
          validateCreateSuccess: creators.prepareAction<{
            data: TInput;
          }>((payload) => ({ payload })),
          validateCreateFailure: creators.prepareAction<{
            error: string;
            validationErrors: Record<string, string> | null;
          }>((payload) => ({ payload })),
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
  ID = number | string,
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
    update: creators.prepareAction<{
      id: ID;
      data: TInput;
      transactionId?: string;
    }>((payload) => ({ payload })),
    updateSuccess: creators.prepareAction<{
      id: ID;
      data: T;
      transactionId?: string;
    }>((payload) => ({ payload })),
    updateFailure: creators.prepareAction<{
      id: ID;
      error: string;
      validationErrors?: Record<string, string> | null;
      transactionId?: string;
    }>((payload) => ({ payload })),

    // Frissítési állapot tisztítása
    clearUpdate: creators.prepareAction<ID>((payload: ID) => ({ payload })),

    // Validálás (ha engedélyezve van)
    ...(validate
      ? {
          validateUpdate: creators.prepareAction<{
            id: ID;
            data: TInput;
          }>((payload) => ({ payload })),
          validateUpdateSuccess: creators.prepareAction<{
            id: ID;
            data: TInput;
          }>((payload) => ({ payload })),
          validateUpdateFailure: creators.prepareAction<{
            id: ID;
            error: string;
            validationErrors: Record<string, string> | null;
          }>((payload) => ({ payload })),
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
  ID = number | string,
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
    patch: creators.prepareAction<{
      id: ID;
      data: Partial<TInput>;
      transactionId?: string;
    }>((payload) => ({ payload })),
    patchSuccess: creators.prepareAction<{
      id: ID;
      data: T;
      transactionId?: string;
    }>((payload) => ({ payload })),
    patchFailure: creators.prepareAction<{
      id: ID;
      error: string;
      validationErrors?: Record<string, string> | null;
      transactionId?: string;
    }>((payload) => ({ payload })),

    // Részleges frissítési állapot tisztítása
    clearPatch: creators.prepareAction<ID>((payload: ID) => ({ payload })),

    // Validálás (ha engedélyezve van)
    ...(validate
      ? {
          validatePatch: creators.prepareAction<{
            id: ID;
            data: Partial<TInput>;
          }>((payload) => ({ payload })),
          validatePatchSuccess: creators.prepareAction<{
            id: ID;
            data: Partial<TInput>;
          }>((payload) => ({ payload })),
          validatePatchFailure: creators.prepareAction<{
            id: ID;
            error: string;
            validationErrors: Record<string, string> | null;
          }>((payload) => ({ payload })),
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
  ID = number | string,
  T extends Entity<ID> = Entity<ID>,
  TInput = Partial<T>,
  TEditContext extends EntityEditContext = EntityEditContext,
  TState = any
>(
  creators: any
) => {
  return {
    // Törlés
    delete: creators.prepareAction<{
      id: ID;
      transactionId?: string;
    }>((payload) => ({ payload })),
    deleteSuccess: creators.prepareAction<{
      id: ID;
      transactionId?: string;
    }>((payload) => ({ payload })),
    deleteFailure: creators.prepareAction<{
      id: ID;
      error: string;
      transactionId?: string;
    }>((payload) => ({ payload })),

    // Törlési állapot tisztítása
    clearDelete: creators.prepareAction<ID>((payload: ID) => ({ payload })),
  };
};

/**
 * Tranzakció tisztító akciók generálása
 *
 * @param creators - Action creator objektum
 * @returns - Tranzakció tisztító akciók object
 */
export const generateTransactionCleanupActions = <
  ID = number | string,
  T extends Entity<ID> = Entity<ID>,
  TInput = Partial<T>,
  TEditContext extends EntityEditContext = EntityEditContext,
  TState = any
>(
  creators: any
) => {
  return {
    // Tranzakció tisztítás
    cleanupTransaction: creators.prepareAction<{
      transactionId: string;
    }>((payload) => ({ payload })),
    cleanupTransactionSuccess: creators.prepareAction<{
      transactionId: string;
    }>((payload) => ({ payload })),
    cleanupTransactionFailure: creators.prepareAction<{
      transactionId: string;
      error: string;
    }>((payload) => ({ payload })),
  };
};
