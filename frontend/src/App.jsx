import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import MapPage from './pages/farmer/MapPage';
import ReportsPage from './pages/farmer/ReportsPage';
import ProfilePage from './pages/farmer/ProfilePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import RequestsPage from './pages/admin/RequestsPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route element={<ProtectedRoute role="farmer" />}>
              <Route element={<DashboardLayout />}>
                <Route path="/farmer" element={<FarmerDashboard />} />
                <Route path="/farmer/map" element={<MapPage />} />
                <Route path="/farmer/reports" element={<ReportsPage />} />
                <Route path="/farmer/profile" element={<ProfilePage />} />
              </Route>
            </Route>
            <Route element={<ProtectedRoute role="admin" />}>
              <Route element={<DashboardLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/requests" element={<RequestsPage />} />
                <Route path="/admin/analytics" element={<AnalyticsPage />} />
                <Route path="/admin/reports" element={<AdminReportsPage />} />
                <Route path="/admin/profile" element={<ProfilePage />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: { borderRadius: '12px', fontSize: '14px', fontFamily: 'DM Sans, sans-serif', fontWeight: '500' },
            success: { style: { background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }, iconTheme: { primary: '#22c55e', secondary: '#fff' } },
            error: { style: { background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }, iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}
