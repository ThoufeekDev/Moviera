import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/stores/auth.store';
import { Loader } from '@/shared/ui/Loader';
import { Role } from '@/shared/constants/Role';
import RoleRedirect from './RoleRedirect';

interface RequireRoleProps {
  roles: Role[];
  loginPath?: string;
}

export default function RequireRole({ roles, loginPath }: RequireRoleProps) {
  const { user, isCheckingAuth } = useAuthStore();
  const location = useLocation();

  if (isCheckingAuth && !user) {
    return <Loader />;
  }

  const resolvedLoginPath =
    loginPath ||
    (roles.includes(Role.SUPER_ADMIN) || location.pathname.startsWith('/super-admin')
      ? '/super-admin/login'
      : roles.includes(Role.THEATRE_ADMIN) || location.pathname.startsWith('/theatre-admin')
      ? '/theatre-admin/login'
      : '/user/login');

  if (!user) {
    return <Navigate to={resolvedLoginPath} state={{ from: location }} replace />;
  }

  return roles.includes(user.role) ? <Outlet /> : <RoleRedirect />;
}
