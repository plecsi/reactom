import { create, ApiResponse, CancelToken } from 'apisauce';
import type { AxiosRequestConfig } from 'axios';

const cancelTokenSource = CancelToken.source();

const api = create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'X-Delegated-Application': ''//config.appName,
  },
  cancelToken: cancelTokenSource.token,
  timeout: 10000,
});

// Generic GET
export async function apiGet<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response: ApiResponse<T> = await api.get(url, undefined, config);
  if (response.ok && response.data) return response.data;
  throw new Error(response.problem || 'API error');
}

// Generic POST
export async function apiPost<T, D = unknown>(url: string, data: D, config?: AxiosRequestConfig): Promise<T> {
  const response: ApiResponse<T> = await api.post(url, data, config);
  if (response.ok && response.data) return response.data;
  throw new Error(response.problem || 'API error');
}

// Generic PATCH
export async function apiPatch<T, D = unknown>(url: string, data: D, config?: AxiosRequestConfig): Promise<T> {
  const response: ApiResponse<T> = await api.patch(url, data, config);
  if (response.ok && response.data) return response.data;
  throw new Error(response.problem || 'API error');
}

// Generic PUT
export async function apiPut<T, D = unknown>(url: string, data: D, config?: AxiosRequestConfig): Promise<T> {
  const response: ApiResponse<T> = await api.put(url, data, config);
  if (response.ok && response.data) return response.data;
  throw new Error(response.problem || 'API error');
}

// Generic DELETE
export async function apiDelete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response: ApiResponse<T> = await api.delete(url, undefined, config);
  if (response.ok && response.data) return response.data;
  throw new Error(response.problem || 'API error');
}

export default { api, apiGet };