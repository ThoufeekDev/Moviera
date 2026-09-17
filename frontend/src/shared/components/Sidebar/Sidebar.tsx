import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import MovieraLogo from '../../../components/common/MovieraLogo/MovieraLogo';
import type { SidebarItem, SidebarProps } from './types';
import styles from './Sidebar.module.css';

// SVG Chevron Icon with smooth rotation
function ChevronIcon({ isExpanded }: { isExpanded: boolean }) {
  return (
    <svg
      className={`${styles.arrowIcon} ${isExpanded ? styles.arrowExpanded : ''}`}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

// Smart Fallback Icon component for items without custom icons
function DefaultItemIcon({ label }: { label: string }) {
  const lower = label.toLowerCase();
  if (lower.includes('dashboard') || lower.includes('home')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
      </svg>
    );
  }
  if (lower.includes('movie') || lower.includes('film')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M6 4v16M18 4v16M2 8h20M2 16h20" />
      </svg>
    );
  }
  if (lower.includes('theatre') || lower.includes('cinema') || lower.includes('screen')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
      </svg>
    );
  }
  if (lower.includes('add') || lower.includes('create') || lower.includes('new')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="9" y1="12" x2="15" y2="12" />
      </svg>
    );
  }
  if (lower.includes('setting') || lower.includes('config')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default function Sidebar({ items, logo, onLogout }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Auto-expand items whose child route matches current active URL
  const [expandedItems, setExpandedItems] = useState<string[]>(() => {
    const activeParents: string[] = [];
    items.forEach((item) => {
      if (item.children?.some((child) => child.path && location.pathname.startsWith(child.path))) {
        activeParents.push(item.label);
      }
    });
    return activeParents;
  });

  useEffect(() => {
    items.forEach((item) => {
      if (
        item.children?.some((child) => child.path && location.pathname.startsWith(child.path)) &&
        !expandedItems.includes(item.label)
      ) {
        setExpandedItems((prev) => [...prev, item.label]);
      }
    });
  }, [location.pathname, items]);

  const toggleItem = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label],
    );
  };

  const renderItem = (item: SidebarItem) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.label);
    const isChildActive =
      hasChildren &&
      item.children?.some(
        (child) =>
          child.path &&
          (location.pathname === child.path ||
            (child.path !== '/' && location.pathname.startsWith(child.path))),
      );

    // Parent item with sub-menu
    if (hasChildren) {
      return (
        <div key={item.label} className={styles.parentItemWrapper}>
          <button
            type="button"
            className={`${styles.navItem} ${styles.parentNavItem} ${isChildActive ? styles.parentActive : ''}`}
            onClick={() => toggleItem(item.label)}
            aria-expanded={isExpanded}
          >
            <span className={styles.icon}>
              {item.icon ?? <DefaultItemIcon label={item.label} />}
            </span>

            <span className={styles.label}>{item.label}</span>

            <span className={styles.arrow}>
              <ChevronIcon isExpanded={isExpanded} />
            </span>
          </button>

          <div className={`${styles.subMenu} ${isExpanded ? styles.subMenuOpen : ''}`}>
            {item.children?.map((child) => (
              <NavLink
                key={child.path}
                to={child.path!}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `${styles.subMenuItem} ${isActive ? styles.active : ''}`
                }
              >
                <span className={styles.subIcon}>
                  {child.icon ?? <DefaultItemIcon label={child.label} />}
                </span>

                <span className={styles.label}>{child.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      );
    }

    // Direct NavLink item
    return (
      <NavLink
        key={item.path}
        to={item.path!}
        onClick={() => setIsOpen(false)}
        className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
      >
        <span className={styles.icon}>
          {item.icon ?? <DefaultItemIcon label={item.label} />}
        </span>

        <span className={styles.label}>{item.label}</span>
      </NavLink>
    );
  };

  return (
    <>
      {/* Mobile Top Navigation Header */}
      <header className={styles.mobileHeader}>
        <button
          type="button"
          className={styles.menuButton}
          onClick={() => setIsOpen(true)}
          aria-label="Open navigation"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button>

        <div className={styles.mobileLogo}>
          {logo ?? <MovieraLogo size="sm" showText={false} subtitle="Admin System" />}
        </div>
      </header>

      {/* Backdrop overlay for mobile drawer */}
      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)} aria-hidden="true" />
      )}

      {/* Main Sidebar Panel */}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.logoContainer}>
          <div className={styles.logo}>
            {logo ?? (
              <div className={styles.defaultLogoWrapper}>
                <MovieraLogo size="md" showText={false} subtitle="Admin Management System" />
              </div>
            )}
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <nav className={styles.navigation}>{items.map(renderItem)}</nav>

        {/* Sidebar Footer Logout Button */}
        <div className={styles.sidebarFooter}>
          <button
            type="button"
            className={styles.logoutButton}
            onClick={onLogout}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.logoutIcon}
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
