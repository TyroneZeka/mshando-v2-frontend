import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { 
  getMyBidsAsync, 
  withdrawBidAsync, 
  updateBidAsync,
  selectMyBids, 
  selectBidsLoading, 
  selectBidsError,
  selectBidsUpdating
} from '../../store/slices/bidSlice';
import { toast } from 'react-hot-toast';
import type { Bid, BidStatus } from '../../types';

export default function MyBidsPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const myBids = useAppSelector(selectMyBids);
  const isLoading = useAppSelector(selectBidsLoading);
  const isUpdating = useAppSelector(selectBidsUpdating);
  const error = useAppSelector(selectBidsError);

  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    amount: '',
    message: '',
    estimatedCompletionHours: '',
  });

  useEffect(() => {
    dispatch(getMyBidsAsync());
  }, [dispatch]);

  const handleEditBid = (bid: Bid) => {
    setSelectedBid(bid);
    setEditFormData({
      amount: bid.amount.toString(),
      message: bid.message || '',
      estimatedCompletionHours: bid.estimatedCompletionHours.toString(),
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateBid = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBid) return;

    try {
      await dispatch(updateBidAsync({
        bidId: selectedBid.id,
        bidData: {
          amount: parseFloat(editFormData.amount),
          message: editFormData.message.trim(),
          estimatedCompletionHours: parseInt(editFormData.estimatedCompletionHours),
        }
      })).unwrap();

      toast.success('Bid updated successfully!');
      setIsEditModalOpen(false);
      setSelectedBid(null);
    } catch {
      toast.error('Failed to update bid');
    }
  };

  const handleWithdrawBid = async (bidId: number) => {
    if (!confirm('Are you sure you want to withdraw this bid? This action cannot be undone.')) {
      return;
    }

    try {
      await dispatch(withdrawBidAsync(bidId)).unwrap();
      toast.success('Bid withdrawn successfully');
    } catch {
      toast.error('Failed to withdraw bid');
    }
  };

  const getBidStatusColor = (status: BidStatus) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'WITHDRAWN':
        return 'bg-gray-100 text-gray-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const canEditBid = (status: BidStatus) => {
    return status === 'PENDING';
  };

  const canWithdrawBid = (status: BidStatus) => {
    return status === 'PENDING';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading && !myBids) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your bids...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => dispatch(getMyBidsAsync())}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Bids</h1>
              <p className="mt-2 text-gray-600">Track and manage your submitted bids.</p>
            </div>
            <Link
              to="/tasker/browse-tasks"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Browse Tasks
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!myBids?.content?.length ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No bids yet</h3>
            <p className="mt-1 text-sm text-gray-500">Start bidding on tasks to grow your business.</p>
            <div className="mt-6">
              <Link
                to="/tasker/browse-tasks"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Browse Tasks
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {myBids.content.map((bid: Bid) => (
                <li key={bid.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {bid.taskTitle || `Task #${bid.taskId}`}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBidStatusColor(bid.status)}`}>
                          {bid.status}
                        </span>
                      </div>
                      
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                          ${bid.amount.toLocaleString()}
                        </div>
                        
                        <div className="flex items-center">
                          <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {bid.estimatedCompletionHours}h estimated
                        </div>
                        
                        <div className="flex items-center">
                          <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(bid.createdAt)}
                        </div>
                      </div>

                      {bid.message && (
                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                          {bid.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => navigate(`/tasker/tasks/${bid.taskId}`)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        View Task
                      </button>
                      
                      {canEditBid(bid.status) && (
                        <button
                          onClick={() => handleEditBid(bid)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Edit
                        </button>
                      )}
                      
                      {canWithdrawBid(bid.status) && (
                        <button
                          onClick={() => handleWithdrawBid(bid.id)}
                          disabled={isUpdating}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                        >
                          Withdraw
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Edit Bid Modal */}
      {isEditModalOpen && selectedBid && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Bid</h3>
              <form onSubmit={handleUpdateBid} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bid Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editFormData.amount}
                    onChange={(e) => setEditFormData({ ...editFormData, amount: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Estimated Hours</label>
                  <input
                    type="number"
                    value={editFormData.estimatedCompletionHours}
                    onChange={(e) => setEditFormData({ ...editFormData, estimatedCompletionHours: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Message</label>
                  <textarea
                    rows={3}
                    value={editFormData.message}
                    onChange={(e) => setEditFormData({ ...editFormData, message: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isUpdating ? 'Updating...' : 'Update Bid'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
