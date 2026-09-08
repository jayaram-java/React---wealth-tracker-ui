export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

