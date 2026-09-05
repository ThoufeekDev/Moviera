import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Layout from '../layouts/Layout';

const AdminLayoutWrapper: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Sync state if navigation occurs outside clicking the sidebar directly
  useEffect(() => {
    const currentPath = location.pathname.split('/').pop();
    if (currentPath && currentPath !== activeTab) {
      setActiveTab(currentPath);
    }
  }, [location.pathname]);

  // Handle active navigation updates when sidebar items are pressed
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === 'dashboard') {
      navigate('/admin/dashboard');
    } else {
      navigate(`/admin/${tabId}`);
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={handleTabChange}>
      {/* Outlet dynamically loads the nested child page component matching the current URL */}
      <Outlet />
    </Layout>
  );
};

export default AdminLayoutWrapper;
