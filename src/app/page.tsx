'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Book, Plus, Trash2, Globe, Lock, User as UserIcon, Pencil, BookMarked, FileText } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db/db';
import { getLanguageName } from '@/lib/languages';
import { useConfirm } from '@/contexts/ConfirmContext';
import { Pagination } from '@/components/ui/Pagination';
import type { Text } from '@/db/db';

const PAGE_SIZE_OPTIONS = [5, 10, 20, 30, 50];
const MOBILE_BREAKPOINT = 640;
type LibraryTab = 'all' | 'texts' | 'books';

function isBook(text: Text): boolean {
  return !!text.pdfBlob;
}

export default function HomePage() {
  const router = useRouter();
  const confirm = useConfirm();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<LibraryTab>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch texts from Dexie, sorted by newest first
  const texts = useLiveQuery(() =>
    db.texts.toArray().then(rows => rows.sort((a, b) => b.createdAt - a.createdAt))
  );

  const filteredTexts = useMemo(() => {
    if (!texts) return [];
    if (activeTab === 'all') return texts;
    if (activeTab === 'books') return texts.filter(isBook);
    return texts.filter(t => !isBook(t));
  }, [texts, activeTab]);

  const totalPages = Math.max(1, Math.ceil(filteredTexts.length / itemsPerPage));
  const paginatedTexts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTexts.slice(start, start + itemsPerPage);
  }, [filteredTexts, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, itemsPerPage]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages >= 1) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const isSmall = window.innerWidth < MOBILE_BREAKPOINT;
    if (isSmall) setItemsPerPage(5);
  }, [mounted]);

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    const ok = await confirm({
      title: 'Delete item?',
      message: 'Are you sure you want to delete this? This cannot be undone.',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      variant: 'danger',
    });
    if (ok) await db.texts.delete(id);
  };

  const handleEdit = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    // Handled by the Link inside the button, but we need to stop propagation
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Your Library</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Manage your texts and progress</p>
          </div>
          <Link href="/import" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-4 py-2.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
              <Plus className="w-5 h-5" />
              <span>Import</span>
            </button>
          </Link>
        </header>

        {/* Tabs: All | Texts | Books */}
        {texts && texts.length > 0 && (
          <div className="flex bg-gray-100 dark:bg-gray-800/80 p-1.5 rounded-2xl w-full max-w-md">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-md'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Book className="w-4 h-4" />
              All
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('texts')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'texts'
                  ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-md'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <FileText className="w-4 h-4" />
              Texts
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('books')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'books'
                  ? 'bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-md'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <BookMarked className="w-4 h-4" />
              Books
            </button>
          </div>
        )}

        {!texts || texts.length === 0 ? (
          /* Empty State */
          <div className="glass-card p-12 text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Book className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No texts yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Import a text or article to start reading and translating words instantly.
            </p>
            <Link href="/import">
              <button className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium">
                Import Article
              </button>
            </Link>
          </div>
        ) : filteredTexts.length === 0 ? (
          /* Empty state for current tab */
          <div className="glass-card p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              {activeTab === 'books' ? (
                <BookMarked className="w-8 h-8 text-indigo-500 dark:text-indigo-400" />
              ) : (
                <FileText className="w-8 h-8 text-blue-500 dark:text-blue-400" />
              )}
            </div>
            <h2 className="text-xl font-semibold mb-2">
              {activeTab === 'books' ? 'No books yet' : 'No texts in this category'}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {activeTab === 'books'
                ? 'Import a PDF or EPUB from the Import page to see your books here.'
                : 'Switch to All or import more texts.'}
            </p>
            <Link href="/import">
              <button className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium">
                Go to Import
              </button>
            </Link>
          </div>
        ) : (
          <>
          {/* Text/Book List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedTexts.map((text) => (
              <div
                key={text.id}
                onClick={() => router.push(`/read/${text.id}`)}
                className="glass-card p-6 cursor-pointer group h-full flex flex-col relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all rounded-2xl overflow-hidden active:scale-[0.98]"
              >
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="text-lg font-bold line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
                      {text.title}
                    </h3>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {text.isPublic ? (
                        <div className="p-1.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg" title="Public">
                          <Globe className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="p-1.5 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-lg" title="Private">
                          <Lock className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                      {getLanguageName(text.language || 'et')}
                    </span>
                    {text.cefrLevel && (
                      <span className="px-2 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded-lg">
                        {text.cefrLevel}
                      </span>
                    )}
                    {text.author && (
                      <span className="px-2 py-1 bg-slate-50 dark:bg-slate-800 text-slate-500 text-[10px] font-medium rounded-lg flex items-center gap-1">
                        <UserIcon className="w-2.5 h-2.5" /> {text.author}
                      </span>
                    )}
                    {text.pdfBlob && (
                      <span className="px-2 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                        PDF BOOK
                      </span>
                    )}
                  </div>

                  <p className="text-slate-500 dark:text-slate-400 line-clamp-2 text-sm font-serif leading-relaxed mb-4">
                    {text.content}
                  </p>
                </div>
                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                  <span>{new Date(text.createdAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}</span>
                  <div className="flex items-center gap-1">
                    {!text.pdfBlob && (
                      <Link href={`/import?id=${text.id}`} onClick={(e) => e.stopPropagation()}>
                        <button
                          className="p-2 text-slate-400 hover:text-blue-500 transition-colors rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          title="Edit story"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </Link>
                    )}
                    <button
                      onClick={(e) => handleDelete(e, text.id)}
                      className="p-2 -mr-2 text-slate-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="Delete story"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {(totalPages > 1 || filteredTexts.length > 0) && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredTexts.length}
              itemsPerPage={itemsPerPage}
              pageSizeOptions={PAGE_SIZE_OPTIONS}
              pageSize={itemsPerPage}
              onPageSizeChange={(size) => setItemsPerPage(size)}
              className="pt-4 border-t border-gray-100 dark:border-gray-800"
            />
          )}
          </>
        )}
      </div>
    </div>
  );
}
