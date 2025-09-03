import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import type {
  Notification,
  PaginatedResponse
} from '../../types';
import notificationService, {
  type EmailNotificationRequest,
  type TaskNotificationData,
  type PaymentNotificationData
} from '../../services/notificationService';

// Async thunks
export const sendEmailNotificationAsync = createAsyncThunk(
  'notifications/sendEmailNotification',
  async (emailData: EmailNotificationRequest, { rejectWithValue }) => {
    try {
      const notification = await notificationService.sendEmailNotification(emailData);
      return notification;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to send email notification');
    }
  }
);

export const sendTaskNotificationAsync = createAsyncThunk(
  'notifications/sendTaskNotification',
  async (taskData: TaskNotificationData, { rejectWithValue }) => {
    try {
      const notification = await notificationService.sendTaskNotification(taskData);
      return notification;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to send task notification');
    }
  }
);

export const sendPaymentNotificationAsync = createAsyncThunk(
  'notifications/sendPaymentNotification',
  async (paymentData: PaymentNotificationData, { rejectWithValue }) => {
    try {
      const notification = await notificationService.sendPaymentNotification(paymentData);
      return notification;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to send payment notification');
    }
  }
);

export const getNotificationsByRecipientAsync = createAsyncThunk(
  'notifications/getNotificationsByRecipient',
  async ({ recipientId, page = 0, size = 20 }: { recipientId: number; page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const notifications = await notificationService.getNotificationsByRecipient(recipientId, page, size);
      return notifications;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch notifications');
    }
  }
);

export const markNotificationAsReadAsync = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId: number, { rejectWithValue }) => {
    try {
      const notification = await notificationService.markAsRead(notificationId);
      return notification;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to mark notification as read');
    }
  }
);

export const markAllNotificationsAsReadAsync = createAsyncThunk(
  'notifications/markAllAsRead',
  async (recipientId: number, { rejectWithValue }) => {
    try {
      await notificationService.markAllAsRead(recipientId);
      return recipientId;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to mark all notifications as read');
    }
  }
);

export const getUnreadNotificationCountAsync = createAsyncThunk(
  'notifications/getUnreadCount',
  async (recipientId: number, { rejectWithValue }) => {
    try {
      const count = await notificationService.getUnreadCount(recipientId);
      return count;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch unread notification count');
    }
  }
);

export const deleteNotificationAsync = createAsyncThunk(
  'notifications/deleteNotification',
  async (notificationId: number, { rejectWithValue }) => {
    try {
      await notificationService.deleteNotification(notificationId);
      return notificationId;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to delete notification');
    }
  }
);

interface NotificationState {
  notifications: PaginatedResponse<Notification> | null;
  recentNotifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  isSending: boolean;
  isMarkingRead: boolean;
  isDeleting: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: null,
  recentNotifications: [],
  unreadCount: 0,
  isLoading: false,
  isSending: false,
  isMarkingRead: false,
  isDeleting: false,
  error: null,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearNotifications: (state) => {
      state.notifications = null;
      state.recentNotifications = [];
    },
    addRecentNotification: (state, action) => {
      state.recentNotifications.unshift(action.payload);
      // Keep only the 10 most recent notifications
      state.recentNotifications = state.recentNotifications.slice(0, 10);
      state.unreadCount += 1;
    },
    removeNotification: (state, action) => {
      const notificationId = action.payload;
      state.recentNotifications = state.recentNotifications.filter(n => n.id !== notificationId);
      if (state.notifications) {
        state.notifications.content = state.notifications.content.filter(n => n.id !== notificationId);
      }
    },
  },
  extraReducers: (builder) => {
    // Send email notification
    builder
      .addCase(sendEmailNotificationAsync.pending, (state) => {
        state.isSending = true;
        state.error = null;
      })
      .addCase(sendEmailNotificationAsync.fulfilled, (state, action) => {
        state.isSending = false;
        state.recentNotifications.unshift(action.payload);
        state.recentNotifications = state.recentNotifications.slice(0, 10);
      })
      .addCase(sendEmailNotificationAsync.rejected, (state, action) => {
        state.isSending = false;
        state.error = action.payload as string;
      });

    // Send task notification
    builder
      .addCase(sendTaskNotificationAsync.pending, (state) => {
        state.isSending = true;
        state.error = null;
      })
      .addCase(sendTaskNotificationAsync.fulfilled, (state, action) => {
        state.isSending = false;
        state.recentNotifications.unshift(action.payload);
        state.recentNotifications = state.recentNotifications.slice(0, 10);
      })
      .addCase(sendTaskNotificationAsync.rejected, (state, action) => {
        state.isSending = false;
        state.error = action.payload as string;
      });

    // Send payment notification
    builder
      .addCase(sendPaymentNotificationAsync.pending, (state) => {
        state.isSending = true;
        state.error = null;
      })
      .addCase(sendPaymentNotificationAsync.fulfilled, (state, action) => {
        state.isSending = false;
        state.recentNotifications.unshift(action.payload);
        state.recentNotifications = state.recentNotifications.slice(0, 10);
      })
      .addCase(sendPaymentNotificationAsync.rejected, (state, action) => {
        state.isSending = false;
        state.error = action.payload as string;
      });

    // Get notifications by recipient
    builder
      .addCase(getNotificationsByRecipientAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getNotificationsByRecipientAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload;
      })
      .addCase(getNotificationsByRecipientAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Mark notification as read
    builder
      .addCase(markNotificationAsReadAsync.pending, (state) => {
        state.isMarkingRead = true;
        state.error = null;
      })
      .addCase(markNotificationAsReadAsync.fulfilled, (state, action) => {
        state.isMarkingRead = false;
        const updatedNotification = action.payload;
        
        // Update in recent notifications
        const recentIndex = state.recentNotifications.findIndex(n => n.id === updatedNotification.id);
        if (recentIndex !== -1 && !state.recentNotifications[recentIndex].readAt) {
          state.recentNotifications[recentIndex] = updatedNotification;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        
        // Update in main notifications
        if (state.notifications) {
          const mainIndex = state.notifications.content.findIndex(n => n.id === updatedNotification.id);
          if (mainIndex !== -1) {
            state.notifications.content[mainIndex] = updatedNotification;
          }
        }
      })
      .addCase(markNotificationAsReadAsync.rejected, (state, action) => {
        state.isMarkingRead = false;
        state.error = action.payload as string;
      });

    // Mark all notifications as read
    builder
      .addCase(markAllNotificationsAsReadAsync.pending, (state) => {
        state.isMarkingRead = true;
        state.error = null;
      })
      .addCase(markAllNotificationsAsReadAsync.fulfilled, (state) => {
        state.isMarkingRead = false;
        state.unreadCount = 0;
        
        // Mark all recent notifications as read
        state.recentNotifications = state.recentNotifications.map(n => ({ ...n, readAt: new Date().toISOString() }));
        
        // Mark all main notifications as read
        if (state.notifications) {
          state.notifications.content = state.notifications.content.map(n => ({ ...n, readAt: new Date().toISOString() }));
        }
      })
      .addCase(markAllNotificationsAsReadAsync.rejected, (state, action) => {
        state.isMarkingRead = false;
        state.error = action.payload as string;
      });

    // Get unread notification count
    builder
      .addCase(getUnreadNotificationCountAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUnreadNotificationCountAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.unreadCount = action.payload;
      })
      .addCase(getUnreadNotificationCountAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete notification
    builder
      .addCase(deleteNotificationAsync.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteNotificationAsync.fulfilled, (state, action) => {
        state.isDeleting = false;
        const notificationId = action.payload;
        
        // Remove from recent notifications
        const wasUnread = state.recentNotifications.find(n => n.id === notificationId && !n.readAt);
        state.recentNotifications = state.recentNotifications.filter(n => n.id !== notificationId);
        
        // Remove from main notifications
        if (state.notifications) {
          state.notifications.content = state.notifications.content.filter(n => n.id !== notificationId);
          state.notifications.totalElements -= 1;
        }
        
        // Decrease unread count if the deleted notification was unread
        if (wasUnread) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(deleteNotificationAsync.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload as string;
      });
  },
});

// Actions
export const { 
  clearError, 
  clearNotifications, 
  addRecentNotification, 
  removeNotification 
} = notificationSlice.actions;

// Selectors
export const selectNotifications = (state: RootState) => state.notifications;
export const selectNotificationsList = (state: RootState) => state.notifications.notifications;
export const selectRecentNotifications = (state: RootState) => state.notifications.recentNotifications;
export const selectUnreadNotificationCount = (state: RootState) => state.notifications.unreadCount;
export const selectNotificationsLoading = (state: RootState) => state.notifications.isLoading;
export const selectNotificationsSending = (state: RootState) => state.notifications.isSending;
export const selectNotificationsMarkingRead = (state: RootState) => state.notifications.isMarkingRead;
export const selectNotificationsDeleting = (state: RootState) => state.notifications.isDeleting;
export const selectNotificationsError = (state: RootState) => state.notifications.error;

export default notificationSlice.reducer;
