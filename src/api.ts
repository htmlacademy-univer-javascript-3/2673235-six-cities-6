import axios, { type AxiosInstance } from 'axios';

const BACKEND_URL = 'https://14.design.htmlacademy.pro/six-cities';
const REQUEST_TIMEOUT = 5000;

export function createAPI(): AxiosInstance {
  return axios.create({
    baseURL: BACKEND_URL,
    timeout: REQUEST_TIMEOUT,
  });
}
