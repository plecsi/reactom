
// Egyszerű ToastContainer komponens, megjeleníti a toastokat
import { useDispatch, useSelector } from 'react-redux';
import { ToastType } from './types';
import { selectToasts } from './selectors';
import { useEffect } from 'react';
import { removeToast } from './slice';

export const ToastContainer = () => {
  const toasts = useSelector(selectToasts);
  const dispatch = useDispatch();

  useEffect(() => {
    toasts.forEach(toast => {
      if (toast.duration !== 0) {
        const timer = setTimeout(() => {
          dispatch(removeToast(toast.id));
        }, toast.duration ?? 5000);

        return () => clearTimeout(timer);
      }
    });
  }, [toasts, dispatch]);
  return (
    <div style={{
      position: 'fixed',
      top: 20,
      right: 20,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      maxWidth: 320,
    }}>
      {toasts.map(({ id, type, message }) => (
        <div
          key={id}
          style={{
            padding: '12px 16px',
            borderRadius: 4,
            color: 'white',
            backgroundColor: getBackgroundColor(type),
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            cursor: 'pointer',
          }}
          onClick={() => removeToast(id)}
          role="alert"
          aria-live="assertive"
        >
          {message}
        </div>
      ))}
    </div>
  );
};

function getBackgroundColor(type: ToastType) {
  switch (type) {
    case 'success':
      return '#4caf50';
    case 'error':
      return '#f44336';
    case 'warning':
      return '#ff9800';
    case 'info':
    default:
      return '#2196f3';
  }
}
