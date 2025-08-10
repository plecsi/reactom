import { call, put, select, takeLatest } from 'redux-saga/effects';
import type { Effect } from 'redux-saga/effects';
import { Entity, EntityDisplayContext, EntityEditContext, EntityListRequest } from './types';

/**
 * Lista saga-k generálása
 *
 * @param config - A generátor konfigurációja
 * @returns - Az entitás listázásához kapcsolódó saga-k
 */
export function generateListSagas<
  ID extends string | number = number | string,
  T extends Entity<ID> = Entity<ID>,
  TDisplayContext extends EntityDisplayContext = EntityDisplayContext,
  TState = any,
  TSliceKey extends string = string,
  TListRequest extends EntityListRequest<ID, T> = EntityListRequest<ID, T>
>(config: {
  actions: any;
  api: any;
  selectors: any;
}) {
  const { actions, api, selectors } = config;

  // Entitások listázását kezelő saga
  function* fetchListSaga(action: ReturnType<typeof actions.fetchList>): Generator<Effect, void, any> {
    try {
      const { payload } = action;
      const response = yield call(api.getList, payload);

      if (response.ok) {
        yield put(actions.fetchListSuccess({
          items: response.data.items,
          total: response.data.total,
          query: payload,
        }));
      } else {
        yield put(actions.fetchListFailure({
          error: response.data?.message || 'Hiba történt a lista lekérése során',
          query: payload,
        }));
      }
    } catch (error: any) {
      yield put(actions.fetchListFailure({
        error: error.message || 'Hiba történt a lista lekérése során',
        query: action.payload,
      }));
    }
  }

  // Lista frissítését kezelő saga
  function* refreshListSaga(): Generator<Effect, void, any>{
    try {
      const query = yield select(selectors.getListQuery);
      yield put(actions.fetchList(query));
    } catch (error: any) {
      yield put(actions.fetchListFailure({
        error: error.message || 'Hiba történt a lista frissítése során',
      }));
    }
  }

  return [
    takeLatest(`${actions.fetchList}`, fetchListSaga),
    takeLatest(`${actions.refreshList}`, refreshListSaga),
  ];
}

/**
 * Egyedi elem saga-k generálása
 *
 * @param config - A generátor konfigurációja
 * @returns - Az egyedi elem műveleteihez kapcsolódó saga-k
 */
export function generateSingleSagas<
  ID extends string | number = number | string,
  T extends Entity<ID> = Entity<ID>,
  TState = any,
  TSliceKey extends string = string
>(config: {
  actions: any;
  api: any;
  selectors: any;
}) {
  const { actions, api, selectors } = config;

  // Egy elem lekérését kezelő saga
  function* fetchByIdSaga(action: ReturnType<typeof actions.fetchById>): Generator<any, void, any> {
    try {
      const { payload } = action;
      const response = yield call(api.getById, payload);

      if (response.ok) {
        yield put(actions.fetchByIdSuccess({
          id: payload,
          data: response.data,
        }));
      } else {
        yield put(actions.fetchByIdFailure({
          id: payload,
          error: response.data?.message || 'Hiba történt az elem lekérése során',
        }));
      }
    } catch (error: any) {
      yield put(actions.fetchByIdFailure({
        id: action.payload,
        error: error.message || 'Hiba történt az elem lekérése során',
      }));
    }
  }

  return [
    takeLatest(`${actions.fetchById}`, fetchByIdSaga),
  ];
}

/**
 * Megjelenítési kontextus saga-k generálása
 *
 * @param config - A generátor konfigurációja
 * @returns - A megjelenítési kontextushoz kapcsolódó saga-k
 */
export function generateDisplayContextSagas<
  ID extends string | number = number | string,
  T extends Entity<ID> = Entity<ID>,
  TDisplayContext extends EntityDisplayContext = EntityDisplayContext,
  TState = any,
  TSliceKey extends string = string
>(config: {
  actions: any;
  api: any;
}) {
  const { actions, api } = config;

  // Megjelenítési kontextus lekérését kezelő saga
  function* fetchDisplayContextSaga(action: ReturnType<typeof actions.fetchDisplayContext>): Generator<any, void, any> {
    try {
      const { payload } = action;
      const response = yield call(api.getDisplayContext, payload);

      if (response.ok) {
        yield put(actions.fetchDisplayContextSuccess({
          id: payload,
          data: response.data,
        }));
      } else {
        yield put(actions.fetchDisplayContextFailure({
          id: payload,
          error: response.data?.message || 'Hiba történt a megjelenítési kontextus lekérése során',
        }));
      }
    } catch (error: any) {
      yield put(actions.fetchDisplayContextFailure({
        id: action.payload,
        error: error.message || 'Hiba történt a megjelenítési kontextus lekérése során',
      }));
    }
  }

  return [
    takeLatest(`${actions.fetchDisplayContext}`, fetchDisplayContextSaga),
  ];
}

/**
 * Szerkesztési kontextus saga-k generálása
 *
 * @param config - A generátor konfigurációja
 * @returns - A szerkesztési kontextushoz kapcsolódó saga-k
 */
export function generateEditContextSagas<
  ID extends string | number = number | string,
  T extends Entity<ID> = Entity<ID>,
  TInput = Partial<T>,
  TEditContext extends EntityEditContext = EntityEditContext,
  TState = any,
  TSliceKey extends string = string
>(config: {
  actions: any;
  api: any;
}) {
  const { actions, api } = config;

  // Szerkesztési kontextus lekérését kezelő saga
  function* fetchEditContextSaga(action: ReturnType<typeof actions.fetchEditContext>): Generator<any, void, any> {
    try {
      const { payload } = action;
      const response = yield call(api.getEditContext, payload);

      if (response.ok) {
        yield put(actions.fetchEditContextSuccess({
          id: payload,
          data: response.data,
        }));
      } else {
        yield put(actions.fetchEditContextFailure({
          id: payload,
          error: response.data?.message || 'Hiba történt a szerkesztési kontextus lekérése során',
        }));
      }
    } catch (error: any) {
      yield put(actions.fetchEditContextFailure({
        id: action.payload,
        error: error.message || 'Hiba történt a szerkesztési kontextus lekérése során',
      }));
    }
  }

  return [
    takeLatest(`${actions.fetchEditContext}`, fetchEditContextSaga),
  ];
}

/**
 * Létrehozási saga-k generálása
 *
 * @param config - A generátor konfigurációja
 * @returns - Az entitás létrehozásához kapcsolódó saga-k
 */
export function generateCreateSagas<
  ID extends string | number = number | string,
  T extends Entity<ID> = Entity<ID>,
  TInput = Partial<T>,
  TEditContext extends EntityEditContext = EntityEditContext,
  TState = any,
  TSliceKey extends string = string
>(config: {
  actions: any;
  api: any;
}) {
  const { actions, api } = config;

  // Elem létrehozását kezelő saga
  function* createSaga(action: ReturnType<typeof actions.create>): Generator<any, void, any> {
    try {
      const { payload } = action;
      const response = yield call(api.create, payload.data);

      if (response.ok) {
        yield put(actions.createSuccess({
          data: response.data,
          transactionId: payload.transactionId,
        }));
      } else {
        yield put(actions.createFailure({
          error: response.data?.message || 'Hiba történt az elem létrehozása során',
          validationErrors: response.data?.validationErrors || null,
          transactionId: payload.transactionId,
        }));
      }
    } catch (error: any) {
      yield put(actions.createFailure({
        error: error.message || 'Hiba történt az elem létrehozása során',
        validationErrors: error.data?.validationErrors || null,
        transactionId: action.payload.transactionId,
      }));
    }
  }

  return [
    takeLatest(`${actions.create}`, createSaga),
  ];
}

/**
 * Frissítési saga-k generálása
 *
 * @param config - A generátor konfigurációja
 * @returns - Az entitás frissítéséhez kapcsolódó saga-k
 */
export function generateUpdateSagas<
  ID extends string | number = number | string,
  T extends Entity<ID> = Entity<ID>,
  TInput = Partial<T>,
  TEditContext extends EntityEditContext = EntityEditContext,
  TState = any,
  TSliceKey extends string = string
>(config: {
  actions: any;
  api: any;
}) {
  const { actions, api } = config;

  // Elem frissítését kezelő saga
  function* updateSaga(action: ReturnType<typeof actions.update>): Generator<any, void, any> {
    try {
      const { payload } = action;
      const response = yield call(api.update, payload.id, payload.data);

      if (response.ok) {
        yield put(actions.updateSuccess({
          id: payload.id,
          data: response.data,
          transactionId: payload.transactionId,
        }));
      } else {
        yield put(actions.updateFailure({
          id: payload.id,
          error: response.data?.message || 'Hiba történt az elem frissítése során',
          validationErrors: response.data?.validationErrors || null,
          transactionId: payload.transactionId,
        }));
      }
    } catch (error: any) {
      yield put(actions.updateFailure({
        id: action.payload.id,
        error: error.message || 'Hiba történt az elem frissítése során',
        validationErrors: error.data?.validationErrors || null,
        transactionId: action.payload.transactionId,
      }));
    }
  }

  return [
    takeLatest(`${actions.update}`, updateSaga),
  ];
}

/**
 * Részleges frissítési saga-k generálása
 *
 * @param config - A generátor konfigurációja
 * @returns - Az entitás részleges frissítéséhez kapcsolódó saga-k
 */
export function generatePatchSagas<
  ID extends string | number = number | string,
  T extends Entity<ID> = Entity<ID>,
  TInput = Partial<T>,
  TEditContext extends EntityEditContext = EntityEditContext,
  TState = any,
  TSliceKey extends string = string
>(config: {
  actions: any;
  api: any;
}) {
  const { actions, api } = config;

  // Elem részleges frissítését kezelő saga
  function* patchSaga(action: ReturnType<typeof actions.patch>): Generator<any, void, any> {
    try {
      const { payload } = action;
      const response = yield call(api.patch, payload.id, payload.data);

      if (response.ok) {
        yield put(actions.patchSuccess({
          id: payload.id,
          data: response.data,
          transactionId: payload.transactionId,
        }));
      } else {
        yield put(actions.patchFailure({
          id: payload.id,
          error: response.data?.message || 'Hiba történt az elem részleges frissítése során',
          validationErrors: response.data?.validationErrors || null,
          transactionId: payload.transactionId,
        }));
      }
    } catch (error: any) {
      yield put(actions.patchFailure({
        id: action.payload.id,
        error: error.message || 'Hiba történt az elem részleges frissítése során',
        validationErrors: error.data?.validationErrors || null,
        transactionId: action.payload.transactionId,
      }));
    }
  }

  return [
    takeLatest(`${actions.patch}`, patchSaga),
  ];
}

/**
 * Törlési saga-k generálása
 *
 * @param config - A generátor konfigurációja
 * @returns - Az entitás törléséhez kapcsolódó saga-k
 */
export function generateDeleteSagas<
  ID extends string | number = number | string,
  T extends Entity<ID> = Entity<ID>,
  TInput = Partial<T>,
  TEditContext extends EntityEditContext = EntityEditContext,
  TState = any,
  TSliceKey extends string = string
>(config: {
  actions: any;
  api: any;
}) {
  const { actions, api } = config;

  // Elem törlését kezelő saga
  function* deleteSaga(action: ReturnType<typeof actions.delete>): Generator<any, void, any> {
    try {
      const { payload } = action;
      const response = yield call(api.delete, payload.id);

      if (response.ok) {
        yield put(actions.deleteSuccess({
          id: payload.id,
          transactionId: payload.transactionId,
        }));
      } else {
        yield put(actions.deleteFailure({
          id: payload.id,
          error: response.data?.message || 'Hiba történt az elem törlése során',
          transactionId: payload.transactionId,
        }));
      }
    } catch (error: any) {
      yield put(actions.deleteFailure({
        id: action.payload.id,
        error: error.message || 'Hiba történt az elem törlése során',
        transactionId: action.payload.transactionId,
      }));
    }
  }

  return [
    takeLatest(`${actions.delete}`, deleteSaga),
  ];
}

/**
 * Tranzakció tisztítás saga generálása
 *
 * @param config - A generátor konfigurációja
 * @returns - A tranzakció tisztításához kapcsolódó saga
 */
export function generateTransactionCleanupSaga<
  ID extends string | number = number | string,
  T extends Entity<ID> = Entity<ID>,
  TInput = Partial<T>,
  TDisplayContext extends EntityDisplayContext = EntityDisplayContext,
  TEditContext extends EntityEditContext = EntityEditContext
>(config: {
  actions: any;
  selectors: any;
}) {
  const { actions, selectors } = config;

  // Tranzakció tisztítást kezelő saga
  function* cleanupTransactionSaga(action: ReturnType<typeof actions.cleanupTransaction>): Generator<any, void, any> {
    try {
      const { payload } = action;
      // Itt lehet implementálni a tranzakció tisztítás logikáját, például:
      // - Törölt elemek cache-ből való eltávolítása
      // - Ideiglenes állapotok visszaállítása
      yield put(actions.cleanupTransactionSuccess({
        transactionId: payload.transactionId,
      }));
    } catch (error: any) {
      yield put(actions.cleanupTransactionFailure({
        transactionId: action.payload.transactionId,
        error: error.message || 'Hiba történt a tranzakció tisztítása során',
      }));
    }
  }

  return [
    takeLatest(`${actions.cleanupTransaction}`, cleanupTransactionSaga),
  ];
}
