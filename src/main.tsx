import { StrictMode, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';
import { Provider } from 'react-redux';
import { entityStore, LanguageProvider, ToastProvider } from '@react/core';

console.log('Entity Store:', entityStore);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

function StoreLogger() {
  useEffect(() => {
    const unsubscribe = entityStore.subscribe(() => {
      console.log('entityStore state:', entityStore.getState());
    });
    return unsubscribe;
  }, []);
  return null;
}

root.render(
  <>
    <Provider store={entityStore}>
      <StoreLogger />
      <LanguageProvider>
        <ToastProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ToastProvider>
      </LanguageProvider>
    </Provider>
  </>
);
