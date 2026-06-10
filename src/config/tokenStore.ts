const STORAGE_KEY = "access_token";

let inMemoryToken: string | null = null;

export const getToken = (): string | null => {
  if (inMemoryToken) return inMemoryToken;
  try {
    inMemoryToken = localStorage.getItem(STORAGE_KEY);
  } catch {
    inMemoryToken = null;
  }
  return inMemoryToken;
};

export const setToken = (token: string): void => {
  inMemoryToken = token;
  try {
    localStorage.setItem(STORAGE_KEY, token);
  } catch {
    /* ignore storage failures */
  }
};

export const clearToken = (): void => {
  inMemoryToken = null;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore storage failures */
  }
};
