'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db, type Text, updateUserScore, addQuizResult, incrementGamesPlayed, getQuizResultsByStory } from '@/db/db';
import { ArrowLeft, Volume2, Save, X, Loader2, Play, Pause, Square, SkipBack, SkipForward, Sun, Moon, Settings, ZoomIn, ZoomOut, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useSpeech } from '@/hooks/useSpeech';
import { useAppSelector } from '@/store';
import { motion, AnimatePresence } from 'framer-motion';
import PdfReader from '@/components/reader/PdfReader';
import StoryGame from '@/components/reader/StoryGame';
import StoryQuiz from '@/components/reader/StoryQuiz';
import { generateGameContent, getGameQuestionCount, StoryGame as GameData } from '@/lib/gameGenerator';
import { generateQuiz, Quiz } from '@/lib/quizGenerator';
import { useToast } from '@/contexts/ToastContext';
import { franc } from 'franc-min';

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
    const [pdfText, setPdfText] = useState('');
    const [accumulatedPdfText, setAccumulatedPdfText] = useState<Map<number, string>>(new Map());
    const [isAutoPlaying, setIsAutoPlaying] = useState(false);
    const [view, setView] = useState<'reader' | 'game' | 'quiz'>('reader');
    const [showFinishPrompt, setShowFinishPrompt] = useState(false);
    const [gameData, setGameData] = useState<GameData | null>(null);
    const [quizData, setQuizData] = useState<Quiz | null>(null);
    const [quizStartTime, setQuizStartTime] = useState<number>(0);

    const { speak, speakStateless, isSpeaking, stopSpeaking, pauseSpeaking, resumeSpeaking, isPaused, currentWordRange, playbackRate, setPlaybackRate } = useSpeech();
    const toast = useToast();

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
                // Auto-detect language if missing (repair legacy data)
                if (!foundText.language) {
                    const lang3 = franc(foundText.content);
                    const langMap2: Record<string, string> = {
                        'eng': 'en', 'est': 'et', 'swe': 'sv', 'fin': 'fi', 'nor': 'no',
                        'dan': 'da', 'nld': 'nl', 'deu': 'de', 'fra': 'fr', 'spa': 'es',
                        'ita': 'it', 'rus': 'ru', 'por': 'pt', 'pol': 'pl', 'zlm': 'et'
                    };
                    const detectedLang = langMap2[lang3] || 'et';
                    await db.texts.update(id, { language: detectedLang });
                    foundText.language = detectedLang;
                }
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




    // --- Navigation ---
    const goToNextPage = useCallback((): void => {
        if (currentPage < totalPages - 1) {
            stopSpeaking();
            setPdfText(''); // Clear previous page text
            setCurrentPage(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            setIsAutoPlaying(false);
            setShowFinishPrompt(true);
        }
    }, [totalPages, stopSpeaking, currentPage]);

    const goToPrevPage = useCallback((): void => {
        if (currentPage > 0) {
            stopSpeaking();
            setPdfText(''); // Clear previous page text
            setIsAutoPlaying(false);
            setCurrentPage(prev => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [stopSpeaking, currentPage]);

    // Handle automatic page continuation and continuous read
    useEffect(() => {
        const contentToRead = text?.pdfBlob ? pdfText : pages[currentPage];

        if (isAutoPlaying && contentToRead && !isSpeaking && !isPaused) {
            // Small delay to allow the UI/PDF to settle if we just changed pages
            const timer = setTimeout(() => {
                speak(contentToRead, targetLanguage, {
                    highlight: true,
                    onEnd: () => {
                        goToNextPage();
                    }
                });
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isAutoPlaying, isSpeaking, isPaused, pdfText, pages, currentPage, text?.pdfBlob, targetLanguage, speak, totalPages, goToNextPage]);

    // --- Audio ---
    const handleToggleAudio = useCallback(() => {
        if (isSpeaking) {
            pauseSpeaking();
        } else if (isPaused) {
            resumeSpeaking();
        } else {
            setIsAutoPlaying(true);
        }
    }, [isSpeaking, isPaused, pauseSpeaking, resumeSpeaking]);

    const handleStop = useCallback(() => {
        stopSpeaking();
        setIsAutoPlaying(false);
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
                language: text?.language || targetLanguage,
                srsLevel: 0,
                nextReview: Date.now(),
                createdAt: Date.now()
            });
            toast({ message: 'Saved to Flashcards!', type: 'success' });
            setSelectedWord(null);
        } catch (e) {
            console.error("Failed to save", e);
        }
    };

    // Accumulate PDF text as user reads pages
    const handlePdfTextExtracted = useCallback((extractedText: string) => {
        setPdfText(extractedText);
        if (extractedText && extractedText.trim().length > 0) {
            setAccumulatedPdfText(prev => {
                const newMap = new Map(prev);
                newMap.set(currentPage, extractedText);
                return newMap;
            });
        }
    }, [currentPage]);

    const handleStartGame = async () => {
        if (!text) return;

        let contentForGame: string;
        
        if (text.pdfBlob) {
            // For PDFs, combine all accumulated text from read pages
            const allPdfText = Array.from(accumulatedPdfText.values()).join('\n\n');
            contentForGame = allPdfText || pdfText || text.content || '';
        } else {
            // For regular text, use the full content
            contentForGame = text.content;
        }

        console.log(`[Reader] Content for game: ${contentForGame?.length || 0} chars, isPdf: ${!!text.pdfBlob}, pages accumulated: ${accumulatedPdfText.size}`);

        // Fetch saved words for this story's language
        const allSavedWords = await db.words.toArray();
        const filteredWords = allSavedWords.filter(w => w.language === text.language);
        console.log(`[Reader] Starting game for "${text.title}" in "${text.language}". Flashcards found: ${filteredWords.length}`);

        const gameContent = contentForGame || '';
        const gameWordCount = gameContent.trim().split(/\s+/).filter(Boolean).length;
        const gameQuestionCount = getGameQuestionCount(gameWordCount);
        const data = generateGameContent(gameContent, text.title, filteredWords, text.language, gameQuestionCount);
        console.log(`[Reader] Game generated with ${data.exercises.length} exercises (${gameWordCount} words → ${gameQuestionCount} questions)`);
        
        setGameData(data);
        setView('game');
        setShowFinishPrompt(false);
    };

    const getContentForQuiz = useCallback(() => {
        if (!text) return '';
        if (text.pdfBlob) {
            const allPdfText = Array.from(accumulatedPdfText.values()).join('\n\n');
            return allPdfText || pdfText || text.content || '';
        }
        return text.content;
    }, [text, accumulatedPdfText, pdfText]);

    const handleStartQuiz = async () => {
        if (!text) return;
        
        const contentForQuiz = getContentForQuiz();
        const quizWordCount = contentForQuiz.trim().split(/\s+/).filter(Boolean).length;
        const quizQuestionCount = getGameQuestionCount(quizWordCount);
        console.log(`[Reader] Starting quiz with ${contentForQuiz.length} chars, ${quizWordCount} words → ${quizQuestionCount} questions`);
        
        const quiz = generateQuiz(contentForQuiz, text.title, text.language, quizQuestionCount);
        console.log(`[Reader] Quiz generated with ${quiz.questions.length} questions`);
        
        setQuizData(quiz);
        setQuizStartTime(Date.now());
        setView('quiz');
        
        // Track game completion
        await incrementGamesPlayed();
    };

    const handleQuizComplete = async (score: number, total: number, percentage: number) => {
        if (!text) return;
        
        const timeTaken = Math.round((Date.now() - quizStartTime) / 1000);
        
        // Save quiz result
        await addQuizResult({
            storyId: text.id,
            storyTitle: text.title,
            score,
            totalPoints: total,
            percentage,
            questionsCorrect: quizData ? Math.round((percentage / 100) * quizData.questions.length) : 0,
            totalQuestions: quizData?.questions.length || 0,
            timeTaken,
            completedAt: Date.now()
        });
        
        // Points: first time or replay all-correct → add score; replay with wrong answers → deduct
        const previousAttempts = await getQuizResultsByStory(text.id);
        const isReplay = previousAttempts.length > 1; // current attempt already saved above
        const allCorrect = score >= total;
        const pointsToApply = isReplay ? (allCorrect ? score : score - total) : score;
        await updateUserScore(pointsToApply, true);
        
        console.log(`[Reader] Quiz completed: ${score}/${total} (${percentage}%)${isReplay ? ` replay ${allCorrect ? `all correct → +${score} pts` : `wrong answers → ${pointsToApply} pts`}` : ` first time → +${score} pts`}`);
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
                        <Link href="/" onClick={() => stopSpeaking()} className={`p-2 -ml-2 rounded-full transition-colors ${readerSettings.darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                            <ArrowLeft className={`w-5 h-5 ${headerText}`} />
                        </Link>
                        <h1 className={`text-lg sm:text-xl font-bold line-clamp-1 ${headerText}`}>{text.title}</h1>
                    </div>
                    {view === 'reader' && (
                        <div className={`text-xs font-medium px-3 py-1 rounded-full ${readerSettings.darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                            {currentPage + 1} / {totalPages}
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content Area */}
            <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-4 sm:pt-5 pb-36">
                <AnimatePresence mode="wait">
                    {view === 'reader' ? (
                        <motion.div
                            key="reader"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {text.pdfBlob ? (
                                <div className="flex justify-center">
                                    <PdfReader
                                        blob={text.pdfBlob}
                                        pageNumber={currentPage + 1}
                                        scale={readerSettings.pdfScale}
                                        onWordClick={(word, position) => handleWordClick(position, word)}
                                        onLoad={setNumPdfPages}
                                        onRenderingUpdate={setIsPdfRendering}
                                        onTextExtracted={handlePdfTextExtracted}
                                        highlightRange={currentWordRange}
                                    />
                                </div>
                            ) : (
                                <div
                                    className={`prose prose-p:my-0 prose-p:leading-snug max-w-none font-serif ${readerText} transition-all duration-300`}
                                    style={{ fontSize: `${readerSettings.fontSize}%` }}
                                >
                                    <p className="whitespace-pre-wrap leading-snug">
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
                        </motion.div>
                    ) : view === 'game' ? (
                        <motion.div
                            key="game"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            {gameData && (
                                <StoryGame
                                    gameData={gameData}
                                    onClose={() => setView('reader')}
                                    onStartQuiz={handleStartQuiz}
                                />
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="quiz"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            {quizData && (
                                <StoryQuiz
                                    quiz={quizData}
                                    onComplete={handleQuizComplete}
                                    onClose={() => setView('reader')}
                                />
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Bottom Toolbar (Only show in reader mode) */}
            {/* ===== Finished Prompt Modal ===== */}
            <AnimatePresence>
                {showFinishPrompt && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setShowFinishPrompt(false)}
                        />
                        <motion.div
                            initial={{ y: 200, opacity: 0, scale: 0.9 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 200, opacity: 0, scale: 0.9 }}
                            className={`relative w-full max-w-lg ${readerSettings.darkMode ? 'bg-gray-900' : 'bg-white'} rounded-3xl shadow-2xl overflow-hidden`}
                        >
                            <div className="p-8 text-center">
                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Star className="w-8 h-8 text-blue-600 dark:text-blue-400 fill-current" />
                                </div>
                                <h2 className={`text-2xl font-bold mb-3 ${readerSettings.darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    You've finished the story!
                                </h2>
                                <p className={`mb-8 ${readerSettings.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Now it's time to play a game to learn from it and reinforce your vocabulary.
                                </p>

                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <button
                                            onClick={handleStartGame}
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/30 active:scale-95 flex items-center justify-center gap-2"
                                        >
                                            Play Game <ArrowRight className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={async () => {
                                                setShowFinishPrompt(false);
                                                await handleStartQuiz();
                                            }}
                                            className={`flex-1 bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-purple-500/30 active:scale-95 flex items-center justify-center gap-2`}
                                        >
                                            Skip to Test
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => setShowFinishPrompt(false)}
                                        className={`w-full ${readerSettings.darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} py-3 rounded-2xl font-bold transition-all`}
                                    >
                                        Just Finish
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ===== Bottom Toolbar ===== */}
            {view === 'reader' && !showFinishPrompt && (
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
                        {/* Settings Button */}
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

                        {/* Next Page / Finish */}
                        <button
                            onClick={goToNextPage}
                            disabled={isPdfRendering}
                            className={`p-2 transition-colors disabled:opacity-30 ${readerSettings.darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
                            title={currentPage >= totalPages - 1 ? 'Finish Reading' : 'Next Page'}
                        >
                            <SkipForward className={`w-6 h-6 fill-current ${currentPage >= totalPages - 1 ? 'text-green-500' : ''}`} />
                        </button>

                        {/* Page indicator */}
                        <span className={`text-xs font-medium tabular-nums ${readerSettings.darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            {currentPage + 1}/{totalPages}
                        </span>
                    </div>
                </div>
            )}

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
