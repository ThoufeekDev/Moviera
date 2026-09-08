import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/store/auth.store';
import Loader from '../components/common/Loader';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function TheatreAdminRoute({ children }: Props) {
  const { user, isAuthenticated, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/theatre-admin/login" replace />;
  }

  if (user?.role !== 'THEATRE_ADMIN') {
    return <Navigate to="/" replace />;
  }

  return children;
}
