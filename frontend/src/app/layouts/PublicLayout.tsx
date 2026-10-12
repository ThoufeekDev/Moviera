import { type ReactNode, useState } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { MovieraLogo } from '@/shared/ui/MovieraLogo';
import { Button } from '@/shared/ui/Button';
import { useAuthStore } from '@/features/auth/stores/auth.store';

interface PublicLayoutProps {
  children?: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/user/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col bg-page text-ink font-sans">
      {/* ── Public Header (Sticky) ───────────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-surface shadow-xs">
        <div className="mx-auto flex h-14 md:h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 rounded-md">
            <MovieraLogo size="md" />
          </Link>

          {/* Desktop Search Bar (grows) */}
          <div className="hidden md:flex flex-1 max-w-md items-center">
            <div className="relative w-full">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <input
                type="search"
                placeholder="Search for Movies, Events, Plays and Activities"
                className="h-10 w-full rounded-md border border-border bg-surface-muted pl-10 pr-4 text-sm text-ink placeholder:text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:bg-surface transition-colors"
              />
            </div>
          </div>

          {/* User actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block text-sm font-medium text-ink truncate max-w-[140px]">
                  {user.name}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/user/login">
                  <Button variant="primary" size="sm">
                    Sign In
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu hamburger toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-md text-ink-muted hover:bg-surface-muted hover:text-ink md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {mobileMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <>
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="18" x2="20" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu (collapsible) */}
        {mobileMenuOpen && (
          <nav className="border-t border-border bg-surface px-4 py-3 md:hidden flex flex-col gap-1 text-sm animate-in fade-in duration-150" aria-label="Mobile navigation">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex min-h-[44px] items-center px-3 rounded-md font-medium text-ink hover:bg-surface-muted"
            >
              Movies
            </Link>
            <Link
              to="/theatre-admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex min-h-[44px] items-center px-3 rounded-md font-medium text-ink hover:bg-surface-muted"
            >
              Partner Portal
            </Link>
            <Link
              to="/super-admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex min-h-[44px] items-center px-3 rounded-md font-medium text-ink hover:bg-surface-muted"
            >
              Admin Portal
            </Link>
          </nav>
        )}
      </header>

      {/* ── Dark Nav Strip (Desktop Only: 40px, bg-nav text-nav-ink) ───── */}
      <nav className="hidden md:block w-full bg-nav text-nav-ink" aria-label="Primary sections navigation">
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 text-xs font-medium">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-nav-ink hover:text-white transition-colors">
              Movies
            </Link>
          </div>
          <div className="flex items-center gap-6 text-nav-ink/80">
            <Link to="/theatre-admin/login" className="hover:text-white transition-colors">
              List Your Show
            </Link>
            <Link to="/" className="hover:text-white transition-colors">
              Offers
            </Link>
            <Link to="/theatre-admin/login" className="hover:text-white transition-colors">
              Portal Access
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Main Content Body ────────────────────────────────────────────── */}
      <main className="flex-1 min-w-0">
        {children ?? <Outlet />}
      </main>

      {/* ── Footer (bg-nav text-nav-ink) ─────────────────────────────────── */}
      <footer className="mt-auto border-t border-white/10 bg-nav text-nav-ink py-10 md:py-12">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-white/10">
            {/* Col 1: Brand */}
            <div className="md:col-span-2 flex flex-col gap-3">
              <MovieraLogo size="md" variant="light" />
              <p className="max-w-sm text-xs md:text-sm text-nav-ink/70 leading-relaxed">
                Moviera is your premier movie ticket booking and cinema management platform. Discover the latest releases, showtimes, and theatre venues.
              </p>
            </div>

            {/* Col 2: Movie Goers */}
            <div className="flex flex-col gap-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-nav-ink">
                Movie Goers
              </h4>
              <ul className="flex flex-col gap-2 text-xs md:text-sm text-nav-ink/75">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Now Showing
                  </Link>
                </li>
                <li>
                  <Link to="/user/login" className="hover:text-white transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link to="/register/user" className="hover:text-white transition-colors">
                    Create Account
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Partners & Admins */}
            <div className="flex flex-col gap-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-nav-ink">
                Cinema Partners
              </h4>
              <ul className="flex flex-col gap-2 text-xs md:text-sm text-nav-ink/75">
                <li>
                  <Link to="/theatre-admin/login" className="hover:text-white transition-colors">
                    Theatre Partner Login
                  </Link>
                </li>
                <li>
                  <Link to="/theatre-admin/register" className="hover:text-white transition-colors">
                    Partner Registration
                  </Link>
                </li>
                <li>
                  <Link to="/super-admin/login" className="hover:text-white transition-colors">
                    Super Admin Portal
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright Strip */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-nav-ink/60">
            <p>&copy; {new Date().getFullYear()} Moviera. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
