import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/store/auth.store';
import Loader from '../components/common/Loader';

interface Props {
  children: React.ReactNode;
}

export default function AdminPublicRoute({ children }: Props) {
  const { user, isAuthenticated, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return <Loader />;
  }

  if (isAuthenticated && user?.role === 'ADMIN') {
    console.log('Redirecting to dashboard');
    return <Navigate to="/admin" replace />;
  }

  return children;
}
