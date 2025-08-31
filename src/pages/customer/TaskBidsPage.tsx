import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { 
  getMyTasksBidsAsync, 
  acceptBidAsync, 
  rejectBidAsync,
  selectMyTasksBids, 
  selectBidsLoading, 
  selectBidsError,
  selectBidsUpdating
} from '../../store/slices/bidSlice';
import { toast } from 'react-hot-toast';
import type { Bid, BidStatus } from '../../types';

export default function TaskBidsPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const taskBids = useAppSelector(selectMyTasksBids);
  const isLoading = useAppSelector(selectBidsLoading);
  const isUpdating = useAppSelector(selectBidsUpdating);
  const error = useAppSelector(selectBidsError);

  const [selectedTaskId, setSelectedTaskId] = useState<number | undefined>();

  useEffect(() => {
    dispatch(getMyTasksBidsAsync());
  }, [dispatch]);

  const handleAcceptBid = async (bidId: number) => {
    if (!confirm('Are you sure you want to accept this bid? This will reject all other bids for the task.')) {
      return;
    }

    try {
      await dispatch(acceptBidAsync(bidId)).unwrap();
      toast.success('Bid accepted successfully!');
    } catch {
      toast.error('Failed to accept bid');
    }
  };

  const handleRejectBid = async (bidId: number) => {
    if (!confirm('Are you sure you want to reject this bid?')) {
      return;
    }

    try {
      await dispatch(rejectBidAsync(bidId)).unwrap();
      toast.success('Bid rejected');
    } catch {
      toast.error('Failed to reject bid');
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

  const canAcceptBid = (status: BidStatus) => {
    return status === 'PENDING';
  };

  const canRejectBid = (status: BidStatus) => {
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

  const groupedBids = taskBids?.content.reduce((groups, bid) => {
    const taskId = bid.taskId;
    if (!groups[taskId]) {
      groups[taskId] = [];
    }
    groups[taskId].push(bid);
    return groups;
  }, {} as Record<number, Bid[]>) || {};

  const filteredBids = selectedTaskId 
    ? taskBids?.content.filter(bid => bid.taskId === selectedTaskId) || []
    : taskBids?.content || [];

  if (isLoading && !taskBids) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bids...</p>
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
            onClick={() => dispatch(getMyTasksBidsAsync())}
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
              <h1 className="text-3xl font-bold text-gray-900">Task Bids</h1>
              <p className="mt-2 text-gray-600">Manage bids received on your tasks.</p>
            </div>
            
            {/* Task filter dropdown */}
            {Object.keys(groupedBids).length > 1 && (
              <div className="flex items-center space-x-2">
                <label htmlFor="task-filter" className="text-sm font-medium text-gray-700">
                  Filter by task:
                </label>
                <select
                  id="task-filter"
                  value={selectedTaskId || ''}
                  onChange={(e) => setSelectedTaskId(e.target.value ? parseInt(e.target.value) : undefined)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All tasks</option>
                  {Object.keys(groupedBids).map(taskId => {
                    const bid = groupedBids[parseInt(taskId)][0];
                    return (
                      <option key={taskId} value={taskId}>
                        {bid.taskTitle || `Task #${taskId}`} ({groupedBids[parseInt(taskId)].length} bids)
                      </option>
                    );
                  })}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!filteredBids.length ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No bids received</h3>
            <p className="mt-1 text-sm text-gray-500">
              {selectedTaskId ? 'No bids for the selected task.' : 'Your tasks haven\'t received any bids yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(
              selectedTaskId 
                ? { [selectedTaskId]: filteredBids }
                : groupedBids
            ).map(([taskId, bids]) => (
              <div key={taskId} className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium text-gray-900">
                      {bids[0]?.taskTitle || `Task #${taskId}`}
                    </h2>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {bids.length} bid{bids.length !== 1 ? 's' : ''}
                      </span>
                      <button
                        onClick={() => navigate(`/customer/tasks/${taskId}`)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Task
                      </button>
                    </div>
                  </div>
                </div>

                <ul className="divide-y divide-gray-200">
                  {bids.map((bid: Bid) => (
                    <li key={bid.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-medium text-gray-900">
                              {bid.taskerName || `Tasker #${bid.taskerId}`}
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
                              <span className="font-medium">${bid.amount.toLocaleString()}</span>
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
                            <div className="mt-3 p-3 bg-gray-50 rounded-md">
                              <p className="text-sm text-gray-700">{bid.message}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          {canAcceptBid(bid.status) && (
                            <button
                              onClick={() => handleAcceptBid(bid.id)}
                              disabled={isUpdating}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                            >
                              Accept
                            </button>
                          )}
                          
                          {canRejectBid(bid.status) && (
                            <button
                              onClick={() => handleRejectBid(bid.id)}
                              disabled={isUpdating}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                              Reject
                            </button>
                          )}
                          
                          {bid.status === 'ACCEPTED' && (
                            <button
                              onClick={() => navigate(`/customer/tasks/${bid.taskId}`)}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              Manage Task
                            </button>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
