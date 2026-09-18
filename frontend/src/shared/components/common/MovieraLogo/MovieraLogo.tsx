import './MovieraLogo.css';

export interface MovieraLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'badge' | 'icon-only' | 'light';
  showText?: boolean;
  subtitle?: string;
  className?: string;
  onClick?: () => void;
}

export default function MovieraLogo({
  size = 'md',
  variant = 'default',
  showText = false,
  subtitle,
  className = '',
  onClick,
}: MovieraLogoProps) {
  return (
    <div
      className={`moviera-logo size-${size} variant-${variant} ${onClick ? 'clickable' : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="moviera-logo-img-container">
        <img
          src="/logo.png"
          alt="Moviera Logo"
          className="moviera-logo-img"
          onError={(e) => {
            // Fallback if image path fails to load
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>

      {(showText || subtitle) && (
        <div className="moviera-logo-text">
          {showText && (
            <span className="brand-title">
              <span className="brand-movie">Movie</span>
              <span className="brand-ra">ra</span>
            </span>
          )}
          {subtitle && <span className="brand-subtitle">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
