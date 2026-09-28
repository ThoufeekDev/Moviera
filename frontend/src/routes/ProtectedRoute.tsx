
import { useAuthStore } from '../features/auth/stores/auth.store';
import Loader from '../shared/components/Loader/Loader';
import { Role } from '../shared/constants/Role';
import RoleRedirect from './RoleRedirect';
interface Props {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

                                                  // ! if superAdmin is the role Only a SUPER_ADMIN can enter this route.
export default function ProtectedRoute({ children,allowedRoles}: Props) {
  const { isAuthenticated, isCheckingAuth, user } = useAuthStore();

  if (isCheckingAuth) {
    return <Loader />;
  }

  if (!isAuthenticated || !user) {
    return <RoleRedirect/>
  }

  if(allowedRoles && !allowedRoles.includes(user.role)) return <RoleRedirect/>

  // if (user?.role !== Role.USER) {
  //   return <RoleRedirect/>
  // }

  return children;
}
