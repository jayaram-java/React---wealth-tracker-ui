import { useCallback, useEffect, useMemo, useState } from 'react';
import type { AuthPayload, LoginResponse } from '../types/LoginTypes';
import {
  clearAuthSessionStorage,
  clearStoredAuth,
  readStoredAuth,
  writeStoredAuth,
} from './authStorage';
import { AuthContext, type AuthContextValue } from './AuthContext';
import { isAuthPayloadValid } from './authSession';
import { setSessionTimeoutHandler } from '../../../serviceconfigs/AxiosAPI';
import { logoutRequest } from '../service/authService';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<AuthPayload | null>(() => readStoredAuth());
  const isHydrated = typeof window !== 'undefined';

  const refreshAuth = useCallback(() => {
    setAuth((current) => {
      if (isAuthPayloadValid(current)) {
        return current;
      }
      clearStoredAuth();
      return null;
    });
  }, []);

  const login = useCallback((payload: LoginResponse, username: string) => {
    const nextAuth: AuthPayload = { ...payload, username };
    setAuth(nextAuth);
    writeStoredAuth(nextAuth);
  }, []);

  const clearAuthData = useCallback(() => {
    setAuth(null);
    clearStoredAuth();
    clearAuthSessionStorage();
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = auth?.refreshToken ?? readStoredAuth()?.refreshToken ?? '';

    clearAuthData();

    if (!refreshToken) {
      return;
    }

    void logoutRequest(refreshToken).catch(() => {
      // Logout must never fail open; local auth is already cleared.
    });
  }, [auth, clearAuthData]);

  useEffect(() => {
    setSessionTimeoutHandler(clearAuthData);
    return () => setSessionTimeoutHandler(null);
  }, [clearAuthData]);

  useEffect(() => {
    if (!auth) {
      return;
    }

    if (!isAuthPayloadValid(auth)) {
      clearAuthData();
      return;
    }

    writeStoredAuth(auth);
  }, [auth, clearAuthData]);

  const value = useMemo<AuthContextValue>(
    () => ({
      accessToken: auth?.accessToken ?? '',
      refreshToken: auth?.refreshToken ?? '',
      tokenType: auth?.tokenType ?? '',
      username: auth?.username ?? '',
      isAuthenticated: Boolean(auth?.accessToken),
      isHydrated,
      login,
      logout,
      refreshAuth,
    }),
    [auth, isHydrated, login, logout, refreshAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
