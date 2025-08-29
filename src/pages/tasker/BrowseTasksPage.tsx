import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { searchTasksAsync, getCategoriesAsync, selectSearchResults, selectCategories, selectTasksLoading, selectTasksError } from '../../store/slices/taskSlice';
import { TaskStatus } from '../../types';
import type { TaskSearchParams, TaskPriority, Task } from '../../types';

export default function BrowseTasksPage() {
  const dispatch = useAppDispatch();
  const searchResults = useAppSelector(selectSearchResults);
  const categories = useAppSelector(selectCategories);
  const isLoading = useAppSelector(selectTasksLoading);
  const error = useAppSelector(selectTasksError);

  const [searchParams, setSearchParams] = useState<TaskSearchParams>({
    status: TaskStatus.PUBLISHED,
    page: 0,
    size: 10,
    sortBy: 'createdAt',
    sortDirection: 'DESC'
  });

  const [filters, setFilters] = useState({
    categoryId: '',
    minBudget: '',
    maxBudget: '',
    location: '',
    isRemote: false,
    priority: '' as TaskPriority | '',
  });

  useEffect(() => {
    dispatch(getCategoriesAsync());
    if (!searchResults) {
      dispatch(searchTasksAsync(searchParams));
    }
  }, [dispatch, searchResults, searchParams]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFilters(prev => ({ ...prev, [name]: checked }));
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSearch = () => {
    const params: TaskSearchParams = {
      ...searchParams,
      page: 0, // Reset to first page
    };

    // Add filters to search params
    if (filters.categoryId) {
      params.categoryId = parseInt(filters.categoryId);
    }
    if (filters.minBudget) {
      params.minBudget = parseFloat(filters.minBudget);
    }
    if (filters.maxBudget) {
      params.maxBudget = parseFloat(filters.maxBudget);
    }
    if (filters.location) {
      params.location = filters.location;
    }
    if (filters.isRemote) {
      params.isRemote = filters.isRemote;
    }
    if (filters.priority) {
      params.priority = filters.priority;
    }

    setSearchParams(params);
    dispatch(searchTasksAsync(params));
  };

  const handleClearFilters = () => {
    const newFilters = {
      categoryId: '',
      minBudget: '',
      maxBudget: '',
      location: '',
      isRemote: false,
      priority: '' as TaskPriority | '',
    };
    setFilters(newFilters);
    
    const params: TaskSearchParams = {
      status: TaskStatus.PUBLISHED,
      page: 0,
      size: 10,
      sortBy: 'createdAt',
      sortDirection: 'DESC'
    };
    setSearchParams(params);
    dispatch(searchTasksAsync(params));
  };

  const handlePageChange = (newPage: number) => {
    const params = { ...searchParams, page: newPage };
    setSearchParams(params);
    dispatch(searchTasksAsync(params));
  };

  const getPriorityBadgeColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'LOW':
        return 'bg-gray-100 text-gray-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'HIGH':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading && !searchResults) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading available tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Browse Tasks</h1>
            <p className="mt-2 text-gray-600">Find tasks that match your skills and interests.</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Filters</h3>
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear all
                </button>
              </div>

              <div className="space-y-4">
                {/* Category */}
                <div>
                  <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    name="categoryId"
                    id="categoryId"
                    value={filters.categoryId}
                    onChange={handleFilterChange}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">All categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Budget Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Budget Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      name="minBudget"
                      placeholder="Min $"
                      value={filters.minBudget}
                      onChange={handleFilterChange}
                      className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <input
                      type="number"
                      name="maxBudget"
                      placeholder="Max $"
                      value={filters.maxBudget}
                      onChange={handleFilterChange}
                      className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    name="priority"
                    id="priority"
                    value={filters.priority}
                    onChange={handleFilterChange}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">All priorities</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>

                {/* Remote Work */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isRemote"
                    id="isRemote"
                    checked={filters.isRemote}
                    onChange={handleFilterChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isRemote" className="ml-2 block text-sm text-gray-900">
                    Remote work only
                  </label>
                </div>

                {/* Location */}
                {!filters.isRemote && (
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      id="location"
                      placeholder="Enter location"
                      value={filters.location}
                      onChange={handleFilterChange}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                )}

                <button
                  onClick={handleSearch}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* Tasks List */}
          <div className="lg:col-span-3 mt-8 lg:mt-0">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error loading tasks</h3>
                    <p className="mt-1 text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {!searchResults?.content?.length ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your search filters to find more tasks.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {searchResults.content.map((task: Task) => (
                  <div key={task.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {task.title}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {task.description}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                          <div className="flex items-center">
                            <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            <span className="font-semibold text-green-600">${task.budget.toLocaleString()}</span>
                          </div>
                          
                          <div className="flex items-center">
                            <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {task.isRemote ? 'Remote' : task.location}
                          </div>
                          
                          {task.dueDate && (
                            <div className="flex items-center">
                              <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Due {formatDate(task.dueDate)}
                            </div>
                          )}
                          
                          {task.estimatedDuration && (
                            <div className="flex items-center">
                              <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {task.estimatedDuration}h estimated
                            </div>
                          )}
                          
                          <div className="flex items-center">
                            <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Posted by {task.customerName || 'Customer'}
                          </div>
                        </div>
                        
                        {task.categoryName && (
                          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {task.categoryName}
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-6 flex-shrink-0">
                        <Link
                          to={`/tasker/tasks/${task.id}`}
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {searchResults && searchResults.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(searchResults.page - 1)}
                    disabled={searchResults.first || isLoading}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(searchResults.page + 1)}
                    disabled={searchResults.last || isLoading}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{' '}
                      <span className="font-medium">{searchResults.page * searchResults.size + 1}</span>
                      {' '}to{' '}
                      <span className="font-medium">
                        {Math.min((searchResults.page + 1) * searchResults.size, searchResults.totalElements)}
                      </span>
                      {' '}of{' '}
                      <span className="font-medium">{searchResults.totalElements}</span>
                      {' '}results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => handlePageChange(searchResults.page - 1)}
                        disabled={searchResults.first || isLoading}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => handlePageChange(searchResults.page + 1)}
                        disabled={searchResults.last || isLoading}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
