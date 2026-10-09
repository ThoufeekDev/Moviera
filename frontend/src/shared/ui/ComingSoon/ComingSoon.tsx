import { useNavigate } from 'react-router-dom';
import { cn } from '@/shared/lib/cn';

interface ComingSoonProps {
  title?: string;
  description?: string;
  backTo?: string;
  backLabel?: string;
  className?: string;
}

export default function ComingSoon({
  title = 'Coming Soon',
  description = "We're working on this feature and it will be available soon.",
  backTo,
  backLabel = 'Go Back',
  className,
}: ComingSoonProps) {
  const navigate = useNavigate();

  return (
    <div
      className={cn(
        'box-border flex min-h-full w-full flex-col items-center justify-center',
        'overflow-hidden px-6 py-10 text-center',
        className,
      )}
    >
      {/* Icon */}
      <div className="relative mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-[18px] border border-slate-200 bg-white text-slate-500 shadow-[0_4px_16px_rgba(0,0,0,0.05)] [animation:coming-icon-enter_0.6s_ease-out_both,coming-icon-float_4s_ease-in-out_0.8s_infinite] before:absolute before:inset-[-5px] before:rounded-[22px] before:border before:border-slate-200 before:opacity-0 before:[animation:coming-icon-pulse_2.8s_ease-out_0.8s_infinite] max-sm:h-16 max-sm:w-16 max-sm:rounded-2xl">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-8 w-8 [animation:coming-clock_4s_linear_1s_infinite] max-sm:h-7 max-sm:w-7"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      </div>

      {/* Label */}
      <span className="mb-[10px] text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500 [animation:coming-fade-up_0.55s_ease-out_0.2s_both]">
        Feature in development
      </span>

      {/* Title */}
      <h1 className="m-0 text-[32px] font-bold leading-[1.2] tracking-[-0.025em] text-slate-900 [animation:coming-fade-up_0.6s_ease-out_0.3s_both] max-sm:text-[26px]">
        {title}
      </h1>

      {/* Description */}
      <p className="mx-0 mb-6 mt-3 max-w-[480px] text-[14px] leading-[1.7] text-slate-500 [animation:coming-fade-up_0.6s_ease-out_0.4s_both] max-sm:text-[13px] max-sm:leading-[1.6]">
        {description}
      </p>

      {/* Button */}
      <button
        type="button"
        onClick={() => {
          if (backTo) navigate(backTo);
          else navigate(-1);
        }}
        className={cn(
          'cursor-pointer rounded-lg border border-slate-200 bg-slate-900 px-[18px] py-[10px]',
          'font-inherit text-[13px] font-semibold text-white',
          'shadow-[0_2px_6px_rgba(0,0,0,0.08)]',
          '[animation:coming-fade-up_0.6s_ease-out_0.5s_both]',
          'transition-all duration-200 ease-out',
          'hover:bg-slate-800 hover:-translate-y-[2px] hover:shadow-[0_6px_14px_rgba(0,0,0,0.12)]',
          'active:translate-y-0 active:shadow-[0_2px_5px_rgba(0,0,0,0.08)]',
        )}
      >
        {backLabel}
      </button>
    </div>
  );
}
