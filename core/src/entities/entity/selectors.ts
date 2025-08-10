import { Entity, EntityDisplayContext, EntityEditContext, EntityListRequest, EntityStoreState } from './types';

/**
 * Generál alap szelektorokat egy entitás store-hoz
 *
 * @param storeKey - A store kulcsa a gyökér store-ban
 * @returns Objektum a szelektor függvényekkel
 */
export const generateEntitySelectors = <
  ID extends string | number | symbol = number | string,
  T extends Entity<ID> = Entity<ID>,
  TInput = Partial<T>,
  TDisplayContext extends EntityDisplayContext = EntityDisplayContext,
  TEditContext extends EntityEditContext = EntityEditContext,
  TState extends EntityStoreState<ID, T, TInput, TDisplayContext, TEditContext> = EntityStoreState<ID, T, TInput, TDisplayContext, TEditContext>,
  TRootState = { [key: string]: any }
>(
  storeKey: string
) => {
  // Alap szelektorok
  const getState = (state: TRootState) => state[storeKey] as TState;

  // Entitás szelektorok
  const getEntities = (state: TRootState) => getState(state).byId;
  const getEntityById = (state: TRootState, id: ID) => getEntities(state)[id];
  const getAllEntities = (state: TRootState) => Object.values(getEntities(state)) as T[];

  // Lista szelektorok
  const getListState = (state: TRootState) => getState(state).list;
  const getListIds = (state: TRootState) => getListState(state).ids;
  const getListItems = (state: TRootState) => {
    const ids = getListIds(state);
    const entities = getEntities(state);
    return ids.map(id => entities[id]).filter(Boolean) as T[];
  };
  const getListLoading = (state: TRootState) => getListState(state).loading;
  const getListLoaded = (state: TRootState) => getListState(state).loaded;
  const getListError = (state: TRootState) => getListState(state).error;
  const getListTotal = (state: TRootState) => getListState(state).total;
  const getListQuery = (state: TRootState) => getListState(state).query;
  const getListPaginationMode = (state: TRootState) => getListState(state).paginationMode;

  // Egyedi elem szelektorok
  const getSingleState = (state: TRootState) => getState(state).single;
  const isEntityLoading = (state: TRootState, id: ID) => getSingleState(state).loading[id] || false;
  const getEntityError = (state: TRootState, id: ID) => getSingleState(state).error[id] || null;

  // Aktív elem szelektorok
  const getActiveItemState = (state: TRootState) => getState(state).activeItem;
  const getActiveItemId = (state: TRootState) => getActiveItemState(state).id;
  const getActiveItemData = (state: TRootState) => {
    const id = getActiveItemId(state);
    return id ? getEntityById(state, id) : null;
  };
  const getActiveItemOriginalData = (state: TRootState) => getActiveItemState(state).originalData;
  const getActiveItemValidationErrors = (state: TRootState) => getActiveItemState(state).validationErrors;

  // Megjelenítési kontextus szelektorok
  const getDisplayContextState = (state: TRootState) => getState(state).displayContext;
  const getDisplayContextById = (state: TRootState, id: ID) => {
    const contextState = getDisplayContextState(state);
    return contextState ? contextState.byId[id] : undefined;
  };
  const isDisplayContextLoading = (state: TRootState, id: ID) => {
    const contextState = getDisplayContextState(state);
    return contextState ? contextState.loading[id] || false : false;
  };
  const getDisplayContextError = (state: TRootState, id: ID) => {
    const contextState = getDisplayContextState(state);
    return contextState ? contextState.error[id] || null : null;
  };

  // Szerkesztési kontextus szelektorok
  const getEditContextState = (state: TRootState) => getState(state).editContext;
  const getEditContextById = (state: TRootState, id: ID) => {
    const contextState = getEditContextState(state);
    return contextState ? contextState.byId[id] : undefined;
  };
  const isEditContextLoading = (state: TRootState, id: ID) => {
    const contextState = getEditContextState(state);
    return contextState ? contextState.loading[id] || false : false;
  };
  const getEditContextError = (state: TRootState, id: ID) => {
    const contextState = getEditContextState(state);
    return contextState ? contextState.error[id] || null : null;
  };

  // Létrehozási szelektorok
  const getCreateState = (state: TRootState) => getState(state).create;
  const isCreateLoading = (state: TRootState) => {
    const createState = getCreateState(state);
    return createState ? createState.loading : false;
  };
  const getCreateError = (state: TRootState) => {
    const createState = getCreateState(state);
    return createState ? createState.error : null;
  };
  const isCreateSuccess = (state: TRootState) => {
    const createState = getCreateState(state);
    return createState ? createState.success : false;
  };
  const getCreateData = (state: TRootState) => {
    const createState = getCreateState(state);
    return createState ? createState.data : null;
  };
  const getCreateValidationErrors = (state: TRootState) => {
    const createState = getCreateState(state);
    return createState ? createState.validationErrors : null;
  };

  // Frissítési szelektorok
  const getUpdateState = (state: TRootState) => getState(state).update;
  const isUpdateLoading = (state: TRootState, id: ID) => {
    const updateState = getUpdateState(state);
    return updateState ? updateState.loading[id] || false : false;
  };
  const getUpdateError = (state: TRootState, id: ID) => {
    const updateState = getUpdateState(state);
    return updateState ? updateState.error[id] || null : null;
  };
  const isUpdateSuccess = (state: TRootState, id: ID) => {
    const updateState = getUpdateState(state);
    return updateState ? updateState.success[id] || false : false;
  };
  const getUpdateValidationErrors = (state: TRootState, id: ID) => {
    const updateState = getUpdateState(state);
    return updateState ? updateState.validationErrors[id] || null : null;
  };

  // Részleges frissítési szelektorok
  const getPatchState = (state: TRootState) => getState(state).patch;
  const isPatchLoading = (state: TRootState, id: ID) => {
    const patchState = getPatchState(state);
    return patchState ? patchState.loading[id] || false : false;
  };
  const getPatchError = (state: TRootState, id: ID) => {
    const patchState = getPatchState(state);
    return patchState ? patchState.error[id] || null : null;
  };
  const isPatchSuccess = (state: TRootState, id: ID) => {
    const patchState = getPatchState(state);
    return patchState ? patchState.success[id] || false : false;
  };
  const getPatchValidationErrors = (state: TRootState, id: ID) => {
    const patchState = getPatchState(state);
    return patchState ? patchState.validationErrors[id] || null : null;
  };

  // Törlési szelektorok
  const getDeleteState = (state: TRootState) => getState(state).delete;
  const isDeleteLoading = (state: TRootState, id: ID) => {
    const deleteState = getDeleteState(state);
    return deleteState ? deleteState.loading[id] || false : false;
  };
  const getDeleteError = (state: TRootState, id: ID) => {
    const deleteState = getDeleteState(state);
    return deleteState ? deleteState.error[id] || null : null;
  };
  const isDeleteSuccess = (state: TRootState, id: ID) => {
    const deleteState = getDeleteState(state);
    return deleteState ? deleteState.success[id] || false : false;
  };

  // Tranzakciók szelektorok
  const getTransactionsState = (state: TRootState) => getState(state).transactions;
  const isTransactionPending = (state: TRootState, transactionId: string) => {
    const transactionsState = getTransactionsState(state);
    return transactionsState ? transactionsState.pending[transactionId] || false : false;
  };
  const isTransactionCompleted = (state: TRootState, transactionId: string) => {
    const transactionsState = getTransactionsState(state);
    return transactionsState ? transactionsState.completed[transactionId] || false : false;
  };
  const isTransactionFailed = (state: TRootState, transactionId: string) => {
    const transactionsState = getTransactionsState(state);
    return transactionsState ? transactionsState.failed[transactionId] || false : false;
  };

  return {
    // Alap
    getState,

    // Entitások
    getEntities,
    getEntityById,
    getAllEntities,

    // Listázás
    getListState,
    getListIds,
    getListItems,
    getListLoading,
    getListLoaded,
    getListError,
    getListTotal,
    getListQuery,
    getListPaginationMode,

    // Egyedi elem
    getSingleState,
    isEntityLoading,
    getEntityError,

    // Aktív elem
    getActiveItemState,
    getActiveItemId,
    getActiveItemData,
    getActiveItemOriginalData,
    getActiveItemValidationErrors,

    // Megjelenítési kontextus
    getDisplayContextState,
    getDisplayContextById,
    isDisplayContextLoading,
    getDisplayContextError,

    // Szerkesztési kontextus
    getEditContextState,
    getEditContextById,
    isEditContextLoading,
    getEditContextError,

    // Létrehozás
    getCreateState,
    isCreateLoading,
    getCreateError,
    isCreateSuccess,
    getCreateData,
    getCreateValidationErrors,

    // Frissítés
    getUpdateState,
    isUpdateLoading,
    getUpdateError,
    isUpdateSuccess,
    getUpdateValidationErrors,

    // Részleges frissítés
    getPatchState,
    isPatchLoading,
    getPatchError,
    isPatchSuccess,
    getPatchValidationErrors,

    // Törlés
    getDeleteState,
    isDeleteLoading,
    getDeleteError,
    isDeleteSuccess,

    // Tranzakciók
    getTransactionsState,
    isTransactionPending,
    isTransactionCompleted,
    isTransactionFailed,
  };
};
