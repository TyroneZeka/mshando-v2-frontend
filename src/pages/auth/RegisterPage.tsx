import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { registerAsync, selectAuthLoading, selectAuthError, clearError } from '../../store/slices/authSlice';
import { toast } from 'react-hot-toast';
import type { UserRole } from '../../types';

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phoneNumber?: string;
  general?: string;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: 'CUSTOMER' as UserRole,
  });

  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  // Validation functions
  const validateUsername = (username: string): string | undefined => {
    if (!username.trim()) return 'Username is required';
    if (username.length < 3) return 'Username must be at least 3 characters';
    if (username.length > 50) return 'Username must be less than 50 characters';
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Username can only contain letters, numbers, and underscores';
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/(?=.*[a-z])/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/(?=.*\d)/.test(password)) return 'Password must contain at least one number';
    return undefined;
  };

  const validateConfirmPassword = (password: string, confirmPassword: string): string | undefined => {
    if (!confirmPassword) return 'Please confirm your password';
    if (password !== confirmPassword) return 'Passwords do not match';
    return undefined;
  };

  const validatePhoneNumber = (phoneNumber: string): string | undefined => {
    if (!phoneNumber.trim()) return undefined; // Phone is optional
    // Remove all non-digit characters for validation
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    if (digitsOnly.length < 10) return 'Phone number must be at least 10 digits';
    if (digitsOnly.length > 15) return 'Phone number must be less than 15 digits';
    // Basic international format validation
    if (!/^[+]?[\d\s\-()]{10,15}$/.test(phoneNumber)) {
      return 'Please enter a valid phone number (e.g., +1-234-567-8900)';
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    errors.username = validateUsername(formData.username);
    errors.email = validateEmail(formData.email);
    errors.password = validatePassword(formData.password);
    errors.confirmPassword = validateConfirmPassword(formData.password, formData.confirmPassword);
    errors.phoneNumber = validatePhoneNumber(formData.phoneNumber);

    setFieldErrors(errors);

    // Return true if no errors
    return !Object.values(errors).some(error => error !== undefined);
  };

  const parseBackendError = (errorMessage: string): FormErrors => {
    const errors: FormErrors = {};
    
    // Handle common backend error messages
    if (errorMessage.toLowerCase().includes('username') && errorMessage.toLowerCase().includes('already exists')) {
      errors.username = 'This username is already taken';
    } else if (errorMessage.toLowerCase().includes('email') && errorMessage.toLowerCase().includes('already exists')) {
      errors.email = 'This email is already registered';
    } else if (errorMessage.toLowerCase().includes('phone') && errorMessage.toLowerCase().includes('invalid')) {
      errors.phoneNumber = 'Invalid phone number format';
    } else if (errorMessage.toLowerCase().includes('password')) {
      errors.password = errorMessage;
    } else {
      errors.general = errorMessage;
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setFieldErrors({});
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...registrationData } = formData;
      // Convert empty phone number to undefined to avoid validation errors
      const finalData = {
        ...registrationData,
        phoneNumber: registrationData.phoneNumber.trim() || undefined
      };
      
      await dispatch(registerAsync(finalData)).unwrap();
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      
      // Parse backend error and set field-specific errors
      if (typeof error === 'string') {
        const backendErrors = parseBackendError(error);
        setFieldErrors(backendErrors);
        
        // Show toast for general errors
        if (backendErrors.general) {
          toast.error(backendErrors.general);
        }
      } else {
        setFieldErrors({ general: 'Registration failed. Please try again.' });
        toast.error('Registration failed. Please try again.');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field-specific error when user starts typing
    if (fieldErrors[name as keyof FormErrors]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
    
    // Clear general error when user starts typing
    if (error) {
      dispatch(clearError());
    }

    // Real-time validation for certain fields
    if (name === 'phoneNumber' && value.trim()) {
      const phoneError = validatePhoneNumber(value);
      if (phoneError) {
        setFieldErrors(prev => ({ ...prev, phoneNumber: phoneError }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className={`mt-1 appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none sm:text-sm ${
                  fieldErrors.username 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="Enter your username"
              />
              {fieldErrors.username && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.username}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none sm:text-sm ${
                  fieldErrors.email 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="Enter your email"
              />
              {fieldErrors.email && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`mt-1 appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none sm:text-sm ${
                  fieldErrors.phoneNumber 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="+1-234-567-8900"
              />
              {fieldErrors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.phoneNumber}</p>
              )}
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                I want to <span className="text-red-500">*</span>
              </label>
              <select
                id="role"
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="CUSTOMER">Post tasks and hire taskers</option>
                <option value="TASKER">Find work and complete tasks</option>
              </select>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none sm:text-sm ${
                  fieldErrors.password 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="Enter your password"
              />
              {fieldErrors.password && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Must be at least 8 characters with uppercase, lowercase, and number
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`mt-1 appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none sm:text-sm ${
                  fieldErrors.confirmPassword 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="Confirm your password"
              />
              {fieldErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            {(error || fieldErrors.general) && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">
                  {fieldErrors.general || error}
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
