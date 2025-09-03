import { paymentApi } from './api';
import type {
  Payment,
  CreatePaymentRequest,
  RefundRequest,
  PaymentSearchParams,
  PaginatedResponse,
  PaymentStatus,
  PaymentType
} from '../types';

class PaymentService {
  // Create payment
  async createPayment(paymentData: CreatePaymentRequest): Promise<Payment> {
    const response = await paymentApi.post('/payments', paymentData);
    return response.data;
  }

  // Get payment by ID
  async getPaymentById(id: number): Promise<Payment> {
    const response = await paymentApi.get(`/payments/${id}`);
    return response.data;
  }

  // Get payment by external transaction ID
  async getPaymentByExternalTransactionId(externalTransactionId: string): Promise<Payment> {
    const response = await paymentApi.get(`/payments/external/${externalTransactionId}`);
    return response.data;
  }

  // Process payment
  async processPayment(id: number): Promise<Payment> {
    const response = await paymentApi.patch(`/payments/${id}/process`);
    return response.data;
  }

  // Complete payment
  async completePayment(id: number): Promise<Payment> {
    const response = await paymentApi.patch(`/payments/${id}/complete`);
    return response.data;
  }

  // Retry failed payment
  async retryPayment(id: number): Promise<Payment> {
    const response = await paymentApi.patch(`/payments/${id}/retry`);
    return response.data;
  }

  // Cancel payment
  async cancelPayment(id: number, reason: string): Promise<Payment> {
    const response = await paymentApi.patch(`/payments/${id}/cancel?reason=${encodeURIComponent(reason)}`);
    return response.data;
  }

  // Process refund
  async refundPayment(paymentId: number, refundData: RefundRequest): Promise<Payment> {
    const response = await paymentApi.post(`/payments/${paymentId}/refund`, refundData);
    return response.data;
  }

  // Get customer payments
  async getCustomerPayments(
    customerId: number,
    page = 0,
    size = 20
  ): Promise<PaginatedResponse<Payment>> {
    const response = await paymentApi.get(`/payments/customer/${customerId}?page=${page}&size=${size}`);
    return response.data;
  }

  // Get tasker payments
  async getTaskerPayments(
    taskerId: number,
    page = 0,
    size = 20
  ): Promise<PaginatedResponse<Payment>> {
    const response = await paymentApi.get(`/payments/tasker/${taskerId}?page=${page}&size=${size}`);
    return response.data;
  }

  // Get task payments
  async getTaskPayments(taskId: number): Promise<Payment[]> {
    const response = await paymentApi.get(`/payments/task/${taskId}`);
    return response.data;
  }

  // Get payments by status
  async getPaymentsByStatus(
    status: PaymentStatus,
    page = 0,
    size = 20
  ): Promise<PaginatedResponse<Payment>> {
    const response = await paymentApi.get(`/payments/status/${status}?page=${page}&size=${size}`);
    return response.data;
  }

  // Get payments by status and type
  async getPaymentsByStatusAndType(
    status: PaymentStatus,
    paymentType: PaymentType,
    page = 0,
    size = 20
  ): Promise<PaginatedResponse<Payment>> {
    const response = await paymentApi.get(
      `/payments/filter?status=${status}&paymentType=${paymentType}&page=${page}&size=${size}`
    );
    return response.data;
  }

  // Get payments in date range
  async getPaymentsInDateRange(
    startDate: string,
    endDate: string,
    page = 0,
    size = 20
  ): Promise<PaginatedResponse<Payment>> {
    const response = await paymentApi.get(
      `/payments/date-range?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}&page=${page}&size=${size}`
    );
    return response.data;
  }

  // Get customer total payments
  async getCustomerTotalPayments(customerId: number): Promise<number> {
    const response = await paymentApi.get(`/payments/customer/${customerId}/total`);
    return response.data;
  }

  // Get tasker total earnings
  async getTaskerTotalEarnings(taskerId: number): Promise<number> {
    const response = await paymentApi.get(`/payments/tasker/${taskerId}/earnings`);
    return response.data;
  }

  // Get service fees in period
  async getServiceFeesInPeriod(startDate: string, endDate: string): Promise<number> {
    const response = await paymentApi.get(
      `/payments/service-fees?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`
    );
    return response.data;
  }

  // Check customer pending payments
  async hasCustomerPendingPayments(customerId: number): Promise<boolean> {
    const response = await paymentApi.get(`/payments/customer/${customerId}/has-pending`);
    return response.data;
  }

  // Check bid payments
  async hasBidPayments(bidId: number): Promise<boolean> {
    const response = await paymentApi.get(`/payments/bid/${bidId}/has-payments`);
    return response.data;
  }

  // Search payments with advanced filters
  async searchPayments(params: PaymentSearchParams): Promise<PaginatedResponse<Payment>> {
    const searchParams = new URLSearchParams();
    
    if (params.status) searchParams.append('status', params.status);
    if (params.paymentType) searchParams.append('paymentType', params.paymentType);
    if (params.customerId) searchParams.append('customerId', params.customerId.toString());
    if (params.taskerId) searchParams.append('taskerId', params.taskerId.toString());
    if (params.startDate) searchParams.append('startDate', params.startDate);
    if (params.endDate) searchParams.append('endDate', params.endDate);
    if (params.page !== undefined) searchParams.append('page', params.page.toString());
    if (params.size !== undefined) searchParams.append('size', params.size.toString());

    const response = await paymentApi.get(`/payments/search?${searchParams.toString()}`);
    return response.data;
  }
}

export default new PaymentService();
