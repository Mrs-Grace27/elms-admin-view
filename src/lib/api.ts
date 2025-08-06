// Core API configuration and utilities
export const API_BASE_URL = 'https://api.mykey.com/v1/api';

export interface ApiResponse<T = any> {
  data?: T;
  error?: boolean;
  message?: string;
  code?: string;
  details?: any;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public code?: string,
    public details?: any,
    message?: string
  ) {
    super(message || 'API Error');
    this.name = 'ApiError';
  }
}

export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string>;
}

export const createApiClient = () => {
  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const buildUrl = (endpoint: string, params?: Record<string, string>) => {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, value.toString());
        }
      });
    }
    return url.toString();
  };

  const handleResponse = async <T>(response: Response): Promise<T> => {
    const contentType = response.headers.get('content-type');
    let data: any;

    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new ApiError(
        response.status,
        data?.code,
        data?.details,
        data?.message || `HTTP ${response.status}`
      );
    }

    return data;
  };

  const request = async <T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> => {
    const { method = 'GET', headers = {}, body, params } = config;
    const url = buildUrl(endpoint, params);

    const fetchOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...headers,
      },
    };

    if (body && method !== 'GET') {
      if (body instanceof FormData) {
        // Remove Content-Type header for FormData to let browser set it with boundary
        delete fetchOptions.headers!['Content-Type'];
        fetchOptions.body = body;
      } else {
        fetchOptions.body = JSON.stringify(body);
      }
    }

    const response = await fetch(url, fetchOptions);
    return handleResponse<T>(response);
  };

  return { request, getAuthHeaders, buildUrl };
};

export const api = createApiClient();