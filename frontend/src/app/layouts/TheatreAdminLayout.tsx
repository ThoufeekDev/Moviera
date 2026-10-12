import AdminLayout from './AdminLayout';
import { theatreAdminSidebarItems } from '@/features/theatre-admin/config/theatreAdminSidebar.config';

export default function TheatreAdminLayout() {
  return <AdminLayout items={theatreAdminSidebarItems} loginPath="/theatre-admin/login" />;
}
