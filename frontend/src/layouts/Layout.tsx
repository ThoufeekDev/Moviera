import React, { useState, type ReactNode } from 'react';

import Sidebar from '../features/admin/components/Sidebar/Sidebar';

import './layout.css';

interface LayoutProps {
  children: ReactNode;

  activeTab: string;

  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="layout-container">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <main className="layout-main">{children}</main>
    </div>
  );
};

export default Layout;
