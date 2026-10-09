import { Link } from 'react-router-dom';
import { MovieraLogo } from '@/shared/ui/MovieraLogo';

export default function NotFoundPage() {
  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-slate-50 p-5 bg-[radial-gradient(circle_at_50%_30%,rgba(248,68,100,0.07)_0%,rgba(248,250,252,1)_75%)]">
      <div className="relative z-10 flex w-full max-w-[460px] flex-col items-center rounded-3xl border border-slate-200/80 border-t-4 border-t-brand-500 bg-white p-7 text-center shadow-xl shadow-slate-900/5 sm:p-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Brand Logo */}
        <div className="mb-4">
          <MovieraLogo size="md" />
        </div>

        {/* Animated Cinema Stage Graphic */}
        <div className="relative mb-3 flex h-[100px] w-[180px] items-center justify-center">
          {/* Projector Light Beam */}
          <div className="pointer-events-none absolute top-2.5 h-0 w-0 border-x-[60px] border-b-[80px] border-x-transparent border-b-brand-500/10" />

          {/* Film Reel Animation */}
          <div className="text-brand-500 drop-shadow-[0_6px_16px_rgba(248,68,100,0.3)] animate-spin-slow">
            <svg
              width="72"
              height="72"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="3" />
              <circle cx="12" cy="6" r="1.5" fill="currentColor" />
              <circle cx="12" cy="18" r="1.5" fill="currentColor" />
              <circle cx="6" cy="12" r="1.5" fill="currentColor" />
              <circle cx="18" cy="12" r="1.5" fill="currentColor" />
            </svg>
          </div>

          {/* Floating Ticket Badges */}
          <div className="absolute top-4 left-2.5 -rotate-12 rounded-xl border border-slate-200 bg-white p-2 text-brand-500 shadow-md transition-transform">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="6" width="20" height="12" rx="2" />
              <path d="M6 12h.01M18 12h.01" />
              <polygon points="10,9 15,12 10,15" fill="currentColor" />
            </svg>
          </div>

          <div className="absolute bottom-4 right-2.5 rotate-12 rounded-xl border border-slate-200 bg-white p-2 text-brand-500 shadow-md transition-transform">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3L20.2 6Z" />
              <path d="M4 11h16a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z" />
            </svg>
          </div>
        </div>

        {/* Error Display Code */}
        <h1 className="my-1 text-6xl sm:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-brand-500 to-brand-700">
          404
        </h1>

        {/* Message */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
            Scene Not Found
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
            Oops! It looks like this movie scene took a wrong turn or the showtime URL was removed.
            Let&apos;s get you back to the main stage!
          </p>
        </div>

        {/* Actions */}
        <div className="flex w-full flex-col sm:flex-row gap-3">
          <Link
            to="/"
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-sm font-bold text-white shadow-md shadow-brand-500/25 transition hover:from-brand-600 hover:to-brand-700 hover:shadow-lg hover:shadow-brand-500/35"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Return to Home
          </Link>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Go Back
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-5 text-xs font-medium text-slate-400">
        <p>&copy; {new Date().getFullYear()} Moviera Cinema. All rights reserved.</p>
      </footer>
    </main>
  );
}
