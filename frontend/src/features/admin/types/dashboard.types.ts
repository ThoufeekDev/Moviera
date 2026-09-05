export interface SidebarItem {
  id: string;
  label: string;
  icon: string;
}

export interface StatCard {
  id: number;
  title: string;
  value: string;
  change: string;
  status: 'positive' | 'neutral' | 'critical';
}

export interface QueueItem {
  id: string;
  name: string;
  dept: string;
  doctor: string;
  priority: boolean;
}

export interface DeptUtilization {
  name: string;
  percentage: number;
  status: 'normal' | 'critical';
}

export interface Appointment {
  id: number;
  patient: string;
  doctor: string;
  time: string;
  status: 'Confirmed' | 'In Progress' | 'Waiting';
}
