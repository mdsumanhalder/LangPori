'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppSelector } from '@/store';
import { getLanguageName } from '@/lib/languages';
import { LanguageSettingsModal } from './LanguageSettingsModal';
import { ChevronDown } from 'lucide-react';

export function LanguageSwitcher() {
    const [activeModal, setActiveModal] = useState<'native' | 'target' | null>(null);
    const targetLanguage = useAppSelector((state) => state.settings.targetLanguage);
    const nativeLanguage = useAppSelector((state) => state.settings.nativeLanguage);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside (redundant safety, though dropdown handles it internally too)
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setActiveModal(null);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="flex items-center gap-4" ref={containerRef}>
            {/* Native Language Selector */}
            <div className="relative">
                <button
                    onClick={() => setActiveModal(activeModal === 'native' ? null : 'native')}
                    className={`flex items-center gap-1 text-sm font-medium transition-colors ${activeModal === 'native'
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                >
                    <span className="opacity-70">I know</span>
                    <span className="font-bold">{getLanguageName(nativeLanguage)}</span>
                    <ChevronDown className={`w-3 h-3 opacity-50 transition-transform ${activeModal === 'native' ? 'rotate-180' : ''}`} />
                </button>

                <LanguageSettingsModal
                    isOpen={activeModal === 'native'}
                    onClose={() => setActiveModal(null)}
                    mode="native"
                    align="left"
                />
            </div>

            {/* Target Language Selector */}
            <div className="relative">
                <button
                    onClick={() => setActiveModal(activeModal === 'target' ? null : 'target')}
                    className={`flex items-center gap-1 text-sm font-medium transition-colors ${activeModal === 'target'
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                >
                    <span className="opacity-70">I&apos;m learning</span>
                    <span className="font-bold">{getLanguageName(targetLanguage)}</span>
                    <ChevronDown className={`w-3 h-3 opacity-50 transition-transform ${activeModal === 'target' ? 'rotate-180' : ''}`} />
                </button>

                <LanguageSettingsModal
                    isOpen={activeModal === 'target'}
                    onClose={() => setActiveModal(null)}
                    mode="target"
                    align="right"
                />
            </div>
        </div>
    );
}
