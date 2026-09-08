import React from 'react';
import { SIDEBAR_ITEMS } from '../../../../data/mockData';
import './sidebar.css';
import { useAuthStore } from '../../../auth/store/auth.store';
import MovieraLogo from '../../../../components/common/MovieraLogo/MovieraLogo';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}




const icons: Record<string, React.ReactNode> = {
  dashboard: (
    <svg viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),

  users: (
    <svg viewBox="0 0 24 24">
      <circle cx="9" cy="7" r="4" />
      <path d="M3 21v-2a6 6 0 0 1 12 0v2" />
      <path d="M16 3.5a4 4 0 0 1 0 7" />
      <path d="M21 21v-2a6 6 0 0 0-3-5.2" />
    </svg>
  ),

  doctors: (
    <svg viewBox="0 0 24 24">
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <path d="M4 7h16" />
      <rect x="4" y="4" width="16" height="17" rx="3" />
      <path d="M12 11v6" />
      <path d="M9 14h6" />
    </svg>
  ),

  appointments: (
    <svg viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
      <path d="M8 14h3" />
      <path d="M8 18h5" />
    </svg>
  ),

  patients: (
    <svg viewBox="0 0 24 24">
      <circle cx="9" cy="8" r="4" />
      <path d="M3 21a6 6 0 0 1 12 0" />
      <path d="M19 8v6" />
      <path d="M16 11h6" />
    </svg>
  ),

  reports: (
    <svg viewBox="0 0 24 24">
      <path d="M4 20V10" />
      <path d="M10 20V4" />
      <path d="M16 20v-7" />
      <path d="M22 20H2" />
    </svg>
  ),

  reviews: (
    <svg viewBox="0 0 24 24">
      <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
    </svg>
  ),

  messages: (
    <svg viewBox="0 0 24 24">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  ),

  settings: (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V22h-2.6v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1A1.7 1.7 0 0 0 8 17a1.7 1.7 0 0 0-1.5-1H6v-2.6h.5a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V7H15v.5a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.5V16h-.5a1.7 1.7 0 0 0-1.5 1Z" />
    </svg>
  ),
};


const ChevronIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const LogoutIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="m16 17 5-5-5-5" />
    <path d="M21 12H9" />
  </svg>
);





const Sidebar: React.FC<SidebarProps> = React.memo(
  
  ({ activeTab, setActiveTab, isOpen, toggleSidebar }) => {

    const logout = useAuthStore((state) => state.logout);

    async function handleLogout() {
      try {
        await logout();
      } catch (error) {
        console.log(error);
      }
    }
    return (
      <>
        {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar} aria-hidden="true" />}

        <aside className={`sidebar-container-el ${isOpen ? 'is-open' : ''}`}>
          {/* Header */}

          <div className="sidebar-header">
            <MovieraLogo size="sm" variant="light" subtitle="Admin Portal" />
          </div>


          <nav className="sidebar-navigation" aria-label="Admin navigation">
            {SIDEBAR_ITEMS.map((item) => {
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab(item.id);

                    if (window.innerWidth <= 992) {
                      toggleSidebar();
                    }
                  }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="sidebar-nav-icon">{icons[item.id]}</span>

                  <span className="sidebar-nav-label">{item.label}</span>

                  <span className="sidebar-nav-arrow">
                    <ChevronIcon />
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Footer */}

          <div className="sidebar-footer" style={{ fontFamily: 'Inter, sans-serif' }}>
            <div className="sidebar-profile">
              <div className="profile-avatar">
                <img
                  src="https://img.magnific.com/free-vector/hospital-building-construction-exterior-facade-architectural-design-healthcare-medical-insurance-concept_575670-1125.jpg?semt=ais_hybrid&w=740&q=80"
                  alt="Admin User"
                />
                <span className="profile-status" />
              </div>

              <div className="profile-details">
                <strong>Admin User</strong>
                <span>Chief Officer</span>
              </div>
            </div>

            <button className="sidebar-logout" aria-label="Logout" onClick={handleLogout}>
              <LogoutIcon />
            </button>
          </div>
        </aside>
      </>
    );
  },
);

Sidebar.displayName = 'Sidebar';

export default Sidebar;
