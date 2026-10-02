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

    ],
  },
  {
    label: 'Settings',
    path: '/theatre-admin/settings',
  },
];