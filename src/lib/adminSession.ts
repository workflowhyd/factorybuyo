const STORAGE_KEY = "factorybuyo_admin_token";

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(STORAGE_KEY);
}

export function setAdminToken(token: string) {
  window.localStorage.setItem(STORAGE_KEY, token);
}

export function clearAdminToken() {
  window.localStorage.removeItem(STORAGE_KEY);
}
