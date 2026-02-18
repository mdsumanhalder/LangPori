import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExamResult, UserProgress } from '@/types';

const initialState: UserProgress = {
    lessonsCompleted: [],
    examResults: [],
    totalStudyTime: 0,
    currentStreak: 0,
    lastStudyDate: new Date().toISOString().split('T')[0],
};

// Sanitize exam results to ensure completedAt is always a string
const sanitizeExamResults = (results: ExamResult[]): ExamResult[] => {
    if (!Array.isArray(results)) return [];

    return results.map(result => {
        // Handle various types of completedAt values
        let completedAtStr: string;
        const completedAt = result.completedAt as unknown;

        if (typeof completedAt === 'string') {
            completedAtStr = completedAt;
        } else if (completedAt && typeof completedAt === 'object' && 'toISOString' in completedAt) {
            completedAtStr = (completedAt as Date).toISOString();
        } else {
            completedAtStr = new Date().toISOString();
        }

        return {
            ...result,
            completedAt: completedAtStr,
        };
    });
};

// Load initial state from localStorage if available
const loadInitialState = (): UserProgress => {
    if (typeof window === 'undefined') return initialState;

    try {
        const saved = localStorage.getItem('userProgress');
        if (saved) {
            const parsed = JSON.parse(saved);

            // Sanitize the data to ensure all values are serializable
            return {
                lessonsCompleted: Array.isArray(parsed.lessonsCompleted) ? parsed.lessonsCompleted : [],
                examResults: sanitizeExamResults(parsed.examResults || []),
                totalStudyTime: typeof parsed.totalStudyTime === 'number' ? parsed.totalStudyTime : 0,
                currentStreak: typeof parsed.currentStreak === 'number' ? parsed.currentStreak : 0,
                lastStudyDate: typeof parsed.lastStudyDate === 'string' ? parsed.lastStudyDate : new Date().toISOString().split('T')[0],
            };
        }
    } catch (error) {
        console.error('Failed to load progress from localStorage:', error);
        // Clear corrupted data
        localStorage.removeItem('userProgress');
    }
    return initialState;
};

const progressSlice = createSlice({
    name: 'progress',
    initialState: loadInitialState(),
    reducers: {
        setProgress: (state, action: PayloadAction<UserProgress>) => {
            return action.payload;
        },
        markLessonComplete: (state, action: PayloadAction<number>) => {
            if (!state.lessonsCompleted.includes(action.payload)) {
                state.lessonsCompleted.push(action.payload);
                saveToLocalStorage(state);
            }
        },
        saveExamResult: (state, action: PayloadAction<ExamResult>) => {
            // Ensure completedAt is a string
            const sanitizedResult: ExamResult = {
                ...action.payload,
                completedAt: typeof action.payload.completedAt === 'string'
                    ? action.payload.completedAt
                    : new Date().toISOString(),
            };
            state.examResults.push(sanitizedResult);
            saveToLocalStorage(state);
        },
        updateStudyTime: (state, action: PayloadAction<number>) => {
            state.totalStudyTime += action.payload;
            saveToLocalStorage(state);
        },
        updateStreak: (state) => {
            const today = new Date().toISOString().split('T')[0];
            const lastDate = state.lastStudyDate;

            if (lastDate === today) {
                return; // Already studied today
            }

            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            if (lastDate === yesterdayStr) {
                state.currentStreak += 1;
            } else {
                state.currentStreak = 1; // Reset streak
            }

            state.lastStudyDate = today;
            saveToLocalStorage(state);
        },
        resetProgress: () => {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('userProgress');
            }
            return { ...initialState };
        },
    },
});

// Helper to persist state
function saveToLocalStorage(state: UserProgress): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem('userProgress', JSON.stringify(state));
    }
}

export const {
    setProgress,
    markLessonComplete,
    saveExamResult,
    updateStudyTime,
    updateStreak,
    resetProgress,
} = progressSlice.actions;

export default progressSlice.reducer;
