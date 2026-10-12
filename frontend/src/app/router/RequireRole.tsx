import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/stores/auth.store';
import { Loader } from '@/shared/ui/Loader';
import { Role } from '@/shared/constants/Role';
import RoleRedirect from './RoleRedirect';

interface RequireRoleProps {
  roles: Role[];
}

export default function RequireRole({ roles }: RequireRoleProps) {
  const { user, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/user/login" replace />;
  }

  return roles.includes(user.role) ? <Outlet /> : <RoleRedirect />;
}
