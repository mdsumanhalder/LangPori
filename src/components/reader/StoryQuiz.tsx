'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Clock, Trophy, Star, ArrowRight, Zap } from 'lucide-react';
import { Quiz, QuizQuestion, calculateQuizScore } from '@/lib/quizGenerator';

interface StoryQuizProps {
    quiz: Quiz;
    onComplete: (score: number, total: number, percentage: number) => void;
    onClose: () => void;
}

export default function StoryQuiz({ quiz, onComplete, onClose }: StoryQuizProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [showResult, setShowResult] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [timeLeft, setTimeLeft] = useState(quiz.timeLimit || 300);

    const currentQuestion = quiz.questions[currentIndex];
    const isLastQuestion = currentIndex === quiz.questions.length - 1;

    // Timer
    useEffect(() => {
        if (showResult || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    clearInterval(timer);
                    handleFinish();
                    return 0;
                }
                return t - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [showResult]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSelectOption = (option: string) => {
        if (isAnswered) return;
        setSelectedOption(option);
    };

    const handleSubmitAnswer = () => {
        if (!selectedOption || isAnswered) return;

        setAnswers(prev => ({ ...prev, [currentQuestion.id]: selectedOption }));
        setIsAnswered(true);

        // Auto-advance after showing feedback
        setTimeout(() => {
            if (isLastQuestion) {
                handleFinish();
            } else {
                setCurrentIndex(i => i + 1);
                setSelectedOption(null);
                setIsAnswered(false);
            }
        }, 1500);
    };

    const handleFinish = () => {
        const finalAnswers = selectedOption && !answers[currentQuestion.id]
            ? { ...answers, [currentQuestion.id]: selectedOption }
            : answers;

        const result = calculateQuizScore(finalAnswers, quiz.questions);
        setShowResult(true);
        onComplete(result.score, result.total, result.percentage);
    };

    const result = useMemo(() => {
        if (!showResult) return null;
        return calculateQuizScore(answers, quiz.questions);
    }, [showResult, answers, quiz.questions]);

    if (showResult && result) {
        const stars = result.percentage >= 90 ? 3 : result.percentage >= 70 ? 2 : result.percentage >= 50 ? 1 : 0;
        
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border dark:border-gray-800"
            >
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
                    <Trophy className="w-12 h-12 text-white" />
                </div>

                <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Here's how you did</p>

                {/* Stars */}
                <div className="flex gap-2 mb-6">
                    {[1, 2, 3].map(i => (
                        <Star
                            key={i}
                            className={`w-10 h-10 ${i <= stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-700'}`}
                        />
                    ))}
                </div>

                {/* Score Card */}
                <div className="grid grid-cols-3 gap-4 mb-8 w-full max-w-md">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl">
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{result.score}</div>
                        <div className="text-xs uppercase tracking-wider text-blue-500 font-bold">Points</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-2xl">
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400">{result.correct}/{quiz.questions.length}</div>
                        <div className="text-xs uppercase tracking-wider text-green-500 font-bold">Correct</div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-2xl">
                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{result.percentage}%</div>
                        <div className="text-xs uppercase tracking-wider text-purple-500 font-bold">Score</div>
                    </div>
                </div>

                {/* Motivational Message */}
                <p className="text-lg font-medium mb-8 text-gray-700 dark:text-gray-300">
                    {result.percentage >= 90 ? '🎉 Outstanding! You really understood the story!' :
                     result.percentage >= 70 ? '👏 Great job! Keep up the good work!' :
                     result.percentage >= 50 ? '👍 Good effort! Review the story for better results.' :
                     '📚 Keep practicing! Read the story again to improve.'}
                </p>

                <button
                    onClick={onClose}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95"
                >
                    Continue
                </button>
            </motion.div>
        );
    }

    const isCorrect = selectedOption === currentQuestion.correctAnswer;

    return (
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 px-2">
                {/* Progress */}
                <div className="flex gap-1">
                    {quiz.questions.map((_, i) => (
                        <div
                            key={i}
                            className={`h-2 w-8 rounded-full transition-all duration-300 ${
                                i < currentIndex ? 'bg-green-500' :
                                i === currentIndex ? 'bg-blue-500 w-12' :
                                'bg-gray-200 dark:bg-gray-800'
                            }`}
                        />
                    ))}
                </div>

                {/* Timer */}
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                    timeLeft < 60 ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                }`}>
                    <Clock className="w-4 h-4" />
                    <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
                </div>
            </div>

            {/* Question Info */}
            <div className="flex items-center justify-between mb-4 px-2">
                <span className="text-sm font-medium text-gray-500">
                    Question {currentIndex + 1} of {quiz.questions.length}
                </span>
                <span className="flex items-center gap-1 text-sm font-bold text-amber-600">
                    <Zap className="w-4 h-4" /> {currentQuestion.points} pts
                </span>
            </div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    className="relative"
                >
                    {/* Feedback Overlay */}
                    <AnimatePresence>
                        {isAnswered && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className={`absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm rounded-3xl ${
                                    isCorrect ? 'bg-green-500/10' : 'bg-red-500/10'
                                }`}
                            >
                                <motion.div
                                    initial={{ y: 20 }}
                                    animate={{ y: 0 }}
                                    className={`flex flex-col items-center gap-2 px-8 py-6 rounded-2xl shadow-2xl ${
                                        isCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                                    }`}
                                >
                                    {isCorrect ? (
                                        <CheckCircle2 className="w-12 h-12" />
                                    ) : (
                                        <XCircle className="w-12 h-12" />
                                    )}
                                    <span className="text-xl font-bold">
                                        {isCorrect ? `+${currentQuestion.points} Points!` : 'Incorrect'}
                                    </span>
                                    {!isCorrect && (
                                        <span className="text-sm opacity-90">
                                            Correct: {currentQuestion.correctAnswer}
                                        </span>
                                    )}
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl border dark:border-gray-800">
                        {/* Question Type Badge */}
                        <div className="flex items-center gap-2 mb-4">
                            <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                                currentQuestion.type === 'multiple_choice' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                                currentQuestion.type === 'true_false' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' :
                                'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                            }`}>
                                {currentQuestion.type === 'multiple_choice' ? 'Multiple Choice' :
                                 currentQuestion.type === 'true_false' ? 'True or False' : 'Fill in Blank'}
                            </span>
                        </div>

                        {/* Question Text */}
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-8 leading-relaxed">
                            {currentQuestion.question}
                        </h3>

                        {/* Options */}
                        <div className="space-y-3 mb-8">
                            {currentQuestion.options?.map((option, i) => {
                                const isSelected = selectedOption === option;
                                const showCorrect = isAnswered && option === currentQuestion.correctAnswer;
                                const showWrong = isAnswered && isSelected && !isCorrect;

                                return (
                                    <button
                                        key={i}
                                        onClick={() => handleSelectOption(option)}
                                        disabled={isAnswered}
                                        className={`w-full py-4 px-6 rounded-2xl border-2 text-left font-medium transition-all ${
                                            showCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
                                            showWrong ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' :
                                            isSelected ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' :
                                            'border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }`}
                                    >
                                        <span className="flex items-center gap-3">
                                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                                showCorrect ? 'bg-green-500 text-white' :
                                                showWrong ? 'bg-red-500 text-white' :
                                                isSelected ? 'bg-blue-500 text-white' :
                                                'bg-gray-100 dark:bg-gray-800 text-gray-500'
                                            }`}>
                                                {String.fromCharCode(65 + i)}
                                            </span>
                                            {option}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmitAnswer}
                            disabled={!selectedOption || isAnswered}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-2xl font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                        >
                            {isLastQuestion ? 'Finish Quiz' : 'Submit Answer'}
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
