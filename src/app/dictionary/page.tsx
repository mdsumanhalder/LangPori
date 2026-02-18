'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Search,
    Volume2,
    Book,
    Loader2,
    ExternalLink
} from 'lucide-react';
import { useSpeech } from '@/hooks/useSpeech';
import { frequencyWords } from '@/data/frequencyData';
import { WiktionaryResult, FrequencyWord } from '@/types';
import { useAppSelector } from '@/store';
import { getLanguageName } from '@/lib/languages';

export default function DictionaryPage() {
    const targetLanguage = useAppSelector((state) => state.settings.targetLanguage);
    const nativeLanguage = useAppSelector((state) => state.settings.nativeLanguage);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<FrequencyWord[]>([]);
    const [wiktionaryResult, setWiktionaryResult] = useState<WiktionaryResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedWord, setSelectedWord] = useState<FrequencyWord | null>(null);
    const { speak, isSpeaking } = useSpeech();



    const fetchWiktionary = useCallback(async (word: string, lang: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/wiktionary?word=${encodeURIComponent(word)}&lang=${lang}`);
            const data: WiktionaryResult = await response.json();
            setWiktionaryResult(data);
        } catch (error) {
            console.error('Failed to fetch Wiktionary:', error);
            setWiktionaryResult({
                word,
                language: getLanguageName(lang) || lang,
                definitions: [],
                error: 'Failed to fetch definition'
            });
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleWordClick = useCallback((word: FrequencyWord) => {
        setSelectedWord(word);
        fetchWiktionary(word.word, 'et'); // Frequency words are always Estonian
    }, [fetchWiktionary]);

    const handleSpeak = useCallback((text: string, lang?: string) => {
        speak(text, lang || targetLanguage);
    }, [speak, targetLanguage]);

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
        // Only search frequency words if they match the current target language (Estonian)
        const isEstonian = targetLanguage === 'et';

        if (!query.trim()) {
            setSearchResults([]);
            setWiktionaryResult(null);
            return;
        }

        // If not Estonian, we might just want to trigger a wiktionary fetch directly or wait for enter?
        // But the current UI is search-as-you-type for local data.
        // For now, let's keep local search only for Estonian.

        if (isEstonian) {
            const lowerQuery = query.toLowerCase();
            const results = frequencyWords.filter(
                w => w.word.toLowerCase().includes(lowerQuery) ||
                    w.translation.toLowerCase().includes(lowerQuery)
            );
            setSearchResults(results.slice(0, 20));
        } else {
            setSearchResults([]);
        }

    }, [targetLanguage]);

    // Trigger Wiktionary search on Enter key or button click for non-local results
    const triggerExternalSearch = () => {
        if (searchQuery) fetchWiktionary(searchQuery, targetLanguage);
    };

    const partOfSpeechColors: Record<string, string> = {
        noun: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
        verb: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
        adjective: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
        adverb: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
        pronoun: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
        numeral: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300',
        conjunction: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
        preposition: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
        interjection: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
        ordinal: 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300',
        phrase: 'bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300',
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
            {/* Header */}
            {/* Header */}
            <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 dark:bg-gray-900/70 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                    <h1 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Book className="w-5 h-5" />
                        Dictionary
                    </h1>
                    <div className="w-5" />
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
                {/* Search Input */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder={targetLanguage === 'et' ? "Otsi sõnu..." : "Search words..."}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-gray-800 shadow-lg border-2 border-transparent focus:border-blue-500 outline-none text-lg text-gray-900 dark:text-white placeholder-gray-400"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                triggerExternalSearch();
                            }
                        }}
                    />
                </div>

                {/* Quick Access: Popular Words (Only for Estonian) */}
                {!searchQuery && !selectedWord && targetLanguage === 'et' && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                            📚 Most Common Words
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {frequencyWords.slice(0, 20).map((word) => (
                                <button
                                    key={word.rank}
                                    onClick={() => handleWordClick(word)}
                                    className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all text-left group"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-400">#{word.rank}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${partOfSpeechColors[word.partOfSpeech] || 'bg-gray-100 text-gray-600'}`}>
                                            {word.partOfSpeech}
                                        </span>
                                    </div>
                                    <p className="font-bold text-gray-900 dark:text-white mt-1 group-hover:text-blue-600 transition-colors">
                                        {word.word}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {word.translation}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Search Results */}
                <AnimatePresence>
                    {searchResults.length > 0 && !selectedWord && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
                        >
                            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                                <h3 className="font-medium text-gray-600 dark:text-gray-400">
                                    {searchResults.length} results found
                                </h3>
                            </div>
                            <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-96 overflow-y-auto">
                                {searchResults.map((word) => (
                                    <div
                                        key={word.rank}
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => handleWordClick(word)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                handleWordClick(word);
                                            }
                                        }}
                                        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left cursor-pointer"
                                    >
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSpeak(word.word);
                                                }}
                                                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors shrink-0"
                                                aria-label={`Listen to ${word.word}`}
                                            >
                                                <Volume2 className={`w-4 h-4 ${isSpeaking ? 'text-blue-500' : 'text-gray-500'}`} />
                                            </button>
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-white">{word.word}</p>
                                                <p className="text-sm text-gray-500">{word.translation}</p>
                                            </div>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full ${partOfSpeechColors[word.partOfSpeech] || 'bg-gray-100 text-gray-600'}`}>
                                            {word.partOfSpeech}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Selected Word Details */}
                <AnimatePresence>
                    {selectedWord && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
                        >
                            {/* Word Header */}
                            <div className="p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                                <div className="flex items-center justify-between mb-4">
                                    <button
                                        onClick={() => {
                                            setSelectedWord(null);
                                            setWiktionaryResult(null);
                                        }}
                                        className="text-white/80 hover:text-white transition-colors"
                                    >
                                        ← Back to search
                                    </button>
                                    <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                                        Rank #{selectedWord.rank}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => handleSpeak(selectedWord.word)}
                                        disabled={isSpeaking}
                                        className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                                    >
                                        <Volume2 className={`w-6 h-6 ${isSpeaking ? 'animate-pulse' : ''}`} />
                                    </button>
                                    <div>
                                        <h2 className="text-3xl font-bold">{selectedWord.word}</h2>
                                        <p className="text-xl text-white/80">{selectedWord.translation}</p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <span className={`inline-block px-3 py-1 rounded-full text-sm bg-white/20`}>
                                        {selectedWord.partOfSpeech}
                                    </span>
                                </div>
                            </div>

                            {/* Wiktionary Definition */}
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <Book className="w-4 h-4" />
                                        Wiktionary Definition
                                    </h3>
                                    <a
                                        href={`https://en.wiktionary.org/wiki/${encodeURIComponent(selectedWord.word)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
                                    >
                                        View on Wiktionary
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>

                                {isLoading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                                    </div>
                                ) : wiktionaryResult?.error ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <p>{wiktionaryResult.error}</p>
                                        <p className="text-sm mt-2">Try viewing on Wiktionary directly.</p>
                                    </div>
                                ) : wiktionaryResult?.definitions.length ? (
                                    <div className="space-y-4">
                                        {wiktionaryResult.definitions.map((def, index) => (
                                            <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                                <span className={`text-xs px-2 py-1 rounded-full ${partOfSpeechColors[def.partOfSpeech] || 'bg-gray-200 text-gray-600'}`}>
                                                    {def.partOfSpeech}
                                                </span>
                                                <p className="mt-2 text-gray-700 dark:text-gray-300">
                                                    {def.definition}
                                                </p>
                                                {def.examples && def.examples.length > 0 && (
                                                    <div className="mt-2 pl-4 border-l-2 border-blue-300">
                                                        {def.examples.map((ex, i) => (
                                                            <p key={i} className="text-sm text-gray-500 italic">{ex}</p>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <p>No detailed definition available.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Tips */}
                {!selectedWord && (
                    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        <p>💡 <strong>Tip:</strong> Search for Estonian or English words. Click on a word to see detailed information and hear pronunciation.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
