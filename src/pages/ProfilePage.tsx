import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { updateProfileAsync, selectUser, selectAuthLoading } from '../store/slices/authSlice';
import { toast } from 'react-hot-toast';
import type { UserRole, ProfileUpdateRequest } from '../types';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectUser);
  const isLoading = useAppSelector(selectAuthLoading);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileUpdateRequest>({
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    bio: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    hourlyRate: undefined,
    skills: '',
    availability: '',
    languages: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        email: currentUser.email || '',
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        phoneNumber: currentUser.phoneNumber || '',
        bio: currentUser.bio || '',
        address: currentUser.address || '',
        city: currentUser.city || '',
        state: currentUser.state || '',
        postalCode: currentUser.postalCode || '',
        country: currentUser.country || '',
        hourlyRate: currentUser.hourlyRate,
        skills: currentUser.skills || '',
        availability: currentUser.availability || '',
        languages: currentUser.languages || '',
        emergencyContactName: currentUser.emergencyContactName || '',
        emergencyContactPhone: currentUser.emergencyContactPhone || '',
      });
    }
  }, [currentUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? (value ? parseFloat(value) : undefined) : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(updateProfileAsync(formData)).unwrap();
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    if (currentUser) {
      setFormData({
        email: currentUser.email || '',
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        phoneNumber: currentUser.phoneNumber || '',
        bio: currentUser.bio || '',
        address: currentUser.address || '',
        city: currentUser.city || '',
        state: currentUser.state || '',
        postalCode: currentUser.postalCode || '',
        country: currentUser.country || '',
        hourlyRate: currentUser.hourlyRate,
        skills: currentUser.skills || '',
        availability: currentUser.availability || '',
        languages: currentUser.languages || '',
        emergencyContactName: currentUser.emergencyContactName || '',
        emergencyContactPhone: currentUser.emergencyContactPhone || '',
      });
    }
    setIsEditing(false);
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'CUSTOMER':
        return 'bg-blue-100 text-blue-800';
      case 'TASKER':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const parseSkills = (skillsStr: string): string[] => {
    if (!skillsStr) return [];
    try {
      return JSON.parse(skillsStr);
    } catch {
      return [];
    }
  };

  const parseLanguages = (languagesStr: string): string[] => {
    if (!languagesStr) return [];
    try {
      return JSON.parse(languagesStr);
    } catch {
      return [];
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="mt-2 text-gray-600">Manage your account information and preferences.</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Personal Information Section */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="-ml-0.5 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="px-6 py-6">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Basic Information</h4>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        value={formData.firstName || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter your first name"
                      />
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        value={formData.lastName || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter your last name"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email || ''}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter your email address"
                      />
                    </div>

                    <div>
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        id="phoneNumber"
                        value={formData.phoneNumber || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      id="bio"
                      rows={4}
                      value={formData.bio || ''}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>

                {/* Address Information */}
                <div className="border-t border-gray-200 pt-8">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Address Information</h4>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        id="address"
                        value={formData.address || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter your street address"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
                      <div className="sm:col-span-2">
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          id="city"
                          value={formData.city || ''}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Enter your city"
                        />
                      </div>

                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          id="state"
                          value={formData.state || ''}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="State"
                        />
                      </div>

                      <div>
                        <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          id="postalCode"
                          value={formData.postalCode || ''}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="ZIP"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                        Country
                      </label>
                      <select
                        name="country"
                        id="country"
                        value={formData.country || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="">Select a country</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="AU">Australia</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                        <option value="ES">Spain</option>
                        <option value="IT">Italy</option>
                        <option value="NL">Netherlands</option>
                        <option value="SE">Sweden</option>
                        <option value="NO">Norway</option>
                        <option value="DK">Denmark</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Tasker-specific fields */}
                {currentUser.role === 'TASKER' && (
                  <div className="border-t border-gray-200 pt-8">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Tasker Information</h4>
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700">
                          Hourly Rate ($)
                        </label>
                        <input
                          type="number"
                          name="hourlyRate"
                          id="hourlyRate"
                          min="0"
                          step="0.01"
                          value={formData.hourlyRate || ''}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Enter your hourly rate"
                        />
                      </div>

                      <div>
                        <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                          Skills (JSON format)
                        </label>
                        <textarea
                          name="skills"
                          id="skills"
                          rows={3}
                          value={formData.skills || ''}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder='["Cleaning", "Plumbing", "Carpentry"]'
                        />
                        <p className="mt-1 text-xs text-gray-500">Enter your skills as a JSON array</p>
                      </div>

                      <div>
                        <label htmlFor="availability" className="block text-sm font-medium text-gray-700">
                          Availability Schedule (JSON format)
                        </label>
                        <textarea
                          name="availability"
                          id="availability"
                          rows={4}
                          value={formData.availability || ''}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder='{"monday": "9:00-17:00", "tuesday": "9:00-17:00"}'
                        />
                        <p className="mt-1 text-xs text-gray-500">Enter your availability as a JSON object</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional Information */}
                <div className="border-t border-gray-200 pt-8">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Additional Information</h4>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label htmlFor="languages" className="block text-sm font-medium text-gray-700">
                        Languages (JSON format)
                      </label>
                      <input
                        type="text"
                        name="languages"
                        id="languages"
                        value={formData.languages || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder='["English", "Spanish", "French"]'
                      />
                      <p className="mt-1 text-xs text-gray-500">Enter languages as a JSON array</p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="emergencyContactName" className="block text-sm font-medium text-gray-700">
                          Emergency Contact Name
                        </label>
                        <input
                          type="text"
                          name="emergencyContactName"
                          id="emergencyContactName"
                          value={formData.emergencyContactName || ''}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Enter emergency contact name"
                        />
                      </div>

                      <div>
                        <label htmlFor="emergencyContactPhone" className="block text-sm font-medium text-gray-700">
                          Emergency Contact Phone
                        </label>
                        <input
                          type="tel"
                          name="emergencyContactPhone"
                          id="emergencyContactPhone"
                          value={formData.emergencyContactPhone || ''}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Enter emergency contact phone"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 border-t border-gray-200 pt-6">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-8">
                {/* Basic Information Display */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Basic Information</h4>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Username</dt>
                      <dd className="mt-1 text-sm text-gray-900">{currentUser.username}</dd>
                    </div>

                    <div>
                      <dt className="text-sm font-medium text-gray-500">Role</dt>
                      <dd className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(currentUser.role)}`}>
                          {currentUser.role}
                        </span>
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm font-medium text-gray-500">First Name</dt>
                      <dd className="mt-1 text-sm text-gray-900">{currentUser.firstName || 'Not provided'}</dd>
                    </div>

                    <div>
                      <dt className="text-sm font-medium text-gray-500">Last Name</dt>
                      <dd className="mt-1 text-sm text-gray-900">{currentUser.lastName || 'Not provided'}</dd>
                    </div>

                    <div>
                      <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                      <dd className="mt-1 text-sm text-gray-900">{currentUser.email}</dd>
                    </div>

                    <div>
                      <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                      <dd className="mt-1 text-sm text-gray-900">{currentUser.phoneNumber || 'Not provided'}</dd>
                    </div>

                    <div>
                      <dt className="text-sm font-medium text-gray-500">Email Verified</dt>
                      <dd className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          currentUser.emailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {currentUser.emailVerified ? 'Verified' : 'Pending'}
                        </span>
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm font-medium text-gray-500">Member Since</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {new Date(currentUser.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </dd>
                    </div>
                  </div>

                  {currentUser.bio && (
                    <div className="mt-6">
                      <dt className="text-sm font-medium text-gray-500">Bio</dt>
                      <dd className="mt-1 text-sm text-gray-900">{currentUser.bio}</dd>
                    </div>
                  )}
                </div>

                {/* Address Information Display */}
                {(currentUser.address || currentUser.city || currentUser.state || currentUser.postalCode || currentUser.country) && (
                  <div className="border-t border-gray-200 pt-8">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Address Information</h4>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      {currentUser.address && (
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">Street Address</dt>
                          <dd className="mt-1 text-sm text-gray-900">{currentUser.address}</dd>
                        </div>
                      )}

                      {currentUser.city && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">City</dt>
                          <dd className="mt-1 text-sm text-gray-900">{currentUser.city}</dd>
                        </div>
                      )}

                      {currentUser.state && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">State</dt>
                          <dd className="mt-1 text-sm text-gray-900">{currentUser.state}</dd>
                        </div>
                      )}

                      {currentUser.postalCode && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Postal Code</dt>
                          <dd className="mt-1 text-sm text-gray-900">{currentUser.postalCode}</dd>
                        </div>
                      )}

                      {currentUser.country && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Country</dt>
                          <dd className="mt-1 text-sm text-gray-900">{currentUser.country}</dd>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Tasker-specific information */}
                {currentUser.role === 'TASKER' && (
                  <div className="border-t border-gray-200 pt-8">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Tasker Information</h4>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      {currentUser.hourlyRate && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Hourly Rate</dt>
                          <dd className="mt-1 text-sm text-gray-900">${currentUser.hourlyRate.toFixed(2)}/hour</dd>
                        </div>
                      )}

                      {currentUser.averageRating && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Average Rating</dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {currentUser.averageRating.toFixed(1)} ⭐ ({currentUser.totalReviews || 0} reviews)
                          </dd>
                        </div>
                      )}

                      {currentUser.totalTasksCompleted && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Tasks Completed</dt>
                          <dd className="mt-1 text-sm text-gray-900">{currentUser.totalTasksCompleted}</dd>
                        </div>
                      )}

                      {currentUser.isBackgroundChecked !== undefined && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Background Check</dt>
                          <dd className="mt-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              currentUser.isBackgroundChecked ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {currentUser.isBackgroundChecked ? 'Verified' : 'Pending'}
                            </span>
                          </dd>
                        </div>
                      )}

                      {currentUser.skills && (
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">Skills</dt>
                          <dd className="mt-1">
                            <div className="flex flex-wrap gap-2">
                              {parseSkills(currentUser.skills).map((skill, index) => (
                                <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </dd>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Additional Information Display */}
                {(currentUser.languages || currentUser.emergencyContactName || currentUser.emergencyContactPhone) && (
                  <div className="border-t border-gray-200 pt-8">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Additional Information</h4>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      {currentUser.languages && (
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">Languages</dt>
                          <dd className="mt-1">
                            <div className="flex flex-wrap gap-2">
                              {parseLanguages(currentUser.languages).map((language, index) => (
                                <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  {language}
                                </span>
                              ))}
                            </div>
                          </dd>
                        </div>
                      )}

                      {currentUser.emergencyContactName && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Emergency Contact</dt>
                          <dd className="mt-1 text-sm text-gray-900">{currentUser.emergencyContactName}</dd>
                        </div>
                      )}

                      {currentUser.emergencyContactPhone && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Emergency Contact Phone</dt>
                          <dd className="mt-1 text-sm text-gray-900">{currentUser.emergencyContactPhone}</dd>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
