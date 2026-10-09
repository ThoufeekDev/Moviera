import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/shared/lib/cn';
import type { SidebarItem, SidebarProps } from './types';
import MovieraLogo from '@/shared/ui/MovieraLogo/MovieraLogo';

// ── Internal helpers ──────────────────────────────────────────────────────────

function ChevronIcon({ isExpanded }: { isExpanded: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('transition-transform duration-[250ms] ease-[cubic-bezier(0.16,1,0.3,1)]', isExpanded && 'rotate-180 text-brand-500')}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function DefaultItemIcon({ label }: { label: string }) {
  const lower = label.toLowerCase();
  if (lower.includes('dashboard')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    );
  }
  if (lower.includes('movie') || lower.includes('film')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
        <line x1="7" y1="2" x2="7" y2="22" /><line x1="17" y1="2" x2="17" y2="22" />
        <line x1="2" y1="12" x2="22" y2="12" /><line x1="2" y1="7" x2="7" y2="7" />
        <line x1="2" y1="17" x2="7" y2="17" /><line x1="17" y1="17" x2="22" y2="17" />
        <line x1="17" y1="7" x2="22" y2="7" />
      </svg>
    );
  }
  if (lower.includes('theatre') || lower.includes('screen')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    );
  }
  if (lower.includes('user') || lower.includes('admin')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
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

// ── Shared class strings ──────────────────────────────────────────────────────

const navItemBase = [
  'flex w-full min-h-[46px] items-center gap-[0.85rem] rounded-xl',
  'border border-transparent bg-transparent px-[0.9rem] py-[0.7rem]',
  'text-left text-[0.925rem] font-medium no-underline',
  'text-[rgba(186,186,206,0.7)]',
  'cursor-pointer select-none',
  'transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]',
  'hover:bg-[rgba(248,68,100,0.08)] hover:border-[rgba(248,68,100,0.15)] hover:text-white hover:translate-x-[3px]',
  'active:scale-[0.98]',
].join(' ');

const navItemActive = [
  '!text-white !bg-gradient-to-r from-brand-500 to-brand-700 !border-transparent',
  'font-semibold shadow-[0_6px_18px_rgba(248,68,100,0.35)]',
].join(' ');

const navItemParentActive = [
  '!text-brand-500 !bg-[rgba(248,68,100,0.1)] !border-[rgba(248,68,100,0.25)] font-semibold',
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
            <span className="flex h-6 w-6 shrink-0 items-center justify-center text-[rgba(186,186,206,0.5)] transition-colors duration-200">
              {item.icon ?? <DefaultItemIcon label={item.label} />}
            </span>
            <span className="flex-1 truncate">{item.label}</span>
            <span className="ml-auto flex items-center justify-center text-[rgba(186,186,206,0.5)]">
              <ChevronIcon isExpanded={isExpanded} />
            </span>
          </button>

          {isExpanded && (
            <div className="flex flex-col gap-1 border-l-2 border-[rgba(248,68,100,0.2)] pl-[1.15rem] ml-4 [animation:subMenuSlideDown_0.22s_ease-out_forwards]">
              {item.children?.map((child) => (
                <NavLink
                  key={child.path}
                  to={child.path!}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex min-h-[40px] items-center gap-3 rounded-lg px-[0.85rem] py-[0.55rem]',
                      'text-[0.865rem] font-medium no-underline text-[rgba(186,186,206,0.7)]',
                      'transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]',
                      'hover:text-white hover:bg-[rgba(255,255,255,0.05)] hover:translate-x-[3px]',
                      isActive && '!text-brand-500 !bg-[rgba(248,68,100,0.14)] font-semibold',
                    )
                  }
                >
                  <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center text-[rgba(186,186,206,0.5)] transition-colors duration-200">
                    {child.icon ?? <DefaultItemIcon label={child.label} />}
                  </span>
                  <span className="truncate">{child.label}</span>
                </NavLink>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <NavLink
        key={item.path}
        to={item.path!}
        onClick={() => setIsOpen(false)}
        className={({ isActive }) => cn(navItemBase, isActive && navItemActive)}
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center text-[rgba(186,186,206,0.5)] transition-colors duration-200">
          {item.icon ?? <DefaultItemIcon label={item.label} />}
        </span>
        <span className="truncate">{item.label}</span>
      </NavLink>
    );
  };

  return (
    <>
      {/* Mobile Top Navigation Header (hidden on lg+) */}
      <header className="fixed inset-x-0 top-0 z-[990] hidden h-16 items-center justify-between bg-[rgba(15,18,29,0.92)] px-5 backdrop-blur-xl border-b border-[rgba(255,255,255,0.07)] text-white max-md:flex">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-[10px] border-none bg-[rgba(248,68,100,0.08)] text-brand-500 transition-all duration-200 hover:bg-[rgba(248,68,100,0.18)]"
          onClick={() => setIsOpen(true)}
          aria-label="Open navigation"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button>
        <div className="flex items-center">
          {logo ?? <MovieraLogo size="sm" showText={false} />}
        </div>
      </header>

      {/* Backdrop overlay for mobile drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-[4px] [animation:overlayFade_0.25s_ease-out]"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Panel */}
      <aside
        className={cn(
          // Layout
          'fixed left-0 top-0 z-[1000] flex h-dvh w-[260px] flex-col',
          // Background (dark theme)
          'bg-slate-950',
          '[background-image:linear-gradient(180deg,rgba(248,68,100,0.03)_0%,transparent_40%)]',
          // Border
          'border-r border-[rgba(255,255,255,0.07)]',
          // Scrollbar
          'overflow-y-auto scrollbar-thin',
          '[scrollbar-color:rgba(248,68,100,0.2)_transparent]',
          '[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb]:bg-[rgba(248,68,100,0.2)]',
          // Padding & colour
          'px-4 py-6 text-white',
          // Mobile: translate off-screen, slide in when open
          'transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
          'max-md:-translate-x-full max-md:w-[280px] max-md:shadow-[10px_0_30px_rgba(0,0,0,0.5)]',
          isOpen && 'max-md:translate-x-0',
        )}
      >
        {/* Logo row */}
        <div className="mb-3 flex items-center justify-between border-b border-[rgba(255,255,255,0.07)] px-2 pb-6">
          <div className="flex items-center gap-3">
            {logo ?? <MovieraLogo size="md" showText={false} subtitle="Admin Management System" />}
          </div>
          <button
            type="button"
            className="hidden h-9 w-9 items-center justify-center rounded-lg border-none bg-[rgba(255,255,255,0.06)] text-[rgba(186,186,206,0.7)] transition-all duration-200 hover:bg-[rgba(248,68,100,0.15)] hover:text-brand-500 max-md:flex"
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-1">
          {items.map(renderItem)}
        </nav>

        {/* Footer / Logout */}
        <div className="mt-auto border-t border-[rgba(255,255,255,0.07)] pt-4">
          <button
            type="button"
            onClick={onLogout}
            className={cn(
              'group flex w-full min-h-[44px] items-center justify-center gap-3 rounded-xl',
              'border border-[rgba(248,68,100,0.2)] bg-[rgba(248,68,100,0.08)]',
              'px-4 py-[0.65rem] text-[0.9rem] font-semibold text-brand-500',
              'transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]',
              'hover:bg-gradient-to-r hover:from-brand-500 hover:to-brand-700 hover:border-transparent hover:text-white',
              'hover:shadow-[0_4px_14px_rgba(248,68,100,0.35)] hover:-translate-y-px',
              'active:translate-y-px active:shadow-none',
            )}
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
              className="shrink-0 transition-transform duration-200 group-hover:translate-x-[2px]"
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
