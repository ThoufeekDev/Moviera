import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';

import { Loader } from '@/shared/ui/Loader';
import { Role } from '@/shared/constants/Role';
import { ComingSoon } from '@/shared/ui/ComingSoon';

// Public & Layout Components
import PublicRoute from './PublicRoute';
import RequireRole from './RequireRole';
import RoleRedirect from './RoleRedirect';
import PublicLayout from '@/app/layouts/PublicLayout';
import SuperAdminLayout from '@/app/layouts/SuperAdminLayout';
import TheatreAdminLayout from '@/app/layouts/TheatreAdminLayout';

// Lazy Loaded Pages
const HomePage = lazy(() => import('@/features/home/pages/HomePage'));
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const UserRegisterPage = lazy(() => import('@/features/auth/pages/UserRegisterPage'));
const VerifyOtpPage = lazy(() => import('@/features/auth/pages/VerifyOtpPage'));
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
const MyTheatrePage = lazy(
  () => import('@/features/theatres/pages/MyTheatresPage'),
);
const TheatreDetailsPage = lazy(
  () => import('@/features/theatres/pages/TheatreDetailsPage'),
);

const SuperAdminLoginPage = lazy(
  () => import('@/features/super-admin/pages/SuperAdminLoginPage'),
);
const SuperAdminDashboardPage = lazy(
  () => import('@/features/super-admin/pages/SuperAdminDashboardPage'),
);
const MovieManagementPage = lazy(
  () => import('@/features/movies/pages/MovieManagementPage'),
);
const CreateMoviePage = lazy(
  () => import('@/features/movies/pages/CreateMoviePage'),
);
const MovieDetailsPage = lazy(
  () => import('@/features/movies/pages/MovieDetailsPage'),
);
const EditMoviePage = lazy(
  () => import('@/features/movies/pages/EditMoviePage'),
);

const NotFoundPage = lazy(() => import('@/shared/components/NotFoundPage'));

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Public Website Routes */}
          <Route element={<PublicLayout />}>
            <Route index element={<HomePage />} />
          </Route>

          {/* User Auth Routes */}
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

          {/* Theatre Admin Auth */}
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

          {/* Super Admin Auth */}
          <Route
            path="/super-admin/login"
            element={
              <PublicRoute>
                <SuperAdminLoginPage />
              </PublicRoute>
            }
          />

          {/* Theatre Admin Protected Portal */}
          <Route element={<RequireRole roles={[Role.THEATRE_ADMIN]} />}>
            <Route path="/theatre-admin" element={<TheatreAdminLayout />}>
              <Route index element={<TheatreAdminDashboardPage />} />
              <Route path="theatres" element={<MyTheatrePage />} />
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
          </Route>

          {/* Super Admin Protected Portal */}
          <Route element={<RequireRole roles={[Role.SUPER_ADMIN]} />}>
            <Route path="/super-admin" element={<SuperAdminLayout />}>
              <Route index element={<SuperAdminDashboardPage />} />
              <Route path="movies" element={<MovieManagementPage />} />
              <Route path="movies/create" element={<CreateMoviePage />} />
              <Route path="movies/:id" element={<MovieDetailsPage />} />
              <Route path="movies/:movieId/edit" element={<EditMoviePage />} />
              <Route
                path="theatres"
                element={
                  <ComingSoon
                    title="Theatre Management"
                    description="Super Admin theatre operations and oversight are coming soon."
                    backTo="/super-admin"
                    backLabel="Back to Dashboard"
                  />
                }
              />
              <Route
                path="theatres/create"
                element={
                  <ComingSoon
                    title="Add Theatre"
                    description="Super Admin theatre onboarding is coming soon."
                    backTo="/super-admin"
                    backLabel="Back to Dashboard"
                  />
                }
              />
            </Route>
          </Route>

          {/* Generic Role Redirect */}
          <Route path="/admin" element={<RoleRedirect />} />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
