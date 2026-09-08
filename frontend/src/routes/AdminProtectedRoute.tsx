// import { Navigate } from 'react-router-dom';
// import { useAuthStore } from '../features/auth/store/auth.store';
// import Loader from '../components/common/Loader';
// import { Role } from '../shared/enums/Role';

// interface Props {
//   children: React.ReactNode;
// }

// export default function AdminRoute({ children }: Props) {
//   const { user, isAuthenticated, isCheckingAuth } = useAuthStore();

//   if (isCheckingAuth) {
//     return <Loader />;
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/admin/login" replace />;
//   }

//   if (user?.role !== Role.THEATRE_ADMIN) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// }
