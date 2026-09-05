interface ButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function Button({
  children,
  type = 'button',
  disabled = false,
  loading = false,
  className = '',
  onClick,
}: ButtonProps) {
  return (
    <button
      type={type}

      disabled={disabled || loading}

      className={`button ${className}`}
      onClick={onClick}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}
