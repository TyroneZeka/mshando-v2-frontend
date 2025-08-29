import { userApi, TokenManager } from './api';
import type { 
  User, 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  TokenValidationResponse,
  ApiResponse 
} from '../types';

export class AuthService {
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await userApi.post<AuthResponse>('/auth/login', credentials);
    const data = response.data;
    
    if (data.token) {
      TokenManager.setToken(data.token);
      if (data.refreshToken) {
        TokenManager.setRefreshToken(data.refreshToken);
      }
    }
    
    return data;
  }

  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await userApi.post<AuthResponse>('/auth/register', userData);
    return response.data;
  }

  static async validateToken(): Promise<TokenValidationResponse> {
    const response = await userApi.get<TokenValidationResponse>('/auth/validate');
    return response.data;
  }

  static async refreshToken(): Promise<AuthResponse> {
    const refreshToken = TokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await userApi.post<AuthResponse>('/auth/refresh', {
      refreshToken,
    });
    
    const data = response.data;
    if (data.token) {
      TokenManager.setToken(data.token);
      if (data.refreshToken) {
        TokenManager.setRefreshToken(data.refreshToken);
      }
    }
    
    return data;
  }

  static async getCurrentUser(): Promise<User> {
    const response = await userApi.get<User>('/users/me');
    return response.data;
  }

  static async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await userApi.put<User>('/users/me', userData);
    return response.data;
  }

  static async verifyEmail(token: string): Promise<ApiResponse> {
    const response = await userApi.get<ApiResponse>(`/auth/verify-email?token=${token}`);
    return response.data;
  }

  static async resendVerification(email: string): Promise<ApiResponse> {
    const response = await userApi.post<ApiResponse>('/auth/resend-verification', { email });
    return response.data;
  }

  static async checkVerificationStatus(email: string): Promise<{ email: string; verified: boolean }> {
    const response = await userApi.get(`/auth/verification-status?email=${email}`);
    return response.data;
  }

  static logout(): void {
    TokenManager.clearTokens();
  }

  static isAuthenticated(): boolean {
    const token = TokenManager.getToken();
    if (!token) {
      return false;
    }
    
    if (TokenManager.isTokenExpired(token)) {
      // Token is expired, clear it
      TokenManager.clearTokens();
      return false;
    }
    
    return true;
  }

  static getToken(): string | null {
    return TokenManager.getToken();
  }

  static clearAuthState(): void {
    TokenManager.clearTokens();
  }
}
