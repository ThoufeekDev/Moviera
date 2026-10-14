
import { useLocation, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/stores/auth.store';
import { Loader } from '@/shared/ui/Loader';
import RoleRedirect from './RoleRedirect';

interface Props {
  children: React.ReactNode;
}

export default function PublicRoute({ children }: Props) {
  const { isAuthenticated, isCheckingAuth, user } = useAuthStore();
  const location = useLocation();

  if (isCheckingAuth && !user) {
    return <Loader />;
  }

  if (isAuthenticated && user) {
    const from = (location.state as { from?: { pathname: string; search?: string; hash?: string } })?.from;
    if (from?.pathname && from.pathname !== location.pathname) {
      const targetUrl = `${from.pathname}${from.search || ''}${from.hash || ''}`;
      return <Navigate to={targetUrl} replace />;
    }
    return <RoleRedirect />;
  }

  return children;
}
