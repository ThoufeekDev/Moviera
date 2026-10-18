import { Route } from 'react-router-dom';
import { lazy } from 'react';
import PublicRoute from '@/app/router/PublicRoute';
import RequireRole from '@/app/router/RequireRole';
import AdminLayout from '@/app/layouts/AdminLayout';
import { Role } from '@/shared/constants/Role';
import { ComingSoon } from '@/shared/ui/ComingSoon';
import { theatreAdminSidebarItems } from './config/theatreAdminSidebar.config';

const TheatreAdminLoginPage = lazy(
  () => import('./pages/TheatreAdminLoginPage')
);
const TheatreAdminRegisterPage = lazy(
  () => import('./pages/TheatreAdminRegisterPage')
);
const TheatreAdminDashboardPage = lazy(
  () => import('./pages/TheatreAdminDashboardPage')
);
const MyTheatresPage = lazy(() =>
  import('@/features/theatres').then((m) => ({ default: m.MyTheatresPage }))
);
const TheatreDetailsPage = lazy(() =>
  import('@/features/theatres').then((m) => ({ default: m.TheatreDetailsPage }))
);

export const theatreAdminRoutes = (
  <>
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

    {/* Theatre Admin Protected Portal */}
    <Route element={<RequireRole roles={[Role.THEATRE_ADMIN]} loginPath="/theatre-admin/login" />}>
      <Route
        path="/theatre-admin"
        element={
          <AdminLayout
            items={theatreAdminSidebarItems}
            loginPath="/theatre-admin/login"
          />
        }
      >
        <Route index element={<TheatreAdminDashboardPage />} />
        <Route path="theatres" element={<MyTheatresPage />} />
        <Route path="theatres/:theatreId" element={<TheatreDetailsPage />} />
        <Route
          path="settings"
          element={
            <ComingSoon
              title="Settings"
              description="Theatre settings features are coming soon."
              backTo="/theatre-admin"
              backLabel="Back to Dashboard"
            />
          }
        />
      </Route>
    </Route>
  </>
);

export default theatreAdminRoutes;
