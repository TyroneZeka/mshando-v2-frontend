import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { searchTasksAsync, selectTasksList, selectTasksLoading } from '../../store/slices/taskSlice';
import type { Task, TaskStatus } from '../../types';
import { TaskStatus as TaskStatusEnum } from '../../types';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { UserRole } from '../../types';

export default function TaskerDashboard() {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectTasksList);
  const isLoading = useAppSelector(selectTasksLoading);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'ALL'>('ALL');

  useEffect(() => {
    dispatch(searchTasksAsync({}));
  }, [dispatch]);

  const availableTasks = tasks.filter((task: Task) => task.status === TaskStatusEnum.PUBLISHED);
  const filteredTasks = statusFilter === 'ALL' ? tasks : tasks.filter((task: Task) => task.status === statusFilter);

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatusEnum.PUBLISHED:
        return 'bg-green-100 text-green-800';
      case TaskStatusEnum.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800';
      case TaskStatusEnum.COMPLETED:
        return 'bg-gray-100 text-gray-800';
      case TaskStatusEnum.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <DashboardLayout 
        userRole={UserRole.TASKER}
        title="Dashboard"
        subtitle="Welcome to your tasker dashboard"
      >
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      userRole={UserRole.TASKER}
      title="Dashboard"
      subtitle="Welcome to your tasker dashboard"
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{availableTasks.length}</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Available Tasks
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {availableTasks.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {tasks.filter((task: Task) => task.status === TaskStatusEnum.IN_PROGRESS).length}
                  </span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    In Progress
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {tasks.filter((task: Task) => task.status === TaskStatusEnum.IN_PROGRESS).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {tasks.filter((task: Task) => task.status === TaskStatusEnum.COMPLETED).length}
                  </span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Completed
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {tasks.filter((task: Task) => task.status === TaskStatusEnum.COMPLETED).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">$</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Earnings
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {formatCurrency(
                      tasks
                        .filter((task: Task) => task.status === TaskStatusEnum.COMPLETED)
                        .reduce((total: number, task: Task) => total + task.budget, 0)
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Tasks
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Browse and manage available tasks
            </p>
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'ALL')}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="ALL">All Tasks</option>
              <option value={TaskStatusEnum.PUBLISHED}>Available</option>
              <option value={TaskStatusEnum.IN_PROGRESS}>In Progress</option>
              <option value={TaskStatusEnum.COMPLETED}>Completed</option>
              <option value={TaskStatusEnum.CANCELLED}>Cancelled</option>
            </select>
          </div>
        </div>
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {statusFilter === 'ALL' 
                ? 'No tasks are available at the moment.'
                : `No tasks with status "${statusFilter}" found.`
              }
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredTasks.map((task: Task) => (
              <li key={task.id} className="px-4 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {task.title}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {task.description}
                      </p>
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
                    {task.status === TaskStatusEnum.PUBLISHED && (
                      <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 px-3 rounded">
                        Apply
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </DashboardLayout>
  );
}
