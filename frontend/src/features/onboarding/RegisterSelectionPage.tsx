import { Link } from 'react-router-dom';
import MovieraLogo from '../../components/common/MovieraLogo/MovieraLogo';
import './gateWay.css';

export default function GatewayPage() {
  return (
    <div className="gateway-container">
      {/* Platform Entry Header */}
      <header className="gateway-header">
        <MovieraLogo size="lg" />
        <h1>Choose Your Gateway</h1>
        <p>
          Join Moviera to book tickets for the latest movies or partner with us to manage your cinema listings.
        </p>
      </header>

      {/* Grid Configuration Segment */}
      <nav className="gateway-grid" aria-label="Portal Navigation Actions">
        {/* OPTION 1: MOVIE GOER / USER */}
        <Link to="/register/user" className="gateway-card patient-path">
          <div className="card-icon" aria-hidden="true">
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
          <h2>Movie Goer</h2>
          <p>Book tickets, reserve best seats, explore upcoming movies, and grab snack offers.</p>
          <span className="card-action-link">
            Get Started
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </span>
        </Link>

        {/* OPTION 2: THEATER PARTNER / ADMIN */}
        <Link to="/register/hospital" className="gateway-card hospital-path">
          <div className="card-icon" aria-hidden="true">
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
          <h2>Cinema Partner</h2>
          <p>List your theater, manage showtimes, screen layouts, and ticket reservations.</p>
          <span className="card-action-link">
            Partner With Us
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </span>
        </Link>
      </nav>

      <footer className="gateway-footer">
        Already have an account? <Link to="/user/login">Login Here</Link>
      </footer>
    </div>
  );
}

