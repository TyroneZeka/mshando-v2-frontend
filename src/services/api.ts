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

      // Handle specific error status codes
      const status = error.response?.status;
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      
      switch (status) {
        case 400:
          // Bad Request - usually validation errors
          toast.error(errorMessage || 'Invalid request data');
          break;
        case 401:
          // Unauthorized - handled above for token refresh
          if (!originalRequest._retry) {
            toast.error('Please log in to continue');
          }
          break;
        case 403:
          // Forbidden
          toast.error('You do not have permission to perform this action');
          break;
        case 404:
          // Not Found
          if (error.config?.url?.includes('/auth/')) {
            toast.error('Invalid username or password');
          } else {
            toast.error('The requested resource was not found');
          }
          break;
        case 409:
          // Conflict - usually duplicate data
          toast.error(errorMessage || 'This data already exists');
          break;
        case 422:
          // Unprocessable Entity - validation errors
          toast.error(errorMessage || 'Validation error');
          break;
        case 500:
          // Internal Server Error
          toast.error('Server error. Please try again later');
          break;
        case 502:
        case 503:
        case 504:
          // Bad Gateway, Service Unavailable, Gateway Timeout
          toast.error('Service temporarily unavailable. Please try again later');
          break;
        default:
          // Other errors
          if (errorMessage) {
            toast.error(errorMessage);
          } else {
            toast.error('An unexpected error occurred');
          }
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
    const status = error.response?.status;
    const message = error.response?.data?.message || error.response?.data?.error;
    
    // Return specific messages based on status code
    switch (status) {
      case 400:
        return message || 'Invalid request data';
      case 401:
        return 'Authentication required';
      case 403:
        return 'Access denied';
      case 404:
        return message || 'Resource not found';
      case 409:
        return message || 'Data conflict - resource already exists';
      case 422:
        return message || 'Validation failed';
      case 500:
        return 'Internal server error';
      case 502:
      case 503:
      case 504:
        return 'Service temporarily unavailable';
      default:
        return message || error.message || 'Network error occurred';
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};
