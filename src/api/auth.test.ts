import { beforeEach, describe, expect, it } from 'vitest';
import {
  clearAuthSession,
  getStoredAuthToken,
  getStoredUserEmail,
  persistAuthSession,
} from '@/api/auth';

const createJwt = (payload: Record<string, unknown>) => {
  const encode = (value: string) =>
    btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');

  return `${encode('{"alg":"none","typ":"JWT"}')}.${encode(JSON.stringify(payload))}.signature`;
};

describe('auth session storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('persists auth token and email', () => {
    persistAuthSession('token-123', 'player@example.com');

    expect(getStoredAuthToken()).toBe('token-123');
    expect(getStoredUserEmail()).toBe('player@example.com');
  });

  it('restores email from token payload when localStorage has old session format', () => {
    const token = createJwt({ email: 'legacy@example.com' });
    localStorage.setItem('token', token);

    expect(getStoredUserEmail()).toBe('legacy@example.com');
    expect(localStorage.getItem('userEmail')).toBe('legacy@example.com');
  });

  it('clears orphaned email when token is missing', () => {
    localStorage.setItem('userEmail', 'stale@example.com');

    expect(getStoredUserEmail()).toBeNull();
    expect(localStorage.getItem('userEmail')).toBeNull();
  });

  it('removes token and email on clear', () => {
    persistAuthSession('token-123', 'player@example.com');

    clearAuthSession();

    expect(getStoredAuthToken()).toBeNull();
    expect(getStoredUserEmail()).toBeNull();
  });
});
