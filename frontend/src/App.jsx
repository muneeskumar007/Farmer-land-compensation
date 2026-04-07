import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RoleGuard from "./components/RoleGuard.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import OfficerDashboard from "./pages/OfficerDashboard.jsx";
import FarmerDashboard from "./pages/FarmerDashboard.jsx";
import CaseCreatePage from "./pages/CaseCreatePage.jsx";
import PredictionPage from "./pages/PredictionPage.jsx";
import CaseDetailsPage from "./pages/CaseDetailsPage.jsx";
import FarmerPortal from "./pages/FarmerPortal.jsx";
import AnalyticsPage from "./pages/AnalyticsPage.jsx";
import CasesListPage from "./pages/CasesListPage.jsx";
import Unauthorized from "./pages/Unauthorized.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route
        path="/admin"
        element={
          <RoleGuard allow={["admin"]}>
            <DashboardLayout>
              <AdminDashboard />
            </DashboardLayout>
          </RoleGuard>
        }
      />
      <Route
        path="/analytics"
        element={
          <RoleGuard allow={["admin"]}>
            <DashboardLayout>
              <AnalyticsPage />
            </DashboardLayout>
          </RoleGuard>
        }
      />

      <Route
        path="/officer"
        element={
          <RoleGuard allow={["officer"]}>
            <DashboardLayout>
              <OfficerDashboard />
            </DashboardLayout>
          </RoleGuard>
        }
      />
      <Route
        path="/cases/new"
        element={
          <RoleGuard allow={["officer"]}>
            <DashboardLayout>
              <CaseCreatePage />
            </DashboardLayout>
          </RoleGuard>
        }
      />

      <Route
        path="/cases"
        element={
          <RoleGuard allow={["admin", "officer"]}>
            <DashboardLayout>
              <CasesListPage />
            </DashboardLayout>
          </RoleGuard>
        }
      />
      <Route
        path="/cases/:id"
        element={
          <RoleGuard allow={["admin", "officer", "farmer"]}>
            <DashboardLayout>
              <CaseDetailsPage />
            </DashboardLayout>
          </RoleGuard>
        }
      />

      <Route
        path="/prediction/:id"
        element={
          <RoleGuard allow={["admin", "officer"]}>
            <DashboardLayout>
              <PredictionPage />
            </DashboardLayout>
          </RoleGuard>
        }
      />

      <Route
        path="/farmer"
        element={
          <RoleGuard allow={["farmer"]}>
            <DashboardLayout>
              <FarmerDashboard />
            </DashboardLayout>
          </RoleGuard>
        }
      />
      <Route
        path="/farmer/reports"
        element={
          <RoleGuard allow={["farmer"]}>
            <DashboardLayout>
              <FarmerPortal />
            </DashboardLayout>
          </RoleGuard>
        }
      />

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
