import { decodeJwtPayload } from '../../../utils/jwt';
import type { AuthPayload } from '../types/LoginTypes';

interface JwtExpiryPayload {
  exp?: number;
}

export const isAuthPayloadValid = (auth: AuthPayload | null): auth is AuthPayload => {
  if (!auth?.accessToken) {
    return false;
  }

  const payload = decodeJwtPayload<JwtExpiryPayload>(auth.accessToken);
  if (!payload?.exp) {
    return true;
  }

  return Date.now() < payload.exp * 1000;
};

