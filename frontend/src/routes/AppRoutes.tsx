import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';

import Loader from '../components/common/Loader';

// Lazy Loaded Pages
const LoginPage = lazy(() => import('../features/auth/pages/Login/LoginPage'));

const UserRegisterPage = lazy(() => import('../features/auth/pages/Register/UserRegisterPage'));

const VerifyOtpPage = lazy(() => import('../features/auth/pages/VerifyOtp/VerifyOtpPage'));

const HomePage = lazy(() => import('../features/auth/pages/Home/HomePage'));

const GatewayPage = lazy(() => import('../features/onboarding/RegisterSelectionPage'));

const AdminLoginPage = lazy(() => import('../features/theatre_admin/pages/Login/Theatre_AdminLoginPage'));


const AdminRegisterPage = lazy(
  () => import('../features/theatre_admin/pages/Register/AdminRegisterPage'),
);

const AdminDashboardPage = lazy(
  () => import('../features/theatre_admin/pages/Dashboard/AdminDashboardPage'),
);


// SUPER_ADMIN PAGES

const SuperAdminLoginPage = lazy(() => import('../features/super_admin/pages/Login/SuperAdminLoginPage'))

const SuperAdminDashboardPage = lazy(()=>import("../features/super_admin/pages/Dashboard/SuperAdminDashboardPage"))

const NotFoundPage = lazy(() => import('../shared/pages/NotFoundPage'));

// Route Components

// import AdminRoute from './AdminProtectedRoute';
// import AdminPublicRoute from './AdminPublicRoute';
// import SuperAdminRoute from './SuperAdminRoute';
// import AdminRedirect from './AdminRedirect';


import TheatreAdminRoute from './TheatreAdminRoute';
import RoleRedirect from './RoleRedirect';
import TheatreAdminPublicRoute from './TheatreAdminPublicRoute';
import AdminLayoutWrapper from './AdminLayoutWrapper';
import AdminOnboardingRoute from './AdminOnboardingRoute';
import PublicRoute from './PublicRoute';
import ProtectedRoute from './ProtectedRoute';
import SuperAdminRoute from './SuperAdminRoute';

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
            path="/theatre-admin/register"
            element={
              <TheatreAdminPublicRoute>
                <AdminRegisterPage />
              </TheatreAdminPublicRoute>
            }
          />

          <Route
            path="/theatre-admin/login"
            element={
              <TheatreAdminRoute>
                <AdminLoginPage />
              </TheatreAdminRoute>
            }
          />

          {/* Admin Redirect */}
          <Route path="/admin" element={<RoleRedirect />} />

          {/* Admin Dashboard Routes */}
          <Route
            element={
              <TheatreAdminRoute>
                <AdminOnboardingRoute>
                  <AdminLayoutWrapper />
                </AdminOnboardingRoute>
              </TheatreAdminRoute>
            }
          >
            <Route path="/theatre-admin/dashboard" element={<AdminDashboardPage />} />


            <Route
              path="/theatre-admin/settings"
              element={
                <ComingSoon
                  title="Settings"
                  description="Cinema settings features are coming soon."
                  backTo="/theatre-admin/dashboard"
                  backLabel="Back to Dashboard"
                />
              }
            />
          </Route>








          <Route
          
            path='/super-admin/login'
            element={
                 <PublicRoute>
                  <SuperAdminLoginPage />
                </PublicRoute>
            }
          
          />


          <Route
            path='/super-admin'
            element={
              <SuperAdminRoute>
                <SuperAdminDashboardPage />
              </SuperAdminRoute>
            } />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
