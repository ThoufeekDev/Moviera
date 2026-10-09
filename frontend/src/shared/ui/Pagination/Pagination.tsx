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

  const navBtnBase = [
    'inline-flex h-10 items-center gap-1.5 rounded-[10px] border px-4',
    'text-[0.88rem] font-semibold',
    'bg-white border-slate-200 text-slate-700',
    'shadow-[0_2px_6px_rgba(0,0,0,0.04)]',
    'transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]',
    'hover:not(:disabled):border-brand-500 hover:not(:disabled):text-brand-500',
    'hover:not(:disabled):bg-[rgba(248,68,100,0.04)] hover:not(:disabled):-translate-y-px',
    'hover:not(:disabled):shadow-[0_4px_12px_rgba(248,68,100,0.15)]',
    'active:not(:disabled):translate-y-0',
    'disabled:opacity-45 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 disabled:shadow-none',
  ];

  return (
    <nav
      aria-label="Pagination Navigation"
      className={cn(
        'my-6 flex select-none items-center justify-center gap-3 px-4 py-3',
        'max-sm:gap-2 max-sm:p-2',
        className,
      )}
    >
      {/* Previous */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={cn(navBtnBase)}
        aria-label="Previous Page"
      >
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <span className="max-[480px]:hidden">Previous</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1.5 max-[480px]:gap-1">
        {pages.map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="inline-flex h-10 min-w-[32px] items-center justify-center text-[1.1rem] font-semibold text-slate-400">
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
                'inline-flex h-10 min-w-[40px] items-center justify-center rounded-[10px] border px-2',
                'text-[0.9rem] font-semibold',
                'transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]',
                'max-sm:min-w-[36px] max-sm:h-[38px] max-sm:rounded-lg max-sm:text-[0.85rem]',
                'max-[480px]:min-w-[34px] max-[480px]:h-9 max-[480px]:px-1 max-[480px]:text-[0.82rem]',
                isActive
                  ? [
                      'bg-gradient-to-br from-brand-500 to-brand-700 border-brand-500 text-white font-bold',
                      'shadow-[0_4px_14px_rgba(248,68,100,0.4)] scale-[1.04]',
                    ]
                  : [
                      'bg-white border-slate-200 text-slate-700',
                      'shadow-[0_2px_6px_rgba(0,0,0,0.03)]',
                      'hover:border-brand-500 hover:text-brand-500 hover:bg-[rgba(248,68,100,0.05)]',
                      'hover:-translate-y-px hover:shadow-[0_4px_10px_rgba(248,68,100,0.12)]',
                    ],
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
        className={cn(navBtnBase)}
        aria-label="Next Page"
      >
        <span className="max-[480px]:hidden">Next</span>
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </nav>
  );
}
