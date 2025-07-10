// core/src/store/rootSaga.ts
import { all } from 'redux-saga/effects';
import { entitySaga } from './entitySaga';

export default function* rootSaga() {
  yield all([
    entitySaga(),
    // add other sagas here
  ]);
}