import { APP_BASENAME } from '../config';

const TOKEN_KEY = 'awak_okr_token';
const USER_KEY = 'awak_okr_user';

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  data?: unknown;
}

async function request<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const { data, headers: customHeaders, ...rest } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(customHeaders as Record<string, string>),
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...rest,
    headers,
  };

  if (data !== undefined) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(url, config);

  if (response.status === 401) {
    removeToken();
    window.location.href = `${APP_BASENAME}/login`;
    throw new Error('认证已过期，请重新登录');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: '请求失败' }));
    throw new Error(errorData.error || `请求失败 (${response.status})`);
  }

  return response.json();
}

export const api = {
  get<T>(url: string, options?: RequestOptions): Promise<T> {
    return request<T>(url, { ...options, method: 'GET' });
  },

  post<T>(url: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>(url, { ...options, method: 'POST', data });
  },

  put<T>(url: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>(url, { ...options, method: 'PUT', data });
  },

  del<T>(url: string, options?: RequestOptions): Promise<T> {
    return request<T>(url, { ...options, method: 'DELETE' });
  },
};

export { getToken, setToken, removeToken };
