import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';

import Loader from '../components/common/Loader';

// Lazy Loaded Pages
const LoginPage = lazy(() => import('../features/auth/pages/Login/LoginPage'));

const UserRegisterPage = lazy(() => import('../features/auth/pages/Register/UserRegisterPage'));

const VerifyOtpPage = lazy(() => import('../features/auth/pages/VerifyOtp/VerifyOtpPage'));

const HomePage = lazy(() => import('../features/auth/pages/Home/HomePage'));

const GatewayPage = lazy(() => import('../features/onboarding/RegisterSelectionPage'));

const AdminLoginPage = lazy(() => import('../features/admin/pages/Login/AdminLoginPage'));

const AdminRegisterPage = lazy(
  () => import('../features/admin/pages/Register/AdminRegisterPage'),
);

const AdminDashboardPage = lazy(
  () => import('../features/admin/pages/Dashboard/AdminDashboardPage'),
);

const NotFoundPage = lazy(() => import('../shared/pages/NotFoundPage'));

// Route Components

import AdminRoute from './AdminProtectedRoute';
import AdminPublicRoute from './AdminPublicRoute';
import AdminLayoutWrapper from './AdminLayoutWrapper';
import AdminOnboardingRoute from './AdminOnboardingRoute';
import PublicRoute from './PublicRoute';
import ProtectedRoute from './ProtectedRoute';
import AdminRedirect from './AdminRedirect';
import ComingSoon from '../shared/components/ComingSoon/ComingSoon';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* User Routes */}
          <Route
            path="/register"
            element={
              <PublicRoute>
                <GatewayPage />
              </PublicRoute>
            }
          />

          <Route
            path="/register/user"
            element={
              <PublicRoute>
                <UserRegisterPage />
              </PublicRoute>
            }
          />

          <Route
            path="/verify-otp"
            element={
              <PublicRoute>
                <VerifyOtpPage />
              </PublicRoute>
            }
          />

          <Route
            path="/user/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          {/* Admin Public Routes */}
          <Route
            path="/register/hospital"
            element={
              <AdminPublicRoute>
                <AdminRegisterPage />
              </AdminPublicRoute>
            }
          />

          <Route
            path="/admin/login"
            element={
              <AdminPublicRoute>
                <AdminLoginPage />
              </AdminPublicRoute>
            }
          />

          {/* Admin Redirect */}
          <Route path="/admin" element={<AdminRedirect />} />

          {/* Admin Dashboard Routes */}
          <Route
            element={
              <AdminRoute>
                <AdminOnboardingRoute>
                  <AdminLayoutWrapper />
                </AdminOnboardingRoute>
              </AdminRoute>
            }
          >
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />

            <Route
              path="/admin/departments"
              element={
                <ComingSoon
                  title="Departments"
                  description="Cinema departments and screens features are coming soon."
                  backTo="/admin/dashboard"
                  backLabel="Back to Dashboard"
                />
              }
            />

            <Route
              path="/admin/appointments"
              element={
                <ComingSoon
                  title="Appointments"
                  description="Cinema showtimes & reservations features are coming soon."
                  backTo="/admin/dashboard"
                  backLabel="Back to Dashboard"
                />
              }
            />

            <Route
              path="/admin/patients"
              element={
                <ComingSoon
                  title="Audience"
                  description="Cinema audience management features are coming soon."
                  backTo="/admin/dashboard"
                  backLabel="Back to Dashboard"
                />
              }
            />

            <Route
              path="/admin/reviews"
              element={
                <ComingSoon
                  title="Reviews"
                  description="Cinema reviews features are coming soon."
                  backTo="/admin/dashboard"
                  backLabel="Back to Dashboard"
                />
              }
            />

            <Route
              path="/admin/queue"
              element={
                <ComingSoon
                  title="Queue"
                  description="Cinema ticket queue features are coming soon."
                  backTo="/admin/dashboard"
                  backLabel="Back to Dashboard"
                />
              }
            />

            <Route
              path="/admin/analytics"
              element={
                <ComingSoon
                  title="Analytics"
                  description="Cinema analytics features are coming soon."
                  backTo="/admin/dashboard"
                  backLabel="Back to Dashboard"
                />
              }
            />

            <Route
              path="/admin/settings"
              element={
                <ComingSoon
                  title="Settings"
                  description="Cinema settings features are coming soon."
                  backTo="/admin/dashboard"
                  backLabel="Back to Dashboard"
                />
              }
            />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
