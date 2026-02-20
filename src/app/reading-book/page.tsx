'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { db } from '@/db/db';
import PdfReader from '@/components/reader/PdfReader';
import { useSpeech } from '@/hooks/useSpeech';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Play, Pause, Square, ZoomIn, ZoomOut, Loader2 } from 'lucide-react';
import { WordPopover } from '@/components/WordPopover';

export default function ReadingBookPage() {
    const searchParams = useSearchParams();
    const bookId = searchParams.get('id');

    const [bookBlob, setBookBlob] = useState<Blob | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [numPages, setNumPages] = useState(0);
    const [scale, setScale] = useState(1.5);
    const [extractedText, setExtractedText] = useState('');

    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedWord, setSelectedWord] = useState<{ word: string, x: number, y: number } | null>(null);

    const { speak, stopSpeaking, isSpeaking, isPaused, pauseSpeaking, resumeSpeaking, currentWordRange } = useSpeech();

    useEffect(() => {
        const loadBook = async () => {
            if (!bookId) return;
            // Fetch book from indexedDB
            const book = await db.texts.get(Number(bookId));
            if (book && book.pdfBlob) {
                setBookBlob(book.pdfBlob);
            }
        };
        loadBook();
    }, [bookId]);

    // Clear text when page changes to avoid re-reading old text during transitions
    useEffect(() => {
        setExtractedText('');
    }, [pageNumber, scale]);

    // Handle automatic page continuation
    useEffect(() => {
        if (isPlaying && extractedText && !isSpeaking && !isPaused) {
            // Start speaking current page
            speak(extractedText, 'et', {
                onEnd: () => {
                    // When page ends, advance if possible
                    setPageNumber(prev => {
                        if (prev < numPages) {
                            return prev + 1;
                        } else {
                            setIsPlaying(false);
                            return prev;
                        }
                    });
                }
            });
        }
    }, [isPlaying, extractedText, isSpeaking, isPaused, speak, numPages]);

    const handleWordClick = useCallback((word: string, position: { x: number, y: number }) => {
        // Clean word from punctuation
        const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
        setSelectedWord({ word: cleanWord, x: position.x, y: position.y });
    }, []);

    const handlePlay = () => {
        if (isPaused) {
            resumeSpeaking();
        } else {
            setIsPlaying(true);
        }
    };

    const handleStop = () => {
        stopSpeaking();
        setIsPlaying(false);
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            {/* Top Toolbar */}
            <div className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="font-bold text-slate-800 hidden md:block">Reading Mode</h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-slate-100 rounded-lg p-1">
                        <Button variant="ghost" size="sm" onClick={() => {
                            setPageNumber(prev => Math.max(1, prev - 1));
                            if (isPlaying) stopSpeaking(); // Stop current and wait for new text
                        }} disabled={pageNumber <= 1}>
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <span className="text-xs font-medium px-2 min-w-[60px] text-center">
                            Page {pageNumber} / {numPages}
                        </span>
                        <Button variant="ghost" size="sm" onClick={() => {
                            setPageNumber(prev => Math.min(numPages, prev + 1));
                            if (isPlaying) stopSpeaking(); // Stop current and wait for new text
                        }} disabled={pageNumber >= numPages}>
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="flex items-center bg-slate-100 rounded-lg p-1 gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setScale(prev => Math.max(0.5, prev - 0.1))}>
                            <ZoomOut className="w-4 h-4" />
                        </Button>
                        <span className="text-xs font-medium w-10 text-center">{Math.round(scale * 100)}%</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setScale(prev => Math.min(3, prev + 0.1))}>
                            <ZoomIn className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {isSpeaking ? (
                        <Button variant="outline" size="sm" onClick={pauseSpeaking} className="gap-2 border-orange-200 text-orange-600 hover:bg-orange-50">
                            <Pause className="w-4 h-4 fill-current" /> Pause
                        </Button>
                    ) : isPaused ? (
                        <Button variant="soft" size="sm" onClick={resumeSpeaking} className="gap-2 bg-blue-50 text-blue-600">
                            <Play className="w-4 h-4 fill-current" /> Resume
                        </Button>
                    ) : (
                        <Button variant="default" size="sm" onClick={handlePlay} className="gap-2 bg-blue-600 hover:bg-blue-700">
                            <Play className="w-4 h-4 fill-current" /> Listen
                        </Button>
                    )}
                    {(isPlaying) && (
                        <Button variant="ghost" size="icon" onClick={handleStop} className="text-red-500">
                            <Square className="w-4 h-4 fill-current" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Reader Area */}
            <main className="flex-1 overflow-auto p-4 md:p-8 flex justify-center items-start">
                {bookBlob ? (
                    <PdfReader
                        blob={bookBlob}
                        pageNumber={pageNumber}
                        scale={scale}
                        onWordClick={handleWordClick}
                        onLoad={setNumPages}
                        highlightRange={currentWordRange}
                        onTextExtracted={setExtractedText}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center mt-20 gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-slate-300" />
                        <p className="text-slate-400">Loading your book...</p>
                    </div>
                )}
            </main>

            {/* Translation Popover */}
            {selectedWord && (
                <WordPopover
                    word={selectedWord.word}
                    position={{ x: selectedWord.x, y: selectedWord.y }}
                    onClose={() => setSelectedWord(null)}
                    onSave={() => {
                        db.words.add({
                            original: selectedWord.word,
                            translation: '', // Translation would come from an API normally
                            context: extractedText.substring(0, 100),
                            srsLevel: 0,
                            nextReview: Date.now(),
                            createdAt: Date.now()
                        });
                        setSelectedWord(null);
                    }}
                    isSaved={false}
                />
            )}

            {/* Footer / Progress */}
            <div className="h-2 bg-slate-200 sticky bottom-0 z-50 overflow-hidden">
                <div
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${(pageNumber / numPages) * 100}%` }}
                />
            </div>
        </div>
    );
}
