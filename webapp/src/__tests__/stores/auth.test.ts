import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { authStore } from '../../lib/stores/auth';

describe('authStore', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should initialize with null user and token', () => {
    let state;
    const unsubscribe = authStore.subscribe(s => {
      state = s;
    });

    expect(state?.user).toBeNull();
    expect(state?.token).toBeNull();
    expect(state?.isLoading).toBe(false);
    expect(state?.error).toBeNull();

    unsubscribe();
  });

  it('should set user and token', () => {
    let state;
    const unsubscribe = authStore.subscribe(s => {
      state = s;
    });

    const testUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    };

    authStore.setUser(testUser);
    authStore.setToken('test-token');

    expect(state?.user).toEqual(testUser);
    expect(state?.token).toEqual('test-token');
    expect(localStorage.getItem('auth_token')).toBe('test-token');

    unsubscribe();
  });

  it('should clear token on logout', () => {
    let state;
    const unsubscribe = authStore.subscribe(s => {
      state = s;
    });

    authStore.setToken('test-token');
    expect(localStorage.getItem('auth_token')).toBe('test-token');

    authStore.logout();

    expect(state?.user).toBeNull();
    expect(state?.token).toBeNull();
    expect(localStorage.getItem('auth_token')).toBeNull();

    unsubscribe();
  });

  it('should set and clear error', () => {
    let state;
    const unsubscribe = authStore.subscribe(s => {
      state = s;
    });

    authStore.setError('Test error');
    expect(state?.error).toBe('Test error');

    authStore.clearError();
    expect(state?.error).toBeNull();

    unsubscribe();
  });
});
