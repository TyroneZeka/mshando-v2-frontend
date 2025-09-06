import { userApi, biddingApi, paymentApi } from './api';
import type { User, PaginatedResponse } from '../types';

export interface AdminUserSearchParams {
  username?: string;
  email?: string;
  role?: 'CUSTOMER' | 'TASKER' | 'ADMIN';
  active?: boolean;
  page?: number;
  size?: number;
}

export interface AdminStats {
  totalUsers: number;
  totalCustomers: number;
  totalTaskers: number;
  totalTasks: number;
  totalActiveTasks: number;
  totalCompletedTasks: number;
  totalBids: number;
  totalActiveBids: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

export interface BidStatistics {
  totalBids: number;
  pendingBids: number;
  acceptedBids: number;
  rejectedBids: number;
  averageBidAmount: number;
  bidsByCategory: Array<{
    categoryName: string;
    bidCount: number;
    averageAmount: number;
  }>;
  bidsTrend: Array<{
    date: string;
    count: number;
    amount: number;
  }>;
}

export interface PaymentStatistics {
  totalPayments: number;
  totalAmount: number;
  totalServiceFees: number;
  averageTaskValue: number;
  monthlyRevenue: Array<{
    month: string;
    amount: number;
    fees: number;
  }>;
  paymentsByStatus: Array<{
    status: string;
    count: number;
    amount: number;
  }>;
}

export interface UserStatistics {
  totalUsers: number;
  newUsersThisMonth: number;
  usersByRole: Array<{
    role: string;
    count: number;
  }>;
  userRegistrationTrend: Array<{
    date: string;
    count: number;
  }>;
  topTaskers: Array<{
    user: User;
    completedTasks: number;
    averageRating: number;
    totalEarnings: number;
  }>;
  topCustomers: Array<{
    user: User;
    createdTasks: number;
    totalSpent: number;
  }>;
}

interface ActivityMetadata {
  taskId?: number;
  bidId?: number;
  paymentId?: number;
  amount?: number;
  status?: string;
  [key: string]: unknown;
}

class AdminService {
  // User Management
  async searchUsers(params?: AdminUserSearchParams): Promise<PaginatedResponse<User>> {
    const queryParams = new URLSearchParams();
    
    if (params?.username) queryParams.append('username', params.username);
    if (params?.email) queryParams.append('email', params.email);
    if (params?.role) queryParams.append('role', params.role);
    if (params?.active !== undefined) queryParams.append('active', params.active.toString());
    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.size !== undefined) queryParams.append('size', params.size.toString());

    const response = await userApi.get(`/users/search?${queryParams.toString()}`);
    return response.data;
  }

  async getAllUsers(page: number = 0, size: number = 20): Promise<PaginatedResponse<User>> {
    const response = await userApi.get(`/users?page=${page}&size=${size}`);
    return response.data;
  }

  async deleteUser(userId: number): Promise<void> {
    await userApi.delete(`/users/${userId}`);
  }

  async activateUser(userId: number): Promise<User> {
    const response = await userApi.patch(`/users/${userId}/activate`);
    return response.data;
  }

  async deactivateUser(userId: number): Promise<User> {
    const response = await userApi.patch(`/users/${userId}/deactivate`);
    return response.data;
  }

  async getUserById(userId: number): Promise<User> {
    const response = await userApi.get(`/users/${userId}`);
    return response.data;
  }

  // Admin Statistics
  async getAdminStats(): Promise<AdminStats> {
    const response = await userApi.get('/admin/statistics');
    return response.data;
  }

  async getBidStatistics(): Promise<BidStatistics> {
    const response = await biddingApi.get('/bids/statistics');
    return response.data;
  }

  async getPaymentStatistics(): Promise<PaymentStatistics> {
    const response = await paymentApi.get('/payments/statistics');
    return response.data;
  }

  async getUserStatistics(): Promise<UserStatistics> {
    const response = await userApi.get('/users/statistics');
    return response.data;
  }

  // Service Fees
  async getServiceFees(): Promise<{
    totalFees: number;
    monthlyFees: Array<{
      month: string;
      amount: number;
    }>;
  }> {
    const response = await paymentApi.get('/payments/service-fees');
    return response.data;
  }

  // Platform Health
  async getPlatformHealth(): Promise<{
    status: 'healthy' | 'warning' | 'error';
    uptime: number;
    activeUsers: number;
    errorRate: number;
    averageResponseTime: number;
  }> {
    const response = await userApi.get('/admin/health');
    return response.data;
  }

  // Recent Activity
  async getRecentActivity(limit: number = 10): Promise<Array<{
    id: number;
    type: 'USER_REGISTERED' | 'TASK_CREATED' | 'BID_PLACED' | 'PAYMENT_MADE' | 'TASK_COMPLETED';
    description: string;
    userId: number;
    userName: string;
    timestamp: string;
    metadata?: ActivityMetadata;
  }>> {
    const response = await userApi.get(`/admin/activity?limit=${limit}`);
    return response.data;
  }

  // System Configuration
  async getSystemConfig(): Promise<{
    maintenanceMode: boolean;
    registrationEnabled: boolean;
    paymentProcessingEnabled: boolean;
    notificationsEnabled: boolean;
    maxTasksPerUser: number;
    maxBidsPerTask: number;
    serviceFeePercentage: number;
  }> {
    const response = await userApi.get('/admin/config');
    return response.data;
  }

  async updateSystemConfig(config: {
    maintenanceMode?: boolean;
    registrationEnabled?: boolean;
    paymentProcessingEnabled?: boolean;
    notificationsEnabled?: boolean;
    maxTasksPerUser?: number;
    maxBidsPerTask?: number;
    serviceFeePercentage?: number;
  }): Promise<void> {
    await userApi.patch('/admin/config', config);
  }
}

export const adminService = new AdminService();
