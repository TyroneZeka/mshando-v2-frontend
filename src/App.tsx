import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { getCurrentUserAsync, selectIsAuthenticated, selectUserRole } from './store/slices/authSlice';
import { UserRole } from './types';

// Components
import Layout from './components/layout/Layout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CustomerRoutes from './pages/customer/CustomerRoutes';
import TaskerRoutes from './pages/tasker/TaskerRoutes';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';

function AppContent() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const userRole = useAppSelector(selectUserRole);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCurrentUserAsync());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public routes */}
          <Route 
            path="/" 
            element={
              isAuthenticated ? (
                <Navigate 
                  to={
                    userRole === UserRole.ADMIN ? '/admin' :
                    userRole === UserRole.CUSTOMER ? '/customer' : '/tasker'
                  } 
                  replace 
                />
              ) : (
                <LandingPage />
              )
            } 
          />
          <Route 
            path="/login" 
            element={
              isAuthenticated ? (
                <Navigate 
                  to={
                    userRole === UserRole.ADMIN ? '/admin' :
                    userRole === UserRole.CUSTOMER ? '/customer' : '/tasker'
                  } 
                  replace 
                />
              ) : (
                <LoginPage />
              )
            } 
          />
          <Route 
            path="/register" 
            element={
              isAuthenticated ? (
                <Navigate 
                  to={
                    userRole === UserRole.ADMIN ? '/admin' :
                    userRole === UserRole.CUSTOMER ? '/customer' : '/tasker'
                  } 
                  replace 
                />
              ) : (
                <RegisterPage />
              )
            } 
          />

          {/* Protected routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.CUSTOMER, UserRole.TASKER]}>
                <Layout>
                  <ProfilePage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/*"
            element={
              <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
                <Layout>
                  <CustomerRoutes />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasker/*"
            element={
              <ProtectedRoute allowedRoles={[UserRole.TASKER]}>
                <Layout>
                  <TaskerRoutes />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
