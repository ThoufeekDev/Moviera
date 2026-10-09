import type { SidebarItem } from '@/shared/ui/Sidebar';


export const theatreAdminSidebarItems: SidebarItem[] = [
  {
    label: 'Dashboard',
    path: '/theatre-admin',
  },
  {
    label: 'Theatres',
    children: [
      {
        label: 'My Theatres',
        path: '/theatre-admin/theatres',
      },

    ],
  },
  {
    label: 'Settings',
    path: '/theatre-admin/settings',
  },
];