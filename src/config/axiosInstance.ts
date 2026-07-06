import axios from "axios";

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

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 401) {
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
