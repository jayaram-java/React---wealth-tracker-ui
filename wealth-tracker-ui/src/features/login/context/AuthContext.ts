import { createContext } from 'react';
import type { AuthState, LoginResponse } from '../types/LoginTypes';

export interface AuthContextValue extends AuthState {
  login: (payload: LoginResponse, username: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

