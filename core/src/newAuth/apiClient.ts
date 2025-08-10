// apiClient.ts
import { create } from 'apisauce';
import store from '../store/store';

const apiClient = create({
  baseURL: 'http://localhost:3000/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

// CSRF token automatikus hozzáadása minden kéréshez

apiClient.addRequestTransform((request) => {
  const state = store.getState();
  console.log('CSRF a request előtt:', state.auth?.csrfToken);
  const csrfToken = state.auth?.csrfToken;
  if (csrfToken) {
    request.headers['x-csrf-token'] = csrfToken;
  }
});

export default apiClient;
