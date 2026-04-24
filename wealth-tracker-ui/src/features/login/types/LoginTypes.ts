export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

export interface AuthPayload extends LoginResponse {
  username: string;
}

export interface AuthState extends AuthPayload {
  isAuthenticated: boolean;
  isHydrated: boolean;
}
