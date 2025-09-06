import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminService } from '../../services/adminService';
import { handleApiError } from '../../services/api';
import type { RootState } from '../index';
import type { User, PaginatedResponse } from '../../types';
import type { 
  AdminUserSearchParams, 
  AdminStats, 
  BidStatistics, 
  PaymentStatistics, 
  UserStatistics 
} from '../../services/adminService';

interface AdminState {
  users: PaginatedResponse<User> | null;
  currentUser: User | null;
  stats: AdminStats | null;
  bidStats: BidStatistics | null;
  paymentStats: PaymentStatistics | null;
  userStats: UserStatistics | null;
  serviceFees: {
    totalFees: number;
    monthlyFees: Array<{
      month: string;
      amount: number;
    }>;
  } | null;
  recentActivity: Array<{
    id: number;
    type: 'USER_REGISTERED' | 'TASK_CREATED' | 'BID_PLACED' | 'PAYMENT_MADE' | 'TASK_COMPLETED';
    description: string;
    userId: number;
    userName: string;
    timestamp: string;
  }> | null;
  platformHealth: {
    status: 'healthy' | 'warning' | 'error';
    uptime: number;
    activeUsers: number;
    errorRate: number;
    averageResponseTime: number;
  } | null;
  systemConfig: {
    maintenanceMode: boolean;
    registrationEnabled: boolean;
    paymentProcessingEnabled: boolean;
    notificationsEnabled: boolean;
    maxTasksPerUser: number;
    maxBidsPerTask: number;
    serviceFeePercentage: number;
  } | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
}

const initialState: AdminState = {
  users: null,
  currentUser: null,
  stats: null,
  bidStats: null,
  paymentStats: null,
  userStats: null,
  serviceFees: null,
  recentActivity: null,
  platformHealth: null,
  systemConfig: null,
  isLoading: false,
  isUpdating: false,
  error: null,
};

// User Management Async Thunks
export const searchUsersAsync = createAsyncThunk(
  'admin/searchUsers',
  async (params: AdminUserSearchParams, { rejectWithValue }) => {
    try {
      return await adminService.searchUsers(params);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const getAllUsersAsync = createAsyncThunk(
  'admin/getAllUsers',
  async ({ page = 0, size = 20 }: { page?: number; size?: number }, { rejectWithValue }) => {
    try {
      return await adminService.getAllUsers(page, size);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const deleteUserAsync = createAsyncThunk(
  'admin/deleteUser',
  async (userId: number, { rejectWithValue }) => {
    try {
      await adminService.deleteUser(userId);
      return userId;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const activateUserAsync = createAsyncThunk(
  'admin/activateUser',
  async (userId: number, { rejectWithValue }) => {
    try {
      return await adminService.activateUser(userId);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const deactivateUserAsync = createAsyncThunk(
  'admin/deactivateUser',
  async (userId: number, { rejectWithValue }) => {
    try {
      return await adminService.deactivateUser(userId);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const getUserByIdAsync = createAsyncThunk(
  'admin/getUserById',
  async (userId: number, { rejectWithValue }) => {
    try {
      return await adminService.getUserById(userId);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Statistics Async Thunks
export const getAdminStatsAsync = createAsyncThunk(
  'admin/getAdminStats',
  async (_, { rejectWithValue }) => {
    try {
      return await adminService.getAdminStats();
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const getBidStatisticsAsync = createAsyncThunk(
  'admin/getBidStatistics',
  async (_, { rejectWithValue }) => {
    try {
      return await adminService.getBidStatistics();
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const getPaymentStatisticsAsync = createAsyncThunk(
  'admin/getPaymentStatistics',
  async (_, { rejectWithValue }) => {
    try {
      return await adminService.getPaymentStatistics();
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const getUserStatisticsAsync = createAsyncThunk(
  'admin/getUserStatistics',
  async (_, { rejectWithValue }) => {
    try {
      return await adminService.getUserStatistics();
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const getServiceFeesAsync = createAsyncThunk(
  'admin/getServiceFees',
  async (_, { rejectWithValue }) => {
    try {
      return await adminService.getServiceFees();
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const getRecentActivityAsync = createAsyncThunk(
  'admin/getRecentActivity',
  async (limit: number = 10, { rejectWithValue }) => {
    try {
      return await adminService.getRecentActivity(limit);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const getPlatformHealthAsync = createAsyncThunk(
  'admin/getPlatformHealth',
  async (_, { rejectWithValue }) => {
    try {
      return await adminService.getPlatformHealth();
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const getSystemConfigAsync = createAsyncThunk(
  'admin/getSystemConfig',
  async (_, { rejectWithValue }) => {
    try {
      return await adminService.getSystemConfig();
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const updateSystemConfigAsync = createAsyncThunk(
  'admin/updateSystemConfig',
  async (config: {
    maintenanceMode?: boolean;
    registrationEnabled?: boolean;
    paymentProcessingEnabled?: boolean;
    notificationsEnabled?: boolean;
    maxTasksPerUser?: number;
    maxBidsPerTask?: number;
    serviceFeePercentage?: number;
  }, { rejectWithValue }) => {
    try {
      await adminService.updateSystemConfig(config);
      return config;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
    clearUsers: (state) => {
      state.users = null;
    },
  },
  extraReducers: (builder) => {
    // Search users
    builder
      .addCase(searchUsersAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchUsersAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(searchUsersAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get all users
    builder
      .addCase(getAllUsersAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllUsersAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsersAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete user
    builder
      .addCase(deleteUserAsync.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(deleteUserAsync.fulfilled, (state, action) => {
        state.isUpdating = false;
        if (state.users) {
          state.users.content = state.users.content.filter(user => user.id !== action.payload);
          state.users.totalElements -= 1;
        }
        if (state.currentUser?.id === action.payload) {
          state.currentUser = null;
        }
      })
      .addCase(deleteUserAsync.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });

    // Activate user
    builder
      .addCase(activateUserAsync.fulfilled, (state, action) => {
        if (state.users) {
          const index = state.users.content.findIndex(user => user.id === action.payload.id);
          if (index !== -1) {
            state.users.content[index] = action.payload;
          }
        }
        if (state.currentUser?.id === action.payload.id) {
          state.currentUser = action.payload;
        }
      });

    // Deactivate user
    builder
      .addCase(deactivateUserAsync.fulfilled, (state, action) => {
        if (state.users) {
          const index = state.users.content.findIndex(user => user.id === action.payload.id);
          if (index !== -1) {
            state.users.content[index] = action.payload;
          }
        }
        if (state.currentUser?.id === action.payload.id) {
          state.currentUser = action.payload;
        }
      });

    // Get user by ID
    builder
      .addCase(getUserByIdAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserByIdAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload;
      })
      .addCase(getUserByIdAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Statistics
    builder
      .addCase(getAdminStatsAsync.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(getBidStatisticsAsync.fulfilled, (state, action) => {
        state.bidStats = action.payload;
      })
      .addCase(getPaymentStatisticsAsync.fulfilled, (state, action) => {
        state.paymentStats = action.payload;
      })
      .addCase(getUserStatisticsAsync.fulfilled, (state, action) => {
        state.userStats = action.payload;
      })
      .addCase(getServiceFeesAsync.fulfilled, (state, action) => {
        state.serviceFees = action.payload;
      })
      .addCase(getRecentActivityAsync.fulfilled, (state, action) => {
        state.recentActivity = action.payload;
      })
      .addCase(getPlatformHealthAsync.fulfilled, (state, action) => {
        state.platformHealth = action.payload;
      })
      .addCase(getSystemConfigAsync.fulfilled, (state, action) => {
        state.systemConfig = action.payload;
      })
      .addCase(updateSystemConfigAsync.fulfilled, (state, action) => {
        if (state.systemConfig) {
          state.systemConfig = { ...state.systemConfig, ...action.payload };
        }
      });
  },
});

export const { clearError, clearCurrentUser, clearUsers } = adminSlice.actions;

// Selectors
export const selectAdmin = (state: RootState) => state.admin;
export const selectAdminUsers = (state: RootState) => state.admin.users;
export const selectCurrentAdminUser = (state: RootState) => state.admin.currentUser;
export const selectAdminStats = (state: RootState) => state.admin.stats;
export const selectBidStats = (state: RootState) => state.admin.bidStats;
export const selectPaymentStats = (state: RootState) => state.admin.paymentStats;
export const selectUserStats = (state: RootState) => state.admin.userStats;
export const selectServiceFees = (state: RootState) => state.admin.serviceFees;
export const selectRecentActivity = (state: RootState) => state.admin.recentActivity;
export const selectPlatformHealth = (state: RootState) => state.admin.platformHealth;
export const selectSystemConfig = (state: RootState) => state.admin.systemConfig;
export const selectAdminLoading = (state: RootState) => state.admin.isLoading;
export const selectAdminUpdating = (state: RootState) => state.admin.isUpdating;
export const selectAdminError = (state: RootState) => state.admin.error;

export default adminSlice.reducer;
