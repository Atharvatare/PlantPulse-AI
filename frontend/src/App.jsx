import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import DashboardLayout from './layouts/DashboardLayout';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/dashboard/Dashboard';
import AssetManagement from './pages/dashboard/AssetManagement';
import AddAsset from './pages/dashboard/AddAsset';
import PredictiveMaintenance from './pages/dashboard/PredictiveMaintenance';
import WorkOrders from './pages/dashboard/WorkOrders';
import CreateWorkOrder from './pages/dashboard/CreateWorkOrder';
import Analytics from './pages/dashboard/Analytics';
import AIAssistant from './pages/dashboard/AIAssistant';
import Reports from './pages/dashboard/Reports';
import Alerts from './pages/dashboard/Alerts';
import AdminPanel from './pages/dashboard/AdminPanel';
import Settings from './pages/dashboard/Settings';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="assets" element={<AssetManagement />} />
        <Route path="assets/add" element={<AddAsset />} />
        <Route path="assets/edit/:id" element={<AddAsset />} />
        <Route path="predictive" element={<PredictiveMaintenance />} />
        <Route path="work-orders" element={<WorkOrders />} />
        <Route path="work-orders/create" element={<CreateWorkOrder />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="ai-assistant" element={<AIAssistant />} />
        <Route path="reports" element={<Reports />} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
