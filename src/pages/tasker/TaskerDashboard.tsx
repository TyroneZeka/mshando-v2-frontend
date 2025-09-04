import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { searchTasksAsync, selectSearchResults } from '../../store/slices/taskSlice';
import { getMyBidsAsync, selectMyBids } from '../../store/slices/bidSlice';
import { getTaskerTotalEarningsAsync, selectTaskerTotalEarnings } from '../../store/slices/paymentSlice';
import { getUnreadNotificationCountAsync, selectUnreadNotificationCount } from '../../store/slices/notificationSlice';
import { selectUser } from '../../store/slices/authSlice';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { UserRole } from '../../types';
import type { Task } from '../../types';

export default function TaskerDashboard() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const availableTasks = useAppSelector(selectSearchResults);
  const myBids = useAppSelector(selectMyBids);
  const totalEarnings = useAppSelector(selectTaskerTotalEarnings);
  const unreadNotifications = useAppSelector(selectUnreadNotificationCount);

  useEffect(() => {
    dispatch(searchTasksAsync({ page: 0, size: 5 })); // Get latest 5 tasks for preview
    dispatch(getMyBidsAsync({ page: 0, size: 5 })); // Get latest 5 bids for preview
    
    if (user?.id) {
      dispatch(getTaskerTotalEarningsAsync(user.id));
      dispatch(getUnreadNotificationCountAsync(user.id));
    }
  }, [dispatch, user?.id]);

  const bidStats = {
    total: myBids?.totalElements || 0,
    pending: myBids?.content?.filter(bid => bid.status === 'PENDING').length || 0,
    accepted: myBids?.content?.filter(bid => bid.status === 'ACCEPTED').length || 0,
    rejected: myBids?.content?.filter(bid => bid.status === 'REJECTED').length || 0,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getBidStatusColor = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return 'text-green-600 bg-green-100';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100';
      case 'REJECTED':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTaskPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <DashboardLayout 
      userRole={UserRole.TASKER}
      title="Tasker Dashboard"
      subtitle="Discover tasks, manage bids, and track your earnings."
    >
      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Earnings</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {formatCurrency(totalEarnings || 0)}
                </dd>
              </dl>
            </div>
          </div>
          <div className="mt-4">
            <Link 
              to="/tasker/earnings"
              className="text-sm text-green-600 hover:text-green-800"
            >
              View earnings →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Available Tasks</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {availableTasks?.totalElements || 0}
                </dd>
              </dl>
            </div>
          </div>
          <div className="mt-4">
            <Link 
              to="/tasker/browse"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Browse tasks →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">My Bids</dt>
                <dd className="text-lg font-medium text-gray-900">{bidStats.total}</dd>
                <dd className="text-sm text-gray-500">
                  {bidStats.pending} pending, {bidStats.accepted} accepted
                </dd>
              </dl>
            </div>
          </div>
          <div className="mt-4">
            <Link 
              to="/tasker/bids"
              className="text-sm text-purple-600 hover:text-purple-800"
            >
              View bids →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 00-15 0v5h5l-5 5-5-5h5V7a9.5 9.5 0 0119 0v10z" />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Notifications</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {unreadNotifications || 0} unread
                </dd>
              </dl>
            </div>
          </div>
          <div className="mt-4">
            <Link 
              to="/tasker/notifications"
              className="text-sm text-orange-600 hover:text-orange-800"
            >
              View all →
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Available Tasks */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Latest Tasks</h3>
            <Link 
              to="/tasker/browse"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View all
            </Link>
          </div>
          <div className="p-6">
            {availableTasks?.content && availableTasks.content.length > 0 ? (
              <div className="space-y-4">
                {availableTasks.content.slice(0, 5).map((task: Task) => (
                  <div key={task.id} className="border-l-4 border-blue-400 pl-4 py-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                          {task.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {task.description}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm font-medium text-green-600">
                            {formatCurrency(task.budget)}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTaskPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(task.createdAt)}
                          </span>
                        </div>
                      </div>
                      <Link
                        to={`/tasker/tasks/${task.id}`}
                        className="ml-4 inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks available</h3>
                <p className="mt-1 text-sm text-gray-500">Check back later for new opportunities!</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Bids */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Recent Bids</h3>
            <Link 
              to="/tasker/bids"
              className="text-sm text-purple-600 hover:text-purple-800"
            >
              View all
            </Link>
          </div>
          <div className="p-6">
            {myBids?.content && myBids.content.length > 0 ? (
              <div className="space-y-4">
                {myBids.content.slice(0, 5).map((bid) => (
                  <div key={bid.id} className="border-l-4 border-purple-400 pl-4 py-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          Bid #{bid.id}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {bid.message || 'No message provided'}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm font-medium text-green-600">
                            {formatCurrency(bid.amount)}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBidStatusColor(bid.status)}`}>
                            {bid.status}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(bid.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No bids yet</h3>
                <p className="mt-1 text-sm text-gray-500">Start bidding on tasks to see your submissions here.</p>
                <div className="mt-6">
                  <Link 
                    to="/tasker/browse"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                  >
                    Browse Tasks
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/tasker/browse"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900">Browse Tasks</div>
                <div className="text-sm text-gray-500">Find new opportunities</div>
              </div>
            </Link>

            <Link
              to="/tasker/bids"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900">My Bids</div>
                <div className="text-sm text-gray-500">Track your proposals</div>
              </div>
            </Link>

            <Link
              to="/tasker/assignments"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900">Assignments</div>
                <div className="text-sm text-gray-500">Active work</div>
              </div>
            </Link>

            <Link
              to="/tasker/earnings"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900">Earnings</div>
                <div className="text-sm text-gray-500">View payments</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
