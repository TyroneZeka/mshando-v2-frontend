import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logout, selectUser } from '../../store/slices/authSlice';
import { UserRole } from '../../types';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: UserRole;
  title: string;
  subtitle: string;
}

export default function DashboardLayout({ children, userRole, title, subtitle }: DashboardLayoutProps) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectUser);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const getNavigationLinks = () => {
    if (userRole === UserRole.CUSTOMER) {
      return [
        { name: 'Dashboard', href: '/customer', current: true },
        { name: 'Create Task', href: '/customer/create-task', current: false },
        { name: 'My Tasks', href: '/customer/tasks', current: false },
      ];
    } else if (userRole === UserRole.TASKER) {
      return [
        { name: 'Dashboard', href: '/tasker', current: true },
        { name: 'Browse Tasks', href: '/tasker/browse', current: false },
        { name: 'My Bids', href: '/tasker/bids', current: false },
        { name: 'Assignments', href: '/tasker/assignments', current: false },
      ];
    }
    return [];
  };

  const navigationLinks = getNavigationLinks();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and Navigation Links */}
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-2xl font-bold text-blue-600">
                  Mshando
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`${
                      link.current
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Profile dropdown */}
            <div className="flex items-center">
              <div className="relative ml-3">
                <div>
                  <button
                    type="button"
                    className="bg-white flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {currentUser?.firstName?.charAt(0) || 'U'}
                      </span>
                    </div>
                  </button>
                </div>

                {/* Profile dropdown menu */}
                {isProfileMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                      <div className="font-medium">{currentUser?.firstName} {currentUser?.lastName}</div>
                      <div className="text-gray-500">{currentUser?.email}</div>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navigationLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`${
                  link.current
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            <p className="mt-2 text-gray-600">{subtitle}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}
