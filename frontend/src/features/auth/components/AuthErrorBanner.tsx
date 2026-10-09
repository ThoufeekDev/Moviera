interface AuthErrorBannerProps {
  message: string;
}

export default function AuthErrorBanner({ message }: AuthErrorBannerProps) {
  if (!message) return null;

  return (
    <div
      className="mb-5 flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-left text-xs font-medium text-rose-800"
      role="alert"
    >
      <svg
        className="h-4 w-4 shrink-0 text-rose-600"
        viewBox="0 0 16 16"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm-.75-9.25a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0v-3.5zm.75 6.5a.875.875 0 1 1 0-1.75.875.875 0 0 1 0 1.75z"
          clipRule="evenodd"
        />
      </svg>
      <span className="leading-relaxed">{message}</span>
    </div>
  );
}
