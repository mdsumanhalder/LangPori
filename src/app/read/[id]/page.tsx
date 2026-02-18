'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db, type Text } from '@/db/db';
import { ArrowLeft, Volume2, Save, X, Loader2, Play, Square, Pause } from 'lucide-react';
import Link from 'next/link';
import { useSpeech } from '@/hooks/useSpeech';
import { useAppSelector } from '@/store';

export default function ReaderPage() {
    const params = useParams();
    const router = useRouter();
    const targetLanguage = useAppSelector((state) => state.settings.targetLanguage);
    const nativeLanguage = useAppSelector((state) => state.settings.nativeLanguage);
    const [text, setText] = useState<Text | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedWord, setSelectedWord] = useState<{ word: string, translation: string | null, position: { x: number, y: number } } | null>(null);
    const [translating, setTranslating] = useState(false);

    const { speak, speakStateless, isSpeaking, stopSpeaking, pauseSpeaking, resumeSpeaking, isPaused, currentWordRange } = useSpeech();

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

    const handleToggleAudio = () => {
        if (isSpeaking) {
            pauseSpeaking();
        } else if (isPaused) {
            resumeSpeaking();
        } else if (text) {
            // Enable highlighting mode for full text reading
            speak(text.content, targetLanguage, { highlight: true });
        }
    };

    const handleStop = () => {
        stopSpeaking();
    };


    // Handle Word Click
    const handleWordClick = async (e: React.MouseEvent<HTMLSpanElement>, word: string) => {
        // Clean the word (remove punctuation)
        const cleanWord = word.replace(/[.,!?;:()"]/g, '').trim();
        if (!cleanWord) return;

        // Position popup near the click
        const rect = e.currentTarget.getBoundingClientRect();
        const position = {
            x: rect.left + window.scrollX,
            y: rect.bottom + window.scrollY + 10
        };

        setSelectedWord({
            word: cleanWord,
            translation: null,
            position
        });
        setTranslating(true);

        // Play Audio (via useSpeech instead of proxy for consistency) - No highlighting needed for single word
        // ONLY speak if we are not already speaking (to avoid interrupting the main flow)
        if (!isSpeaking) {
            speak(cleanWord, targetLanguage);
        }

        // Fetch Translation
        try {
            // Check if we already have it in "words" table? (Optimization for later)

            // Fetch from MyMemory API
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
                context: text?.content.substring(0, 100) || "", // Simplified context for now
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
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
    }

    if (!text) return null;

    // Parser: Split text into words but keep whitespace/punctuation for reconstruction
    // This is a simple regex splitter. For production, a more robust tokenization is needed.
    const tokens = text.content.split(/(\s+|[.,!?;:()"]+)/g);

    // Character index counter for highlighting
    let charIndex = 0;

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8 pb-32">
            <div className="max-w-3xl mx-auto">
                <header className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <h1 className="text-3xl font-bold line-clamp-1">{text.title}</h1>
                    </div>
                    <div className="flex gap-2">
                        {(isSpeaking || isPaused) && (
                            <button
                                onClick={handleStop}
                                className="p-3 rounded-full bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 transition-all"
                                title="Stop Reading"
                            >
                                <Square className="w-5 h-5 fill-current" />
                            </button>
                        )}
                        <button
                            onClick={handleToggleAudio}
                            className={`p-3 rounded-full transition-all ${isSpeaking
                                ? 'bg-amber-100 text-amber-600 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400'
                                : 'bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400'
                                }`}
                            title={isSpeaking ? "Pause" : (isPaused ? "Resume" : "Read Aloud")}
                        >
                            {isSpeaking ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                        </button>
                    </div>
                </header>

                <div className="prose dark:prose-invert max-w-none text-xl leading-loose font-serif">
                    <p>
                        {tokens.map((token, index) => {
                            const currentStart = charIndex;
                            const currentEnd = currentStart + token.length;
                            charIndex = currentEnd;

                            // Determine highlighting
                            // We highlight if the TTS current word range overlaps with this token's range
                            // Usually TTS gives the start index of the word.
                            // Determine highlighting
                            // We highlight if the current simulated cursor (1 char range) falls within this token
                            const isHighlighted = currentWordRange &&
                                currentWordRange.start >= currentStart &&
                                currentWordRange.start < currentEnd;


                            // If it's whitespace or punctuation, just render it (but still check highlight for safety/continuity?)
                            if (/^[\s.,!?;:()"]+$/.test(token)) {
                                return <span key={index} className={isHighlighted ? "bg-amber-200 dark:bg-amber-900/50" : ""}>{token}</span>;
                            }

                            // Otherwise it's a word
                            return (
                                <span
                                    key={index}
                                    onClick={(e) => handleWordClick(e, token)}
                                    className={`cursor-pointer rounded px-0.5 transition-colors ${isHighlighted
                                        ? 'bg-amber-200 dark:bg-amber-900/50 text-gray-900 dark:text-gray-100' // Highlight style
                                        : 'hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-600 dark:hover:text-blue-400' // Hover style
                                        }`}
                                >
                                    {token}
                                </span>
                            );
                        })}
                    </p>
                </div>
            </div>

            {/* Translation Popup */}
            {selectedWord && (
                <div
                    className="fixed z-50 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 w-64 animate-in fade-in zoom-in duration-200"
                    style={{
                        left: Math.min(window.innerWidth - 270, Math.max(10, selectedWord.position.x - 100)), // Clamp to screen
                        top: selectedWord.position.y
                    }}
                >
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-blue-600 dark:text-blue-400 capitalize">{selectedWord.word}</h3>
                        <button onClick={() => setSelectedWord(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {translating ? (
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Loader2 className="w-4 h-4 animate-spin" /> Translating...
                        </div>
                    ) : (
                        <div className="mb-4">
                            <p className="text-lg font-medium">{selectedWord.translation}</p>
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
                                if (wasPlaying) {
                                    pauseSpeaking();
                                }
                                await speakStateless(selectedWord.word, targetLanguage);
                                if (wasPlaying) {
                                    resumeSpeaking();
                                }
                            }}
                            className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-200 transition-colors"
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
