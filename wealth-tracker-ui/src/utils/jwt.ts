export const decodeJwtPayload = <T,>(token: string): T | null => {
  try {
    const parts = token.split('.');
    if (parts.length < 2) {
      return null;
    }
    const normalized = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const decoded = atob(padded);
    return JSON.parse(decoded) as T;
  } catch {
    return null;
  }
};
