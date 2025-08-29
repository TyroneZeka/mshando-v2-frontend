import { createSlice } from '@reduxjs/toolkit';

interface PaymentState {
  payments: unknown[];
  isLoading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  payments: [],
  isLoading: false,
  error: null,
};

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {},
});

export default paymentSlice.reducer;
