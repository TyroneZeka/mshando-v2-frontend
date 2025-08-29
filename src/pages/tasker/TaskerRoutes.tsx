import { Routes, Route, Navigate } from 'react-router-dom';
import TaskerDashboard from './TaskerDashboard';
import BrowseTasksPage from './BrowseTasksPage';
import TaskDetailsPage from './TaskDetailsPage';

export default function TaskerRoutes() {
  return (
    <Routes>
      <Route path="/" element={<TaskerDashboard />} />
      <Route path="/browse" element={<BrowseTasksPage />} />
      <Route path="/tasks/:taskId" element={<TaskDetailsPage />} />
      <Route path="*" element={<Navigate to="/tasker" replace />} />
    </Routes>
  );
}
