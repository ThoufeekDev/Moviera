import { Link } from 'react-router-dom';
import { MovieraLogo } from '@/shared/ui/MovieraLogo';

export default function GatewayPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-slate-100 p-6 font-sans bg-[radial-gradient(circle_at_50%_0%,rgba(248,68,100,0.05)_0%,rgba(244,245,248,1)_75%)]">
      {/* Platform Entry Header */}
      <header className="mb-9 flex max-w-lg flex-col items-center text-center">
        <MovieraLogo size="lg" />
        <h1 className="mt-5 mb-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Choose Your Gateway
        </h1>
        <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
          Join Moviera to book tickets for the latest movies or partner with us to manage your cinema listings.
        </p>
      </header>

      {/* Grid Configuration Segment */}
      <nav className="grid w-full max-w-3xl grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-7" aria-label="Portal Navigation Actions">
        {/* OPTION 1: MOVIE GOER / USER */}
        <Link
          to="/register/user"
          className="group relative flex flex-col items-start overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-7 sm:p-9 shadow-md shadow-slate-900/5 transition duration-200 hover:-translate-y-1 hover:border-brand-500/40 hover:shadow-xl hover:shadow-brand-500/10 focus-visible:outline-2 focus-visible:outline-brand-500"
        >
          {/* Top Accent Stripe */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-500 to-rose-400" />

          <div className="mb-5 flex h-13 w-13 items-center justify-center rounded-2xl border border-brand-500/20 bg-brand-500/10 text-brand-500 transition">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="6" width="20" height="12" rx="2" />
              <path d="M6 12h.01M18 12h.01" />
              <polygon points="10,9 15,12 10,15" fill="currentColor" />
            </svg>
          </div>

          <h2 className="mb-2 text-xl font-extrabold tracking-tight text-slate-900">
            Movie Goer
          </h2>
          <p className="mb-6 text-sm leading-relaxed text-slate-600">
            Book tickets, reserve best seats, explore upcoming movies, and grab snack offers.
          </p>

          <span className="inline-flex items-center gap-2 text-sm font-bold text-brand-500 transition group-hover:gap-3">
            Get Started
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
        </Link>

        {/* OPTION 2: THEATER PARTNER / ADMIN */}
        <Link
          to="/register/hospital"
          className="group relative flex flex-col items-start overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-7 sm:p-9 shadow-md shadow-slate-900/5 transition duration-200 hover:-translate-y-1 hover:border-slate-400 hover:shadow-xl hover:shadow-slate-900/10 focus-visible:outline-2 focus-visible:outline-slate-700"
        >
          {/* Top Accent Stripe */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-slate-800 to-slate-600" />

          <div className="mb-5 flex h-13 w-13 items-center justify-center rounded-2xl border border-slate-300 bg-slate-100 text-slate-800 transition">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 21h18M5 21V7l7-4 7 4v14" />
              <path d="M9 10h2M13 10h2M9 14h2M13 14h2" />
            </svg>
          </div>

          <h2 className="mb-2 text-xl font-extrabold tracking-tight text-slate-900">
            Cinema Partner
          </h2>
          <p className="mb-6 text-sm leading-relaxed text-slate-600">
            List your theater, manage showtimes, screen layouts, and ticket reservations.
          </p>

          <span className="inline-flex items-center gap-2 text-sm font-bold text-slate-800 transition group-hover:gap-3">
            Partner With Us
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
        </Link>
      </nav>

      <footer className="mt-8 text-sm text-slate-600">
        Already have an account?{' '}
        <Link to="/user/login" className="font-bold text-brand-500 hover:underline">
          Login Here
        </Link>
      </footer>
    </div>
  );
}
