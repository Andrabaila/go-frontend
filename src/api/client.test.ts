import { afterEach, describe, expect, it, vi } from 'vitest';

const clearAuthSessionMock = vi.fn();
const getStoredAuthTokenMock = vi.fn();

vi.mock('@/api/auth', () => ({
  clearAuthSession: clearAuthSessionMock,
  getStoredAuthToken: getStoredAuthTokenMock,
}));

describe('apiClient interceptors', () => {
  afterEach(() => {
    clearAuthSessionMock.mockReset();
    getStoredAuthTokenMock.mockReset();
  });

  it('adds bearer token to authorized requests', async () => {
    getStoredAuthTokenMock.mockReturnValue('token-123');

    const { apiClient } = await import('@/api/client');
    const [fulfilled] = apiClient.interceptors.request.handlers;
    const config = await fulfilled?.fulfilled?.({ headers: {} });

    expect(config?.headers.Authorization).toBe('Bearer token-123');
  });

  it('clears auth session on 401 responses', async () => {
    const { apiClient } = await import('@/api/client');
    const [handler] = apiClient.interceptors.response.handlers;

    await expect(
      handler?.rejected?.({
        response: {
          status: 401,
        },
      })
    ).rejects.toEqual({
      response: {
        status: 401,
      },
    });

    expect(clearAuthSessionMock).toHaveBeenCalledTimes(1);
  });
});
