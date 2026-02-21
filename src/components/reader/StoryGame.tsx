'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight, Trophy, Star, BookOpen, Zap } from 'lucide-react';
import { GameExercise, StoryGame as GameData } from '@/lib/gameGenerator';

interface StoryGameProps {
    gameData: GameData;
    onClose: () => void;
    onStartQuiz?: () => void;
}

export default function StoryGame({ gameData, onClose, onStartQuiz }: StoryGameProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

    const currentExercise = gameData.exercises[currentIndex];
    const isFinished = currentIndex >= gameData.exercises.length;

    const handleAnswer = (isCorrect: boolean) => {
        if (feedback) return;

        setFeedback(isCorrect ? 'correct' : 'wrong');
        if (isCorrect) setScore(s => s + 1);

        setTimeout(() => {
            setFeedback(null);
            setCurrentIndex(i => i + 1);
        }, 1500);
    };

    if (isFinished) {
        const percentage = Math.round((score / gameData.exercises.length) * 100);
        const stars = percentage >= 90 ? 3 : percentage >= 70 ? 2 : percentage >= 50 ? 1 : 0;

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border dark:border-gray-800"
            >
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
                    <Trophy className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Game Complete!</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-4">You've finished the learning exercises.</p>

                {/* Stars */}
                <div className="flex gap-1 mb-6">
                    {[1, 2, 3].map(i => (
                        <Star
                            key={i}
                            className={`w-8 h-8 ${i <= stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-700'}`}
                        />
                    ))}
                </div>

                <div className="flex gap-4 mb-8">
                    <div className="bg-blue-50 dark:bg-blue-900/20 px-6 py-4 rounded-2xl">
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{score}/{gameData.exercises.length}</div>
                        <div className="text-xs uppercase tracking-wider text-blue-500 font-bold">Correct</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 px-6 py-4 rounded-2xl">
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400">{percentage}%</div>
                        <div className="text-xs uppercase tracking-wider text-green-500 font-bold">Score</div>
                    </div>
                </div>

                {/* Quiz Prompt */}
                {onStartQuiz && (
                    <div className="w-full mb-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl border border-purple-200 dark:border-purple-800">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-purple-700 dark:text-purple-300">Ready for a Quiz?</h3>
                                <p className="text-sm text-purple-600 dark:text-purple-400">Test your comprehension and earn points!</p>
                            </div>
                        </div>
                        <button
                            onClick={onStartQuiz}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                        >
                            <Zap className="w-5 h-5" />
                            Take Quiz & Earn Points
                        </button>
                    </div>
                )}

                <button
                    onClick={onClose}
                    className={`w-full py-4 rounded-2xl font-bold transition-all active:scale-95 ${
                        onStartQuiz 
                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30'
                    }`}
                >
                    {onStartQuiz ? 'Skip Quiz' : 'Back to Story'}
                </button>
            </motion.div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            {/* Progress Header */}
            <div className="flex flex-col gap-3 mb-6 px-2">
                <div className="flex items-center justify-between">
                    <div className="flex gap-1 overflow-x-auto pb-1">
                        {gameData.exercises.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 w-6 flex-shrink-0 rounded-full transition-all duration-500 ${i < currentIndex ? 'bg-green-500' : i === currentIndex ? 'bg-blue-500 w-10' : 'bg-gray-200 dark:bg-gray-800'
                                    }`}
                            />
                        ))}
                    </div>
                    <div className="text-sm font-bold text-gray-500 flex-shrink-0">
                        Question {currentIndex + 1}/{gameData.exercises.length}
                    </div>
                </div>
                {onStartQuiz && (
                    <button
                        type="button"
                        onClick={onStartQuiz}
                        className="self-end text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:underline transition-colors flex items-center gap-1.5"
                    >
                        <Zap className="w-4 h-4" />
                        Skip to Test
                    </button>
                )}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    className="relative"
                >
                    {/* Feedback Overlays */}
                    <AnimatePresence>
                        {feedback && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className={`absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm rounded-3xl ${feedback === 'correct' ? 'bg-green-500/10' : 'bg-red-500/10'
                                    }`}
                            >
                                <motion.div
                                    initial={{ y: 20 }}
                                    animate={{ y: 0 }}
                                    className={`flex items-center gap-3 px-8 py-4 rounded-full shadow-2xl ${feedback === 'correct' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                                        }`}
                                >
                                    {feedback === 'correct' ? <CheckCircle2 className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
                                    <span className="text-xl font-bold">{feedback === 'correct' ? 'Perfect!' : 'Oops!'}</span>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {currentExercise.type === 'matching' && (
                        <VocabMatch
                            exercise={currentExercise}
                            onAnswer={handleAnswer}
                        />
                    )}
                    {currentExercise.type === 'reorder' && (
                        currentExercise.question.includes('Unscramble') ? (
                            <WordScramble
                                exercise={currentExercise}
                                onAnswer={handleAnswer}
                            />
                        ) : (
                            <SentenceReorder
                                exercise={currentExercise}
                                onAnswer={handleAnswer}
                            />
                        )
                    )}
                    {currentExercise.type === 'fill' && (
                        <FillInBlank
                            exercise={currentExercise}
                            onAnswer={handleAnswer}
                        />
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

// --- SUB-COMPONENTS ---

function VocabMatch({ exercise, onAnswer }: { exercise: GameExercise, onAnswer: (correct: boolean) => void }) {
    return (
        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl border dark:border-gray-800">
            <h3 className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-6">Vocabulary Matching</h3>
            <div className="text-3xl font-bold text-center mb-10 text-gray-800 dark:text-white capitalize">
                {exercise.question}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {exercise.options?.map((opt, i) => (
                    <button
                        key={i}
                        onClick={() => onAnswer(opt === exercise.answer)}
                        className="py-6 px-4 rounded-2xl border-2 border-gray-100 dark:border-gray-800 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-medium transition-all text-lg active:scale-95"
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
}

function SentenceReorder({ exercise, onAnswer }: { exercise: GameExercise, onAnswer: (correct: boolean) => void }) {
    const [selected, setSelected] = useState<string[]>([]);
    const [available, setAvailable] = useState<string[]>(exercise.options || []);

    const toggleWord = (word: string, fromSelected: boolean) => {
        if (fromSelected) {
            setSelected(s => s.filter(w => w !== word));
            setAvailable(a => [...a, word]);
        } else {
            setAvailable(a => a.filter(w => w !== word));
            setSelected(s => [...s, word]);
        }
    };

    const isCorrect = useMemo(() => {
        const target = (exercise.answer as string[]).join(' ');
        const current = selected.join(' ');
        return target === current;
    }, [selected, exercise.answer]);

    return (
        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl border dark:border-gray-800">
            <h3 className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-6">Sentence Reordering</h3>

            {/* Answer Area */}
            <div className="min-h-[120px] p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border-2 border-dashed border-gray-200 dark:border-gray-700 mb-8 flex flex-wrap gap-2 content-start">
                <AnimatePresence>
                    {selected.map((word, i) => (
                        <motion.button
                            key={`${word}-${i}`}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={() => toggleWord(word, true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-lg font-medium shadow-md"
                        >
                            {word}
                        </motion.button>
                    ))}
                </AnimatePresence>
            </div>

            {/* Word Bank */}
            <div className="flex flex-wrap gap-2 justify-center mb-10">
                {available.map((word, i) => (
                    <button
                        key={`${word}-${i}`}
                        onClick={() => toggleWord(word, false)}
                        className="bg-white dark:bg-gray-800 px-4 py-2 rounded-xl border-2 dark:border-gray-700 text-lg font-medium hover:border-blue-500 transition-all active:scale-95"
                    >
                        {word}
                    </button>
                ))}
            </div>

            <button
                disabled={selected.length === 0}
                onClick={() => onAnswer(isCorrect)}
                className="w-full bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 text-white py-4 rounded-2xl font-bold transition-all disabled:opacity-30"
            >
                Check Answer
            </button>
        </div>
    );
}

function FillInBlank({ exercise, onAnswer }: { exercise: GameExercise, onAnswer: (correct: boolean) => void }) {
    const [inputValue, setInputValue] = useState('');

    return (
        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl border dark:border-gray-800">
            <h3 className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-6">Fill in the Blank</h3>

            <div className="text-xl font-serif leading-relaxed mb-10 text-gray-700 dark:text-gray-200 p-6 bg-amber-50/50 dark:bg-gray-800/30 rounded-2xl border border-amber-100/50 dark:border-gray-700">
                {exercise.question}
            </div>

            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type the missing word..."
                className="w-full py-4 px-6 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 mb-6 text-xl focus:border-blue-500 outline-none transition-all dark:text-white"
                autoFocus
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && inputValue.trim()) {
                        onAnswer(inputValue.toLowerCase().trim() === (exercise.answer as string).toLowerCase());
                    }
                }}
            />

            <button
                disabled={!inputValue.trim()}
                onClick={() => onAnswer(inputValue.toLowerCase().trim() === (exercise.answer as string).toLowerCase())}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold transition-all disabled:opacity-30 shadow-lg shadow-blue-500/30"
            >
                Submit
            </button>
        </div>
    );
}

function WordScramble({ exercise, onAnswer }: { exercise: GameExercise, onAnswer: (correct: boolean) => void }) {
    const [selected, setSelected] = useState<string[]>([]);
    const [available, setAvailable] = useState<string[]>(exercise.options || []);

    const correctAnswer = (exercise.answer as string[]).join('');

    const toggleLetter = (letter: string, idx: number, fromSelected: boolean) => {
        if (fromSelected) {
            const newSelected = [...selected];
            newSelected.splice(idx, 1);
            setSelected(newSelected);
            setAvailable(a => [...a, letter]);
        } else {
            const newAvailable = [...available];
            newAvailable.splice(idx, 1);
            setAvailable(newAvailable);
            setSelected(s => [...s, letter]);
        }
    };

    const isCorrect = selected.join('') === correctAnswer;

    return (
        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl border dark:border-gray-800">
            <h3 className="text-sm font-bold text-purple-500 uppercase tracking-widest mb-6">Word Scramble</h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 text-center">
                Arrange the letters to form the word
            </p>

            {/* Answer Area */}
            <div className="min-h-[80px] p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border-2 border-dashed border-gray-200 dark:border-gray-700 mb-8 flex flex-wrap gap-2 justify-center content-center">
                <AnimatePresence>
                    {selected.map((letter, i) => (
                        <motion.button
                            key={`selected-${i}`}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={() => toggleLetter(letter, i, true)}
                            className="bg-purple-600 text-white w-12 h-12 rounded-xl text-2xl font-bold shadow-md uppercase flex items-center justify-center"
                        >
                            {letter}
                        </motion.button>
                    ))}
                </AnimatePresence>
            </div>

            {/* Letter Bank */}
            <div className="flex flex-wrap gap-2 justify-center mb-10">
                {available.map((letter, i) => (
                    <button
                        key={`avail-${i}`}
                        onClick={() => toggleLetter(letter, i, false)}
                        className="bg-white dark:bg-gray-800 w-12 h-12 rounded-xl border-2 dark:border-gray-700 text-2xl font-bold hover:border-purple-500 transition-all active:scale-95 uppercase flex items-center justify-center"
                    >
                        {letter}
                    </button>
                ))}
            </div>

            <button
                disabled={selected.length === 0}
                onClick={() => onAnswer(isCorrect)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-2xl font-bold transition-all disabled:opacity-30 shadow-lg shadow-purple-500/30"
            >
                Check Answer
            </button>
        </div>
    );
}
