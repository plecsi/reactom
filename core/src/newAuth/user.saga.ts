import { takeLatest, call, put, select, all } from 'redux-saga/effects';
import client from '../newAuth/clients';
import {
  fetchProfileRequest,
  fetchProfileSuccess,
  fetchProfileFailure,
  updateProfileRequest,
  updateProfileSuccess,
} from './user.slice';
import { selectAuthUser } from '../newAuth/auth.selectors';
import { loginSuccess, silentRefreshSuccess } from '../newAuth/auth.slice';

// API hívások
function fetchProfileApi(userId: string) {
  return client.get(`user/profile/${userId}`);
}

function updateProfileApi(payload: { userId: string; twoFactorEnabled: boolean }) {
  return client.put(`user/profile/${payload.userId}`, payload);
}

// --- SAGÁK ---
function* handleFetchProfile(action: ReturnType<typeof fetchProfileRequest>) {
  try {
    let userId = action.payload?.userId;

    // Ha nincs userId, store-ból vesszük
    if (!userId) {
      const user = yield select(selectAuthUser);
      if (!user?.id) return; // Itt csak kilépünk hiba dobás helyett
      userId = user.id;
    }

    // Ha már van profil betöltve, nem töltjük újra
    const profile = yield select(state => state.user.profile);
    if (profile?.id === userId) return;

    const response = yield call(fetchProfileApi, userId);
    yield put(fetchProfileSuccess(response.data));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    yield put(fetchProfileFailure(message));
  }
}

function* handleUpdateProfile(action: ReturnType<typeof updateProfileRequest>) {
  try {
    const response = yield call(updateProfileApi, action.payload);
    yield put(updateProfileSuccess(response.data));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    yield put(fetchProfileFailure(message));
  }
}

// --- Automatikus profil lekérés login / silent refresh után ---
function* triggerProfileAfterAuth(action: any) {
  const userId = action.payload?.user?.id;
  if (userId) {
    yield put(fetchProfileRequest({ userId }));
  }
}



export function* userSaga() {
  yield all([
    takeLatest(fetchProfileRequest.type, handleFetchProfile),
    takeLatest(updateProfileRequest.type, handleUpdateProfile),
    takeLatest(loginSuccess.type, triggerProfileAfterAuth),
    takeLatest(silentRefreshSuccess.type, triggerProfileAfterAuth),
  ]);
}
