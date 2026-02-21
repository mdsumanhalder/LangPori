'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { BookOpen, Home, Trophy, MessageCircle, Book, Menu, X, Mic, Library } from 'lucide-react';
import { useState } from 'react';
import { LanguageSwitcher } from './LanguageSwitcher';

export default function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { name: 'Library', href: '/', icon: Library },
        { name: 'Vocabulary', href: '/vocabulary', icon: BookOpen },
        { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
        { name: 'Import', href: '/import', icon: Home },
    ];

    return (
        <nav className="sticky top-0 z-[60] w-full border-b border-white/20 bg-white/60 backdrop-blur-xl dark:bg-gray-900/60 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 group">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2"
                        >
                            <Image
                                src="/langpori-logo.png"
                                alt="LangPori"
                                width={32}
                                height={32}
                                className="rounded-lg shadow-lg shadow-teal-500/30"
                            />
                            <span className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 via-blue-600 to-indigo-600 dark:from-teal-400 dark:via-blue-400 dark:to-indigo-400 hidden xs:block">
                                LangPori
                            </span>
                        </motion.div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`relative px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 group ${isActive
                                            ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                                            : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                            }`}
                                    >
                                        <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'scale-110' : ''}`} />
                                        {item.name}
                                        {isActive && (
                                            <motion.div
                                                layoutId="navbar-indicator"
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full mx-3 mb-1.5"
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Desktop Language Switcher */}
                    <div className="hidden md:flex ml-4">
                        <LanguageSwitcher />
                    </div>

                    {/* Mobile Menu Button & Switcher */}
                    <div className="md:hidden flex items-center gap-2 sm:gap-3">
                        <LanguageSwitcher />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-1.5 sm:p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            {isOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Overlay */}
            <motion.div
                initial={false}
                animate={{
                    opacity: isOpen ? 1 : 0,
                    pointerEvents: isOpen ? 'auto' : 'none'
                }}
                className="md:hidden fixed inset-0 top-16 z-[60] bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800"
                style={{ height: 'calc(100vh - 4rem)' }}
            >
                <div className="flex flex-col p-4 space-y-2">
                    {navItems.map((item, index) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <motion.div
                                key={item.name}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{
                                    x: isOpen ? 0 : -20,
                                    opacity: isOpen ? 1 : 0
                                }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-4 px-4 py-4 rounded-xl text-lg font-medium transition-colors ${isActive
                                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                                        : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                        }`}
                                >
                                    <div className={`p-3 rounded-xl ${isActive ? 'bg-white/50 dark:bg-black/20' : 'bg-gray-100/50 dark:bg-gray-800/50'}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    {item.name}
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>
        </nav >
    );
}
