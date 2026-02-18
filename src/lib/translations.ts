// Translation strings for the application
export const translations = {
    en: {
        // Home Page
        home: {
            welcome: "Welcome to LangPori",
            subtitle: "Master Estonian Language",
            description: "Your comprehensive platform for learning Estonian through interactive lessons, real-world sentences, and comprehensive exams.",
            yourProgress: "Your Progress",
            lessonsCompleted: "Lessons Completed",
            examsPassed: "Exams Passed",
            currentStreak: "Current Streak",
            days: "days",
            quickStart: "Quick Start",
            startLearning: "Start Learning",
            practiceSentences: "Practice Sentences",
            takeExam: "Take an Exam",
            exploreLessons: "Explore Lessons",
            examLevels: "Exam Levels",
            lessonLevels: "Lesson Levels",
            startExam: "Start Exam",
            viewLessons: "View Lessons",
        },
        // Lessons Page
        lessons: {
            title: "Lessons",
            selectLevel: "Select Level",
            noLessons: "No lessons found for",
            backToHome: "Back to Home",
            essentialVocab: "Essential Vocabulary",
            mostCommon: "Most Common Estonian Words",
        },
        // Sentences Page
        sentences: {
            title: "Sentence Practice",
            level: "Level",
            all: "All",
            direction: "Direction",
            etToEn: "Estonian → English",
            enToEt: "English → Estonian",
            showTranslation: "Show Translation",
            hideTranslation: "Hide Translation",
            shuffle: "Shuffle",
            reset: "Reset",
            markLearned: "Mark as Learned",
            learned: "Learned",
        },
        // Dictionary Page
        dictionary: {
            title: "Dictionary",
            searchPlaceholder: "Search Estonian or English words...",
            commonWords: "Common Words",
            searchResults: "Search Results",
            noResults: "No results found",
            loading: "Loading...",
            definitions: "Definitions",
            examples: "Examples",
        },
        // Exam Page
        exam: {
            title: "Exam",
            selectLevel: "Select Exam Level",
            startExam: "Start Exam",
            backToHome: "Back to Home",
            question: "Question",
            of: "of",
            submit: "Submit Answer",
            next: "Next Question",
            finish: "Finish Exam",
            results: "Exam Results",
            score: "Score",
            passed: "Passed",
            failed: "Failed",
            retake: "Retake Exam",
            viewLessons: "View Lessons",
        },
        // Common
        common: {
            back: "Back",
            home: "Home",
            lessons: "Lessons",
            sentences: "Sentences",
            dictionary: "Dictionary",
            exams: "Exams",
            beginner: "Beginner",
            elementary: "Elementary",
            intermediate: "Intermediate",
        }
    },
    et: {
        // Home Page
        home: {
            welcome: "Tere tulemast LangPori",
            subtitle: "Õpi Inglise Keelt",
            description: "Sinu põhjalik platvorm inglise keele õppimiseks läbi interaktiivsete õppetundide, reaalsete lausete ja põhjalike eksamite.",
            yourProgress: "Sinu Progress",
            lessonsCompleted: "Õppetunde Lõpetatud",
            examsPassed: "Eksameid Läbitud",
            currentStreak: "Praegune Seeria",
            days: "päeva",
            quickStart: "Kiire Algus",
            startLearning: "Alusta Õppimist",
            practiceSentences: "Harjuta Lauseid",
            takeExam: "Tee Eksam",
            exploreLessons: "Uuri Õppetunde",
            examLevels: "Eksami Tasemed",
            lessonLevels: "Õppetunni Tasemed",
            startExam: "Alusta Eksamit",
            viewLessons: "Vaata Õppetunde",
        },
        // Lessons Page
        lessons: {
            title: "Õppetunnid",
            selectLevel: "Vali Tase",
            noLessons: "Õppetunde ei leitud",
            backToHome: "Tagasi Koju",
            essentialVocab: "Oluline Sõnavara",
            mostCommon: "Kõige Levinumad Inglise Sõnad",
        },
        // Sentences Page
        sentences: {
            title: "Lausete Harjutamine",
            level: "Tase",
            all: "Kõik",
            direction: "Suund",
            etToEn: "Eesti → Inglise",
            enToEt: "Inglise → Eesti",
            showTranslation: "Näita Tõlget",
            hideTranslation: "Peida Tõlge",
            shuffle: "Sega",
            reset: "Lähtesta",
            markLearned: "Märgi Õpituks",
            learned: "Õpitud",
        },
        // Dictionary Page
        dictionary: {
            title: "Sõnaraamat",
            searchPlaceholder: "Otsi inglise või eesti sõnu...",
            commonWords: "Tavalised Sõnad",
            searchResults: "Otsingu Tulemused",
            noResults: "Tulemusi ei leitud",
            loading: "Laadimine...",
            definitions: "Definitsioonid",
            examples: "Näited",
        },
        // Exam Page
        exam: {
            title: "Eksam",
            selectLevel: "Vali Eksami Tase",
            startExam: "Alusta Eksamit",
            backToHome: "Tagasi Koju",
            question: "Küsimus",
            of: "/",
            submit: "Esita Vastus",
            next: "Järgmine Küsimus",
            finish: "Lõpeta Eksam",
            results: "Eksami Tulemused",
            score: "Skoor",
            passed: "Läbitud",
            failed: "Ebaõnnestunud",
            retake: "Tee Eksam Uuesti",
            viewLessons: "Vaata Õppetunde",
        },
        // Common
        common: {
            back: "Tagasi",
            home: "Kodu",
            lessons: "Õppetunnid",
            sentences: "Laused",
            dictionary: "Sõnaraamat",
            exams: "Eksamid",
            beginner: "Algaja",
            elementary: "Elementaarne",
            intermediate: "Keskmine",
        }
    }
};

export type Language = 'en' | 'et';

export function t(lang: Language, key: string): string {
    const keys = key.split('.');
    let value: any = translations[lang];

    for (const k of keys) {
        value = value?.[k];
    }

    return value || key;
}
