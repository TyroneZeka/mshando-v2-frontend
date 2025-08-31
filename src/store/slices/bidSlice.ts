import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bidService } from '../../services/bidService';
import { handleApiError } from '../../services/api';
import type { RootState } from '../index';
import type { Bid, CreateBidRequest, PaginatedResponse } from '../../types';

interface BidState {
  myBids: PaginatedResponse<Bid> | null;
  myTasksBids: PaginatedResponse<Bid> | null;
  taskBids: Bid[];
  currentBid: Bid | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  error: string | null;
}

const initialState: BidState = {
  myBids: null,
  myTasksBids: null,
  taskBids: [],
  currentBid: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  error: null,
};

// Async thunks
export const createBidAsync = createAsyncThunk(
  'bids/createBid',
  async (bidData: CreateBidRequest) => {
    try {
      return await bidService.createBid(bidData);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
);

export const getMyBidsAsync = createAsyncThunk(
  'bids/getMyBids',
  async (params?: { page?: number; size?: number; status?: string }) => {
    try {
      return await bidService.getMyBids(params);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
);

export const getMyTasksBidsAsync = createAsyncThunk(
  'bids/getMyTasksBids',
  async (params?: { page?: number; size?: number; taskId?: number }) => {
    try {
      return await bidService.getMyTasksBids(params);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
);

export const getTaskBidsAsync = createAsyncThunk(
  'bids/getTaskBids',
  async (taskId: number) => {
    try {
      return await bidService.getTaskBids(taskId);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
);

export const updateBidAsync = createAsyncThunk(
  'bids/updateBid',
  async ({ bidId, bidData }: { bidId: number; bidData: Partial<CreateBidRequest> }) => {
    try {
      return await bidService.updateBid(bidId, bidData);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
);

export const acceptBidAsync = createAsyncThunk(
  'bids/acceptBid',
  async (bidId: number) => {
    try {
      return await bidService.acceptBid(bidId);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
);

export const rejectBidAsync = createAsyncThunk(
  'bids/rejectBid',
  async (bidId: number) => {
    try {
      return await bidService.rejectBid(bidId);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
);

export const withdrawBidAsync = createAsyncThunk(
  'bids/withdrawBid',
  async (bidId: number) => {
    try {
      return await bidService.withdrawBid(bidId);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
);

const bidSlice = createSlice({
  name: 'bids',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentBid: (state) => {
      state.currentBid = null;
    },
    clearTaskBids: (state) => {
      state.taskBids = [];
    },
  },
  extraReducers: (builder) => {
    // Create bid
    builder
      .addCase(createBidAsync.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createBidAsync.fulfilled, (state, action) => {
        state.isCreating = false;
        state.currentBid = action.payload;
        // Add to myBids if we have them loaded
        if (state.myBids) {
          state.myBids.content.unshift(action.payload);
          state.myBids.totalElements += 1;
        }
      })
      .addCase(createBidAsync.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.error.message || 'Failed to create bid';
      });

    // Get my bids
    builder
      .addCase(getMyBidsAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMyBidsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myBids = action.payload;
      })
      .addCase(getMyBidsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load bids';
      });

    // Get my tasks bids (for customers)
    builder
      .addCase(getMyTasksBidsAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMyTasksBidsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myTasksBids = action.payload;
      })
      .addCase(getMyTasksBidsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load task bids';
      });

    // Get task bids
    builder
      .addCase(getTaskBidsAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTaskBidsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.taskBids = action.payload;
      })
      .addCase(getTaskBidsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load task bids';
      });

    // Update bid
    builder
      .addCase(updateBidAsync.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateBidAsync.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.currentBid = action.payload;
        
        // Update in myBids if exists
        if (state.myBids) {
          const index = state.myBids.content.findIndex(bid => bid.id === action.payload.id);
          if (index !== -1) {
            state.myBids.content[index] = action.payload;
          }
        }
        
        // Update in taskBids if exists
        const taskBidIndex = state.taskBids.findIndex(bid => bid.id === action.payload.id);
        if (taskBidIndex !== -1) {
          state.taskBids[taskBidIndex] = action.payload;
        }
      })
      .addCase(updateBidAsync.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.error.message || 'Failed to update bid';
      });

    // Accept bid
    builder
      .addCase(acceptBidAsync.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(acceptBidAsync.fulfilled, (state, action) => {
        state.isUpdating = false;
        
        // Update in myTasksBids if exists
        if (state.myTasksBids) {
          const index = state.myTasksBids.content.findIndex(bid => bid.id === action.payload.id);
          if (index !== -1) {
            state.myTasksBids.content[index] = action.payload;
          }
        }
        
        // Update in taskBids if exists
        const taskBidIndex = state.taskBids.findIndex(bid => bid.id === action.payload.id);
        if (taskBidIndex !== -1) {
          state.taskBids[taskBidIndex] = action.payload;
        }
      })
      .addCase(acceptBidAsync.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.error.message || 'Failed to accept bid';
      });

    // Reject bid
    builder
      .addCase(rejectBidAsync.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(rejectBidAsync.fulfilled, (state, action) => {
        state.isUpdating = false;
        
        // Update in myTasksBids if exists
        if (state.myTasksBids) {
          const index = state.myTasksBids.content.findIndex(bid => bid.id === action.payload.id);
          if (index !== -1) {
            state.myTasksBids.content[index] = action.payload;
          }
        }
        
        // Update in taskBids if exists
        const taskBidIndex = state.taskBids.findIndex(bid => bid.id === action.payload.id);
        if (taskBidIndex !== -1) {
          state.taskBids[taskBidIndex] = action.payload;
        }
      })
      .addCase(rejectBidAsync.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.error.message || 'Failed to reject bid';
      });

    // Withdraw bid
    builder
      .addCase(withdrawBidAsync.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(withdrawBidAsync.fulfilled, (state, action) => {
        state.isUpdating = false;
        
        // Update in myBids if exists
        if (state.myBids) {
          const index = state.myBids.content.findIndex(bid => bid.id === action.payload.id);
          if (index !== -1) {
            state.myBids.content[index] = action.payload;
          }
        }
        
        // Update in taskBids if exists
        const taskBidIndex = state.taskBids.findIndex(bid => bid.id === action.payload.id);
        if (taskBidIndex !== -1) {
          state.taskBids[taskBidIndex] = action.payload;
        }
      })
      .addCase(withdrawBidAsync.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.error.message || 'Failed to withdraw bid';
      });
  },
});

export const { clearError, clearCurrentBid, clearTaskBids } = bidSlice.actions;

// Selectors
export const selectMyBids = (state: RootState) => state.bids.myBids;
export const selectMyTasksBids = (state: RootState) => state.bids.myTasksBids;
export const selectTaskBids = (state: RootState) => state.bids.taskBids;
export const selectCurrentBid = (state: RootState) => state.bids.currentBid;
export const selectBidsLoading = (state: RootState) => state.bids.isLoading;
export const selectBidsCreating = (state: RootState) => state.bids.isCreating;
export const selectBidsUpdating = (state: RootState) => state.bids.isUpdating;
export const selectBidsError = (state: RootState) => state.bids.error;

export default bidSlice.reducer;
