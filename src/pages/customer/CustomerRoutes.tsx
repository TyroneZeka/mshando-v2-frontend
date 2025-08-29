import { Routes, Route, Navigate } from 'react-router-dom';
import CustomerDashboard from './CustomerDashboard';
import CreateTaskPage from './CreateTaskPage';
import MyTasksPage from './MyTasksPage';

export default function CustomerRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CustomerDashboard />} />
      <Route path="/create-task" element={<CreateTaskPage />} />
      <Route path="/tasks" element={<MyTasksPage />} />
      <Route path="*" element={<Navigate to="/customer" replace />} />
    </Routes>
  );
}
