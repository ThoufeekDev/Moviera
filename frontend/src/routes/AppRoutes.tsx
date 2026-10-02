import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';

import Loader from '../shared/components/Loader/Loader';

// Lazy Loaded Pages
const LoginPage = lazy(() => import('../features/auth/pages/login/LoginPage'));

const UserRegisterPage = lazy(() => import('../features/auth/pages/register/UserRegisterPage'));

const VerifyOtpPage = lazy(() => import('../features/auth/pages/verify-otp/VerifyOtpPage'));

const HomePage = lazy(() => import('../features/auth/pages/home/HomePage'));

const GatewayPage = lazy(() => import('../features/onboarding/GateWay'));

const TheatreAdminLoginPage = lazy(
  () => import('../features/theatre-admin/pages/login/TheatreAdminLoginPage'),
);

const TheatreAdminRegisterPage = lazy(
  () => import('../features/theatre-admin/pages/register/TheatreAdminRegisterPage'),
);

const TheatreAdminDashboardPage = lazy(
  () => import('../features/theatre-admin/pages/dashboard/TheatreAdminDashboardPage'),
);

// SUPER_ADMIN PAGES

const SuperAdminLoginPage = lazy(
  () => import('../features/super-admin/pages/Login/SuperAdminLoginPage'),
);

const CreateMoviePage = lazy(
  () => import('../features/super-admin/pages/movies-management/create-movie/CreateMoviePage'),
);

const MovieDetailsPage = lazy(
  () => import('../features/super-admin/pages/movies-management/movie-details/MovieDetailsPage'),
);
const SuperAdminDashboardPage = lazy(
  () => import('../features/super-admin/pages/Dashboard/SuperAdminDashboardPage'),
);

const NotFoundPage = lazy(() => import('../shared/pages/NotFoundPage'));

// Route Components

// import TheatreAdminRoute from './TheatreAdminRoute';
import RoleRedirect from './RoleRedirect';
// import TheatreAdminPublicRoute from './TheatreAdminPublicRoute';
// import TheatreAdminLayoutWrapper from './TheatreAdminLayoutWrapper';

import PublicRoute from './PublicRoute';
import ProtectedRoute from './ProtectedRoute';
// import SuperAdminRoute from './SuperAdminRoute';

import ComingSoon from '../shared/components/coming-soon/ComingSoon';
import SuperAdminLayout from '../features/super-admin/layouts/SuperAdminLayout';
import MovieManagementPage from '../features/super-admin/pages/movies-management/MovieManagementPage';
import EditMoviePage from '../features/super-admin/pages/movies-management/movie-edit/EditMoviePage';

import { Role } from '../shared/constants/Role';
import TheatreAdminLayout from '../features/theatre-admin/layouts/TheatreAdminLayout';
import { MyTheatrePage } from '../features/theatre-admin/pages/theatres/MyTheatresPage';
import TheatreDetailsPage from '../features/theatre-admin/pages/theatres/theatre-details/TheatreDetailsPage';

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
              <ProtectedRoute allowedRoles={[Role.USER]}>
                <HomePage />
              </ProtectedRoute>
            }
          />

          {/* ==================== THEATRE ADMIN ==================== */}

          <Route
            path="/theatre-admin/register"
            element={
              <PublicRoute>
                <TheatreAdminRegisterPage />
              </PublicRoute>
            }
          />

          <Route
            path="/theatre-admin/login"
            element={
              <PublicRoute>
                <TheatreAdminLoginPage />
              </PublicRoute>
            }
          />


<Route
  path="/theatre-admin"
  element={
    <ProtectedRoute allowedRoles={[Role.THEATRE_ADMIN]}>
      <TheatreAdminLayout />
    </ProtectedRoute>
  }
>
  <Route
    index
    element={<TheatreAdminDashboardPage />}
            />
            
    <Route path="theatres" element={ <MyTheatrePage/>} />
    <Route path="theatres/:theatreId" element={<TheatreDetailsPage />} />

  <Route
    path="settings"
    element={
      <ComingSoon
        title="Settings"
        description="Cinema settings features are coming soon."
        backTo="/theatre-admin"
        backLabel="Back to Dashboard"
      />
    }
  />
</Route>


           {/* ==================== SUPER ADMIN ==================== */}

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
              <ProtectedRoute allowedRoles={[Role.SUPER_ADMIN]}>
                <SuperAdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<SuperAdminDashboardPage />} />

            <Route path="movies" element={<MovieManagementPage />} />
            <Route path="movies/create" element={<CreateMoviePage />} />
            <Route path="movies/:slug" element={<MovieDetailsPage />} />
            <Route path="movies/:movieId/edit" element={<EditMoviePage />} />
          </Route>

          <Route path='/admin' element={<RoleRedirect/> } />

          {/* 404 */}

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
