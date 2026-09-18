import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/stores/auth.store';
import Loader from '../shared/components/Loader/Loader';
import type { ReactNode } from 'react';
import { Role } from '../shared/constants/Role';
interface Props {
  children: ReactNode;
}

export default function TheatreAdminRoute({ children }: Props) {
  const { user, isAuthenticated, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/theatre-admin/login" replace  />;
  }

  if (user?.role !== Role.THEATRE_ADMIN) {
    return <Navigate to="/" replace />;
  }

  return children;
}
