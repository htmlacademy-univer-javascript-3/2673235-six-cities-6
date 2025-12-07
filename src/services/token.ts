const AUTH_TOKEN_KEY_NAME = 'six-cities-token';

export function getToken(): string {
  return localStorage.getItem(AUTH_TOKEN_KEY_NAME) ?? '';
}

export function saveToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY_NAME, token);
}

export function dropToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY_NAME);
}
