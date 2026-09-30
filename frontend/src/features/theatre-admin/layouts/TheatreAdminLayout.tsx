import { Outlet } from "react-router-dom";

import Sidebar  from "../../../shared/components/Sidebar/Sidebar"
import { theatreAdminSidebarItems } from "../config/theatre-admin-sidebar.config";
import styles from './TheatreAdminLayout.module.css';


export default function TheatreAdminLayout() {
    return (
            <div className={styles.layoutContainer}>
      <Sidebar items={theatreAdminSidebarItems} />

      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>

    )
}
