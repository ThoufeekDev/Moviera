export interface ChipOption {
  value: string;
  label: string;
}

interface ChipSelectProps {
  options: ChipOption[];
  value: string | string[] | undefined;
  onChange: (value: any) => void;
  multiple?: boolean;
  activeVariant?: 'solid' | 'subtle';
  shape?: 'pill' | 'square';
  className?: string;
  error?: string | null;
  idPrefix?: string;
}

export default function ChipSelect({
  options,
  value,
  onChange,
  multiple = false,
  activeVariant = 'subtle',
  shape = 'pill',
  className = '',
  error,
  idPrefix = 'chip',
}: ChipSelectProps) {
  const isSelected = (val: string) => {
    if (multiple) {
      return Array.isArray(value) && value.includes(val);
    }
    return value === val;
  };

  const handleToggle = (val: string) => {
    if (multiple) {
      const arr = Array.isArray(value) ? value : [];
      if (arr.includes(val)) {
        onChange(arr.filter((item) => item !== val));
      } else {
        onChange([...arr, val]);
      }
    } else {
      onChange(val);
    }
  };

  const shapeClass = shape === 'pill' ? 'rounded-full' : 'rounded-sm';

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = isSelected(opt.value);
          const activeClasses =
            activeVariant === 'solid'
              ? 'border-brand-600 bg-brand-600 text-white shadow-card'
              : 'border-brand-600 bg-brand-50 text-brand-600';

          return (
            <button
              type="button"
              key={opt.value}
              id={`${idPrefix}-${opt.value}`}
              onClick={() => handleToggle(opt.value)}
              className={`inline-flex min-h-[44px] items-center justify-center px-4 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 border ${shapeClass} ${
                selected
                  ? activeClasses
                  : 'border-border bg-surface text-ink hover:border-brand-600/40'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      {error && <p className="text-xs font-medium text-danger-600">{error}</p>}
    </div>
  );
}
