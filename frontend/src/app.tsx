import AppRoutes from './routes/AppRoutes';
import { useAuthStore } from './features/auth/store/auth.store';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  const fetchProfile = useAuthStore((state) => state.fetchProfile);
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <>
      <AppRoutes />

      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
}
