import { Link } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';

function TheatreAdminDashboardPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-ink">
          Theatre Admin Dashboard
        </h1>
        <p className="text-xs md:text-sm text-ink-muted">
          Manage your theatre screens, facilities, and theatre operations.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="rounded-lg border border-border bg-surface p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-md bg-brand-50 border border-brand-100 text-brand-600">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <h3 className="text-base font-medium text-ink">My Theatres</h3>
            <p className="mt-1 text-xs md:text-sm text-ink-muted leading-relaxed">
              View and configure all multiplex theatres and screens assigned to your account.
            </p>
          </div>
          <div className="mt-5">
            <Link to="/theatre-admin/theatres">
              <Button variant="primary" size="sm" fullWidth>
                Manage Theatres
              </Button>
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-md bg-surface-muted border border-border text-ink">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </div>
            <h3 className="text-base font-medium text-ink">Account Settings</h3>
            <p className="mt-1 text-xs md:text-sm text-ink-muted leading-relaxed">
              Configure operations, staff privileges, and notification preferences.
            </p>
          </div>
          <div className="mt-5">
            <Link to="/theatre-admin/settings">
              <Button variant="secondary" size="sm" fullWidth>
                View Settings
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TheatreAdminDashboardPage;
