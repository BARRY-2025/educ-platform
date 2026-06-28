import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MainLayout, PublicLayout } from './components/layout';
import { LoginPage } from './pages/auth';
import { DashboardPage } from './pages/dashboard';
import { StudentsListPage, StudentDetailPage } from './pages/students';
import { AttendancePage, ScannerPage } from './pages/attendance';
import { GradesPage } from './pages/grades';
import { FinancePage } from './pages/finance';
import { NotificationsPage } from './pages/notifications';
import { AnalyticsPage } from './pages/analytics';
import { PublicRankingsPage, PublicStatisticsPage } from './pages/public';
import { ProfilePage } from './pages/profile';
import { SettingsPage } from './pages/settings';
import { useAuthStore } from './store/auth.store';

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/public/rankings" element={<PublicRankingsPage />} />
            <Route path="/public/statistics" element={<PublicStatisticsPage />} />
          </Route>

          {/* Auth routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/students" element={<StudentsListPage />} />
            <Route path="/students/:id" element={<StudentDetailPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/scan" element={<ScannerPage />} />
            <Route path="/grades" element={<GradesPage />} />
            <Route path="/my-grades" element={<GradesPage />} />
            <Route path="/finance" element={<FinancePage />} />
            <Route path="/my-payments" element={<FinancePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/rankings" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
