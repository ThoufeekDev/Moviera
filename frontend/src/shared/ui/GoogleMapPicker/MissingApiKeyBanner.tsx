import { AlertTriangle } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { cn } from '@/shared/lib/cn';

export interface MissingApiKeyBannerProps {
  onSwitchToManual?: () => void;
  className?: string;
}

export function MissingApiKeyBanner({ onSwitchToManual, className }: MissingApiKeyBannerProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-amber-300/80 bg-amber-50/70 p-4 text-amber-900 dark:border-amber-700/50 dark:bg-amber-950/20 dark:text-amber-200',
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
        <div className="space-y-1.5 text-sm">
          <h5 className="font-semibold text-amber-900 dark:text-amber-100">
            Google Maps Platform API Key Required
          </h5>
          <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
            Google-assisted location lookup requires an API key configured via{' '}
            <code className="rounded bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 font-mono text-[11px]">
              VITE_GOOGLE_MAPS_API_KEY
            </code>{' '}
            with Maps JavaScript API, Places API (New), and Geocoding API enabled.
          </p>
          {onSwitchToManual && (
            <div className="pt-2 flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={onSwitchToManual}
                className="text-xs cursor-pointer font-medium"
              >
                Switch to Manual Address Entry
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
