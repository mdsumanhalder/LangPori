'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Book, Plus, Trash2 } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db/db';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  // Fetch texts from Dexie, sorted by newest first
  const texts = useLiveQuery(() =>
    db.texts.toArray().then(rows => rows.sort((a, b) => b.createdAt - a.createdAt))
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this text?')) {
      await db.texts.delete(id);
    }
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
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Your Library</h1>
            <p className="text-muted-foreground">Manage your texts and progress</p>
          </div>
          <Link href="/import">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
              <Plus className="w-5 h-5" />
              <span>Import Text</span>
            </button>
          </Link>
        </header>

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
        ) : (
          /* Text List */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {texts.map((text) => (
              <Link href={`/read/${text.id}`} key={text.id}>
                <div className="glass-card p-6 hover-lift cursor-pointer group h-full flex flex-col relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {text.title}
                    </h3>
                    <p className="text-muted-foreground line-clamp-3 text-sm font-serif">
                      {text.content}
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-xs text-muted-foreground">
                    <span>{new Date(text.createdAt).toLocaleDateString()}</span>
                    <button
                      onClick={(e) => handleDelete(e, text.id)}
                      className="p-2 -mr-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                      title="Delete text"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
