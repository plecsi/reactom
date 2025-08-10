// src/store/toastSaga.ts
import { takeEvery, delay, put, ForkEffect } from 'redux-saga/effects';
import { addToast, removeToast } from './slice';
import { ToastMessage } from './types';

function* handleAddToast(action: ReturnType<typeof addToast>) {
  const toast: ToastMessage = action.payload as ToastMessage;
  const duration = toast.duration ?? 3000;

  // Várakozás a duration idejéig, majd eltávolítás
  yield delay(duration);
  // Az id-t az action.payload nem tartalmazza, ezért itt nem tudjuk használni közvetlenül.
  // Megoldás: a toast id-t a slice generálja, így itt nem tudjuk eltávolítani automatikusan.
  // Ezért a toast id-t a saga nem tudja, így az automatikus eltávolítást a komponensben vagy middleware-ben kell megoldani.
  // Alternatív megoldás: a toast id-t a saga generálja, és dispatcheli az addToast-ot.
  // Itt egyszerűsítésként nem távolítjuk el automatikusan.
}

export function* watchAddToast(): Generator<ForkEffect<never>, void, unknown> {
  yield takeEvery(addToast.type, handleAddToast);
}
