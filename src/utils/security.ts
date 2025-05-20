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

export function clearCurrentLoggedInUser(): void {
  const loggedUser: string | null = localStorage.getItem(LocalStorageKeys.USER_ID_LOGGED_IN);
  if (loggedUser) localStorage.removeItem(LocalStorageKeys.USER_ID_LOGGED_IN);
}

export function authRequestMatcher(path: string): boolean {
  const authorizeRequests = new Set<string>([AppRoutes.BASKET]);
  return authorizeRequests.has(path);
}

export function userLoggedIn(): boolean {
  const loggedId: string | null = localStorage.getItem(LocalStorageKeys.USER_ID_LOGGED_IN);
  return !!loggedId;
}
