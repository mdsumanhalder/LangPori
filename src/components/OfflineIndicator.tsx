'use client';

import { WifiOff } from 'lucide-react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { AnimatePresence, motion } from 'framer-motion';

export default function OfflineIndicator() {
    const { isOnline } = useNetworkStatus();

    return (
        <AnimatePresence>
            {!isOnline && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-amber-500 text-white dark:bg-amber-600 overflow-hidden"
                >
                    <div className="container mx-auto px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium">
                        <WifiOff className="w-4 h-4" />
                        <span>You are currently offline. Some features may be unavailable.</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
