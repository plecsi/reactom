import axios from 'axios';
import store from '../store/store';
import { selectCsrfToken } from './auth.selectors';
import { RootState } from '../store/types';

const client = axios.create({
  baseURL:  'http://localhost:3000',
  withCredentials: true
});

// Interceptor to add CSRF token header
client.interceptors.request.use((config) => {
  const state = store.getState();
  const csrfToken = state.auth?.csrfToken;
  if (csrfToken) {
    config.headers['x-csrf-token'] = csrfToken;
  }
  return config;
});

export default client;