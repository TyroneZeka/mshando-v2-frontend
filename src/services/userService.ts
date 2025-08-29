import { userApi } from './api';
import type { User } from '../types';

export interface UpdateProfileRequest {
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  bio?: string;
  skills?: string[];
  hourlyRate?: number;
  location?: string;
}

export interface UserProfile extends User {
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

class UserService {
  async getCurrentUser(): Promise<UserProfile> {
    const response = await userApi.get('/users/me');
    return response.data;
  }

  async updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    const response = await userApi.put('/users/me', data);
    return response.data;
  }

  async deleteAccount(): Promise<void> {
    await userApi.delete('/users/me');
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await userApi.post('/users/me/change-password', {
      currentPassword,
      newPassword,
    });
  }
}

export const userService = new UserService();
