import type { SidebarItem } from "../../../shared/components/Sidebar/types";


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
      {
        label: 'Add Theatre',
        path: '/theatre-admin/theatres/create',
      },
    ],
  },
  {
    label: 'Settings',
    path: '/theatre-admin/settings',
  },
];