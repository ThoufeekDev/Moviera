import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';

import { Loader } from '@/shared/ui/Loader';

// Lazy Loaded Pages
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));

const UserRegisterPage = lazy(() => import('@/features/auth/pages/UserRegisterPage'));

const VerifyOtpPage = lazy(() => import('@/features/auth/pages/VerifyOtpPage'));

const HomePage = lazy(() => import('@/features/auth/pages/HomePage'));

const GatewayPage = lazy(() => import('@/features/auth/pages/GatewayPage'));

const TheatreAdminLoginPage = lazy(
  () => import('@/features/theatre-admin/pages/TheatreAdminLoginPage'),
);

const TheatreAdminRegisterPage = lazy(
  () => import('@/features/theatre-admin/pages/TheatreAdminRegisterPage'),
);

const TheatreAdminDashboardPage = lazy(
  () => import('@/features/theatre-admin/pages/TheatreAdminDashboardPage'),
);

// SUPER_ADMIN PAGES

const SuperAdminLoginPage = lazy(
  () => import('@/features/super-admin/pages/SuperAdminLoginPage'),
);

const CreateMoviePage = lazy(
  () => import('@/features/movies/pages/CreateMoviePage'),
);

const MovieDetailsPage = lazy(
  () => import('@/features/movies/pages/MovieDetailsPage'),
);
const SuperAdminDashboardPage = lazy(
  () => import('@/features/super-admin/pages/SuperAdminDashboardPage'),
);

const NotFoundPage = lazy(() => import('@/shared/components/NotFoundPage'));

// Route Components

// import TheatreAdminRoute from './TheatreAdminRoute';
import RoleRedirect from './RoleRedirect';
// import TheatreAdminPublicRoute from './TheatreAdminPublicRoute';
// import TheatreAdminLayoutWrapper from './TheatreAdminLayoutWrapper';

import PublicRoute from './PublicRoute';
import ProtectedRoute from './ProtectedRoute';
// import SuperAdminRoute from './SuperAdminRoute';

import { ComingSoon } from '@/shared/ui/ComingSoon';
import SuperAdminLayout from '@/app/layouts/SuperAdminLayout';
import MovieManagementPage from '@/features/movies/pages/MovieManagementPage';
import EditMoviePage from '@/features/movies/pages/EditMoviePage';

import { Role } from '@/shared/constants/Role';
import TheatreAdminLayout from '@/app/layouts/TheatreAdminLayout';
import { MyTheatrePage } from '@/features/theatres/pages/MyTheatresPage';
import TheatreDetailsPage from '@/features/theatres/pages/TheatreDetailsPage';

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
            {/* <Route path="movies/:id" element={<MovieDetailsPage />} /> */}
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
