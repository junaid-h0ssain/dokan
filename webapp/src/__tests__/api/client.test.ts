import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { apiCall, get, post } from '../../lib/api/client';

describe('API Client', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should make a GET request', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ data: 'test' }),
    });

    const response = await get('/test');

    expect(response.status).toBe(200);
    expect(response.data).toEqual({ data: 'test' });
    expect(response.error).toBeUndefined();
  });

  it('should make a POST request', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ id: '1', name: 'test' }),
    });

    const response = await post('/test', { name: 'test' });

    expect(response.status).toBe(200);
    expect(response.data).toEqual({ id: '1', name: 'test' });
  });

  it('should include auth token in headers', async () => {
    localStorage.setItem('auth_token', 'test-token');

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
    });

    await get('/test');

    const callArgs = (global.fetch as any).mock.calls[0];
    expect(callArgs[1].headers['Authorization']).toBe('Bearer test-token');
  });

  it('should handle error responses', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ message: 'Bad request' }),
    });

    const response = await get('/test');

    expect(response.status).toBe(400);
    expect(response.error).toBe('Bad request');
    expect(response.data).toBeUndefined();
  });

  it('should handle network errors', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

    const response = await get('/test');

    expect(response.status).toBe(0);
    expect(response.error).toBe('Network error');
  });

  it('should handle request timeout', async () => {
    (global.fetch as any).mockImplementationOnce(() =>
      new Promise((_, reject) => {
        const error = new Error('Aborted');
        (error as any).name = 'AbortError';
        reject(error);
      })
    );

    const response = await apiCall('/test', { timeout: 100 });

    expect(response.status).toBe(408);
    expect(response.error).toContain('timeout');
  });
});
