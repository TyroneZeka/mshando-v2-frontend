import { Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logout, selectUser } from '../../store/slices/authSlice';
import { UserRole } from '../../types';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Header() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectUser);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!currentUser) return '/';
    
    switch (currentUser.role) {
      case UserRole.ADMIN:
        return '/admin';
      case UserRole.CUSTOMER:
        return '/customer';
      case UserRole.TASKER:
        return '/tasker';
      default:
        return '/';
    }
  };

  const getNavigationItems = () => {
    if (!currentUser) return [];

    const baseItems = [
      { name: 'Dashboard', href: getDashboardLink() },
      { name: 'Profile', href: '/profile' },
    ];

    switch (currentUser.role) {
      case UserRole.CUSTOMER:
        return [
          ...baseItems,
          { name: 'My Tasks', href: '/customer/tasks' },
          { name: 'Create Task', href: '/customer/create-task' },
        ];
      case UserRole.TASKER:
        return [
          ...baseItems,
          { name: 'Browse Tasks', href: '/tasker/browse' },
          { name: 'My Bids', href: '/tasker/bids' },
          { name: 'My Assignments', href: '/tasker/assignments' },
        ];
      case UserRole.ADMIN:
        return [
          ...baseItems,
          { name: 'Manage Users', href: '/admin/users' },
          { name: 'Manage Categories', href: '/admin/categories' },
          { name: 'Reports', href: '/admin/reports' },
        ];
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  if (!currentUser) {
    return null; // Don't show header for unauthenticated users
  }

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to={getDashboardLink()} className="text-2xl font-bold text-blue-600">
                Mshando
              </Link>
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {/* Profile dropdown */}
            <Menu as="div" className="ml-3 relative">
              <div>
                <Menu.Button className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {currentUser.firstName ? currentUser.firstName[0].toUpperCase() : currentUser.username[0].toUpperCase()}
                    </span>
                  </div>
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                      <p className="font-medium">{currentUser.firstName && currentUser.lastName 
                        ? `${currentUser.firstName} ${currentUser.lastName}` 
                        : currentUser.username}</p>
                      <p className="text-gray-500">{currentUser.email}</p>
                      <p className="text-xs text-gray-400 capitalize">{currentUser.role.toLowerCase()}</p>
                    </div>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/profile"
                          className={classNames(
                            active ? 'bg-gray-100' : '',
                            'block px-4 py-2 text-sm text-gray-700'
                          )}
                        >
                          Your Profile
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={classNames(
                            active ? 'bg-gray-100' : '',
                            'block w-full text-left px-4 py-2 text-sm text-gray-700'
                          )}
                        >
                          Sign out
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </header>
  );
}
