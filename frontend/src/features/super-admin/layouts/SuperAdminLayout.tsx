import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/shared/ui/Sidebar';
import { superAdminSidebarItems } from '../config/super-admin-sidebar.config';

export default function SuperAdminLayout() {
  return (
    <div className="flex h-screen h-[100dvh] w-full overflow-hidden bg-slate-50 font-sans text-slate-900">
      <Sidebar items={superAdminSidebarItems} />

      <main className="flex-1 min-w-0 h-screen h-[100dvh] overflow-y-auto overflow-x-hidden p-4 pt-20 pb-8 md:ml-[260px] md:p-8 transition-[margin] duration-300">
        <Outlet />
      </main>
    </div>
  );
}
