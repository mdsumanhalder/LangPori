'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MAX_VISIBLE = 5; // max page number buttons to show (e.g. 1 ... 4 5 6 ... 10)

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Optional: "Showing 1–10 of 45" */
  totalItems?: number;
  itemsPerPage?: number;
  /** Optional: show "Per page" dropdown with these options */
  pageSizeOptions?: number[];
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  className?: string;
}

function range(start: number, end: number): number[] {
  const r: number[] = [];
  for (let i = start; i <= end; i++) r.push(i);
  return r;
}

function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= MAX_VISIBLE) return range(1, total);
  const half = Math.floor(MAX_VISIBLE / 2);
  let start = Math.max(1, current - half);
  let end = Math.min(total, start + MAX_VISIBLE - 1);
  if (end - start + 1 < MAX_VISIBLE) start = Math.max(1, end - MAX_VISIBLE + 1);
  const pages: (number | 'ellipsis')[] = [];
  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push('ellipsis');
  }
  pages.push(...range(start, end));
  if (end < total) {
    if (end < total - 1) pages.push('ellipsis');
    pages.push(total);
  }
  return pages;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  pageSizeOptions,
  pageSize,
  onPageSizeChange,
  className = '',
}: PaginationProps) {
  const [perPageOpen, setPerPageOpen] = useState(false);
  const perPageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!perPageOpen) return;
    const close = (e: MouseEvent) => {
      if (perPageRef.current && !perPageRef.current.contains(e.target as Node)) setPerPageOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [perPageOpen]);

  const showPageSize = pageSizeOptions?.length && pageSize != null && onPageSizeChange;
  const showInfo = totalItems != null && itemsPerPage != null;
  const startItem = showInfo ? (currentPage - 1) * itemsPerPage + 1 : null;
  const endItem = showInfo ? Math.min(currentPage * itemsPerPage, totalItems) : null;

  if (totalPages <= 1 && !showPageSize) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className={`flex flex-col gap-3 sm:gap-4 ${className}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {totalItems != null && startItem != null && endItem != null && (
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Showing <span className="font-semibold text-gray-700 dark:text-gray-300">{startItem}</span>
              –<span className="font-semibold text-gray-700 dark:text-gray-300">{endItem}</span>
              {' '}of <span className="font-semibold text-gray-700 dark:text-gray-300">{totalItems}</span>
            </p>
          )}
          {showPageSize && (
            <div className="flex items-center gap-2" ref={perPageRef}>
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                Per page
              </span>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setPerPageOpen((o) => !o)}
                  className="flex items-center gap-1.5 pl-3 pr-8 sm:pr-9 py-2 min-h-[2.75rem] sm:min-h-0 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none cursor-pointer touch-manipulation"
                >
                  {pageSize}
                  <ChevronDown className={`absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform ${perPageOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {perPageOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 bottom-full z-50 mb-1 min-w-[4rem] rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg py-1"
                    >
                      {pageSizeOptions.map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => {
                            onPageSizeChange(n);
                            setPerPageOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 text-sm text-left text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          {n}
                          {n === pageSize && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
        {totalPages > 1 && (
      <nav
        role="navigation"
        aria-label="Pagination"
        className="flex items-center justify-center sm:justify-end gap-1 sm:gap-1.5 overflow-x-auto py-1 min-h-[2.75rem] sm:min-h-0"
      >
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm touch-manipulation shrink-0"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="flex items-center gap-0.5 sm:gap-1 mx-0.5 sm:mx-1 shrink-0">
          {pages.map((p, i) =>
            p === 'ellipsis' ? (
              <span
                key={`ellipsis-${i}`}
                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-gray-400 dark:text-gray-500 text-xs sm:text-base shrink-0"
              >
                …
              </span>
            ) : (
              <motion.button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                whileTap={{ scale: 0.98 }}
                className={`relative flex items-center justify-center min-w-[2rem] w-8 h-8 sm:min-w-[2.5rem] sm:w-10 sm:h-10 px-2 sm:px-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all touch-manipulation shrink-0 ${
                  p === currentPage
                    ? 'text-white shadow-lg shadow-blue-500/30'
                    : 'text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                aria-label={`Page ${p}`}
                aria-current={p === currentPage ? 'page' : undefined}
              >
                {p === currentPage && (
                  <motion.span
                    layoutId="pagination-active"
                    className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600"
                    transition={{ type: 'spring', duration: 0.4 }}
                  />
                )}
                <span className="relative z-10">{p}</span>
              </motion.button>
            )
          )}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm touch-manipulation shrink-0"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </nav>
        )}
      </div>
    </div>
  );
}
