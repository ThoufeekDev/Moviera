import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/stores/auth.store';
import { Loader } from '@/shared/ui/Loader';
import { Role } from '@/shared/constants/Role';

export default function RoleRedirect() {
  const { user, isAuthenticated, isCheckingAuth } = useAuthStore();
  const location = useLocation();

  if (isCheckingAuth && !user) {
    return <Loader />;
  }

  if (!isAuthenticated || !user) {
    const loginPath = location.pathname.startsWith('/super-admin')
      ? '/super-admin/login'
      : location.pathname.startsWith('/theatre-admin')
      ? '/theatre-admin/login'
      : '/user/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  switch (user.role) {
    case Role.SUPER_ADMIN:
      return <Navigate to="/super-admin" replace />;

    case Role.THEATRE_ADMIN:
      return <Navigate to="/theatre-admin" replace />;

    case Role.USER:
      return <Navigate to="/" replace />;
    default:
      return <Navigate to="/user/login" replace />;
  }
}
