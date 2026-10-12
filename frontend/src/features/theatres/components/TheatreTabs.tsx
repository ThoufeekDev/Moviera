export type TheatreTab = 'OVERVIEW' | 'SCREENS' | 'SHOWS' | 'SETTINGS';

interface TheatreTabsProps {
  activeTab: TheatreTab;
  onTabChange: (tab: TheatreTab) => void;
  totalScreens: number;
  totalShows: number;
}

export default function TheatreTabs({
  activeTab,
  onTabChange,
  totalScreens,
  totalShows,
}: TheatreTabsProps) {
  const tabButtonBase =
    'inline-flex min-h-[44px] items-center justify-center rounded-md px-4 py-2 text-xs md:text-sm transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600';

  return (
    <nav className="flex flex-wrap gap-2" aria-label="Theatre management tabs">
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === 'OVERVIEW'}
        className={`${tabButtonBase} ${
          activeTab === 'OVERVIEW'
            ? 'bg-brand-600 text-white font-bold shadow-card'
            : 'text-nav-ink/75 hover:bg-white/10 hover:text-white font-medium'
        }`}
        onClick={() => onTabChange('OVERVIEW')}
      >
        Overview
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={activeTab === 'SCREENS'}
        className={`${tabButtonBase} ${
          activeTab === 'SCREENS'
            ? 'bg-brand-600 text-white font-bold shadow-card'
            : 'text-nav-ink/75 hover:bg-white/10 hover:text-white font-medium'
        }`}
        onClick={() => onTabChange('SCREENS')}
      >
        Screens ({totalScreens})
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={activeTab === 'SHOWS'}
        className={`${tabButtonBase} ${
          activeTab === 'SHOWS'
            ? 'bg-brand-600 text-white font-bold shadow-card'
            : 'text-nav-ink/75 hover:bg-white/10 hover:text-white font-medium'
        }`}
        onClick={() => onTabChange('SHOWS')}
      >
        Shows ({totalShows})
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={activeTab === 'SETTINGS'}
        className={`${tabButtonBase} ${
          activeTab === 'SETTINGS'
            ? 'bg-brand-600 text-white font-bold shadow-card'
            : 'text-nav-ink/75 hover:bg-white/10 hover:text-white font-medium'
        }`}
        onClick={() => onTabChange('SETTINGS')}
      >
        Settings
      </button>
    </nav>
  );
}