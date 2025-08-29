import { createSlice } from '@reduxjs/toolkit';

interface NotificationState {
  notifications: unknown[];
  isLoading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  isLoading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
});

export default notificationSlice.reducer;
