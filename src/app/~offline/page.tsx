'use client';

import { WifiOff } from "lucide-react";
import Link from "next/link";




export default function OfflinePage() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
            <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
                <WifiOff className="w-12 h-12 text-gray-500 dark:text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold mb-2">You are offline</h1>
            <p className="text-muted-foreground mb-8 max-w-md">
                It seems you have lost your internet connection. Some features may be unavailable until you reconnect.
            </p>
            <div className="flex gap-4">
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                >
                    Retry
                </button>
                <Link
                    href="/"
                    className="px-6 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-medium hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
}
