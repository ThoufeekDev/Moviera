import { Route } from 'react-router-dom';
import { lazy } from 'react';
import PublicLayout from '@/app/layouts/PublicLayout';
import PublicRoute from '@/app/router/PublicRoute';

const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() =>
  import('@/features/auth').then((m) => ({ default: m.LoginPage }))
);
const UserRegisterPage = lazy(() =>
  import('@/features/auth').then((m) => ({ default: m.UserRegisterPage }))
);
const VerifyOtpPage = lazy(() =>
  import('@/features/auth').then((m) => ({ default: m.VerifyOtpPage }))
);
const GatewayPage = lazy(() =>
  import('@/features/auth').then((m) => ({ default: m.GatewayPage }))
);

export const publicRoutes = (
  <>
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
  </>
);

export default publicRoutes;
