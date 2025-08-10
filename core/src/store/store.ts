import { StoreService } from './StoreService';
import languageReducer from '../i18n/languageStore';
import toastReducer from '../Toast/slice';
import { languageSaga } from '../entities/language/saga';
import { all, takeLatest } from 'redux-saga/effects';
import { watchAddToast } from '../Toast';
import { authSaga } from '../newAuth';
import authReducer from '../newAuth/auth.slice';

function* rootSaga() {
  yield all([
    languageSaga(),
    authSaga(),
    watchAddToast(),
  ]);
}

const storeService = StoreService.getInstance();

// Regisztrálj statikus reducer-t
storeService.registerStaticReducer('language', languageReducer);
storeService.registerStaticReducer('auth', authReducer);
storeService.registerStaticReducer('toast', toastReducer);

// Ha vannak egyedi middleware-ek, regisztráld őket
// storeService.registerMiddleware(customMiddleware);

const store = storeService.createStore(rootSaga);

export default store;