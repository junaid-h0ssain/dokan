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

export interface RequestInterceptor {
  (config: RequestConfig): Promise<RequestConfig> | RequestConfig;
}

export interface ResponseInterceptor {
  (response: ApiResponse<any>): Promise<ApiResponse<any>> | ApiResponse<any>;
}

export interface RequestConfig {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: string;
  signal?: AbortSignal;
}

const DEFAULT_TIMEOUT = 5000;
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

let requestInterceptors: RequestInterceptor[] = [];
let responseInterceptors: ResponseInterceptor[] = [];

function getAuthToken(): string | null {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
}

function setAuthToken(token: string): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
}

function clearAuthToken(): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
}

// Interceptor management
export function addRequestInterceptor(interceptor: RequestInterceptor): void {
  requestInterceptors.push(interceptor);
}

export function addResponseInterceptor(interceptor: ResponseInterceptor): void {
  responseInterceptors.push(interceptor);
}

export function clearInterceptors(): void {
  requestInterceptors = [];
  responseInterceptors = [];
}

// Default request interceptor for JWT token
addRequestInterceptor(async (config) => {
  const token = getAuthToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Default response interceptor for token refresh and error handling
addResponseInterceptor(async (response) => {
  // Handle 401 Unauthorized - token might be expired
  if (response.status === 401) {
    clearAuthToken();
    // Could trigger logout here if needed
  }
  return response;
});

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

  const finalHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  // Prepare request config
  let requestConfig: RequestConfig = {
    url,
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
    signal: controller.signal,
  };

  // Apply request interceptors
  for (const interceptor of requestInterceptors) {
    requestConfig = await interceptor(requestConfig);
  }

  try {
    const response = await fetch(requestConfig.url, {
      method: requestConfig.method,
      headers: requestConfig.headers,
      body: requestConfig.body,
      signal: requestConfig.signal,
    });

    clearTimeout(timeoutId);

    let apiResponse: ApiResponse<T>;

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      apiResponse = {
        error: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
      };
    } else {
      const data = await response.json();
      apiResponse = { data, status: response.status };
    }

    // Apply response interceptors
    for (const interceptor of responseInterceptors) {
      apiResponse = await interceptor(apiResponse);
    }

    return apiResponse;
  } catch (error) {
    clearTimeout(timeoutId);

    let apiResponse: ApiResponse<T>;

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        apiResponse = {
          error: 'Request timeout. Please try again.',
          status: 408,
        };
      } else {
        apiResponse = {
          error: error.message || 'Network error occurred. Please check your connection.',
          status: 0,
        };
      }
    } else {
      apiResponse = {
        error: 'Unknown error occurred',
        status: 0,
      };
    }

    // Apply response interceptors even for errors
    for (const interceptor of responseInterceptors) {
      apiResponse = await interceptor(apiResponse);
    }

    return apiResponse;
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

// Token management utilities
export { getAuthToken, setAuthToken, clearAuthToken };
