import { createSlice } from '@reduxjs/toolkit';

interface BidState {
  bids: unknown[];
  isLoading: boolean;
  error: string | null;
}

const initialState: BidState = {
  bids: [],
  isLoading: false,
  error: null,
};

const bidSlice = createSlice({
  name: 'bids',
  initialState,
  reducers: {},
});

export default bidSlice.reducer;
