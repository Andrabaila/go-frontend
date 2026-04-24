import type { LoginRequest, RegisterRequest } from '@/types/auth';
import { apiClient } from '@/api/client';

const AUTH_TOKEN_KEY = 'token';
const AUTH_EMAIL_KEY = 'userEmail';

const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  const [, payload] = token.split('.');
  if (!payload) return null;

  try {
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      '='
    );

    return JSON.parse(atob(padded)) as Record<string, unknown>;
  } catch {
    return null;
  }
};

const getEmailFromToken = (token: string): string | null => {
  const payload = decodeJwtPayload(token);
  const email =
    typeof payload?.email === 'string'
      ? payload.email
      : typeof payload?.sub === 'string' && payload.sub.includes('@')
        ? payload.sub
        : null;

  return email;
};

export const persistAuthSession = (token: string, email: string) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_EMAIL_KEY, email);
};

export const clearAuthSession = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_EMAIL_KEY);
};

export const getStoredAuthToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

export const getStoredUserEmail = () => {
  const token = getStoredAuthToken();
  if (!token) {
    clearAuthSession();
    return null;
  }

  const storedEmail = localStorage.getItem(AUTH_EMAIL_KEY);
  if (storedEmail) return storedEmail;

  const emailFromToken = getEmailFromToken(token);
  if (!emailFromToken) return null;

  localStorage.setItem(AUTH_EMAIL_KEY, emailFromToken);
  return emailFromToken;
};

export const loginUser = async (
  data: LoginRequest
): Promise<{ access_token: string }> => {
  const response = await apiClient.post('/auth/login', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  persistAuthSession(response.data.access_token, data.email);
  return response.data;
};

export const registerUser = async (
  data: RegisterRequest
): Promise<{ id: number; email: string }> => {
  const response = await apiClient.post('/auth/register', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};
