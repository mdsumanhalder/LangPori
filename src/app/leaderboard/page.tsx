'use client';

import { useState, useEffect } from 'react';
import { db, getUserScore, type UserScore, type QuizResult } from '@/db/db';
import { Trophy, Star, Zap, BookOpen, Target, Flame, Medal, Crown, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface LeaderboardEntry {
    rank: number;
    username: string;
    totalPoints: number;
    quizzesTaken: number;
    storiesCompleted: number;
    streak: number;
    isCurrentUser: boolean;
}

export default function LeaderboardPage() {
    const [userScore, setUserScore] = useState<UserScore | null>(null);
    const [recentQuizzes, setRecentQuizzes] = useState<QuizResult[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const score = await getUserScore();
            setUserScore(score || null);

            const quizzes = await db.quizResults
                .orderBy('completedAt')
                .reverse()
                .limit(10)
                .toArray();
            setRecentQuizzes(quizzes);

            setLoading(false);
        };
        loadData();
    }, []);

    // Generate mock leaderboard with user's actual score
    const leaderboard: LeaderboardEntry[] = [
        { rank: 1, username: 'BookWorm', totalPoints: 15420, quizzesTaken: 89, storiesCompleted: 45, streak: 30, isCurrentUser: false },
        { rank: 2, username: 'LangMaster', totalPoints: 12350, quizzesTaken: 72, storiesCompleted: 38, streak: 21, isCurrentUser: false },
        { rank: 3, username: 'QuizKing', totalPoints: 9870, quizzesTaken: 56, storiesCompleted: 28, streak: 14, isCurrentUser: false },
        { rank: 4, username: 'ReadingPro', totalPoints: 7650, quizzesTaken: 45, storiesCompleted: 22, streak: 7, isCurrentUser: false },
        { rank: 5, username: 'WordNinja', totalPoints: 5230, quizzesTaken: 31, storiesCompleted: 15, streak: 5, isCurrentUser: false },
    ];

    // Insert user into leaderboard
    if (userScore && userScore.totalPoints > 0) {
        const userEntry: LeaderboardEntry = {
            rank: 0,
            username: userScore.username || 'You',
            totalPoints: userScore.totalPoints,
            quizzesTaken: userScore.quizzesTaken,
            storiesCompleted: userScore.storiesCompleted,
            streak: userScore.currentStreak,
            isCurrentUser: true
        };

        // Find position
        let inserted = false;
        for (let i = 0; i < leaderboard.length; i++) {
            if (userScore.totalPoints > leaderboard[i].totalPoints) {
                leaderboard.splice(i, 0, userEntry);
                inserted = true;
                break;
            }
        }
        if (!inserted && leaderboard.length < 10) {
            leaderboard.push(userEntry);
        }

        // Recalculate ranks
        leaderboard.forEach((entry, i) => {
            entry.rank = i + 1;
        });
    }

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
            case 2: return <Medal className="w-6 h-6 text-gray-400" />;
            case 3: return <Award className="w-6 h-6 text-amber-600" />;
            default: return <span className="w-6 h-6 flex items-center justify-center font-bold text-gray-400">#{rank}</span>;
        }
    };

    const getRankBg = (rank: number, isCurrentUser: boolean) => {
        if (isCurrentUser) return 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-300 dark:border-blue-700';
        switch (rank) {
            case 1: return 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-yellow-300 dark:border-yellow-700';
            case 2: return 'bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50 border-gray-300 dark:border-gray-700';
            case 3: return 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-300 dark:border-amber-700';
            default: return 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-950 dark:to-gray-900">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                        <span className="text-xl">←</span>
                        <span className="font-medium">Back</span>
                    </Link>
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        <Trophy className="w-6 h-6 text-yellow-500" />
                        Leaderboard
                    </h1>
                    <div className="w-20" />
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* User Stats Card */}
                {userScore && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 p-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl shadow-2xl text-white"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                <Trophy className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">{userScore.username || 'Player'}</h2>
                                <p className="text-blue-200">Keep learning to climb the ranks!</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="bg-white/10 rounded-2xl p-4 text-center">
                                <Zap className="w-6 h-6 mx-auto mb-2 text-yellow-300" />
                                <div className="text-2xl font-bold">{userScore.totalPoints}</div>
                                <div className="text-xs text-blue-200 uppercase tracking-wider">Total Points</div>
                            </div>
                            <div className="bg-white/10 rounded-2xl p-4 text-center">
                                <Target className="w-6 h-6 mx-auto mb-2 text-green-300" />
                                <div className="text-2xl font-bold">{userScore.quizzesTaken}</div>
                                <div className="text-xs text-blue-200 uppercase tracking-wider">Quizzes</div>
                            </div>
                            <div className="bg-white/10 rounded-2xl p-4 text-center">
                                <BookOpen className="w-6 h-6 mx-auto mb-2 text-pink-300" />
                                <div className="text-2xl font-bold">{userScore.storiesCompleted}</div>
                                <div className="text-xs text-blue-200 uppercase tracking-wider">Stories</div>
                            </div>
                            <div className="bg-white/10 rounded-2xl p-4 text-center">
                                <Flame className="w-6 h-6 mx-auto mb-2 text-orange-300" />
                                <div className="text-2xl font-bold">{userScore.currentStreak}</div>
                                <div className="text-xs text-blue-200 uppercase tracking-wider">Day Streak</div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* No Stats Yet */}
                {!userScore && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 p-8 bg-white dark:bg-gray-900 rounded-3xl shadow-xl text-center border dark:border-gray-800"
                    >
                        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trophy className="w-10 h-10 text-blue-500" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Start Your Journey!</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Complete quizzes to earn points and appear on the leaderboard.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all"
                        >
                            <BookOpen className="w-5 h-5" />
                            Start Reading
                        </Link>
                    </motion.div>
                )}

                {/* Leaderboard */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Crown className="w-6 h-6 text-yellow-500" />
                        Top Learners
                    </h2>

                    <div className="space-y-3">
                        {leaderboard.slice(0, 10).map((entry, i) => (
                            <motion.div
                                key={entry.username}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${getRankBg(entry.rank, entry.isCurrentUser)}`}
                            >
                                <div className="flex-shrink-0">
                                    {getRankIcon(entry.rank)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className={`font-bold ${entry.isCurrentUser ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                                            {entry.username}
                                        </span>
                                        {entry.isCurrentUser && (
                                            <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">You</span>
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-3">
                                        <span className="flex items-center gap-1">
                                            <Target className="w-3 h-3" /> {entry.quizzesTaken} quizzes
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Flame className="w-3 h-3 text-orange-500" /> {entry.streak} days
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                        {entry.totalPoints.toLocaleString()}
                                    </div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider">points</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Recent Quizzes */}
                {recentQuizzes.length > 0 && (
                    <div>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Star className="w-6 h-6 text-yellow-500" />
                            Recent Quiz Results
                        </h2>

                        <div className="space-y-3">
                            {recentQuizzes.map((quiz, i) => (
                                <motion.div
                                    key={quiz.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800"
                                >
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                        quiz.percentage >= 80 ? 'bg-green-100 dark:bg-green-900/30 text-green-600' :
                                        quiz.percentage >= 50 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600' :
                                        'bg-red-100 dark:bg-red-900/30 text-red-600'
                                    }`}>
                                        <span className="text-lg font-bold">{quiz.percentage}%</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium truncate">{quiz.storyTitle}</div>
                                        <div className="text-sm text-gray-500">
                                            {quiz.questionsCorrect}/{quiz.totalQuestions} correct • {Math.floor(quiz.timeTaken / 60)}:{(quiz.timeTaken % 60).toString().padStart(2, '0')}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-blue-600">+{quiz.score}</div>
                                        <div className="text-xs text-gray-500">points</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
