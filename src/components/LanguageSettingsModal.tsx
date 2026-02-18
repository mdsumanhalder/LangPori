'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Check } from 'lucide-react';
import { SUPPORTED_LANGUAGES, Language } from '@/lib/languages';
import { useAppDispatch, useAppSelector } from '@/store';
import { setNativeLanguage, setTargetLanguage } from '@/store/settingsSlice';

interface LanguageSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'native' | 'target';
    align?: 'left' | 'right';
}

export function LanguageSettingsModal({ isOpen, onClose, mode, align = 'left' }: LanguageSettingsModalProps) {
    const dispatch = useAppDispatch();
    const currentNative = useAppSelector((state) => state.settings.nativeLanguage);
    const currentTarget = useAppSelector((state) => state.settings.targetLanguage);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Reset search when opening
    useEffect(() => {
        if (isOpen) setSearchQuery('');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    // Handle click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    const filteredLanguages = SUPPORTED_LANGUAGES.filter((lang) =>
        lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelectLanguage = (lang: Language) => {
        if (mode === 'native') {
            dispatch(setNativeLanguage(lang.code));
        } else {
            dispatch(setTargetLanguage(lang.code));
        }
        onClose();
    };

    const currentSelection = mode === 'native' ? currentNative : currentTarget;
    const headerTitle = mode === 'native' ? 'Select your first language' : 'Select the language you are learning';

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={dropdownRef}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                    className={`absolute top-full mt-2 ${align === 'right' ? 'right-0' : 'left-0'} z-50 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col max-h-[60vh]`}
                >
                    {/* Header */}
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 rounded-t-xl">
                        <h2 className="text-sm font-bold text-gray-700 dark:text-gray-200">{headerTitle}</h2>
                    </div>

                    {/* Search */}
                    <div className="p-3 border-b border-gray-100 dark:border-gray-800">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search language..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-gray-100"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Language List */}
                    <div className="overflow-y-auto flex-1 p-2">
                        {filteredLanguages.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 text-sm">
                                No languages found
                            </div>
                        ) : (
                            <div className="space-y-0.5">
                                {filteredLanguages.map((lang) => {
                                    const isSelected = lang.code === currentSelection;
                                    return (
                                        <button
                                            key={lang.code}
                                            onClick={() => handleSelectLanguage(lang)}
                                            className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between group transition-colors ${isSelected
                                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                                    : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                                                }`}
                                        >
                                            <span className="text-sm font-medium">
                                                {lang.name} <span className="text-gray-400 font-normal">({lang.nativeName})</span>
                                            </span>
                                            {isSelected && <Check className="w-4 h-4" />}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
