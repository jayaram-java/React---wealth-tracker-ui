import type { AuthPayload } from '../types/LoginTypes';

const AUTH_STORAGE_KEY = 'wealth_tracker_auth';
export const LAST_SCREEN_STORAGE_KEY = 'wealth_tracker_last_screen';

export const readStoredAuth = (): AuthPayload | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthPayload;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

export const writeStoredAuth = (payload: AuthPayload) => {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
};

export const clearStoredAuth = () => {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const clearAuthSessionStorage = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.removeItem(LAST_SCREEN_STORAGE_KEY);
};
