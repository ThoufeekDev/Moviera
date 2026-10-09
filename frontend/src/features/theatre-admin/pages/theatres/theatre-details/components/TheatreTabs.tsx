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
  return (
    <nav className="flex flex-wrap gap-2 text-sm font-semibold" aria-label="Theatre management tabs">
      <button
        type="button"
        className={`rounded-xl px-4 py-2 transition-all ${
          activeTab === 'OVERVIEW'
            ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
            : 'text-slate-300 hover:bg-white/10 hover:text-white'
        }`}
        onClick={() => onTabChange('OVERVIEW')}
      >
        Overview
      </button>

      <button
        type="button"
        className={`rounded-xl px-4 py-2 transition-all ${
          activeTab === 'SCREENS'
            ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
            : 'text-slate-300 hover:bg-white/10 hover:text-white'
        }`}
        onClick={() => onTabChange('SCREENS')}
      >
        Screens ({totalScreens})
      </button>

      <button
        type="button"
        className={`rounded-xl px-4 py-2 transition-all ${
          activeTab === 'SHOWS'
            ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
            : 'text-slate-300 hover:bg-white/10 hover:text-white'
        }`}
        onClick={() => onTabChange('SHOWS')}
      >
        Shows ({totalShows})
      </button>

      <button
        type="button"
        className={`rounded-xl px-4 py-2 transition-all ${
          activeTab === 'SETTINGS'
            ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
            : 'text-slate-300 hover:bg-white/10 hover:text-white'
        }`}
        onClick={() => onTabChange('SETTINGS')}
      >
        Settings
      </button>
    </nav>
  );
}