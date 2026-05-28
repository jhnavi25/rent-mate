import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

let accessToken: string | null = null;

export async function loadToken() {
  accessToken = await SecureStore.getItemAsync('accessToken');
}

export async function setToken(token: string) {
  accessToken = token;
  await SecureStore.setItemAsync('accessToken', token);
}

export async function clearToken() {
  accessToken = null;
  await SecureStore.deleteItemAsync('accessToken');
}

export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message ?? `HTTP ${res.status}`);
  }
  return res.json();
}

export { API_URL };
