import { type ReactNode } from 'react';
import { Sidebar } from '@/shared/ui/Sidebar';
import { theatreAdminSidebarItems } from '@/features/theatre-admin/config/theatre-admin-sidebar.config';

interface LayoutProps {
  children: ReactNode;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full overflow-x-hidden bg-slate-50 font-sans text-slate-900">
      <Sidebar items={theatreAdminSidebarItems} />

      <main className="relative flex min-h-screen min-w-0 flex-1 flex-col">
        {children}
      </main>
    </div>
  );
};

export default Layout;