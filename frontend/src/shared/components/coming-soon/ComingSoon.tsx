import { useNavigate } from 'react-router-dom';
import './ComingSoon.css';

interface ComingSoonProps {
  title?: string;
  description?: string;
  backTo?: string;
  backLabel?: string;
}

export default function ComingSoon({
  title = 'Coming Soon',
  description = "We're working on this feature and it will be available soon.",
  backTo,
  backLabel = 'Go Back',
}: ComingSoonProps) {
  const navigate = useNavigate();

  return (
    <div className="coming-soon">
      <div className="coming-soon-icon">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      </div>

      <span className="coming-soon-label">Feature in development</span>

      <h1>{title}</h1>

      <p>{description}</p>

      <button
        type="button"
        onClick={() => {
          if (backTo) {
            navigate(backTo);
          } else {
            navigate(-1);
          }
        }}
      >
        {backLabel}
      </button>
    </div>
  );
}
