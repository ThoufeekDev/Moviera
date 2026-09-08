import { Navigate } from "react-router-dom";
import { useAuthStore } from "../features/auth/store/auth.store";
import Loader from "../components/common/Loader";
import type {ReactNode} from "react"
import { Role } from "../shared/enums/Role";
interface Props {
    children:ReactNode
}


export default function SuperAdminRoute({ children }:Props) {
  const { user, isAuthenticated, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) return <Loader />;

  if (isAuthenticated) {
    return <Navigate to="/super-admin/login" />;
  }

  if (user?.role !== Role.SUPER_ADMIN) {
    return <Navigate to="/" replace />;
  }

  return children;
}