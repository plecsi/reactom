import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { Entity, EntityDisplayContext, EntityEditContext, EntityListRequest } from './types';

/**
 * Generál CRUD hook-okat egy adott entitáshoz
 *
 * @param actions - Az entitás akciói
 * @param selectors - Az entitás szelektorai
 * @returns - Hook-ok objektuma
 */
export const generateEntityHooks = <
  ID = number | string,
  T extends Entity<ID> = Entity<ID>,
  TInput = Partial<T>,
  TDisplayContext extends EntityDisplayContext = EntityDisplayContext,
  TEditContext extends EntityEditContext = EntityEditContext,
  TListRequest extends EntityListRequest<ID, T> = EntityListRequest<ID, T>
>({
    actions,
    selectors,
  }: {
  actions: any;
  selectors: any;
}) => {
  /**
   * Hook az entitások listájának kezeléséhez
   */
  const useEntityList = (initialQuery?: Partial<TListRequest>) => {
    const dispatch = useDispatch();

    // Szelektorok használata a state eléréséhez
    const items = useSelector(selectors.getListItems);
    const loading = useSelector(selectors.getListLoading);
    const loaded = useSelector(selectors.getListLoaded);
    const error = useSelector(selectors.getListError);
    const total = useSelector(selectors.getListTotal);
    const query = useSelector(selectors.getListQuery);
    const paginationMode = useSelector(selectors.getListPaginationMode);

    // Lista betöltése
    const fetchList = useCallback((listQuery?: Partial<TListRequest>) => {
      dispatch(actions.fetchList({
        ...query,
        ...listQuery,
      }));
    }, [dispatch, query]);

    // Lista frissítése
    const refreshList = useCallback(() => {
      dispatch(actions.refreshList());
    }, [dispatch]);

    // Lista törlése
    const clearList = useCallback(() => {
      dispatch(actions.clearList());
    }, [dispatch]);

    // Lapozási mód beállítása
    const setPaginationMode = useCallback((mode) => {
      dispatch(actions.setPaginationMode(mode));
    }, [dispatch]);

    // Lekérdezés módosítása
    const setQuery = useCallback((newQuery: Partial<TListRequest>) => {
      dispatch(actions.setQuery(newQuery));
    }, [dispatch]);

    // Inicializálás, ha van kezdeti lekérdezés
    useEffect(() => {
      if (initialQuery && !loaded && !loading) {
        fetchList(initialQuery);
      }
    }, [initialQuery, loaded, loading, fetchList]);

    return {
      items,
      loading,
      loaded,
      error,
      total,
      query,
      paginationMode,
      fetchList,
      refreshList,
      clearList,
      setPaginationMode,
      setQuery,
    };
  };

  /**
   * Hook egy adott entitás kezeléséhez
   */
  const useEntity = (id?: ID) => {
    const dispatch = useDispatch();

    // Szelektorok használata az entity eléréséhez
    const getEntity = useCallback((state) => {
      return id ? selectors.getEntityById(state, id) : null;
    }, [id]);

    const entity = useSelector(getEntity);
    const loading = useSelector(state => id ? selectors.isEntityLoading(state, id) : false);
    const error = useSelector(state => id ? selectors.getEntityError(state, id) : null);

    // Entity betöltése
    const fetchEntity = useCallback(() => {
      if (id) {
        dispatch(actions.fetchById(id));
      }
    }, [dispatch, id]);

    // Entity eltávolítása a store-ból
    const removeFromStore = useCallback(() => {
      if (id) {
        dispatch(actions.removeFromStore(id));
      }
    }, [dispatch, id]);

    // Inicializálás, ha van ID
    useEffect(() => {
      if (id && !entity && !loading && !error) {
        fetchEntity();
      }
    }, [id, entity, loading, error, fetchEntity]);

    return {
      entity,
      loading,
      error,
      fetchEntity,
      removeFromStore,
    };
  };

  /**
   * Hook az aktív elem kezeléséhez
   */
  const useActiveItem = () => {
    const dispatch = useDispatch();

    // Szelektorok használata
    const activeItemId = useSelector(selectors.getActiveItemId);
    const activeItemData = useSelector(selectors.getActiveItemData);
    const originalData = useSelector(selectors.getActiveItemOriginalData);
    const validationErrors = useSelector(selectors.getActiveItemValidationErrors);

    // Aktív elem beállítása
    const setActiveItem = useCallback((id: ID | null, data?: T) => {
      if (id) {
        dispatch(actions.setActiveItem({ id, data }));
      } else {
        dispatch(actions.clearActiveItem());
      }
    }, [dispatch]);

    // Aktív elem törlése
    const clearActiveItem = useCallback(() => {
      dispatch(actions.clearActiveItem());
    }, [dispatch]);

    // Validációs hibák beállítása
    const setValidationErrors = useCallback((errors: Record<string, string> | null) => {
      dispatch(actions.setValidationErrors(errors));
    }, [dispatch]);

    // Validációs hibák törlése
    const clearValidationErrors = useCallback(() => {
      dispatch(actions.clearValidationErrors());
    }, [dispatch]);

    return {
      activeItemId,
      activeItemData,
      originalData,
      validationErrors,
      setActiveItem,
      clearActiveItem,
      setValidationErrors,
      clearValidationErrors,
    };
  };

  /**
   * Hook a megjelenítési kontextus kezeléséhez
   */
  const useDisplayContext = (id?: ID) => {
    const dispatch = useDispatch();

    // Szelektorok használata a kontextus eléréséhez
    const getContext = useCallback((state) => {
      return id ? selectors.getDisplayContextById(state, id) : undefined;
    }, [id]);

    const context = useSelector(getContext);
    const loading = useSelector(state => id ? selectors.isDisplayContextLoading(state, id) : false);
    const error = useSelector(state => id ? selectors.getDisplayContextError(state, id) : null);

    // Kontextus betöltése
    const fetchContext = useCallback(() => {
      if (id) {
        dispatch(actions.fetchDisplayContext(id));
      }
    }, [dispatch, id]);

    // Kontextus törlése
    const clearContext = useCallback(() => {
      if (id) {
        dispatch(actions.clearDisplayContext(id));
      }
    }, [dispatch, id]);

    // Inicializálás, ha van ID
    useEffect(() => {
      if (id && !context && !loading && !error) {
        fetchContext();
      }
    }, [id, context, loading, error, fetchContext]);

    return {
      context,
      loading,
      error,
      fetchContext,
      clearContext,
    };
  };

  /**
   * Hook a szerkesztési kontextus kezeléséhez
   */
  const useEditContext = (id?: ID) => {
    const dispatch = useDispatch();

    // Szelektorok használata a kontextus eléréséhez
    const getContext = useCallback((state) => {
      return id ? selectors.getEditContextById(state, id) : undefined;
    }, [id]);

    const context = useSelector(getContext);
    const loading = useSelector(state => id ? selectors.isEditContextLoading(state, id) : false);
    const error = useSelector(state => id ? selectors.getEditContextError(state, id) : null);

    // Kontextus betöltése
    const fetchContext = useCallback(() => {
      if (id) {
        dispatch(actions.fetchEditContext(id));
      }
    }, [dispatch, id]);

    // Kontextus törlése
    const clearContext = useCallback(() => {
      if (id) {
        dispatch(actions.clearEditContext(id));
      }
    }, [dispatch, id]);

    // Inicializálás, ha van ID
    useEffect(() => {
      if (id && !context && !loading && !error) {
        fetchContext();
      }
    }, [id, context, loading, error, fetchContext]);

    return {
      context,
      loading,
      error,
      fetchContext,
      clearContext,
    };
  };

  /**
   * Hook entitás létrehozásához
   */
  const useEntityCreate = () => {
    const dispatch = useDispatch();

    // Szelektorok használata
    const loading = useSelector(selectors.isCreateLoading);
    const error = useSelector(selectors.getCreateError);
    const success = useSelector(selectors.isCreateSuccess);
    const data = useSelector(selectors.getCreateData);
    const validationErrors = useSelector(selectors.getCreateValidationErrors);

    // Tranzakció ID kezelése
    const [transactionId, setTransactionId] = useState<string | undefined>();

    // Létrehozás
    const create = useCallback((inputData: TInput) => {
      const newTransactionId = uuidv4();
      setTransactionId(newTransactionId);
      dispatch(actions.create({
        data: inputData,
        transactionId: newTransactionId,
      }));
      return newTransactionId;
    }, [dispatch]);

    // Űrlap tisztítása
    const clearForm = useCallback(() => {
      dispatch(actions.clearCreateForm());
    }, [dispatch]);

    // Validálás
    const validate = useCallback((inputData: TInput) => {
      dispatch(actions.validateCreate(inputData));
    }, [dispatch]);

    return {
      create,
      clearForm,
      validate,
      loading,
      error,
      success,
      data,
      validationErrors,
      transactionId,
    };
  };

  /**
   * Hook entitás frissítéséhez
   */
  const useEntityUpdate = (id?: ID) => {
    const dispatch = useDispatch();

    // Szelektorok használata
    const loading = useSelector(state => id ? selectors.isUpdateLoading(state, id) : false);
    const error = useSelector(state => id ? selectors.getUpdateError(state, id) : null);
    const success = useSelector(state => id ? selectors.isUpdateSuccess(state, id) : false);
    const validationErrors = useSelector(state => id ? selectors.getUpdateValidationErrors(state, id) : null);

    // Tranzakció ID kezelése
    const [transactionId, setTransactionId] = useState<string | undefined>();

    // Frissítés
    const update = useCallback((inputData: TInput) => {
      if (id) {
        const newTransactionId = uuidv4();
        setTransactionId(newTransactionId);
        dispatch(actions.update({
          id,
          data: inputData,
          transactionId: newTransactionId,
        }));
        return newTransactionId;
      }
      return undefined;
    }, [dispatch, id]);

    // Frissítési állapot tisztítása
    const clearUpdate = useCallback(() => {
      if (id) {
        dispatch(actions.clearUpdate(id));
      }
    }, [dispatch, id]);

    // Validálás
    const validate = useCallback((inputData: TInput) => {
      if (id) {
        dispatch(actions.validateUpdate({
          id,
          data: inputData,
        }));
      }
    }, [dispatch, id]);

    return {
      update,
      clearUpdate,
      validate,
      loading,
      error,
      success,
      validationErrors,
      transactionId,
    };
  };

  /**
   * Hook entitás részleges frissítéséhez
   */
  const useEntityPatch = (id?: ID) => {
    const dispatch = useDispatch();

    // Szelektorok használata
    const loading = useSelector(state => id ? selectors.isPatchLoading(state, id) : false);
    const error = useSelector(state => id ? selectors.getPatchError(state, id) : null);
    const success = useSelector(state => id ? selectors.isPatchSuccess(state, id) : false);
    const validationErrors = useSelector(state => id ? selectors.getPatchValidationErrors(state, id) : null);

    // Tranzakció ID kezelése
    const [transactionId, setTransactionId] = useState<string | undefined>();

    // Részleges frissítés
    const patch = useCallback((inputData: Partial<TInput>) => {
      if (id) {
        const newTransactionId = uuidv4();
        setTransactionId(newTransactionId);
        dispatch(actions.patch({
          id,
          data: inputData,
          transactionId: newTransactionId,
        }));
        return newTransactionId;
      }
      return undefined;
    }, [dispatch, id]);

    // Frissítési állapot tisztítása
    const clearPatch = useCallback(() => {
      if (id) {
        dispatch(actions.clearPatch(id));
      }
    }, [dispatch, id]);

    // Validálás
    const validate = useCallback((inputData: Partial<TInput>) => {
      if (id) {
        dispatch(actions.validatePatch({
          id,
          data: inputData,
        }));
      }
    }, [dispatch, id]);

    return {
      patch,
      clearPatch,
      validate,
      loading,
      error,
      success,
      validationErrors,
      transactionId,
    };
  };

  /**
   * Hook entitás törléséhez
   */
  const useEntityDelete = (id?: ID) => {
    const dispatch = useDispatch();

    // Szelektorok használata
    const loading = useSelector(state => id ? selectors.isDeleteLoading(state, id) : false);
    const error = useSelector(state => id ? selectors.getDeleteError(state, id) : null);
    const success = useSelector(state => id ? selectors.isDeleteSuccess(state, id) : false);

    // Tranzakció ID kezelése
    const [transactionId, setTransactionId] = useState<string | undefined>();

    // Törlés
    const deleteEntity = useCallback(() => {
      if (id) {
        const newTransactionId = uuidv4();
        setTransactionId(newTransactionId);
        dispatch(actions.delete({
          id,
          transactionId: newTransactionId,
        }));
        return newTransactionId;
      }
      return undefined;
    }, [dispatch, id]);

    // Törlési állapot tisztítása
    const clearDelete = useCallback(() => {
      if (id) {
        dispatch(actions.clearDelete(id));
      }
    }, [dispatch, id]);

    return {
      deleteEntity,
      clearDelete,
      loading,
      error,
      success,
      transactionId,
    };
  };

  /**
   * Hook tranzakciók kezeléséhez
   */
  const useEntityTransaction = (transactionId?: string) => {
    const dispatch = useDispatch();

    // Szelektorok használata
    const isPending = useSelector(state => transactionId ? selectors.isTransactionPending(state, transactionId) : false);
    const isCompleted = useSelector(state => transactionId ? selectors.isTransactionCompleted(state, transactionId) : false);
    const isFailed = useSelector(state => transactionId ? selectors.isTransactionFailed(state, transactionId) : false);

    // Tranzakció tisztítása
    const cleanupTransaction = useCallback(() => {
      if (transactionId) {
        dispatch(actions.cleanupTransaction({
          transactionId,
        }));
      }
    }, [dispatch, transactionId]);

    return {
      isPending,
      isCompleted,
      isFailed,
      cleanupTransaction,
    };
  };

  return {
    useEntityList,
    useEntity,
    useActiveItem,
    useDisplayContext,
    useEditContext,
    useEntityCreate,
    useEntityUpdate,
    useEntityPatch,
    useEntityDelete,
    useEntityTransaction,
  };
};
