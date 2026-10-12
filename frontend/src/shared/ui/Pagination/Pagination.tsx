import { cn } from '@/shared/lib/cn';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 4) return [1, 2, 3, 4, 5, '...', totalPages];
    if (currentPage >= totalPages - 3)
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const pages = getPageNumbers();

  const navBtnBase = cn(
    'inline-flex h-11 min-h-[44px] items-center justify-center gap-1.5 rounded-md border border-border bg-surface px-3.5',
    'text-sm font-medium text-ink transition-colors select-none cursor-pointer',
    'hover:not(:disabled):bg-surface-muted hover:not(:disabled):border-ink-muted',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-40 disabled:cursor-not-allowed',
  );

  return (
    <nav
      aria-label="Pagination Navigation"
      className={cn(
        'my-6 flex select-none items-center justify-center gap-2 px-2 py-3',
        className,
      )}
    >
      {/* Previous */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={navBtnBase}
        aria-label="Previous Page"
      >
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="inline-flex h-11 min-h-[44px] min-w-[36px] items-center justify-center text-sm font-semibold text-ink-muted"
                aria-hidden="true"
              >
                &hellip;
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'inline-flex h-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-md border px-2 text-sm font-medium transition-colors select-none cursor-pointer',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2',
                isActive
                  ? 'border-brand-600 bg-brand-600 text-white font-bold'
                  : 'border-border bg-surface text-ink hover:bg-surface-muted hover:border-ink-muted',
              )}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      {/* Next */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={navBtnBase}
        aria-label="Next Page"
      >
        <span className="hidden sm:inline">Next</span>
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </nav>
  );
}
