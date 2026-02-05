import { writable } from 'svelte/store';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

function createAuthStore() {
  const initialState: AuthState = {
    user: null,
    token: localStorage.getItem('auth_token'),
    isLoading: false,
    error: null,
  };

  const { subscribe, set, update } = writable<AuthState>(initialState);

  return {
    subscribe,
    setUser: (user: User | null) => update(state => ({ ...state, user })),
    setToken: (token: string | null) => {
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }
      update(state => ({ ...state, token }));
    },
    setLoading: (isLoading: boolean) => update(state => ({ ...state, isLoading })),
    setError: (error: string | null) => update(state => ({ ...state, error })),
    clearError: () => update(state => ({ ...state, error: null })),
    logout: () => {
      localStorage.removeItem('auth_token');
      set({ user: null, token: null, isLoading: false, error: null });
    },
  };
}

export const authStore = createAuthStore();
