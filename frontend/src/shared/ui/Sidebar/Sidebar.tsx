import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/shared/lib/cn';
import type { SidebarItem, SidebarProps } from './types';
import MovieraLogo from '@/shared/ui/MovieraLogo/MovieraLogo';

// ── Internal helpers ──────────────────────────────────────────────────────────

function ChevronIcon({ isExpanded }: { isExpanded: boolean }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(
        'transition-transform duration-200 text-nav-muted',
        isExpanded && 'rotate-180 text-white',
      )}
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function ItemRightArrow() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-white/40 ml-auto shrink-0 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-white/80"
      aria-hidden="true"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function DefaultItemIcon({ label, active }: { label: string; active?: boolean }) {
  const lower = label.toLowerCase();

  if (lower.includes('dashboard')) {
    return (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(active ? 'text-indigo-400' : 'text-indigo-400/80')}
        aria-hidden="true"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    );
  }
  if (lower.includes('movie') || lower.includes('film')) {
    return (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(active ? 'text-brand-500' : 'text-brand-500/80')}
        aria-hidden="true"
      >
        <rect x="2" y="2" width="20" height="20" rx="2.5" />
        <line x1="7" y1="2" x2="7" y2="22" />
        <line x1="17" y1="2" x2="17" y2="22" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <line x1="2" y1="7" x2="7" y2="7" />
        <line x1="2" y1="17" x2="7" y2="17" />
        <line x1="17" y1="17" x2="22" y2="17" />
        <line x1="17" y1="7" x2="22" y2="7" />
      </svg>
    );
  }
  if (lower.includes('theatre') || lower.includes('screen') || lower.includes('theatre')) {
    return (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(active ? 'text-sky-400' : 'text-sky-400/80')}
        aria-hidden="true"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    );
  }
  if (lower.includes('user') || lower.includes('admin') || lower.includes('assign')) {
    return (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(active ? 'text-purple-400' : 'text-purple-400/80')}
        aria-hidden="true"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    );
  }
  if (lower.includes('setting') || lower.includes('config')) {
    return (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(active ? 'text-amber-400' : 'text-amber-400/80')}
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    );
  }

  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(active ? 'text-white' : 'text-nav-muted')}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

// ── Shared class strings ──────────────────────────────────────────────────────

const navItemBase = [
  'group flex w-full min-h-[42px] items-center gap-3 rounded-xl',
  'border border-transparent bg-transparent px-3 py-2',
  'text-left text-[13.5px] font-medium text-nav-muted',
  'cursor-pointer select-none transition-all duration-150',
  'hover:bg-nav-surface hover:text-nav-ink',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 focus-visible:ring-offset-nav',
].join(' ');

const navItemActive = [
  '!text-white !bg-nav-active !border-white/[0.05]',
  'font-semibold shadow-xs',
].join(' ');

const navItemParentActive = [
  '!text-nav-ink !bg-nav-surface',
].join(' ');

// ── Component ─────────────────────────────────────────────────────────────────

export default function Sidebar({ items, logo, onLogout }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

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
        item.children?.some((child) => child.path && location.pathname.startsWith(child.path))
      ) {
        setExpandedItems((prev) =>
          prev.includes(item.label) ? prev : [...prev, item.label],
        );
      }
    });
  }, [location.pathname, items]);

  const toggleItem = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label],
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

    if (hasChildren) {
      return (
        <div key={item.label} className="flex flex-col gap-1">
          <button
            type="button"
            className={cn(navItemBase, isChildActive && navItemParentActive)}
            onClick={() => toggleItem(item.label)}
            aria-expanded={isExpanded}
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center">
              {item.icon ?? <DefaultItemIcon label={item.label} active={isChildActive} />}
            </span>
            <span className="flex-1 truncate tracking-tight">{item.label}</span>
            <span className="ml-auto flex items-center justify-center">
              <ChevronIcon isExpanded={isExpanded} />
            </span>
          </button>

          {isExpanded && (
            <div className="relative mt-0.5 flex flex-col gap-1 border-l border-nav-border pl-3 ml-4.5">
              {item.children?.map((child) => {
                const isChildCurrent =
                  child.path &&
                  (location.pathname === child.path ||
                    (child.path !== '/' && location.pathname.startsWith(child.path)));

                return (
                  <NavLink
                    key={child.path}
                    to={child.path!}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'group/sub flex min-h-[38px] items-center justify-between rounded-lg px-2.5 py-1.5',
                        'text-xs md:text-[13px] font-medium text-nav-muted',
                        'transition-all duration-150',
                        'hover:text-nav-ink hover:bg-nav-surface',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600',
                        (isActive || isChildCurrent) &&
                          '!text-white !bg-nav-active font-semibold border border-white/[0.04] shadow-xs',
                      )
                    }
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                        {child.icon ?? <DefaultItemIcon label={child.label} active={Boolean(isChildCurrent)} />}
                      </span>
                      <span className="truncate">{child.label}</span>
                    </div>

                    {Boolean(isChildCurrent) && (
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-500 shrink-0" />
                    )}
                  </NavLink>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    const isActive =
      item.path &&
      (location.pathname === item.path ||
        (item.path !== '/' && location.pathname.startsWith(item.path)));

    return (
      <NavLink
        key={item.path}
        to={item.path!}
        onClick={() => setIsOpen(false)}
        className={cn(navItemBase, isActive && navItemActive)}
      >
        <span className="flex h-5 w-5 shrink-0 items-center justify-center">
          {item.icon ?? <DefaultItemIcon label={item.label} active={Boolean(isActive)} />}
        </span>
        <span className="flex-1 truncate tracking-tight">{item.label}</span>
        {isActive && <ItemRightArrow />}
      </NavLink>
    );
  };

  return (
    <>
      {/* Mobile Top Navigation Header */}
      <header className="fixed inset-x-0 top-0 z-40 hidden h-14 md:h-16 items-center justify-between bg-nav px-4 text-nav-ink border-b border-nav-border max-md:flex">
        <button
          type="button"
          className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-nav-muted hover:text-white hover:bg-nav-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
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
            aria-hidden="true"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button>
        <div className="flex items-center">
          {logo ?? <MovieraLogo size="sm" variant="light" showText={true} />}
        </div>
      </header>

      {/* Backdrop overlay for mobile drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Panel */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-dvh w-[260px] flex-col',
          'bg-nav text-nav-muted border-r border-nav-border',
          'overflow-y-auto px-3.5 py-4',
          'transition-transform duration-200 ease-out select-none',
          'max-md:-translate-x-full max-md:w-[280px] max-md:shadow-2xl max-md:pb-[calc(1.5rem+env(safe-area-inset-bottom))]',
          isOpen && 'max-md:translate-x-0',
        )}
      >
        {/* Top Window Dots (macOS style like reference image) */}
        <div className="flex items-center justify-between pb-3.5 mb-2.5 border-b border-nav-border">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-nav-active transition-colors" />
            <span className="h-2.5 w-2.5 rounded-full bg-nav-active transition-colors" />
            <span className="h-2.5 w-2.5 rounded-full bg-nav-active transition-colors" />
          </div>
          <div className="flex items-center gap-2 text-nav-muted">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
          </div>
        </div>

        {/* Logo Section */}
        <div className="mb-4 flex items-center justify-between border-b border-nav-border pb-4 px-1">
          <div className="flex items-center">
            {logo ?? (
              <MovieraLogo
                size="md"
                variant="light"
                showText={true}
                subtitle="Admin Panel"
              />
            )}
          </div>
          <button
            type="button"
            className="hidden h-9 w-9 min-h-[36px] min-w-[36px] items-center justify-center rounded-lg text-nav-muted hover:text-white hover:bg-nav-surface max-md:flex"
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Navigation List */}
        <nav
          className="flex flex-1 flex-col gap-1.5"
          aria-label="Admin Sidebar Navigation"
        >
          {items.map(renderItem)}
        </nav>

        {/* Footer / Logout Button */}
        <div className="mt-auto border-t border-nav-border pt-3.5">
          <button
            type="button"
            onClick={onLogout}
            className={cn(
              'group flex w-full min-h-[42px] items-center justify-center gap-2.5 rounded-xl',
              'border border-nav-border bg-nav-surface shadow-xs',
              'px-4 py-2 text-xs md:text-sm font-medium text-nav-muted',
              'transition-all duration-150',
              'hover:bg-brand-600 hover:text-white hover:border-brand-600',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 focus-visible:ring-offset-nav',
            )}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 transition-transform duration-150 group-hover:-translate-x-0.5"
              aria-hidden="true"
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
