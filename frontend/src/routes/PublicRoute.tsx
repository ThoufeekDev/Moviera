
import { useAuthStore } from '../features/auth/stores/auth.store';
import { Loader } from '@/shared/ui/Loader';

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

  return children;
}
