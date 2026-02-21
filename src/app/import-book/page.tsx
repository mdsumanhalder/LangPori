'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Redirect /import-book to Import page with Books tab selected.
 * The main Import page now has tabs: Import Texts | Import Books.
 */
export default function ImportBookPage() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/import?tab=books');
    }, [router]);
    return null;
}
