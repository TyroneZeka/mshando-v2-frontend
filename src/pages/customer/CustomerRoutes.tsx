import { Routes, Route, Navigate } from 'react-router-dom';
import CustomerDashboard from './CustomerDashboard';
import CreateTaskPage from './CreateTaskPage';
import MyTasksPage from './MyTasksPage';
import TaskBidsPage from './TaskBidsPage';
import AddPhotosPage from './AddPhotosPage';

export default function CustomerRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CustomerDashboard />} />
      <Route path="/create-task" element={<CreateTaskPage />} />
      <Route path="/tasks" element={<MyTasksPage />} />
      <Route path="/tasks/:taskId/bids" element={<TaskBidsPage />} />
      <Route path="/tasks/:taskId/add-photos" element={<AddPhotosPage />} />
      <Route path="*" element={<Navigate to="/customer" replace />} />
    </Routes>
  );
}
