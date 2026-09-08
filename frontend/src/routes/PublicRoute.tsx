
import { useAuthStore } from '../features/auth/store/auth.store';
import Loader from '../components/common/Loader';

import RoleRedirect from './RoleRedirect';

interface Props {
  children: React.ReactNode;
}

export default function PublicRoute({ children }: Props) {
  const { isAuthenticated, isCheckingAuth, user } = useAuthStore();

  if (isCheckingAuth) {
    return <Loader />;
  }

  if (isAuthenticated && user) return <RoleRedirect />;

  /**
  * ! tempreroly removed for testing  
   *   if (isAuthenticated && user) {
    if (user.role === Role.THEATRE_ADMIN) {
      return <Navigate to="/admin" replace />;
    }
    // return <Navigate to="/" replace />;
  }
   * 
   */

  return children;
}
