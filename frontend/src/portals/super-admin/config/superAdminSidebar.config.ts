import type { SidebarItem } from '@/shared/ui/Sidebar';

export const superAdminSidebarItems: SidebarItem[] = [
  {
    label: 'Dashboard',
    path: '/super-admin',
  },
  {
    label: 'Movies',
    children: [
      {
        label: 'Manage Movies',
        path: '/super-admin/movies',
      },
    ],
  },
  {
    label: 'Theatres',
    children: [
      {
        label: 'Manage Theatres',
        path: '/super-admin/alltheatres',
      },
      {
        label: 'Facilities',
        path: '/super-admin/theatres/facilities',
      },
      {
        label: 'Manage admin',
        path: '/super-admin/theatres',
      },
    ],
  },
];