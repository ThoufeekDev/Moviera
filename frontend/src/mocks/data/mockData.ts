export interface MockSidebarItem {
  id: string;
  label: string;
  icon: string;
}

export const SIDEBAR_ITEMS: MockSidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'Movies', label: 'Movies', icon: '' },
];