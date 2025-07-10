import { all } from 'redux-saga/effects';
import { createAbstractStore } from './store';
import userProfileReducer from '../entities/userProfile/slice';
import { userProfileSaga } from '../entities/userProfile/saga';
import languageReducer from '../i18n/languageStore';
import { languageSaga } from '../entities/language/saga';
import { EntityStore } from './types';

const rootReducers = {
  userProfile: userProfileReducer,
  language: languageReducer,
};

function* rootSaga() {
  yield all([userProfileSaga(), languageSaga()]);
}

export const entityStore: EntityStore = createAbstractStore({
  rootReducers,
  rootSaga,
});