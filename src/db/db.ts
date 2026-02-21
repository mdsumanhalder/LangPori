import Dexie, { type EntityTable } from 'dexie';

export interface Text {
    id: number;
    title: string;
    content: string;
    pdfBlob?: Blob;
    author?: string;
    isPublic?: boolean;
    language?: string;
    cefrLevel?: string;
    createdAt: number;
}

export interface Word {
    id: number;
    original: string;
    translation: string;
    context: string;
    language?: string;
    srsLevel: number;
    nextReview: number;
    createdAt: number;
}

export interface UserScore {
    id: number;
    username: string;
    totalPoints: number;
    quizzesTaken: number;
    storiesCompleted: number;
    gamesPlayed: number;
    highestQuizScore: number;
    currentStreak: number;
    lastActivityDate: number;
    createdAt: number;
    updatedAt: number;
}

export interface QuizResult {
    id: number;
    storyId: number;
    storyTitle: string;
    score: number;
    totalPoints: number;
    percentage: number;
    questionsCorrect: number;
    totalQuestions: number;
    timeTaken: number;
    completedAt: number;
}

type DbInstance = Dexie & {
    texts: EntityTable<Text, 'id'>;
    words: EntityTable<Word, 'id'>;
    userScores: EntityTable<UserScore, 'id'>;
    quizResults: EntityTable<QuizResult, 'id'>;
};

function createStubDb(): DbInstance {
    const noop = () => Promise.resolve();
    const empty = () => Promise.resolve([]);
    const stubTable = {
        toArray: empty,
        add: () => Promise.resolve(1),
        put: noop,
        update: noop,
        delete: noop,
        get: () => Promise.resolve(undefined),
        clear: noop,
        where: () => ({
            equals: () => ({
                sortBy: empty,
                toArray: empty,
            }),
        }),
    };
    return {
        texts: stubTable as unknown as EntityTable<Text, 'id'>,
        words: stubTable as unknown as EntityTable<Word, 'id'>,
        userScores: stubTable as unknown as EntityTable<UserScore, 'id'>,
        quizResults: stubTable as unknown as EntityTable<QuizResult, 'id'>,
        version: () => ({ stores: () => {} }),
        open: () => Promise.resolve(),
    } as unknown as DbInstance;
}

function createRealDb(): DbInstance {
    const d = new Dexie('LearnEestiDB') as DbInstance;
    d.version(6).stores({
        texts: '++id, title, createdAt, language',
        words: '++id, original, srsLevel, nextReview, createdAt, language',
        userScores: '++id, username, totalPoints, updatedAt',
        quizResults: '++id, storyId, score, completedAt',
    });
    return d;
}

const db: DbInstance =
    typeof window === 'undefined' ? createStubDb() : createRealDb();

// Helper functions for leaderboard
export async function getUserScore(): Promise<UserScore | undefined> {
    const scores = await db.userScores.toArray();
    return scores[0]; // Single user mode
}

/** Get all quiz results for a story (to detect replay). */
export async function getQuizResultsByStory(storyId: number): Promise<QuizResult[]> {
    return db.quizResults.where('storyId').equals(storyId).sortBy('completedAt');
}

export async function updateUserScore(points: number, isQuiz: boolean = true): Promise<void> {
    const existing = await getUserScore();
    const now = Date.now();
    
    if (existing) {
        const lastDate = new Date(existing.lastActivityDate).toDateString();
        const today = new Date(now).toDateString();
        const isConsecutiveDay = lastDate !== today;
        const newTotal = Math.max(0, existing.totalPoints + points);
        
        await db.userScores.update(existing.id, {
            totalPoints: newTotal,
            quizzesTaken: isQuiz ? existing.quizzesTaken + 1 : existing.quizzesTaken,
            highestQuizScore: isQuiz && points > 0 && points > existing.highestQuizScore ? points : existing.highestQuizScore,
            currentStreak: isConsecutiveDay ? existing.currentStreak + 1 : existing.currentStreak,
            lastActivityDate: now,
            updatedAt: now
        });
    } else {
        const initialPoints = Math.max(0, points);
        await db.userScores.add({
            id: 1,
            username: 'Player',
            totalPoints: initialPoints,
            quizzesTaken: isQuiz ? 1 : 0,
            storiesCompleted: 0,
            gamesPlayed: 0,
            highestQuizScore: initialPoints,
            currentStreak: 1,
            lastActivityDate: now,
            createdAt: now,
            updatedAt: now
        });
    }
}

export async function addQuizResult(result: Omit<QuizResult, 'id'>): Promise<void> {
    await db.quizResults.add(result as QuizResult);
}

export async function incrementStoriesCompleted(): Promise<void> {
    const existing = await getUserScore();
    if (existing) {
        await db.userScores.update(existing.id, {
            storiesCompleted: existing.storiesCompleted + 1,
            updatedAt: Date.now()
        });
    }
}

export async function incrementGamesPlayed(): Promise<void> {
    const existing = await getUserScore();
    if (existing) {
        await db.userScores.update(existing.id, {
            gamesPlayed: existing.gamesPlayed + 1,
            updatedAt: Date.now()
        });
    }
}

export { db };
