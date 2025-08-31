import { biddingApi } from './api';
import type { Bid, CreateBidRequest, PaginatedResponse } from '../types';

export const bidService = {
  // Create a new bid
  createBid: async (bidData: CreateBidRequest): Promise<Bid> => {
    const response = await biddingApi.post('/bids', bidData);
    return response.data;
  },

  // Get my bids (for tasker)
  getMyBids: async (params?: {
    page?: number;
    size?: number;
    status?: string;
  }): Promise<PaginatedResponse<Bid>> => {
    const response = await biddingApi.get('/bids/my-bids', { params });
    return response.data;
  },

  // Get bids on my tasks (for customer)
  getMyTasksBids: async (params?: {
    page?: number;
    size?: number;
    taskId?: number;
  }): Promise<PaginatedResponse<Bid>> => {
    const response = await biddingApi.get('/bids/my-tasks-bids', { params });
    return response.data;
  },

  // Get bids for a specific task
  getTaskBids: async (taskId: number): Promise<Bid[]> => {
    const response = await biddingApi.get(`/bids/task/${taskId}`);
    return response.data;
  },

  // Update a bid
  updateBid: async (bidId: number, bidData: Partial<CreateBidRequest>): Promise<Bid> => {
    const response = await biddingApi.put(`/bids/${bidId}`, bidData);
    return response.data;
  },

  // Accept a bid (customer action)
  acceptBid: async (bidId: number): Promise<Bid> => {
    const response = await biddingApi.patch(`/bids/${bidId}/accept`);
    return response.data;
  },

  // Reject a bid (customer action)
  rejectBid: async (bidId: number): Promise<Bid> => {
    const response = await biddingApi.patch(`/bids/${bidId}/reject`);
    return response.data;
  },

  // Withdraw a bid (tasker action)
  withdrawBid: async (bidId: number): Promise<Bid> => {
    const response = await biddingApi.patch(`/bids/${bidId}/withdraw`);
    return response.data;
  },

  // Get bid statistics
  getBidStatistics: async (): Promise<{
    totalBids: number;
    acceptedBids: number;
    rejectedBids: number;
    pendingBids: number;
    averageBidAmount: number;
  }> => {
    const response = await biddingApi.get('/bids/statistics');
    return response.data;
  },
};
