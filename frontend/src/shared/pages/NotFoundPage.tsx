import { Link } from 'react-router-dom';
import MovieraLogo from '../../components/common/MovieraLogo/MovieraLogo';
import './NotFoundPage.css';

export default function NotFoundPage() {
  return (
    <main className="moviera-404-container">
      <div className="moviera-404-card">
        {/* Brand Logo */}
        <div className="moviera-404-logo">
          <MovieraLogo size="md" />
        </div>

        {/* Animated Cinema Stage Graphic */}
        <div className="cinema-sandbox">
          {/* Projector Light Beam */}
          <div className="projector-beam"></div>

          {/* Film Reel Animation */}
          <div className="film-reel">
            <svg
              width="72"
              height="72"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="reel-svg"
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
          <div className="ticket-floating ticket-left">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="6" width="20" height="12" rx="2" />
              <path d="M6 12h.01M18 12h.01" />
              <polygon points="10,9 15,12 10,15" fill="currentColor" />
            </svg>
          </div>

          <div className="ticket-floating ticket-right">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3L20.2 6Z" />
              <path d="M4 11h16a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z" />
            </svg>
          </div>
        </div>

        {/* Error Display Code */}
        <h1 className="moviera-404-code">404</h1>

        {/* Message */}
        <div className="moviera-404-text-group">
          <h2 className="moviera-404-heading">Scene Not Found</h2>
          <p className="moviera-404-subtext">
            Oops! It looks like this movie scene took a wrong turn or the showtime URL was removed.
            Let's get you back to the main stage!
          </p>
        </div>

        {/* Actions */}
        <div className="moviera-404-actions">
          <Link to="/" className="btn-moviera-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Return to Home
          </Link>

          <button type="button" onClick={() => window.history.back()} className="btn-moviera-secondary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Go Back
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="moviera-404-footer">
        <p>&copy; {new Date().getFullYear()} Moviera Cinema. All rights reserved.</p>
      </footer>
    </main>
  );
}
