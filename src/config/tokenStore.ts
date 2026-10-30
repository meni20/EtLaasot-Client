const STORAGE_KEY = "access_token";

let inMemoryToken: string | null = null;

export const getToken = (): string | null => {
  try {
    // Discard legacy browser-persisted credentials. Reloads use the existing
    // HttpOnly session cookie; the bearer fallback remains memory-only.
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage may be disabled. Authentication does not depend on it.
  }

  return inMemoryToken;
};

export const setToken = (token: string): void => {
  inMemoryToken = token;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // The HttpOnly cookie remains available where persistent storage is blocked.
  }
};

export const clearToken = (): void => {
  inMemoryToken = null;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing else is required when browser storage is unavailable.
  }
};
