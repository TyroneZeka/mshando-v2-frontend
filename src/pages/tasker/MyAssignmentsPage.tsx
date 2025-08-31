import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { getMyAssignmentsAsync, selectMyAssignments, selectTasksLoading, selectTasksError } from '../../store/slices/taskSlice';
import type { Task, TaskStatus } from '../../types';

export default function MyAssignmentsPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const myAssignments = useAppSelector(selectMyAssignments);
  const isLoading = useAppSelector(selectTasksLoading);
  const error = useAppSelector(selectTasksError);

  useEffect(() => {
    dispatch(getMyAssignmentsAsync());
  }, [dispatch]);

  const getStatusBadgeColor = (status: TaskStatus) => {
    switch (status) {
      case 'ASSIGNED':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusAction = (status: TaskStatus) => {
    switch (status) {
      case 'ASSIGNED':
        return { text: 'Start Task', action: 'start', color: 'bg-blue-600 hover:bg-blue-700' };
      case 'IN_PROGRESS':
        return { text: 'Mark Complete', action: 'complete', color: 'bg-green-600 hover:bg-green-700' };
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleTaskAction = (taskId: number, action: string) => {
    // This will be implemented when we add task status management
    console.log(`${action} task ${taskId}`);
    // For now, just navigate to task details
    navigate(`/tasker/tasks/${taskId}`);
  };

  if (isLoading && !myAssignments) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your assignments...</p>
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
            onClick={() => dispatch(getMyAssignmentsAsync())}
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
          <div className="py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Assignments</h1>
              <p className="mt-2 text-gray-600">Tasks assigned to you and their current status.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!myAssignments?.content?.length ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No assignments yet</h3>
            <p className="mt-1 text-sm text-gray-500">Keep bidding on tasks to get your first assignment.</p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/tasker/browse-tasks')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Browse Tasks
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {myAssignments.content.map((task: Task) => (
                <li key={task.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {task.title}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(task.status)}`}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                        {task.description}
                      </p>
                      
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {task.customerName || `Customer #${task.customerId}`}
                        </div>
                        
                        <div className="flex items-center">
                          <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                          ${task.budget.toLocaleString()}
                        </div>
                        
                        {task.location && (
                          <div className="flex items-center">
                            <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {task.isRemote ? 'Remote' : task.location}
                          </div>
                        )}
                        
                        {task.dueDate && (
                          <div className="flex items-center">
                            <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Due {formatDate(task.dueDate)}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => navigate(`/tasker/tasks/${task.id}`)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        View Details
                      </button>
                      
                      {(() => {
                        const statusAction = getStatusAction(task.status);
                        return statusAction ? (
                          <button
                            onClick={() => handleTaskAction(task.id, statusAction.action)}
                            className={`inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white ${statusAction.color} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                          >
                            {statusAction.text}
                          </button>
                        ) : null;
                      })()}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Pagination */}
        {myAssignments && myAssignments.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                disabled={myAssignments.first}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                disabled={myAssignments.last}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">{myAssignments.page * myAssignments.size + 1}</span>
                  {' '}to{' '}
                  <span className="font-medium">
                    {Math.min((myAssignments.page + 1) * myAssignments.size, myAssignments.totalElements)}
                  </span>
                  {' '}of{' '}
                  <span className="font-medium">{myAssignments.totalElements}</span>
                  {' '}results
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
