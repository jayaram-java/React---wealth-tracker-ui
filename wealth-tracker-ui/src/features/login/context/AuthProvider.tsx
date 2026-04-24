import { useMemo, useState } from 'react';
import type { AuthPayload, LoginResponse } from '../types/LoginTypes';
import { clearStoredAuth, readStoredAuth, writeStoredAuth } from './authStorage';
import { AuthContext, type AuthContextValue } from './AuthContext';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<AuthPayload | null>(() => readStoredAuth());
  const isHydrated = typeof window !== 'undefined';

  const login = (payload: LoginResponse, username: string) => {
    const nextAuth: AuthPayload = { ...payload, username };
    setAuth(nextAuth);
    writeStoredAuth(nextAuth);
  };

  const logout = () => {
    setAuth(null);
    clearStoredAuth();
  };

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
    }),
    [auth, isHydrated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
