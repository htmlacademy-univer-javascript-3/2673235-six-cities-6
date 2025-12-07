import axios, {
  type AxiosInstance,
  type AxiosRequestHeaders,
} from 'axios';
import { getToken } from './services/token';

export function createAPI(): AxiosInstance {
  const api = axios.create({
    baseURL: 'https://14.design.htmlacademy.pro/six-cities',
    timeout: 5000,
  });

  api.interceptors.request.use((config) => {
    const token = getToken();

    if (token) {
      const headers = (config.headers ?? {}) as AxiosRequestHeaders & Record<string, string>;
      headers['X-Token'] = token;
      config.headers = headers;
    }

    return config;
  });

  return api;
}
