// core/src/store/store.ts
import { combineReducers, configureStore, ReducersMapObject } from '@reduxjs/toolkit';
import createSagaMiddleware, { Saga } from 'redux-saga';
import { createInjectorsEnhancer } from 'redux-injectors';

export function createAbstractStore<S>({
  rootReducers,
  rootSaga,
}: {
  rootReducers: ReducersMapObject<S>;
  rootSaga: Saga;
}) {
  const sagaMiddleware = createSagaMiddleware();
  const { run: runSaga } = sagaMiddleware;

  // Dinamikusan frissülő reducer objektum
  let injectedReducers = { ...rootReducers };

  const createReducer = () => combineReducers(injectedReducers);


  const store = configureStore({
    reducer: createReducer(),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
    devTools: process.env.NODE_ENV !== 'production',
    enhancers: (getDefaultEnhancers) =>
      getDefaultEnhancers({}).concat([
        createInjectorsEnhancer({
          createReducer: () => rootReducers,
          runSaga,
        }),
      ]) as never,
  });

  sagaMiddleware.run(rootSaga);

  return store;
}


