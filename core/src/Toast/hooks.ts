// src/hooks/useToast.ts
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { selectToasts } from './selectors';
import { ToastMessage } from './types';
import { addToast, removeToast } from './slice';

export const useToast = () => {
  const dispatch = useDispatch();
  const toasts = useSelector(selectToasts);

  const showToast = useCallback(
    (toast: ToastMessage) => {
      dispatch(addToast(toast));
    },
    [dispatch]
  );

  const hideToast = useCallback(
    (id: string) => {
      dispatch(removeToast(id));
    },
    [dispatch]
  );

  return { toasts, showToast, hideToast };
};
