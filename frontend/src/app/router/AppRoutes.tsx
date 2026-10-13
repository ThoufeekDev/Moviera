import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';

import { Loader } from '@/shared/ui/Loader';
import RoleRedirect from './RoleRedirect';
import { publicRoutes } from '@/portals/public';
import { theatreAdminRoutes } from '@/portals/theatre-admin';
import { superAdminRoutes } from '@/portals/super-admin';

const NotFoundPage = lazy(() => import('@/shared/components/NotFoundPage'));

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          {publicRoutes}
          {theatreAdminRoutes}
          {superAdminRoutes}

          {/* Generic Role Redirect */}
          <Route path="/admin" element={<RoleRedirect />} />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
