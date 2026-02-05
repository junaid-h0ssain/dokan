import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fc from 'fast-check';
import { apiCall, get, post, addRequestInterceptor, addResponseInterceptor, clearInterceptors } from '../../lib/api/client';

describe('API Client', () => {
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value.toString();
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };
  })();

  beforeEach(() => {
    // Mock localStorage
    Object.defineProperty(global, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  afterEach(() => {
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

  // Property 49: API Error Display
  // Validates: Requirements 13.1, 13.2
  // WHEN an API request fails, THE System SHALL display a user-friendly error message
  // WHEN a network error occurs, THE System SHALL display a message indicating the connection issue
  it('should display user-friendly error messages for API failures', () => {
    // Test HTTP error with message
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      json: () => Promise.resolve({ message: 'Invalid input data' }),
    });

    return get('/test').then(response => {
      expect(response.status).toBe(400);
      expect(response.error).toBe('Invalid input data');
      expect(typeof response.error).toBe('string');
      expect(response.data).toBeUndefined();
    });
  });

  it('should display user-friendly error messages for network failures', () => {
    // Test network error
    (global.fetch as any).mockRejectedValueOnce(new Error('Connection failed'));

    return get('/test').then(response => {
      expect(response.status).toBe(0);
      expect(response.error).toBe('Connection failed');
      expect(typeof response.error).toBe('string');
      expect(response.data).toBeUndefined();
    });
  });

  it('should display user-friendly error messages for timeout failures', () => {
    // Test timeout error
    (global.fetch as any).mockImplementationOnce(() =>
      new Promise((_, reject) => {
        const error = new Error('Aborted');
        (error as any).name = 'AbortError';
        reject(error);
      })
    );

    return apiCall('/test', { timeout: 100 }).then(response => {
      expect(response.status).toBe(408);
      expect(response.error).toContain('timeout');
      expect(response.error).toContain('try again');
      expect(typeof response.error).toBe('string');
      expect(response.data).toBeUndefined();
    });
  });

  it('should apply request interceptors', async () => {
    let interceptorCalled = false;
    addRequestInterceptor(async (config) => {
      interceptorCalled = true;
      config.headers['X-Test'] = 'intercepted';
      return config;
    });

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
    });

    await get('/test');

    expect(interceptorCalled).toBe(true);
    const callArgs = (global.fetch as any).mock.calls[0];
    expect(callArgs[1].headers['X-Test']).toBe('intercepted');

    clearInterceptors();
  });

  it('should apply response interceptors', async () => {
    let interceptorCalled = false;
    addResponseInterceptor(async (response) => {
      interceptorCalled = true;
      if (response.status === 401) {
        response.error = 'Custom 401 error';
      }
      return response;
    });

    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ message: 'Unauthorized' }),
    });

    const response = await get('/test');

    expect(interceptorCalled).toBe(true);
    expect(response.error).toBe('Custom 401 error');

    clearInterceptors();
  });
});
