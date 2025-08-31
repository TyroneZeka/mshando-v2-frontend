import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { createBidAsync, selectBidsCreating, selectBidsError } from '../../store/slices/bidSlice';
import { toast } from 'react-hot-toast';

export default function CreateBidPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { taskId } = useParams<{ taskId: string }>();
  const isCreating = useAppSelector(selectBidsCreating);
  const error = useAppSelector(selectBidsError);

  const [formData, setFormData] = useState({
    amount: '',
    message: '',
    estimatedCompletionHours: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid bid amount';
    }

    if (!formData.estimatedCompletionHours || parseInt(formData.estimatedCompletionHours) <= 0) {
      newErrors.estimatedCompletionHours = 'Please enter valid estimated hours';
    }

    if (formData.message.trim().length < 10) {
      newErrors.message = 'Please provide a detailed message (at least 10 characters)';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!taskId) {
      toast.error('Task ID is missing');
      return;
    }

    try {
      await dispatch(createBidAsync({
        taskId: parseInt(taskId),
        amount: parseFloat(formData.amount),
        message: formData.message.trim(),
        estimatedCompletionHours: parseInt(formData.estimatedCompletionHours),
      })).unwrap();

      toast.success('Bid submitted successfully!');
      navigate('/tasker/my-bids');
    } catch {
      toast.error('Failed to submit bid');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 inline-flex items-center text-gray-600 hover:text-gray-900"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Submit Your Bid</h1>
              <p className="mt-2 text-gray-600">Place a competitive bid for this task.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Bid Amount ($) *
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className={`block w-full pl-7 pr-12 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.amount ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Enter your competitive bid amount for completing this task.
              </p>
            </div>

            <div>
              <label htmlFor="estimatedCompletionHours" className="block text-sm font-medium text-gray-700">
                Estimated Completion Time (hours) *
              </label>
              <input
                type="number"
                id="estimatedCompletionHours"
                name="estimatedCompletionHours"
                value={formData.estimatedCompletionHours}
                onChange={handleInputChange}
                min="1"
                className={`mt-1 block w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.estimatedCompletionHours ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="24"
              />
              {errors.estimatedCompletionHours && (
                <p className="mt-1 text-sm text-red-600">{errors.estimatedCompletionHours}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                How many hours do you estimate it will take to complete this task?
              </p>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Proposal Message *
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                value={formData.message}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.message ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Explain your approach, relevant experience, and why you're the best fit for this task..."
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-600">{errors.message}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Describe your approach and why you're the best choice for this task. Be specific and professional.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Tips for a winning bid</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Be competitive but realistic with your pricing</li>
                      <li>Provide a detailed explanation of your approach</li>
                      <li>Highlight relevant experience and skills</li>
                      <li>Ask clarifying questions if needed</li>
                      <li>Be professional and responsive</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white inline-block" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit Bid'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
