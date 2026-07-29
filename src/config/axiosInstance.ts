import axios from "axios";
import { clearToken, getToken } from "./tokenStore";

export const createAxiosInstance = (
  baseURL: string,
  prefix: string = "",
  headers: Record<string, string> = {},
) => {
  const instance = axios.create({
    headers,
    baseURL: baseURL + prefix,
    withCredentials: true,
  });

  instance.interceptors.request.use((config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 401) {
        clearToken();
        window.dispatchEvent(new Event("auth:unauthorized"));
      }
      return Promise.reject(error);
    },
  );

  return instance;
};

export const createServerAxiosInstance = (
  prefix: string,
  headers: Record<string, string> = {},
) => createAxiosInstance(import.meta.env.VITE_SERVER_URL, prefix, headers);
