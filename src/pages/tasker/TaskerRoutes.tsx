import { Routes, Route, Navigate } from 'react-router-dom';
import TaskerDashboard from './TaskerDashboard';
import BrowseTasksPage from './BrowseTasksPage';
import TaskDetailsPage from './TaskDetailsPage';
import CreateBidPage from './CreateBidPage';
import MyBidsPage from './MyBidsPage';
import MyAssignmentsPage from './MyAssignmentsPage';

export default function TaskerRoutes() {
  return (
    <Routes>
      <Route path="/" element={<TaskerDashboard />} />
      <Route path="/browse" element={<BrowseTasksPage />} />
      <Route path="/browse-tasks" element={<BrowseTasksPage />} />
      <Route path="/tasks/:taskId" element={<TaskDetailsPage />} />
      <Route path="/tasks/:taskId/bid" element={<CreateBidPage />} />
      <Route path="/bids" element={<MyBidsPage />} />
      <Route path="/assignments" element={<MyAssignmentsPage />} />
      <Route path="*" element={<Navigate to="/tasker" replace />} />
    </Routes>
  );
}
