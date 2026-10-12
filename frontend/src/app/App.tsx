import AppRoutes from '@/app/router/AppRoutes';
import { useAuthStore } from '@/features/auth/stores/auth.store';
import { setAuthFailureHandler } from '@/shared/lib/axios';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  const fetchProfile = useAuthStore((state) => state.fetchProfile);
  useEffect(() => {
    setAuthFailureHandler(() => {
      useAuthStore.getState().clear();
    });
    fetchProfile();
  }, [fetchProfile]);

  return (
    <>
      <AppRoutes />

      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
}
