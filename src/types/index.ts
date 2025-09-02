// User types
export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  bio?: string;
  role: UserRole;
  emailVerified: boolean;
  profilePictureUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export const UserRole = {
  ADMIN: 'ADMIN',
  CUSTOMER: 'CUSTOMER',
  TASKER: 'TASKER'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

// Authentication types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role: UserRole;
}

export interface AuthResponse {
  token?: string;
  tokenType?: string;
  refreshToken?: string;
  user?: User;
  expiresIn?: number;
  message?: string;
}

export interface TokenValidationResponse {
  valid: boolean;
  expiresAt: string;
}

// Task types
export interface Task {
  id: number;
  title: string;
  description: string;
  requirementsDescription: string;
  budget: number;
  status: TaskStatus;
  priority: TaskPriority;
  location?: string;
  isRemote: boolean;
  dueDate?: string;
  estimatedDuration?: number;
  customerId: number;
  customerName?: string;
  taskerId?: number;
  taskerName?: string;
  categoryId?: number;
  categoryName?: string;
  createdAt: string;
  updatedAt: string;
}

export const TaskStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ASSIGNED: 'ASSIGNED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
} as const;

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

export const TaskPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH'
} as const;

export type TaskPriority = typeof TaskPriority[keyof typeof TaskPriority];

export interface CreateTaskRequest {
  title: string;
  description: string;
  requirementsDescription: string;
  budget: number;
  priority?: TaskPriority;
  location?: string;
  isRemote?: boolean;
  dueDate?: string;
  estimatedDuration?: number;
  categoryId?: number;
}

// Category types
export interface Category {
  id: number;
  name: string;
  description?: string;
  iconName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Task Image types
export interface TaskImage {
  id: number;
  fileName: string;
  originalFileName: string;
  fileSize: number;
  contentType: string;
  isPrimary: boolean;
  uploadedAt: string;
}

// Bid types
export interface Bid {
  id: number;
  taskId: number;
  taskTitle?: string;
  taskerId: number;
  taskerName?: string;
  amount: number;
  message?: string;
  estimatedCompletionHours: number;
  status: BidStatus;
  createdAt: string;
  updatedAt: string;
}

export const BidStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  WITHDRAWN: 'WITHDRAWN',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
} as const;

export type BidStatus = typeof BidStatus[keyof typeof BidStatus];

export interface CreateBidRequest {
  taskId: number;
  amount: number;
  message?: string;
  estimatedCompletionHours: number;
}

export interface BidStatistics {
  totalBids: number;
  acceptedBids: number;
  rejectedBids: number;
  pendingBids: number;
  completedBids: number;
  successRate: number;
  averageBidAmount: number;
}

// Payment types
export interface Payment {
  id: number;
  customerId: number;
  customerName?: string;
  taskerId?: number;
  taskerName?: string;
  taskId?: number;
  bidId?: number;
  amount: number;
  serviceFee: number;
  netAmount: number;
  paymentType: PaymentType;
  status: PaymentStatus;
  paymentMethod?: string;
  externalTransactionId?: string;
  description?: string;
  retryCount: number;
  maxRetries: number;
  processedAt?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}

export const PaymentType = {
  TASK_PAYMENT: 'TASK_PAYMENT',
  REFUND: 'REFUND',
  SERVICE_FEE: 'SERVICE_FEE'
} as const;

export type PaymentType = typeof PaymentType[keyof typeof PaymentType];

export const PaymentStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED'
} as const;

export type PaymentStatus = typeof PaymentStatus[keyof typeof PaymentStatus];

export interface CreatePaymentRequest {
  customerId: number;
  taskerId?: number;
  taskId?: number;
  bidId?: number;
  amount: number;
  paymentType: PaymentType;
  description?: string;
}

export interface RefundRequest {
  amount: number;
  reason: string;
  description?: string;
}

// Notification types
export interface Notification {
  id: number;
  recipientId: number;
  recipientEmail?: string;
  recipientPhone?: string;
  notificationType: NotificationType;
  subject: string;
  content: string;
  status: NotificationStatus;
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  createdAt: string;
}

export const NotificationType = {
  EMAIL: 'EMAIL',
  SMS: 'SMS',
  PUSH: 'PUSH'
} as const;

export type NotificationType = typeof NotificationType[keyof typeof NotificationType];

export const NotificationStatus = {
  PENDING: 'PENDING',
  SENT: 'SENT',
  DELIVERED: 'DELIVERED',
  FAILED: 'FAILED',
  READ: 'READ'
} as const;

export type NotificationStatus = typeof NotificationStatus[keyof typeof NotificationStatus];

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  details?: string[];
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}

// Search and Filter types
export interface TaskSearchParams {
  categoryId?: number;
  minBudget?: number;
  maxBudget?: number;
  location?: string;
  isRemote?: boolean;
  priority?: TaskPriority;
  status?: TaskStatus;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}

export interface BidSearchParams {
  status?: BidStatus;
  taskId?: number;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}

export interface PaymentSearchParams {
  status?: PaymentStatus;
  paymentType?: PaymentType;
  customerId?: number;
  taskerId?: number;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}
