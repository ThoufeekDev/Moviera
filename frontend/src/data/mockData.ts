import type {
  SidebarItem,
  StatCard,
  QueueItem,
  DeptUtilization,
  Appointment,
} from '../features/admin/types/dashboard.types';

export const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'doctors', label: 'Doctors', icon: '🩻' },
  { id: 'departments', label: 'Departments', icon: '🏢' },
  { id: 'appointments', label: 'Appointments', icon: '📅' },
  { id: 'patients', label: 'Patients', icon: '👥' },
  { id: 'queue', label: 'Queue', icon: '🔢' },
  { id: 'reviews', label: 'Reviews', icon: '💬' },
  { id: 'analytics', label: 'Analytics', icon: '📈' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

export const STATS_CARDS: StatCard[] = [
  { id: 1, title: "TODAY'S APPOINTMENTS", value: '42', change: '+12%', status: 'positive' },
  { id: 2, title: 'ACTIVE DOCTORS', value: '18', change: 'Stable', status: 'neutral' },
  { id: 3, title: 'REGISTERED PATIENTS', value: '1,240', change: '+8%', status: 'positive' },
  { id: 4, title: 'REVENUE', value: '$12.5k', change: '+5.2%', status: 'positive' },
  { id: 5, title: 'AVG WAIT TIME', value: '15m', change: '-3m', status: 'positive' },
  { id: 6, title: 'SATISFACTION', value: '4.8/5', change: 'Top 5%', status: 'positive' },
];

export const QUEUE_DATA: QueueItem[] = [
  {
    id: 'Q-104',
    name: 'John Doe',
    dept: 'Cardiology',
    doctor: 'Dr. Sarah Jenkins',
    priority: true,
  },
  { id: 'Q-105', name: 'Maria Silva', dept: 'General', doctor: 'Dr. Alan Rick', priority: false },
  {
    id: 'Q-106',
    name: 'Robert King',
    dept: 'Orthopedics',
    doctor: 'Dr. Lisa Wong',
    priority: false,
  },
];

export const DEPT_UTILIZATION: DeptUtilization[] = [
  { name: 'Cardiology', percentage: 92, status: 'normal' },
  { name: 'Neurology', percentage: 78, status: 'normal' },
  { name: 'Pediatrics', percentage: 65, status: 'normal' },
  { name: 'Emergency', percentage: 45, status: 'critical' },
];

export const RECENT_APPOINTMENTS: Appointment[] = [
  {
    id: 1,
    patient: 'Alice Walker',
    doctor: 'Dr. Emily Smith',
    time: '09:30 AM',
    status: 'Confirmed',
  },
  {
    id: 2,
    patient: 'Tom Brown',
    doctor: 'Dr. Michael Chen',
    time: '10:15 AM',
    status: 'In Progress',
  },
  {
    id: 3,
    patient: 'Sarah Miller',
    doctor: 'Dr. Sarah Jenkins',
    time: '11:00 AM',
    status: 'Waiting',
  },
];
