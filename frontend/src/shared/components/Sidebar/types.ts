import type { ReactNode } from "react";

export interface SidebarItem {
    label: string;
    path?: string;
    icon?: ReactNode;
    children?: SidebarItem[];
}

export interface SidebarProps {
    items: SidebarItem[];
    logo?: ReactNode;
    onLogout?: () => void;
}