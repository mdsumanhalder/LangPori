'use client';

import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db/db';
import { ArrowLeft, Trash2, Search, Book } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function VocabularyPage() {
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch all words
    const words = useLiveQuery(() =>
        db.words.toArray().then(rows => rows.sort((a, b) => b.createdAt - a.createdAt))
    );

    const filteredWords = words?.filter(word =>
        word.original.toLowerCase().includes(searchQuery.toLowerCase()) ||
        word.translation.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const handleDelete = async (e: React.MouseEvent, id: number) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm('Delete this word?')) {
            await db.words.delete(id);
        }
    };

    if (!words) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-blue-600 rounded-full border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <header className="flex items-center gap-3 sm:gap-4">
                    <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </Link>
                    <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2 truncate">
                        <Book className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
                        <span className="truncate">Vocabulary ({words.length})</span>
                    </h1>
                </header>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search words..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>

                {/* List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <AnimatePresence mode="popLayout">
                        {filteredWords.map((word) => (
                            <motion.div
                                key={word.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 group relative"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 capitalize">
                                            {word.original}
                                        </h3>
                                        <p className="text-blue-600 dark:text-blue-400 font-medium text-lg">
                                            {word.translation}
                                        </p>
                                        {word.context && (
                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 italic line-clamp-2">
                                                `{word.context}..`
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={(e) => handleDelete(e, word.id)}
                                        className="p-2 text-gray-300 hover:text-red-500 transition-colors md:opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="absolute bottom-3 right-3">
                                    <div className="flex items-center gap-1 text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                                        <span>Lvl {word.srsLevel}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredWords.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No words found. Read some texts to add words!</p>
                        <Link href="/" className="text-blue-600 hover:underline mt-2 inline-block">Go to Library</Link>
                    </div>
                )}
            </div>
        </div>
    );
}
