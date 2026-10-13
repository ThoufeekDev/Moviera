import { Route } from "react-router-dom";
import { lazy } from "react";
import PublicRoute from "@/app/router/PublicRoute";
import RequireRole from "@/app/router/RequireRole";
import AdminLayout from "@/app/layouts/AdminLayout";
import { Role } from "@/shared/constants/Role";
import { ComingSoon } from "@/shared/ui/ComingSoon";
import { superAdminSidebarItems } from "./config/superAdminSidebar.config";

const SuperAdminLoginPage = lazy(() => import("./pages/SuperAdminLoginPage"));
const SuperAdminDashboardPage = lazy(
  () => import("./pages/SuperAdminDashboardPage"),
);
const MovieManagementPage = lazy(() =>
  import("@/features/movies").then((m) => ({ default: m.MovieManagementPage })),
);
const CreateMoviePage = lazy(() =>
  import("@/features/movies").then((m) => ({ default: m.CreateMoviePage })),
);
const MovieDetailsPage = lazy(() =>
  import("@/features/movies").then((m) => ({ default: m.MovieDetailsPage })),
);
const EditMoviePage = lazy(() =>
  import("@/features/movies").then((m) => ({ default: m.EditMoviePage })),
);

const TheatreAdminManagementPage = lazy(
  () => import("./pages/TheatreAdminManagementPage"),
);

export const superAdminRoutes = (
  <>
    {/* Super Admin Auth */}
    <Route
      path="/super-admin/login"
      element={
        <PublicRoute>
          <SuperAdminLoginPage />
        </PublicRoute>
      }
    />

    {/* Super Admin Protected Portal */}
    <Route element={<RequireRole roles={[Role.SUPER_ADMIN]} />}>
      <Route
        path="/super-admin"
        element={
          <AdminLayout
            items={superAdminSidebarItems}
            loginPath="/super-admin/login"
          />
        }
      >
        <Route index element={<SuperAdminDashboardPage />} />
        <Route path="movies" element={<MovieManagementPage />} />
        <Route path="movies/create" element={<CreateMoviePage />} />
        <Route path="movies/:id" element={<MovieDetailsPage />} />
        <Route path="movies/:movieId/edit" element={<EditMoviePage />} />
        <Route path="theatres" element={<TheatreAdminManagementPage />} />
        <Route
          path="alltheatres"
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
  </>
);

export default superAdminRoutes;
