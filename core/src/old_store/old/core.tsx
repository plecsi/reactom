import createSagaMiddleware from '@redux-saga/core';
import { configureStore } from '@reduxjs/toolkit';
import { createInjectorsEnhancer } from 'redux-injectors';
import { rootReducers } from './reducer';
import rootSaga from './saga';
import { createSagaInjector } from './sagaInjector';

const sagaMiddleware = createSagaMiddleware();
const { run: runSaga } = sagaMiddleware;

const entityStore = configureStore({
  reducer: rootReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
  // Use createInjectorsEnhancer to enable dynamic reducer/saga injection
  enhancers: (getDefaultEnhancers) =>
    getDefaultEnhancers({}).concat([
      createInjectorsEnhancer({
        createReducer: () => rootReducers,
        runSaga,
      }),
    ]) as never,
});

const sagaInjector = createSagaInjector(sagaMiddleware, rootSaga);

export { entityStore, sagaInjector };