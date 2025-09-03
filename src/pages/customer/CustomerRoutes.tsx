import { Routes, Route, Navigate } from 'react-router-dom';
import CustomerDashboard from './CustomerDashboard';
import CreateTaskPage from './CreateTaskPage';
import MyTasksPage from './MyTasksPage';
import TaskBidsPage from './TaskBidsPage';
import AddPhotosPage from './AddPhotosPage';
// Sprint 3: Payment and Notification pages
import CustomerPayments from '../payment/CustomerPayments';
import PaymentProcessing from '../payment/PaymentProcessing';
import NotificationCenter from '../notification/NotificationCenter';

export default function CustomerRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CustomerDashboard />} />
      <Route path="/create-task" element={<CreateTaskPage />} />
      <Route path="/tasks" element={<MyTasksPage />} />
      <Route path="/tasks/:taskId/bids" element={<TaskBidsPage />} />
      <Route path="/tasks/:taskId/add-photos" element={<AddPhotosPage />} />
      
      {/* Sprint 3: Payment routes */}
      <Route path="/payments" element={<CustomerPayments />} />
      <Route path="/tasks/:taskId/payment" element={<PaymentProcessing />} />
      
      {/* Sprint 3: Notification routes */}
      <Route path="/notifications" element={<NotificationCenter />} />
      
      <Route path="*" element={<Navigate to="/customer" replace />} />
    </Routes>
  );
}
