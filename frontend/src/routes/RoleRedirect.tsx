import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/stores/auth.store';
import Loader from '../shared/components/Loader/Loader';
import { Role } from '../shared/constants/Role';

export default function RoleRedirect() {
  const { user, isAuthenticated, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return <Loader />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/user/login" replace />;
  }

  switch (user.role) {
    case Role.SUPER_ADMIN:
      return <Navigate to="/super-admin" replace />;

    case Role.THEATRE_ADMIN:
      return <Navigate to="/theatre-admin" replace />;

    case Role.USER:
    default:
      return <Navigate to="/user/login" replace />;
  }
}
