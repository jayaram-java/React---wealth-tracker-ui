import { createContext, useContext, useMemo, useState } from 'react';
import type { AuthPayload, AuthState, LoginResponse } from '../types/LoginTypes';

interface AuthContextValue extends AuthState {
  login: (payload: LoginResponse, username: string) => void;
  logout: () => void;
}

const AUTH_STORAGE_KEY = 'wealth_tracker_auth';

const readStoredAuth = (): AuthPayload | null => {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthPayload;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const stored = readStoredAuth();
  const [auth, setAuth] = useState<AuthPayload | null>(stored);

  const login = (payload: LoginResponse, username: string) => {
    const nextAuth: AuthPayload = { ...payload, username };
    setAuth(nextAuth);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextAuth));
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      accessToken: auth?.accessToken ?? '',
      refreshToken: auth?.refreshToken ?? '',
      tokenType: auth?.tokenType ?? '',
      username: auth?.username ?? '',
      isAuthenticated: Boolean(auth?.accessToken),
      login,
      logout,
    }),
    [auth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
