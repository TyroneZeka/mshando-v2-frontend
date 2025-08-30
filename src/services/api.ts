import axios from 'axios';
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'react-hot-toast';

// API configuration
export const API_CONFIG = {
  USER_SERVICE_URL: 'http://localhost:8080/api',
  TASK_SERVICE_URL: 'http://localhost:8080/api',
  BIDDING_SERVICE_URL: 'http://localhost:8080/api',
  PAYMENT_SERVICE_URL: 'http://localhost:8080/api',
  NOTIFICATION_SERVICE_URL: 'http://localhost:8080/api',
};

// Token management
class TokenManager {
  private static readonly TOKEN_KEY = 'mshando_token';
  private static readonly REFRESH_TOKEN_KEY = 'mshando_refresh_token';

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static setRefreshToken(refreshToken: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  static clearTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  }
}

// Create axios instances for each service
const createApiInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add auth token
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Don't add auth token to auth endpoints (login, register, etc.)
      const isAuthEndpoint = config.url?.includes('/auth/');
      
      if (!isAuthEndpoint) {
        const token = TokenManager.getToken();
        if (token && !TokenManager.isTokenExpired(token)) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for token refresh and error handling
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = TokenManager.getRefreshToken();
          if (refreshToken) {
            const response = await axios.post(`${API_CONFIG.USER_SERVICE_URL}/auth/refresh`, {
              refreshToken,
            });

            const { token: newToken, refreshToken: newRefreshToken } = response.data;
            TokenManager.setToken(newToken);
            if (newRefreshToken) {
              TokenManager.setRefreshToken(newRefreshToken);
            }

            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return instance(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed, redirect to login
          TokenManager.clearTokens();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      // Handle other errors
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('An unexpected error occurred');
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// API instances
export const userApi = createApiInstance(API_CONFIG.USER_SERVICE_URL);
export const taskApi = createApiInstance(API_CONFIG.TASK_SERVICE_URL);
export const biddingApi = createApiInstance(API_CONFIG.BIDDING_SERVICE_URL);
export const paymentApi = createApiInstance(API_CONFIG.PAYMENT_SERVICE_URL);
export const notificationApi = createApiInstance(API_CONFIG.NOTIFICATION_SERVICE_URL);

// Export token manager for use in components
export { TokenManager };

// Utility function to handle API errors
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    if (error.message) {
      return error.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};
