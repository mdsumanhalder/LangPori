import Dexie, { type EntityTable } from 'dexie';

interface Text {
    id: number;
    title: string;
    content: string;
    pdfBlob?: Blob; // Store original PDF for Book Mode
    createdAt: number;
}

interface Word {
    id: number;
    original: string;
    translation: string;
    context: string;
    srsLevel: number;
    nextReview: number;
    createdAt: number;
}

const db = new Dexie('LearnEestiDB') as Dexie & {
    texts: EntityTable<Text, 'id'>,
    words: EntityTable<Word, 'id'>
};

// Schema declaration:
db.version(3).stores({
    texts: '++id, title, createdAt',
    words: '++id, original, srsLevel, nextReview, createdAt'
});

export { db };
export type { Text, Word };
