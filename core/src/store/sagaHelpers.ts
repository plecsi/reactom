import {
  call,
  put,
  select,
  takeLatest,
  takeEvery,
  all,
} from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';

interface EntitySagaConfig<
  TEntity,
  TInput,
  TRequest,
  TDisplayContext,
  TEditContext
> {
  actions: any;
  api: any;
  includeDisplayContext?: boolean;
  includeEditContext?: boolean;
  validate?: boolean;
}

export function createEntitySaga<
  TEntity,
  TInput,
  TRequest,
  TDisplayContext = any,
  TEditContext = any
>(
  config: EntitySagaConfig<
    TEntity,
    TInput,
    TRequest,
    TDisplayContext,
    TEditContext
  >
) {
  const { actions, api, includeDisplayContext, includeEditContext, validate } =
    config;

  function* fetchList(
    action: PayloadAction<TRequest>
  ): Generator<any, void, any> {
    try {
      const response = yield call(api.getList, action.payload);
      console.log('API SAGÁBAN', action)
      if (response.ok) {
        yield put(actions.fetchList(response.data));
      } else {
        yield put(actions.fetchListFailure(response.problem));
      }
    } catch (error) {
      console.log('ERROR SAGÁBAN: ', error)
      yield put(actions.fetchListFailure(error));
    }
  }

  function* fetchSingle(
    action: PayloadAction<TEntity extends { id: infer U } ? U : number>
  ): Generator<any, void, any> {
    try {
      const response = yield call(api.getById, action.payload);
      if (response.ok) {
        yield put(actions.getSuccess(response.data));
      } else {
        yield put(
          actions.getFailure({ id: action.payload, error: response.problem })
        );
      }
    } catch (error) {
      yield put(actions.getFailure({ id: action.payload, error }));
    }
  }

  function* createEntity(
    action: PayloadAction<TInput>
  ): Generator<any, void, any> {
    try {
      const response = yield call(api.create, action.payload);
      if (response.ok) {
        yield put(actions.createSuccess(response.data));
      } else {
        yield put(actions.createFailure(response.problem));
      }
    } catch (error) {
      yield put(actions.createFailure(error));
    }
  }

  function* updateEntity(
    action: PayloadAction<{
      id: TEntity extends { id: infer U } ? U : number;
      data: TInput;
    }>
  ): Generator<any, void, any> {
    try {
      const { id, data } = action.payload;
      const response = yield call(api.update, id, data);
      if (response.ok) {
        yield put(actions.updateSuccess(response.data));
      } else {
        yield put(actions.updateFailure({ id, error: response.problem }));
      }
    } catch (error) {
      yield put(actions.updateFailure({ id: action.payload.id, error }));
    }
  }

  function* patchEntity(
    action: PayloadAction<{
      id: TEntity extends { id: infer U } ? U : number;
      data: Partial<TInput>;
    }>
  ): Generator<any, void, any> {
    try {
      const { id, data } = action.payload;
      const response = yield call(api.patch, id, data);
      if (response.ok) {
        yield put(actions.patchSuccess(response.data));
      } else {
        yield put(actions.patchFailure({ id, error: response.problem }));
      }
    } catch (error) {
      yield put(actions.patchFailure({ id: action.payload.id, error }));
    }
  }

  function* deleteEntity(
    action: PayloadAction<TEntity extends { id: infer U } ? U : number>
  ): Generator<any, void, any> {
    try {
      const response = yield call(api.delete, action.payload);
      if (response.ok) {
        yield put(actions.deleteSuccess(action.payload));
      } else {
        yield put(
          actions.deleteFailure({ id: action.payload, error: response.problem })
        );
      }
    } catch (error) {
      yield put(actions.deleteFailure({ id: action.payload, error }));
    }
  }

  const sagas = [
    takeLatest(actions.fetchList.type, fetchList),
    /*takeLatest(actions.fetchById.type, fetchSingle),
    takeLatest(actions.create.type, createEntity),
    takeLatest(actions.update.type, updateEntity),
    takeLatest(actions.patch.type, patchEntity),
    takeLatest(actions.delete.type, deleteEntity),*/
  ];

  // Opcionális display context kezelés
  if (includeDisplayContext) {
    function* fetchDisplayContext(): Generator<any, void, any> {
      try {
        const response = yield call(api.getDisplayContext);
        if (response.ok) {
          yield put(actions.getDisplayContextSuccess(response.data));
        } else {
          yield put(actions.getDisplayContextFailure(response.problem));
        }
      } catch (error) {
        yield put(actions.getDisplayContextFailure(error));
      }
    }

    sagas.push(
      //takeLatest(actions.fetchDisplayContext.type, fetchDisplayContext)
    );
  }

  // Opcionális edit context kezelés
  if (includeEditContext) {
    function* fetchEditContext(): Generator<any, void, any> {
      try {
        const response = yield call(api.getEditContext);
        if (response.ok) {
          yield put(actions.getEditContextSuccess(response.data));
        } else {
          yield put(actions.getEditContextFailure(response.problem));
        }
      } catch (error) {
        yield put(actions.getEditContextFailure(error));
      }
    }

    sagas.push(
      //takeLatest(actions.fetchEditContext.type, fetchEditContext)
    );
  }

  // Opcionális validálás
 /* if (validate) {
    function* validateEntity(
      action: PayloadAction<TInput>
    ): Generator<any, void, any> {
      try {
        const response = yield call(api.validate, action.payload);
        if (response.ok) {
          yield put(actions.validateSuccess(response.data));
        } else {
          yield put(actions.validateFailure(response.problem));
        }
      } catch (error) {
        yield put(actions.validateFailure(error));
      }
    }

    sagas.push(takeLatest(actions.validate.type, validateEntity));
  }*/

  return function* rootSaga() {
    yield all(sagas);
  };
}
