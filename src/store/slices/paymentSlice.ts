import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import type {
  Payment,
  CreatePaymentRequest,
  RefundRequest,
  PaymentSearchParams,
  PaginatedResponse
} from '../../types';
import paymentService from '../../services/paymentService';

// Async thunks
export const createPaymentAsync = createAsyncThunk(
  'payments/createPayment',
  async (paymentData: CreatePaymentRequest, { rejectWithValue }) => {
    try {
      const payment = await paymentService.createPayment(paymentData);
      return payment;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to create payment');
    }
  }
);

export const getPaymentByIdAsync = createAsyncThunk(
  'payments/getPaymentById',
  async (id: number, { rejectWithValue }) => {
    try {
      const payment = await paymentService.getPaymentById(id);
      return payment;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch payment');
    }
  }
);

export const getCustomerPaymentsAsync = createAsyncThunk(
  'payments/getCustomerPayments',
  async ({ customerId, page = 0, size = 20 }: { customerId: number; page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const payments = await paymentService.getCustomerPayments(customerId, page, size);
      return payments;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch customer payments');
    }
  }
);

export const getTaskerPaymentsAsync = createAsyncThunk(
  'payments/getTaskerPayments',
  async ({ taskerId, page = 0, size = 20 }: { taskerId: number; page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const payments = await paymentService.getTaskerPayments(taskerId, page, size);
      return payments;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch tasker payments');
    }
  }
);

export const getTaskPaymentsAsync = createAsyncThunk(
  'payments/getTaskPayments',
  async (taskId: number, { rejectWithValue }) => {
    try {
      const payments = await paymentService.getTaskPayments(taskId);
      return payments;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch task payments');
    }
  }
);

export const processPaymentAsync = createAsyncThunk(
  'payments/processPayment',
  async (id: number, { rejectWithValue }) => {
    try {
      const payment = await paymentService.processPayment(id);
      return payment;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to process payment');
    }
  }
);

export const refundPaymentAsync = createAsyncThunk(
  'payments/refundPayment',
  async ({ paymentId, refundData }: { paymentId: number; refundData: RefundRequest }, { rejectWithValue }) => {
    try {
      const refund = await paymentService.refundPayment(paymentId, refundData);
      return refund;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to process refund');
    }
  }
);

export const getCustomerTotalPaymentsAsync = createAsyncThunk(
  'payments/getCustomerTotalPayments',
  async (customerId: number, { rejectWithValue }) => {
    try {
      const total = await paymentService.getCustomerTotalPayments(customerId);
      return { customerId, total };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch customer total payments');
    }
  }
);

export const getTaskerTotalEarningsAsync = createAsyncThunk(
  'payments/getTaskerTotalEarnings',
  async (taskerId: number, { rejectWithValue }) => {
    try {
      const total = await paymentService.getTaskerTotalEarnings(taskerId);
      return { taskerId, total };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch tasker total earnings');
    }
  }
);

export const searchPaymentsAsync = createAsyncThunk(
  'payments/searchPayments',
  async (params: PaymentSearchParams, { rejectWithValue }) => {
    try {
      const payments = await paymentService.searchPayments(params);
      return payments;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to search payments');
    }
  }
);

interface PaymentState {
  payments: Payment[];
  currentPayment: Payment | null;
  customerPayments: PaginatedResponse<Payment> | null;
  taskerPayments: PaginatedResponse<Payment> | null;
  taskPayments: Payment[];
  searchResults: PaginatedResponse<Payment> | null;
  customerTotalPayments: number | null;
  taskerTotalEarnings: number | null;
  isLoading: boolean;
  isCreating: boolean;
  isProcessing: boolean;
  isRefunding: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  payments: [],
  currentPayment: null,
  customerPayments: null,
  taskerPayments: null,
  taskPayments: [],
  searchResults: null,
  customerTotalPayments: null,
  taskerTotalEarnings: null,
  isLoading: false,
  isCreating: false,
  isProcessing: false,
  isRefunding: false,
  error: null,
};

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPayment: (state) => {
      state.currentPayment = null;
    },
    clearCustomerPayments: (state) => {
      state.customerPayments = null;
    },
    clearTaskerPayments: (state) => {
      state.taskerPayments = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = null;
    },
  },
  extraReducers: (builder) => {
    // Create payment
    builder
      .addCase(createPaymentAsync.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createPaymentAsync.fulfilled, (state, action) => {
        state.isCreating = false;
        state.currentPayment = action.payload;
        state.payments.unshift(action.payload);
      })
      .addCase(createPaymentAsync.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as string;
      });

    // Get payment by ID
    builder
      .addCase(getPaymentByIdAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPaymentByIdAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPayment = action.payload;
      })
      .addCase(getPaymentByIdAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get customer payments
    builder
      .addCase(getCustomerPaymentsAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCustomerPaymentsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customerPayments = action.payload;
      })
      .addCase(getCustomerPaymentsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get tasker payments
    builder
      .addCase(getTaskerPaymentsAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTaskerPaymentsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.taskerPayments = action.payload;
      })
      .addCase(getTaskerPaymentsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get task payments
    builder
      .addCase(getTaskPaymentsAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTaskPaymentsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.taskPayments = action.payload;
      })
      .addCase(getTaskPaymentsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Process payment
    builder
      .addCase(processPaymentAsync.pending, (state) => {
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(processPaymentAsync.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.currentPayment = action.payload;
        // Update payment in the lists
        const updatePayment = (payment: Payment) => 
          payment.id === action.payload.id ? action.payload : payment;
        
        state.payments = state.payments.map(updatePayment);
        if (state.customerPayments) {
          state.customerPayments.content = state.customerPayments.content.map(updatePayment);
        }
        if (state.taskerPayments) {
          state.taskerPayments.content = state.taskerPayments.content.map(updatePayment);
        }
        state.taskPayments = state.taskPayments.map(updatePayment);
      })
      .addCase(processPaymentAsync.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = action.payload as string;
      });

    // Refund payment
    builder
      .addCase(refundPaymentAsync.pending, (state) => {
        state.isRefunding = true;
        state.error = null;
      })
      .addCase(refundPaymentAsync.fulfilled, (state, action) => {
        state.isRefunding = false;
        state.currentPayment = action.payload;
        // Update payment in the lists
        const updatePayment = (payment: Payment) => 
          payment.id === action.payload.id ? action.payload : payment;
        
        state.payments = state.payments.map(updatePayment);
        if (state.customerPayments) {
          state.customerPayments.content = state.customerPayments.content.map(updatePayment);
        }
        if (state.taskerPayments) {
          state.taskerPayments.content = state.taskerPayments.content.map(updatePayment);
        }
        state.taskPayments = state.taskPayments.map(updatePayment);
      })
      .addCase(refundPaymentAsync.rejected, (state, action) => {
        state.isRefunding = false;
        state.error = action.payload as string;
      });

    // Get customer total payments
    builder
      .addCase(getCustomerTotalPaymentsAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCustomerTotalPaymentsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customerTotalPayments = action.payload.total;
      })
      .addCase(getCustomerTotalPaymentsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get tasker total earnings
    builder
      .addCase(getTaskerTotalEarningsAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTaskerTotalEarningsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.taskerTotalEarnings = action.payload.total;
      })
      .addCase(getTaskerTotalEarningsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Search payments
    builder
      .addCase(searchPaymentsAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchPaymentsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchPaymentsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Actions
export const { 
  clearError, 
  clearCurrentPayment, 
  clearCustomerPayments, 
  clearTaskerPayments,
  clearSearchResults 
} = paymentSlice.actions;

// Selectors
export const selectPayments = (state: RootState) => state.payments;
export const selectCurrentPayment = (state: RootState) => state.payments.currentPayment;
export const selectCustomerPayments = (state: RootState) => state.payments.customerPayments;
export const selectTaskerPayments = (state: RootState) => state.payments.taskerPayments;
export const selectTaskPayments = (state: RootState) => state.payments.taskPayments;
export const selectPaymentSearchResults = (state: RootState) => state.payments.searchResults;
export const selectCustomerTotalPayments = (state: RootState) => state.payments.customerTotalPayments;
export const selectTaskerTotalEarnings = (state: RootState) => state.payments.taskerTotalEarnings;
export const selectPaymentsLoading = (state: RootState) => state.payments.isLoading;
export const selectPaymentsCreating = (state: RootState) => state.payments.isCreating;
export const selectPaymentsProcessing = (state: RootState) => state.payments.isProcessing;
export const selectPaymentsRefunding = (state: RootState) => state.payments.isRefunding;
export const selectPaymentsError = (state: RootState) => state.payments.error;

export default paymentSlice.reducer;
