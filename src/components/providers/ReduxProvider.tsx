'use client';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { setNativeLanguage, setTargetLanguage } from '@/store/settingsSlice';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Load settings
        const stored = localStorage.getItem('language-settings');
        if (stored) {
            try {
                const { native, target } = JSON.parse(stored);
                if (native) store.dispatch(setNativeLanguage(native));
                if (target) store.dispatch(setTargetLanguage(target));
            } catch (e) {
                console.error('Failed to parse language settings', e);
            }
        }

        // Save settings on change
        const unsubscribe = store.subscribe(() => {
            const state = store.getState();
            localStorage.setItem('language-settings', JSON.stringify({
                native: state.settings.nativeLanguage,
                target: state.settings.targetLanguage
            }));
        });

        return () => unsubscribe();
    }, []);

    return <Provider store={store}>{children}</Provider>;
}
