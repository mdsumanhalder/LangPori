'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db, type Text } from '@/db/db';
import { ArrowLeft, Volume2, Save, X, Loader2, Play, Pause, Square, SkipBack, SkipForward, Sun, Moon, Minus, Plus, Type, Settings, ZoomIn, ZoomOut } from 'lucide-react';
import Link from 'next/link';
import { useSpeech } from '@/hooks/useSpeech';
import { useAppSelector } from '@/store';
import { motion, AnimatePresence } from 'framer-motion';
import PdfReader from '@/components/reader/PdfReader';

const WORDS_PER_PAGE = 200;

// --- Reader Display Settings ---
interface ReaderSettings {
    fontSize: number; // percentage, e.g. 100
    darkMode: boolean; // reader-local dark mode
    pdfScale: number; // For Book Mode
}

function getStoredSettings(): ReaderSettings {
    if (typeof window === 'undefined') return { fontSize: 100, darkMode: false, pdfScale: 1.5 };
    try {
        const stored = localStorage.getItem('readerSettings');
        if (stored) return { ...{ fontSize: 100, darkMode: false, pdfScale: 1.5 }, ...JSON.parse(stored) };
    } catch { /* ignore */ }
    return { fontSize: 100, darkMode: false, pdfScale: 1.5 };
}

function storeSettings(settings: ReaderSettings) {
    try {
        localStorage.setItem('readerSettings', JSON.stringify(settings));
    } catch { /* ignore */ }
}

export default function ReaderPage() {
    const params = useParams();
    const router = useRouter();
    const targetLanguage = useAppSelector((state) => state.settings.targetLanguage);
    const nativeLanguage = useAppSelector((state) => state.settings.nativeLanguage);
    const [text, setText] = useState<Text | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedWord, setSelectedWord] = useState<{ word: string, translation: string | null, position: { x: number, y: number } } | null>(null);
    const [translating, setTranslating] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(0);

    // Aa Settings
    const [showAaPanel, setShowAaPanel] = useState(false);
    const [readerSettings, setReaderSettings] = useState<ReaderSettings>({ fontSize: 100, darkMode: false, pdfScale: 1.5 });

    // PDF State
    const [numPdfPages, setNumPdfPages] = useState(0);
    const [isPdfRendering, setIsPdfRendering] = useState(false);

    const { speak, speakStateless, isSpeaking, stopSpeaking, pauseSpeaking, resumeSpeaking, isPaused, currentWordRange, playbackRate, setPlaybackRate } = useSpeech();

    // Load settings on mount
    useEffect(() => {
        setReaderSettings(getStoredSettings());
    }, []);

    // Fetch text on load
    useEffect(() => {
        const fetchText = async () => {
            if (!params.id) return;
            const id = parseInt(Array.isArray(params.id) ? params.id[0] : params.id);
            const foundText = await db.texts.get(id);
            if (foundText) {
                setText(foundText);
            } else {
                router.push('/');
            }
            setLoading(false);
        };
        fetchText();
    }, [params.id, router]);

    // --- Pagination Logic ---
    const pages = useMemo(() => {
        if (!text) return [];
        const words = text.content.split(/(\s+)/);
        const result: string[] = [];
        let currentPageWords: string[] = [];
        let wordCount = 0;

        for (const word of words) {
            currentPageWords.push(word);
            if (!/^\s+$/.test(word)) {
                wordCount++;
            }
            if (wordCount >= WORDS_PER_PAGE) {
                result.push(currentPageWords.join(''));
                currentPageWords = [];
                wordCount = 0;
            }
        }
        if (currentPageWords.length > 0) {
            result.push(currentPageWords.join(''));
        }
        return result;
    }, [text]);

    const totalPages = text?.pdfBlob ? numPdfPages : pages.length;
    const pageContent = pages[currentPage] || '';




    const announceAndReadPage = useCallback(async (pageNum: number, pageText: string) => {
        // Announce the page number first, then read the content
        const announcement = nativeLanguage === 'et' ? `Lehekülg ${pageNum}` : `Page ${pageNum}`;
        await speakStateless(announcement, nativeLanguage);
        // Small delay before reading content
        await new Promise(resolve => setTimeout(resolve, 300));
        speak(pageText, targetLanguage, { highlight: true });
    }, [nativeLanguage, targetLanguage, speakStateless, speak]);

    const goToNextPage = useCallback(() => {
        if (currentPage < totalPages - 1) {
            stopSpeaking();
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            // Announce page and auto-read
            const nextPageContent = pages[nextPage];
            if (nextPageContent) {
                setTimeout(() => announceAndReadPage(nextPage + 1, nextPageContent), 200);
            }
        }
    }, [currentPage, totalPages, stopSpeaking, pages, announceAndReadPage]);

    const goToPrevPage = useCallback(() => {
        if (currentPage > 0) {
            stopSpeaking();
            const prevPage = currentPage - 1;
            setCurrentPage(prevPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            // Announce page and auto-read
            const prevPageContent = pages[prevPage];
            if (prevPageContent) {
                setTimeout(() => announceAndReadPage(prevPage + 1, prevPageContent), 200);
            }
        }
    }, [currentPage, stopSpeaking, pages, announceAndReadPage]);

    // --- Audio ---
    const handleToggleAudio = useCallback(() => {
        if (isSpeaking) {
            pauseSpeaking();
        } else if (isPaused) {
            resumeSpeaking();
        } else if (pageContent) {
            speak(pageContent, targetLanguage, { highlight: true });
        }
    }, [isSpeaking, isPaused, pageContent, targetLanguage, speak, pauseSpeaking, resumeSpeaking]);

    const handleStop = useCallback(() => {
        stopSpeaking();
    }, [stopSpeaking]);

    // --- Aa Settings ---
    const updateSettings = useCallback((updates: Partial<ReaderSettings>) => {
        setReaderSettings(prev => {
            const newSettings = { ...prev, ...updates };
            storeSettings(newSettings);
            return newSettings;
        });
    }, []);

    const increaseFontSize = useCallback(() => {
        updateSettings({ fontSize: Math.min(readerSettings.fontSize + 10, 200) });
    }, [readerSettings.fontSize, updateSettings]);

    const decreaseFontSize = useCallback(() => {
        updateSettings({ fontSize: Math.max(readerSettings.fontSize - 10, 60) });
    }, [readerSettings.fontSize, updateSettings]);

    const toggleDarkMode = useCallback(() => {
        updateSettings({ darkMode: !readerSettings.darkMode });
    }, [readerSettings.darkMode, updateSettings]);

    // Handle Word Click
    const handleWordClick = async (e: React.MouseEvent<HTMLSpanElement> | { x: number, y: number }, word: string) => {
        const cleanWord = word.replace(/[.,!?;:()\"]/g, '').trim();
        if (!cleanWord) return;

        let position = { x: 0, y: 0 };

        if ('x' in e && 'y' in e) {
            // Position from PDF reader
            position = {
                x: e.x + window.scrollX,
                y: e.y + window.scrollY + 20
            };
        } else if ('currentTarget' in e) {
            // Position from standard text spans
            const rect = (e as React.MouseEvent<HTMLSpanElement>).currentTarget.getBoundingClientRect();
            position = {
                x: rect.left + window.scrollX,
                y: rect.bottom + window.scrollY + 10
            };
        }

        setSelectedWord({ word: cleanWord, translation: null, position });
        setTranslating(true);

        // Play the word independently without triggering the main audio player
        speakStateless(cleanWord, targetLanguage);

        try {
            const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(cleanWord)}&langpair=${targetLanguage}|${nativeLanguage}`);
            const data = await res.json();
            if (data.responseData && data.responseData.translatedText) {
                setSelectedWord(prev => prev ? { ...prev, translation: data.responseData.translatedText } : null);
            } else {
                setSelectedWord(prev => prev ? { ...prev, translation: "No translation found" } : null);
            }
        } catch (error) {
            console.error(error);
            setSelectedWord(prev => prev ? { ...prev, translation: "Error fetching translation" } : null);
        } finally {
            setTranslating(false);
        }
    };

    const handleSaveFlashcard = async () => {
        if (!selectedWord || !selectedWord.translation) return;
        try {
            await db.words.add({
                original: selectedWord.word,
                translation: selectedWord.translation,
                context: text?.content.substring(0, 100) || "",
                srsLevel: 0,
                nextReview: Date.now(),
                createdAt: Date.now()
            });
            alert("Saved to Flashcards!");
            setSelectedWord(null);
        } catch (e) {
            console.error("Failed to save", e);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-blue-500" /></div>;
    }

    if (!text) return null;

    // Tokenize page content
    const tokens = pageContent.split(/(\s+|[.,!?;:()\"]+)/g);
    let charIndex = 0;

    // Reader background/text colors based on settings
    const readerBg = readerSettings.darkMode ? 'bg-gray-950' : 'bg-amber-50';
    const readerText = readerSettings.darkMode ? 'text-gray-100' : 'text-gray-900';
    const headerBg = readerSettings.darkMode ? 'bg-gray-900/95' : 'bg-white/95';
    const headerText = readerSettings.darkMode ? 'text-white' : 'text-gray-900';

    return (
        <div className={`min-h-screen ${readerBg} transition-colors duration-300`}>
            {/* Header */}
            <header className={`sticky top-0 z-30 ${headerBg} backdrop-blur-md border-b ${readerSettings.darkMode ? 'border-gray-800' : 'border-gray-200/50'} transition-colors duration-300`}>
                <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                        <Link href="/" className={`p-2 -ml-2 rounded-full transition-colors ${readerSettings.darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                            <ArrowLeft className={`w-5 h-5 ${headerText}`} />
                        </Link>
                        <h1 className={`text-lg sm:text-xl font-bold line-clamp-1 ${headerText}`}>{text.title}</h1>
                    </div>
                    <div className={`text-xs font-medium px-3 py-1 rounded-full ${readerSettings.darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                        {currentPage + 1} / {totalPages}
                    </div>
                </div>
            </header>

            {/* Reader Content */}
            <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-36">
                {text.pdfBlob ? (
                    <div className="flex justify-center">
                        <PdfReader
                            blob={text.pdfBlob}
                            pageNumber={currentPage + 1}
                            scale={readerSettings.pdfScale}
                            onWordClick={(word, position) => handleWordClick(position, word)}
                            onLoad={setNumPdfPages}
                            onRenderingUpdate={setIsPdfRendering}
                        />
                    </div>
                ) : (
                    <div
                        className={`prose max-w-none leading-loose font-serif ${readerText} transition-all duration-300`}
                        style={{ fontSize: `${readerSettings.fontSize}%` }}
                    >
                        <p className="whitespace-pre-wrap">
                            {tokens.map((token, index) => {
                                const currentStart = charIndex;
                                const currentEnd = currentStart + token.length;
                                charIndex += token.length;

                                const isHighlighted = currentWordRange &&
                                    currentWordRange.start >= currentStart &&
                                    currentWordRange.start < currentEnd;

                                if (/^[\s.,!?;:()\"]+$/.test(token)) {
                                    return <span key={index} className={isHighlighted ? "bg-amber-300/60 dark:bg-amber-700/60 rounded" : ""}>{token}</span>;
                                }

                                return (
                                    <span
                                        key={index}
                                        onClick={(e) => handleWordClick(e, token)}
                                        className={`cursor-pointer rounded px-0.5 transition-colors ${isHighlighted
                                            ? 'bg-amber-300/60 rounded'
                                            : readerSettings.darkMode
                                                ? 'hover:bg-gray-800 hover:text-blue-400'
                                                : 'hover:bg-blue-100 hover:text-blue-600'
                                            }`}
                                    >
                                        {token}
                                    </span>
                                );
                            })}
                        </p>
                    </div>
                )}
            </main>

            {/* ===== BOTTOM TOOLBAR ===== */}
            <div className={`fixed bottom-0 left-0 right-0 z-30 ${readerSettings.darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-t transition-colors duration-300`}>
                {/* Progress Bar */}
                <div className={`h-1 ${readerSettings.darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <div
                        className="h-full bg-gradient-to-r from-red-400 to-orange-400 transition-all duration-300 rounded-r-full"
                        style={{ width: `${totalPages > 1 ? ((currentPage) / (totalPages - 1)) * 100 : 100}%` }}
                    />
                </div>

                {/* Toolbar Buttons */}
                <div className="max-w-md mx-auto flex items-center justify-between px-6 py-3 safe-area-bottom">
                    {/* Settings Button (formerly Aa) */}
                    <button
                        onClick={() => setShowAaPanel(!showAaPanel)}
                        className={`p-2 transition-colors ${showAaPanel
                            ? 'text-blue-500'
                            : readerSettings.darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        <Settings className="w-6 h-6" />
                    </button>

                    {/* Previous Page */}
                    <button
                        onClick={goToPrevPage}
                        disabled={currentPage === 0 || isPdfRendering}
                        className={`p-2 transition-colors disabled:opacity-30 ${readerSettings.darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
                    >
                        <SkipBack className="w-6 h-6 fill-current" />
                    </button>

                    {/* Play / Pause Button */}
                    <div className="flex items-center gap-2">
                        {(isSpeaking || isPaused) && (
                            <button
                                onClick={handleStop}
                                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                                <Square className="w-4 h-4 fill-current" />
                            </button>
                        )}
                        <button
                            onClick={handleToggleAudio}
                            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 ${isSpeaking
                                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/30'
                                : 'bg-gradient-to-br from-red-400 to-orange-500 hover:from-red-500 hover:to-orange-600 text-white shadow-red-400/30'
                                }`}
                        >
                            {isSpeaking ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
                        </button>
                    </div>

                    {/* Next Page */}
                    <button
                        onClick={goToNextPage}
                        disabled={currentPage >= totalPages - 1 || isPdfRendering}
                        className={`p-2 transition-colors disabled:opacity-30 ${readerSettings.darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
                    >
                        <SkipForward className="w-6 h-6 fill-current" />
                    </button>

                    {/* Page indicator */}
                    <span className={`text-xs font-medium tabular-nums ${readerSettings.darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {currentPage + 1}/{totalPages}
                    </span>
                </div>
            </div>

            {/* ===== Aa SETTINGS PANEL ===== */}
            <AnimatePresence>
                {showAaPanel && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40"
                            onClick={() => setShowAaPanel(false)}
                        />
                        {/* Panel */}
                        <motion.div
                            initial={{ y: '100%', opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: '100%', opacity: 0 }}
                            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                            className={`fixed bottom-[72px] left-0 right-0 z-50 rounded-t-3xl shadow-2xl ${readerSettings.darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-t px-6 py-6 space-y-6`}
                        >
                            {/* Background Color */}
                            <div>
                                <h3 className={`text-sm font-semibold mb-3 ${readerSettings.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Background color</h3>
                                <div className="flex gap-3">
                                    {/* Light */}
                                    <button
                                        onClick={() => updateSettings({ darkMode: false })}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full border-2 transition-all ${!readerSettings.darkMode
                                            ? 'border-orange-400 bg-amber-50 text-orange-500'
                                            : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-400'
                                            }`}
                                    >
                                        <Sun className={`w-5 h-5 ${!readerSettings.darkMode ? 'text-orange-500' : ''}`} />
                                    </button>
                                    {/* Dark */}
                                    <button
                                        onClick={() => updateSettings({ darkMode: true })}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full border-2 transition-all ${readerSettings.darkMode
                                            ? 'border-blue-500 bg-gray-800 text-blue-400'
                                            : 'border-gray-300 bg-gray-700 text-gray-400'
                                            }`}
                                    >
                                        <Moon className={`w-5 h-5 ${readerSettings.darkMode ? 'text-blue-400' : 'text-gray-400'}`} />
                                    </button>
                                </div>
                            </div>

                            {/* Text Size */}
                            <div>
                                <h3 className={`text-sm font-semibold mb-3 ${readerSettings.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Text size</h3>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={decreaseFontSize}
                                        disabled={readerSettings.fontSize <= 60}
                                        className={`flex-1 py-3 rounded-full text-center font-bold transition-all disabled:opacity-30 ${readerSettings.darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                    >
                                        A-
                                    </button>
                                    <span className={`font-bold text-lg tabular-nums min-w-[3rem] text-center ${readerSettings.darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {readerSettings.fontSize}%
                                    </span>
                                    <button
                                        onClick={increaseFontSize}
                                        disabled={readerSettings.fontSize >= 200}
                                        className={`flex-1 py-3 rounded-full text-center font-bold transition-all disabled:opacity-30 ${readerSettings.darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                    >
                                        A+
                                    </button>
                                </div>
                            </div>

                            {/* Audio Speed */}
                            <div>
                                <h3 className={`text-sm font-semibold mb-3 ${readerSettings.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Audio speed</h3>
                                <div className="flex items-center gap-2">
                                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                                        <button
                                            key={speed}
                                            onClick={() => setPlaybackRate(speed)}
                                            className={`flex-1 py-2.5 rounded-full text-center text-sm font-bold transition-all ${playbackRate === speed
                                                ? 'bg-blue-500 text-white shadow-md'
                                                : readerSettings.darkMode
                                                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            {speed}x
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* PDF Zoom (Only for Book Mode) */}
                            {text?.pdfBlob && (
                                <div>
                                    <h3 className={`text-sm font-semibold mb-3 ${readerSettings.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>PDF Zoom</h3>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => updateSettings({ pdfScale: Math.max(0.5, readerSettings.pdfScale - 0.25) })}
                                            disabled={readerSettings.pdfScale <= 0.5 || isPdfRendering}
                                            className={`flex-1 py-3 rounded-full text-center font-bold transition-all disabled:opacity-30 ${readerSettings.darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                        >
                                            <ZoomOut className="w-5 h-5 mx-auto" />
                                        </button>
                                        <span className={`font-bold text-lg tabular-nums min-w-[4rem] text-center ${readerSettings.darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {Math.round(readerSettings.pdfScale * 100)}%
                                        </span>
                                        <button
                                            onClick={() => updateSettings({ pdfScale: Math.min(3, readerSettings.pdfScale + 0.25) })}
                                            disabled={readerSettings.pdfScale >= 3 || isPdfRendering}
                                            className={`flex-1 py-3 rounded-full text-center font-bold transition-all disabled:opacity-30 ${readerSettings.darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                        >
                                            <ZoomIn className="w-5 h-5 mx-auto" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ===== Translation Popup ===== */}
            {selectedWord && (
                <div
                    className={`fixed z-50 rounded-2xl shadow-2xl border p-5 w-[calc(100%-2rem)] sm:w-72 animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-200 ${readerSettings.darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}
                    style={{
                        left: '50%',
                        transform: 'translateX(-50%)',
                        bottom: '5.5rem',
                    }}
                >
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-blue-600 dark:text-blue-400 capitalize">{selectedWord.word}</h3>
                        <button onClick={() => setSelectedWord(null)} className="text-gray-400 hover:text-gray-600">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {translating ? (
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <Loader2 className="w-4 h-4 animate-spin" /> Translating...
                        </div>
                    ) : (
                        <div className="mb-4">
                            <p className={`text-lg font-medium ${readerSettings.darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{selectedWord.translation}</p>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <button
                            onClick={handleSaveFlashcard}
                            className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            <Save className="w-4 h-4" /> Save
                        </button>
                        <button
                            onClick={async () => {
                                const wasPlaying = isSpeaking;
                                if (wasPlaying) pauseSpeaking();
                                await speakStateless(selectedWord.word, targetLanguage);
                                if (wasPlaying) resumeSpeaking();
                            }}
                            className={`p-2 rounded-lg transition-colors ${readerSettings.darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                        >
                            <Volume2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Backdrop to close popup */}
            {selectedWord && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setSelectedWord(null)}
                />
            )}
        </div>
    );
}
