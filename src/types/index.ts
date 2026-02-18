// Lesson and vocabulary types
export interface WordTranslation {
    word: string;
    translation: string;
    pronunciation?: string;
    grammar?: string;
    example?: string;
    exampleTranslation?: string;
    cases?: {
        nimetav: string;        // Nominative (kes? mis?) - who? what?
        nimetavExample: string;
        nimetavExampleEn: string;
        omastav: string;        // Genitive (kelle? mille?) - whose? of what?
        omastavExample: string;
        omastavExampleEn: string;
        osastav: string;        // Partitive (keda? mida?) - whom? what? (partial)
        osastavExample: string;
        osastavExampleEn: string;
    };
}

export interface CategoryContent {
    category: string;
    words: WordTranslation[];
}

export interface LessonContent {
    word?: string;
    translation?: string;
    pronunciation?: string;
    category?: string;
    words?: WordTranslation[];
}

export interface Lesson {
    id: number;
    title: string;
    level: string;
    language: string;
    description?: string;
    content: LessonContent[];
}

// Exam types
export interface ExamQuestion {
    id: string;
    type: 'multiple-choice' | 'fill-blank' | 'speaking' | 'listening' | 'writing' | 'reading';
    question: string;
    options?: string[];
    correctAnswer: string;
    audioUrl?: string;
    imageUrl?: string;
    userAnswer?: string;
    isCorrect?: boolean;
}

export interface ExamResult {
    totalQuestions: number;
    correctAnswers: number;
    percentage: number;
    timeSpent: number;
    completedAt: string; // ISO string format for Redux serialization
    level?: string;
    sections: {
        grammar: number;
        reading: number;
        writing: number;
        listening: number;
        speaking: number;
    };
}

// User progress types
export interface UserProgress {
    lessonsCompleted: number[];
    examResults: ExamResult[];
    totalStudyTime: number;
    currentStreak: number;
    lastStudyDate: string;
}

// UI helper types
export interface ExamLevel {
    level: string;
    title: string;
    description: string;
    color: string;
    icon: string;
    route: string;
    difficulty: string;
}

export interface LessonLevelCard {
    level: string;
    title: string;
    description: string;
    color: string;
    icon: string;
    count: number;
}

export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
    userAnswer?: string;
    isCorrect?: boolean;
}

export enum LearningMode {
    GRAMMAR = 'grammar',
    READING = 'reading',
    WRITING = 'writing',
    LISTENING = 'listening',
    SPEAKING = 'speaking',
    EXAM = 'exam'
}

// Data types for MVP features
export interface FrequencyWord {
    rank: number;
    word: string;
    translation: string;
    partOfSpeech: string;
}

export interface Sentence {
    id: number;
    estonian: string;
    english: string;
    level: 'A1' | 'A2' | 'B1';
}

export interface WiktionaryDefinition {
    partOfSpeech: string;
    definition: string;
    examples?: string[];
}

export interface WiktionaryResult {
    word: string;
    language: string;
    pronunciation?: string;
    definitions: WiktionaryDefinition[];
    error?: string;
}

// Podcast types
export interface TranscriptSegment {
    id: number;
    startTime: number;  // in seconds
    endTime: number;    // in seconds
    estonian: string;   // Estonian text
    english: string;    // English translation
}

export interface Podcast {
    id: number;
    title: string;
    titleEn: string;
    description: string;
    descriptionEn: string;
    level: 'A1' | 'A2' | 'B1';
    duration: number;   // in seconds
    audioUrl: string;   // mp3 URL
    thumbnailUrl?: string;
    transcript: TranscriptSegment[];
}
