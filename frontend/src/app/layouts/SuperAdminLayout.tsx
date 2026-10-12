import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from '@/shared/ui/Sidebar';
import { superAdminSidebarItems } from '@/features/super-admin/config/superAdminSidebar.config';
import { useAuthStore } from '@/features/auth';

export default function SuperAdminLayout() {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/super-admin/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="flex min-h-dvh w-full bg-page font-sans text-ink">
      <Sidebar items={superAdminSidebarItems} onLogout={handleLogout} />

      <main className="flex-1 min-w-0 min-h-dvh overflow-y-auto overflow-x-hidden pt-16 md:pt-6 md:ml-[260px] pb-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
