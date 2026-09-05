// shared/components/Input/Input.tsx

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function Input({ label, error, id, ...props }: InputProps) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>

      <div className="input-wrapper">
        <input id={id} aria-invalid={!!error} {...props} />
      </div>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
