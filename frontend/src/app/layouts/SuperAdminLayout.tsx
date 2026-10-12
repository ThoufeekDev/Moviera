import AdminLayout from './AdminLayout';
import { superAdminSidebarItems } from '@/features/super-admin/config/superAdminSidebar.config';

export default function SuperAdminLayout() {
  return <AdminLayout items={superAdminSidebarItems} loginPath="/super-admin/login" />;
}
