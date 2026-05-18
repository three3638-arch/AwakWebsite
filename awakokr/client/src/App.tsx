import { type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { APP_BASENAME } from './config';
import { useAuthStore } from './stores/authStore';
import { MainLayout } from './layouts/MainLayout';
import { LoginPage } from './features/auth/LoginPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { OkrPage } from './features/okr/OkrPage';
import { PersonalPage } from './features/personal/PersonalPage';
import { TimelinePage } from './features/timeline/TimelinePage';
import { ReportPage } from './features/report/ReportPage';
import { AdminPage } from './features/admin/AdminPage';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter basename={APP_BASENAME}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="okr" element={<OkrPage />} />
          <Route path="personal" element={<PersonalPage />} />
          <Route path="timeline" element={<TimelinePage />} />
          <Route path="report" element={<ReportPage />} />
          <Route path="admin" element={<AdminPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
