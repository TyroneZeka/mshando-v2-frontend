import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import type { AppDispatch } from '../../store';
import {
  createPaymentAsync,
  processPaymentAsync,
  selectPaymentsCreating,
  selectPaymentsProcessing,
  selectPaymentsError,
  clearError
} from '../../store/slices/paymentSlice';
import { selectUser } from '../../store/slices/authSlice';
import type { CreatePaymentRequest, PaymentType } from '../../types';

const PaymentProcessing: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId: string }>();
  const user = useSelector(selectUser);
  const isCreating = useSelector(selectPaymentsCreating);
  const isProcessing = useSelector(selectPaymentsProcessing);
  const error = useSelector(selectPaymentsError);

  const [formData, setFormData] = useState({
    amount: '',
    paymentMethod: 'CARD',
    description: ''
  });

  const [paymentStep, setPaymentStep] = useState<'details' | 'confirmation' | 'processing' | 'success'>('details');
  const [createdPaymentId, setCreatedPaymentId] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id || !taskId) return;

    const paymentData: CreatePaymentRequest = {
      customerId: user.id,
      taskId: parseInt(taskId),
      amount: parseFloat(formData.amount),
      paymentType: 'TASK_PAYMENT' as PaymentType,
      description: formData.description || `Payment for task #${taskId}`
    };

    try {
      const result = await dispatch(createPaymentAsync(paymentData));
      if (createPaymentAsync.fulfilled.match(result)) {
        setCreatedPaymentId(result.payload.id);
        setPaymentStep('confirmation');
      }
    } catch (error) {
      console.error('Failed to create payment:', error);
    }
  };

  const handleProcessPayment = async () => {
    if (!createdPaymentId) return;

    setPaymentStep('processing');
    
    try {
      const result = await dispatch(processPaymentAsync(createdPaymentId));
      if (processPaymentAsync.fulfilled.match(result)) {
        setPaymentStep('success');
        // Auto-redirect after 3 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      }
    } catch (error) {
      console.error('Failed to process payment:', error);
      setPaymentStep('confirmation');
    }
  };

  const calculateServiceFee = (amount: number) => {
    return amount * 0.05; // 5% service fee
  };

  const calculateTotal = (amount: number) => {
    return amount + calculateServiceFee(amount);
  };

  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  if (paymentStep === 'success') {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md text-center">
        <div className="mb-4">
          <svg className="mx-auto h-16 w-16 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
        <p className="text-gray-600 mb-4">Your payment has been processed successfully.</p>
        <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
      </div>
    );
  }

  if (paymentStep === 'processing') {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md text-center">
        <div className="mb-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment</h2>
        <p className="text-gray-600">Please wait while we process your payment...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Processing</h1>
        <p className="text-gray-600">Complete your payment for Task #{taskId}</p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
            paymentStep === 'details' ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-gray-300 text-gray-600'
          }`}>
            1
          </div>
          <div className={`flex-1 h-1 mx-4 ${
            paymentStep === 'confirmation' ? 'bg-blue-600' : 'bg-gray-300'
          }`}></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
            paymentStep === 'confirmation' ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-gray-300 text-gray-600'
          }`}>
            2
          </div>
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-sm text-gray-600">Payment Details</span>
          <span className="text-sm text-gray-600">Confirmation</span>
        </div>
      </div>

      {paymentStep === 'details' && (
        <div className="bg-white shadow rounded-lg">
          <form onSubmit={handleCreatePayment} className="p-6 space-y-6">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Payment Amount *
              </label>
              <div className="relative">
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
                  min="1"
                  required
                  className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method *
              </label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="CARD">Credit/Debit Card</option>
                <option value="PAYPAL">PayPal</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="DIGITAL_WALLET">Digital Wallet</option>
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Additional notes about this payment..."
              />
            </div>

            {/* Payment Summary */}
            {formData.amount && (
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Payment Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Task Payment:</span>
                    <span className="font-medium">${parseFloat(formData.amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Fee (5%):</span>
                    <span className="font-medium">${calculateServiceFee(parseFloat(formData.amount)).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">Total:</span>
                      <span className="text-lg font-semibold text-gray-900">
                        ${calculateTotal(parseFloat(formData.amount)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating || !formData.amount}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? 'Creating...' : 'Continue to Confirmation'}
              </button>
            </div>
          </form>
        </div>
      )}

      {paymentStep === 'confirmation' && (
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Confirm Your Payment</h2>
            
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Payment Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Task ID:</span>
                  <span className="font-medium">#{taskId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium">{formData.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Task Payment:</span>
                  <span className="font-medium">${parseFloat(formData.amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Fee:</span>
                  <span className="font-medium">${calculateServiceFee(parseFloat(formData.amount)).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                    <span className="text-lg font-semibold text-gray-900">
                      ${calculateTotal(parseFloat(formData.amount)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setPaymentStep('details')}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Edit
              </button>
              <button
                type="button"
                onClick={handleProcessPayment}
                disabled={isProcessing}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Process Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentProcessing;
