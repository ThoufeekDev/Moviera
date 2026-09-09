import { Outlet } from 'react-router-dom';
import Sidebar from '../../../shared/components/Sidebar/Sidebar';
import { superAdminSidebarItems } from '../config/superAdminSidebar.config';
import styles from './SuperAdminLayout.module.css';

export default function SuperAdminLayout() {
  return (
    <div className={styles.layoutContainer}>
      <Sidebar items={superAdminSidebarItems} />

      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
}
