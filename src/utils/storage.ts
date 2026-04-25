export interface Credentials {
  token: string;
  gistId: string;
}

const STORAGE_KEY = 'tab-manager-creds';

export function saveCredentials(token: string, gistId: string): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, gistId }));
}

export function getCredentials(): Credentials | null {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}

export function clearCredentials(): void {
  localStorage.removeItem(STORAGE_KEY);
}
