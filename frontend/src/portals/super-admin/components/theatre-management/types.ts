import type { AdminRole } from '@/features/theatres';

export type { AdminRole };

export interface AssignedAdmin {
  id: string;
  userId: string;
  theatreId: string;
  name: string;
  email: string;
  phone: string;
  avatarColor: string;
  role: AdminRole;
  isActive: boolean;
  assignedAt: string;
}

export interface TheatreItem {
  id: string;
  name: string;
  chain: string;
  city: string;
  location: string;
  screensCount: number;
  totalSeats: number;
  isActive: boolean;
  licenseNumber: string;
  phone: string;
  email: string;
}

export interface ActivityItem {
  id: string;
  adminName: string;
  theatreName: string;
  action: string;
  type: 'ASSIGN' | 'STATUS_CHANGE' | 'REVOKE' | 'ROLE_CHANGE';
  timestamp: string;
}

export const ROLE_CONFIG: Record<
  AdminRole,
  { label: string; badgeClass: string; description: string }
> = {
  PRIMARY_MANAGER: {
    label: 'Primary Manager',
    badgeClass: 'border-brand-200 bg-brand-50 text-brand-700',
    description: 'Full multiplex management, screen creation & pricing controls',
  },
  OPERATIONS_SUPERVISOR: {
    label: 'Operations Supervisor',
    badgeClass: 'border-blue-200 bg-blue-50 text-blue-700',
    description: 'Showtime schedules, screen allocation & maintenance oversight',
  },
  BOX_OFFICE_LEAD: {
    label: 'Box Office Lead',
    badgeClass: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    description: 'Ticketing desk supervision, gate check-in & concessions overview',
  },
};

export const AVATAR_PALETTE = [
  'bg-brand-600 text-white',
  'bg-blue-600 text-white',
  'bg-emerald-600 text-white',
  'bg-purple-600 text-white',
  'bg-amber-600 text-white',
  'bg-rose-600 text-white',
];
