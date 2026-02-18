import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, ExternalLink, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

interface WordPopoverProps {
    word: string;
    translation?: string;
    position: { x: number; y: number } | null;
    onClose: () => void;
    onSave: () => void;
    isSaved: boolean;
}

export function WordPopover({
    word,
    translation,
    position,
    onClose,
    onSave,
    isSaved
}: WordPopoverProps) {
    if (!position) return null;

    // Adjust position to keep popover on screen (simple heuristic)
    const style: React.CSSProperties = {
        position: 'fixed',
        top: position.y - 10, // slightly above the word
        left: position.x,
        transform: 'translate(-50%, -100%)', // center horizontally, above vertically
        zIndex: 50
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                style={style}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 w-64 border border-gray-200 dark:border-gray-700 backdrop-blur-lg"
            >
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white capitalize">{word}</h3>
                        {translation ? (
                            <p className="text-blue-600 dark:text-blue-400 font-medium">{translation}</p>
                        ) : (
                            <p className="text-gray-400 dark:text-gray-500 text-sm italic">Translation not found</p>
                        )}
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); onClose(); }}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="flex gap-2 mt-4">
                    <button
                        onClick={(e) => { e.stopPropagation(); onSave(); }}
                        disabled={isSaved}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${isSaved
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 cursor-default'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800'
                            }`}
                    >
                        {isSaved ? (
                            <>
                                <Check size={16} />
                                Saved
                            </>
                        ) : (
                            <>
                                <Save size={16} />
                                Save
                            </>
                        )}
                    </button>

                    <a
                        href={`https://translate.google.com/?sl=et&tl=en&text=${encodeURIComponent(word)}&op=translate`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ExternalLink size={16} />
                    </a>
                </div>

                {/* Arrow */}
                <div
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-4 h-4 bg-white dark:bg-gray-800 border-r border-b border-gray-200 dark:border-gray-700"
                ></div>
            </motion.div>
        </AnimatePresence>
    );
}
