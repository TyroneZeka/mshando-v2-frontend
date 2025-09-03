import { notificationApi } from './api';
import type { Notification, NotificationType, PaginatedResponse } from '../types';

// Request interfaces for notification operations
export interface EmailNotificationRequest {
  recipientId: number;
  recipientEmail: string;
  subject: string;
  content: string;
}

export interface SmsNotificationRequest {
  recipientId: number;
  recipientPhone: string;
  content: string;
}

export interface TaskNotificationData {
  taskId: number;
  taskTitle: string;
  recipientId: number;
  recipientEmail: string;
  notificationType: 'TASK_CREATED' | 'TASK_UPDATED' | 'TASK_ASSIGNED' | 'TASK_COMPLETED' | 'BID_RECEIVED' | 'BID_ACCEPTED';
  additionalData?: Record<string, unknown>;
}

export interface PaymentNotificationData {
  paymentId: number;
  recipientId: number;
  recipientEmail: string;
  amount: number;
  taskTitle: string;
  notificationType: 'PAYMENT_PROCESSED' | 'PAYMENT_RECEIVED' | 'REFUND_PROCESSED';
  additionalData?: Record<string, unknown>;
}

class NotificationService {
  // Send email notification
  async sendEmailNotification(emailData: EmailNotificationRequest): Promise<Notification> {
    const response = await notificationApi.post('/email', emailData);
    return response.data;
  }

  // Send SMS notification
  async sendSmsNotification(smsData: SmsNotificationRequest): Promise<Notification> {
    const response = await notificationApi.post('/sms', smsData);
    return response.data;
  }

  // Send task-related notification
  async sendTaskNotification(taskData: TaskNotificationData): Promise<Notification> {
    const { taskTitle, recipientId, recipientEmail, notificationType } = taskData;
    
    let subject = '';
    let content = '';

    switch (notificationType) {
      case 'TASK_CREATED':
        subject = 'New Task Created';
        content = `A new task "${taskTitle}" has been created.`;
        break;
      case 'TASK_UPDATED':
        subject = 'Task Updated';
        content = `The task "${taskTitle}" has been updated.`;
        break;
      case 'TASK_ASSIGNED':
        subject = 'Task Assigned';
        content = `You have been assigned to the task "${taskTitle}".`;
        break;
      case 'TASK_COMPLETED':
        subject = 'Task Completed';
        content = `The task "${taskTitle}" has been completed.`;
        break;
      case 'BID_RECEIVED':
        subject = 'New Bid Received';
        content = `You received a new bid for the task "${taskTitle}".`;
        break;
      case 'BID_ACCEPTED':
        subject = 'Bid Accepted';
        content = `Your bid for the task "${taskTitle}" has been accepted.`;
        break;
      default:
        subject = 'Task Notification';
        content = `There is an update for the task "${taskTitle}".`;
    }

    const emailData: EmailNotificationRequest = {
      recipientId,
      recipientEmail,
      subject,
      content,
    };

    return this.sendEmailNotification(emailData);
  }

  // Send payment-related notification
  async sendPaymentNotification(paymentData: PaymentNotificationData): Promise<Notification> {
    const { recipientId, recipientEmail, amount, taskTitle, notificationType } = paymentData;
    
    let subject = '';
    let content = '';

    switch (notificationType) {
      case 'PAYMENT_PROCESSED':
        subject = 'Payment Processed';
        content = `Your payment of $${amount.toFixed(2)} for the task "${taskTitle}" has been processed.`;
        break;
      case 'PAYMENT_RECEIVED':
        subject = 'Payment Received';
        content = `You have received a payment of $${amount.toFixed(2)} for the task "${taskTitle}".`;
        break;
      case 'REFUND_PROCESSED':
        subject = 'Refund Processed';
        content = `A refund of $${amount.toFixed(2)} for the task "${taskTitle}" has been processed.`;
        break;
      default:
        subject = 'Payment Notification';
        content = `There is a payment update for the task "${taskTitle}".`;
    }

    const emailData: EmailNotificationRequest = {
      recipientId,
      recipientEmail,
      subject,
      content,
    };

    return this.sendEmailNotification(emailData);
  }

  // Get notifications for a specific recipient
  async getNotificationsByRecipient(
    recipientId: number, 
    page: number = 0, 
    size: number = 20
  ): Promise<PaginatedResponse<Notification>> {
    const response = await notificationApi.get(`/recipient/${recipientId}`, {
      params: { page, size }
    });
    return response.data;
  }

  // Get notification by ID
  async getNotificationById(id: number): Promise<Notification> {
    const response = await notificationApi.get(`/${id}`);
    return response.data;
  }

  // Mark notification as read
  async markAsRead(notificationId: number): Promise<Notification> {
    const response = await notificationApi.patch(`/${notificationId}/read`);
    return response.data;
  }

  // Mark all notifications as read for a recipient
  async markAllAsRead(recipientId: number): Promise<void> {
    await notificationApi.patch(`/recipient/${recipientId}/read-all`);
  }

  // Get unread notification count
  async getUnreadCount(recipientId: number): Promise<number> {
    const response = await notificationApi.get(`/recipient/${recipientId}/unread-count`);
    return response.data;
  }

  // Delete notification
  async deleteNotification(notificationId: number): Promise<void> {
    await notificationApi.delete(`/${notificationId}`);
  }

  // Get notifications by status
  async getNotificationsByStatus(
    recipientId: number, 
    status: string,
    page: number = 0, 
    size: number = 20
  ): Promise<PaginatedResponse<Notification>> {
    const response = await notificationApi.get(`/recipient/${recipientId}/status/${status}`, {
      params: { page, size }
    });
    return response.data;
  }

  // Get notifications by type
  async getNotificationsByType(
    recipientId: number, 
    notificationType: NotificationType,
    page: number = 0, 
    size: number = 20
  ): Promise<PaginatedResponse<Notification>> {
    const response = await notificationApi.get(`/recipient/${recipientId}/type/${notificationType}`, {
      params: { page, size }
    });
    return response.data;
  }
}

const notificationService = new NotificationService();
export default notificationService;
