import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { 
  getMyTasksAsync, 
  publishTaskAsync,
  deleteTaskAsync,
  selectMyTasks, 
  selectTasksLoading,
  selectTasksError
} from '../../store/slices/taskSlice';
import type { Task } from '../../types';
import { TaskStatus as TaskStatusEnum } from '../../types';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { UserRole } from '../../types';
import { toast } from 'react-hot-toast';

export default function MyTasksPage() {
  const dispatch = useAppDispatch();
  const myTasksData = useAppSelector(selectMyTasks);
  const isLoading = useAppSelector(selectTasksLoading);
  const error = useAppSelector(selectTasksError);
  const [deleteTaskId, setDeleteTaskId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(getMyTasksAsync({}));
  }, [dispatch]);

  const tasks = myTasksData?.content || [];

  const handleUpdateStatus = async (taskId: number, newStatus: string) => {
    try {
      if (newStatus === TaskStatusEnum.PUBLISHED) {
        await dispatch(publishTaskAsync(taskId)).unwrap();
        toast.success('Task published successfully');
      } else {
        // For other status changes, we'd need different async thunks
        // For now, just show a message
        toast('Status change not implemented yet');
        return;
      }
      dispatch(getMyTasksAsync({}));
    } catch {
      toast.error(error || 'Failed to update task status');
    }
  };

  const handleDeleteTask = async () => {
    if (!deleteTaskId) return;
    
    try {
      await dispatch(deleteTaskAsync(deleteTaskId)).unwrap();
      toast.success('Task deleted successfully');
      setDeleteTaskId(null);
      dispatch(getMyTasksAsync({}));
    } catch {
      toast.error(error || 'Failed to delete task');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case TaskStatusEnum.DRAFT:
        return 'bg-gray-100 text-gray-800';
      case TaskStatusEnum.PUBLISHED:
        return 'bg-green-100 text-green-800';
      case TaskStatusEnum.ASSIGNED:
        return 'bg-yellow-100 text-yellow-800';
      case TaskStatusEnum.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800';
      case TaskStatusEnum.COMPLETED:
        return 'bg-purple-100 text-purple-800';
      case TaskStatusEnum.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case TaskStatusEnum.DRAFT:
        return TaskStatusEnum.PUBLISHED;
      case TaskStatusEnum.PUBLISHED:
        return TaskStatusEnum.CANCELLED;
      case TaskStatusEnum.ASSIGNED:
        return TaskStatusEnum.IN_PROGRESS;
      case TaskStatusEnum.IN_PROGRESS:
        return TaskStatusEnum.COMPLETED;
      default:
        return null;
    }
  };

  const getStatusActionText = (currentStatus: string) => {
    switch (currentStatus) {
      case TaskStatusEnum.DRAFT:
        return 'Publish';
      case TaskStatusEnum.PUBLISHED:
        return 'Cancel';
      case TaskStatusEnum.ASSIGNED:
        return 'Start Work';
      case TaskStatusEnum.IN_PROGRESS:
        return 'Mark Complete';
      default:
        return null;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout 
        userRole={UserRole.CUSTOMER}
        title="My Tasks"
        subtitle="Manage your tasks and track their progress"
      >
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      userRole={UserRole.CUSTOMER}
      title="My Tasks"
      subtitle="Manage your tasks and track their progress"
    >
      <div className="sm:flex sm:items-center mb-6">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">My Tasks</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all your tasks including their title, status, budget and creation date.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/customer/tasks/create"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            Create Task
          </Link>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-12 w-12">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new task.</p>
          <div className="mt-6">
            <Link
              to="/customer/tasks/create"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create your first task
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {tasks.map((task: Task) => (
              <li key={task.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="ml-4 flex-1 min-w-0">
                        <Link
                          to={`/customer/tasks/${task.id}`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-500 truncate"
                        >
                          {task.title}
                        </Link>
                        <p className="text-sm text-gray-500 truncate">
                          {task.description}
                        </p>
                        <div className="mt-2 flex items-center text-xs text-gray-500">
                          <span>Created {formatDate(task.createdAt)}</span>
                          {task.dueDate && (
                            <>
                              <span className="mx-2">•</span>
                              <span>Due {formatDate(task.dueDate)}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(task.budget)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {task.priority} Priority
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          to={`/customer/tasks/${task.id}`}
                          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                        >
                          View
                        </Link>
                        {task.status === TaskStatusEnum.DRAFT && (
                          <Link
                            to={`/customer/tasks/${task.id}/edit`}
                            className="text-green-600 hover:text-green-900 text-sm font-medium"
                          >
                            Edit
                          </Link>
                        )}
                        {getNextStatus(task.status) && (
                          <button
                            onClick={() => handleUpdateStatus(task.id, getNextStatus(task.status)!)}
                            className="text-purple-600 hover:text-purple-900 text-sm font-medium"
                          >
                            {getStatusActionText(task.status)}
                          </button>
                        )}
                        {(task.status === TaskStatusEnum.DRAFT || task.status === TaskStatusEnum.PUBLISHED) && (
                          <button
                            onClick={() => setDeleteTaskId(task.id)}
                            className="text-red-600 hover:text-red-900 text-sm font-medium"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTaskId && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-2">Delete Task</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this task? This action cannot be undone.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={handleDeleteTask}
                  className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-24 mr-2 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteTaskId(null)}
                  className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-24 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
