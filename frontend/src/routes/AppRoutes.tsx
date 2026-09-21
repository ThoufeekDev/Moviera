import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';

import Loader from '../shared/components/Loader/Loader';

// Lazy Loaded Pages
const LoginPage = lazy(() => import('../features/auth/pages/login/LoginPage'));

const UserRegisterPage = lazy(() => import('../features/auth/pages/register/UserRegisterPage'));

const VerifyOtpPage = lazy(() => import('../features/auth/pages/verify-otp/VerifyOtpPage'));

const HomePage = lazy(() => import('../features/auth/pages/home/HomePage'));

const GatewayPage = lazy(() => import('../features/onboarding/GateWay'));

const AdminLoginPage = lazy(() => import('../features/theatre-admin/pages/login/TheatreAdminLoginPage'));


const AdminRegisterPage = lazy(
  () => import('../features/theatre-admin/pages/register/TheatreAdminRegisterPage'),
);

const AdminDashboardPage = lazy(
  () => import('../features/theatre-admin/pages/dashboard/TheatreAdminDashboardPage'),
);


// SUPER_ADMIN PAGES

const SuperAdminLoginPage = lazy(() => import('../features/super-admin/pages/Login/SuperAdminLoginPage'))

const SuperAdminDashboardPage = lazy(()=>import("../features/super-admin/pages/Dashboard/SuperAdminDashboardPage"))

const NotFoundPage = lazy(() => import('../shared/pages/NotFoundPage'));

// Route Components

import TheatreAdminRoute from './TheatreAdminRoute';
import RoleRedirect from './RoleRedirect';
import TheatreAdminPublicRoute from './TheatreAdminPublicRoute';
import TheatreAdminLayoutWrapper from './TheatreAdminLayoutWrapper';

import PublicRoute from './PublicRoute';
import ProtectedRoute from './ProtectedRoute';
import SuperAdminRoute from './SuperAdminRoute';

import ComingSoon from '../shared/components/coming-soon/ComingSoon';
import SuperAdminLayout from '../features/super-admin/layouts/SuperAdminLayout';
import MovieManagementPage from '../features/super-admin/pages/movies-management/MovieManagementPage';
import EditMoviePage from '../features/super-admin/pages/movies-management/movie-edit/EditMoviePage';

const CreateMoviePage = lazy(
  () => import('../features/super-admin/pages/movies-management/create-movie/CreateMoviePage')
);

const MovieDetailsPage = lazy(
  () => import('../features/super-admin/pages/movies-management/movie-details/MovieDetailsPage')
);
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
              <TheatreAdminPublicRoute>
                <AdminLoginPage />
              </TheatreAdminPublicRoute>
            }
          />

          {/* Admin Redirect */}
          <Route path="/admin" element={<RoleRedirect />} />

          {/* Admin Dashboard Routes */}
          <Route
            element={
              <TheatreAdminRoute>
            
                  <TheatreAdminLayoutWrapper />
             
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
            path="/super-admin/login"
            element={
              <PublicRoute>
                <SuperAdminLoginPage />
              </PublicRoute>
            }
          />

          <Route
            path="/super-admin"
            element={
              <SuperAdminRoute>
                <SuperAdminLayout />
              </SuperAdminRoute>
            }
          >
            <Route index element={<SuperAdminDashboardPage />} />

            <Route path="movies" element={<MovieManagementPage />} />
            <Route path="movies/create" element={<CreateMoviePage />} />
            <Route path="movies/:id" element={<MovieDetailsPage />} />
            <Route path="movies/:movieId/edit" element={<EditMoviePage/>} />
          </Route>

          {/* 404 */}

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
