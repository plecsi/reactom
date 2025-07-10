import { Saga, Task } from 'redux-saga';
import { SagaMiddleware } from '@redux-saga/core';

type SagaRecord = { [key: string]: Task };

export function createSagaInjector(sagaMiddleware: SagaMiddleware, rootSaga: Saga) {
  const injectedSagas: SagaRecord = {};
  sagaMiddleware.run(rootSaga);

  return function injectSaga(key: string, saga: Saga) {
    if (injectedSagas[key]) return;
    injectedSagas[key] = sagaMiddleware.run(saga);
  };
}