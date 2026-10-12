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
        label: 'All Movies',
        path: '/super-admin/movies',
      },
      {
        label: 'Add Movie',
        path: '/super-admin/movies/create',
        },

    ],
  },
  {
    label: 'Theatres',
    children: [
      {
        label: 'All Theatres',
        path: '/super-admin/theatres',
      },
      {
        label: 'Add Theatre',
        path: '/super-admin/theatres/create',
      },
    ],
  },
];