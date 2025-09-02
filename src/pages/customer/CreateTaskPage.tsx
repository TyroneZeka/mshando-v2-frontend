import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { createTaskAsync, getCategoriesAsync, selectCategories, selectTasksCreating, selectTasksError } from '../../store/slices/taskSlice';
import { toast } from 'react-hot-toast';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { UserRole } from '../../types';
import type { CreateTaskRequest, TaskPriority } from '../../types';

export default function CreateTaskPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);
  const isCreating = useAppSelector(selectTasksCreating);
  const error = useAppSelector(selectTasksError);

  const [formData, setFormData] = useState<CreateTaskRequest>({
    title: '',
    description: '',
    requirementsDescription: '',
    budget: 0,
    priority: 'MEDIUM' as TaskPriority,
    location: '',
    isRemote: false,
    dueDate: '',
    estimatedDuration: undefined,
    categoryId: undefined,
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    dispatch(getCategoriesAsync());
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      let processedValue: string | number | undefined = value;
      
      if (name === 'budget' || name === 'estimatedDuration') {
        processedValue = value === '' ? 0 : parseFloat(value);
      } else if (name === 'categoryId') {
        processedValue = value === '' ? undefined : parseInt(value);
      }
      
      setFormData(prev => ({ ...prev, [name]: processedValue }));
    }

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      errors.title = 'Title must be at least 5 characters';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      errors.description = 'Description must be at least 20 characters';
    }

    if (!formData.requirementsDescription.trim()) {
      errors.requirementsDescription = 'Requirements are required';
    }

    if (formData.budget <= 0) {
      errors.budget = 'Budget must be greater than 0';
    }

    if (!formData.isRemote && !formData.location?.trim()) {
      errors.location = 'Location is required for non-remote tasks';
    }

    if (formData.dueDate) {
      const dueDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        errors.dueDate = 'Due date cannot be in the past';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the validation errors');
      return;
    }

    try {
      // Prepare the task data with properly formatted dueDate
      const taskData = { ...formData };
      
      // If dueDate is provided, convert from date string to LocalDateTime format
      if (taskData.dueDate) {
        // Convert "YYYY-MM-DD" to "YYYY-MM-DDTHH:mm:ss" (default to 09:00:00)
        taskData.dueDate = taskData.dueDate + 'T09:00:00';
      }

      const task = await dispatch(createTaskAsync(taskData)).unwrap();
      toast.success('Task created successfully!');
      navigate(`/customer/tasks/${task.id}`);
    } catch {
      toast.error(error || 'Failed to create task');
    }
  };

  const handleCancel = () => {
    navigate('/customer');
  };

  return (
    <DashboardLayout 
      userRole={UserRole.CUSTOMER}
      title="Create New Task"
      subtitle="Provide details about the task you need completed."
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Task Title *
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  validationErrors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter a clear, descriptive title for your task"
                maxLength={100}
              />
              {validationErrors.title && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                name="description"
                id="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  validationErrors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Describe what you need done in detail..."
              />
              {validationErrors.description && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                {formData.description.length}/1000 characters
              </p>
            </div>

            {/* Requirements */}
            <div>
              <label htmlFor="requirementsDescription" className="block text-sm font-medium text-gray-700">
                Requirements & Deliverables *
              </label>
              <textarea
                name="requirementsDescription"
                id="requirementsDescription"
                rows={3}
                value={formData.requirementsDescription}
                onChange={handleInputChange}
                className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  validationErrors.requirementsDescription ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="List specific requirements, deliverables, and expectations..."
              />
              {validationErrors.requirementsDescription && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.requirementsDescription}</p>
              )}
            </div>

            {/* Budget and Priority */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                  Budget ($) *
                </label>
                <input
                  type="number"
                  name="budget"
                  id="budget"
                  min="1"
                  step="0.01"
                  value={formData.budget || ''}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    validationErrors.budget ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                {validationErrors.budget && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.budget}</p>
                )}
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <select
                  name="priority"
                  id="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                name="categoryId"
                id="categoryId"
                value={formData.categoryId || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select a category (optional)</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isRemote"
                  id="isRemote"
                  checked={formData.isRemote}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isRemote" className="ml-2 block text-sm text-gray-900">
                  This task can be done remotely
                </label>
              </div>

              {!formData.isRemote && (
                <div className="mt-3">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    id="location"
                    value={formData.location || ''}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      validationErrors.location ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter the task location"
                  />
                  {validationErrors.location && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.location}</p>
                  )}
                </div>
              )}
            </div>

            {/* Due Date and Estimated Duration */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  id="dueDate"
                  value={formData.dueDate || ''}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    validationErrors.dueDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {validationErrors.dueDate && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.dueDate}</p>
                )}
              </div>

              <div>
                <label htmlFor="estimatedDuration" className="block text-sm font-medium text-gray-700">
                  Estimated Duration (hours)
                </label>
                <input
                  type="number"
                  name="estimatedDuration"
                  id="estimatedDuration"
                  min="0.5"
                  step="0.5"
                  value={formData.estimatedDuration || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="0.0"
                />
              </div>
            </div>

            {/* Submit buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? 'Creating...' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
