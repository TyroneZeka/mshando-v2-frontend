import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import type { AppDispatch } from '../store';
import {
  getUnreadNotificationCountAsync,
  markNotificationAsReadAsync,
  selectRecentNotifications,
  selectUnreadNotificationCount,
  selectNotificationsLoading
} from '../store/slices/notificationSlice';
import { selectUser } from '../store/slices/authSlice';

const NotificationDropdown: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const recentNotifications = useSelector(selectRecentNotifications);
  const unreadCount = useSelector(selectUnreadNotificationCount);
  const isLoading = useSelector(selectNotificationsLoading);
  
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      dispatch(getUnreadNotificationCountAsync(user.id));
    }
  }, [dispatch, user?.id]);

  const handleMarkAsRead = async (notificationId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await dispatch(markNotificationAsReadAsync(notificationId));
    if (user?.id) {
      dispatch(getUnreadNotificationCountAsync(user.id));
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'EMAIL':
        return '📧';
      case 'SMS':
        return '💬';
      case 'PUSH':
        return '🔔';
      default:
        return '📩';
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 00-15 0v5h5l-5 5-5-5h5V7a9.5 9.5 0 0119 0v10z" />
        </svg>
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Content */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
                <Link
                  to="/notifications"
                  onClick={() => setIsOpen(false)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  View All
                </Link>
              </div>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Loading notifications...</p>
                </div>
              ) : recentNotifications.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {recentNotifications.slice(0, 5).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 ${!notification.readAt ? 'bg-blue-50' : ''}`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 text-lg">
                          {getNotificationIcon(notification.notificationType)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <h4 className={`text-sm font-medium truncate ${!notification.readAt ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.subject}
                            </h4>
                            {!notification.readAt && (
                              <button
                                onClick={(e) => handleMarkAsRead(notification.id, e)}
                                className="ml-2 text-xs text-blue-600 hover:text-blue-800 flex-shrink-0"
                                title="Mark as read"
                              >
                                ✓
                              </button>
                            )}
                          </div>
                          <p className={`text-sm mt-1 line-clamp-2 ${!notification.readAt ? 'text-gray-800' : 'text-gray-600'}`}>
                            {notification.content}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                              {formatTimeAgo(notification.createdAt)}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              notification.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                              notification.status === 'SENT' ? 'bg-blue-100 text-blue-800' :
                              notification.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {notification.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 00-15 0v5h5l-5 5-5-5h5V7a9.5 9.5 0 0119 0v10z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
                  <p className="mt-1 text-sm text-gray-500">You're all caught up!</p>
                </div>
              )}
            </div>

            {recentNotifications.length > 5 && (
              <div className="p-4 border-t border-gray-200 text-center">
                <Link
                  to="/notifications"
                  onClick={() => setIsOpen(false)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  View {recentNotifications.length - 5} more notifications
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationDropdown;
