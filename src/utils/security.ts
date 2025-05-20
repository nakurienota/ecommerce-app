import { LocalStorageKeys } from '@core/enum/local-storage-keys';
import { AppRoutes } from '@utils/router';

export function validTokenExists(): boolean {
  const token: string | null = localStorage.getItem(LocalStorageKeys.ACCESS_TOKEN);
  const expiresAtString: string | null = localStorage.getItem(LocalStorageKeys.ACCESS_TOKEN_EXPIRES);
  if (!token || !expiresAtString) return false;
  const expiresAt: number = Number.parseInt(expiresAtString, 10);
  if (Number.isNaN(expiresAt)) return false;
  return Date.now() < expiresAt;
}

export function deleteCurrentToken(): void {
  const token: string | null = localStorage.getItem(LocalStorageKeys.ACCESS_TOKEN);
  const expiresAtString: string | null = localStorage.getItem(LocalStorageKeys.ACCESS_TOKEN_EXPIRES);
  if (token) localStorage.removeItem(LocalStorageKeys.ACCESS_TOKEN);
  if (expiresAtString) localStorage.removeItem(LocalStorageKeys.ACCESS_TOKEN_EXPIRES);
}

export function authRequestMatcher(path: string): boolean {
  const authorizeRequests = new Set<string>([AppRoutes.BASKET]);
  return authorizeRequests.has(path);
}
