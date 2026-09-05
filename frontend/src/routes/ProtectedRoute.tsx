import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/store/auth.store';
import Loader from '../components/common/Loader';

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const { isAuthenticated, isCheckingAuth, user } = useAuthStore();

  if (isCheckingAuth) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/user/login" replace />;
  }

  if (user?.role !== 'USER') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}
