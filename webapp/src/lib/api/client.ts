export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

const DEFAULT_TIMEOUT = 5000;
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

export async function apiCall<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const {
    method = 'GET',
    headers = {},
    body,
    timeout = DEFAULT_TIMEOUT,
  } = options;

  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const finalHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (token) {
    finalHeaders['Authorization'] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method,
      headers: finalHeaders,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        error: errorData.message || `HTTP ${response.status}`,
        status: response.status,
      };
    }

    const data = await response.json();
    return { data, status: response.status };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          error: 'Request timeout. Please try again.',
          status: 408,
        };
      }
      return {
        error: error.message || 'Network error',
        status: 0,
      };
    }

    return {
      error: 'Unknown error occurred',
      status: 0,
    };
  }
}

export async function get<T>(endpoint: string): Promise<ApiResponse<T>> {
  return apiCall<T>(endpoint, { method: 'GET' });
}

export async function post<T>(
  endpoint: string,
  body: unknown
): Promise<ApiResponse<T>> {
  return apiCall<T>(endpoint, { method: 'POST', body });
}

export async function put<T>(
  endpoint: string,
  body: unknown
): Promise<ApiResponse<T>> {
  return apiCall<T>(endpoint, { method: 'PUT', body });
}

export async function del<T>(endpoint: string): Promise<ApiResponse<T>> {
  return apiCall<T>(endpoint, { method: 'DELETE' });
}
