import { type ReactNode } from 'react';
import { Sidebar } from '@/shared/ui/Sidebar';
import { theatreAdminSidebarItems } from '@/features/theatre-admin/config/theatreAdminSidebar.config';
import { useAuthStore } from '@/features/auth';

interface LayoutProps {
  children: ReactNode;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="flex min-h-dvh w-full bg-page font-sans text-ink">
      <Sidebar items={theatreAdminSidebarItems} onLogout={logout} />

      <main className="flex-1 min-w-0 min-h-dvh overflow-y-auto overflow-x-hidden pt-16 md:pt-6 md:ml-[260px] pb-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;