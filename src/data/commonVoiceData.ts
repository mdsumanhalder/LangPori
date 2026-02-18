// Common Voice Estonian Sample Data
// These sentences are curated for pronunciation practice, listening drills, and dictation
// Audio URLs will be replaced with actual Common Voice audio when available

export interface CommonVoiceSentence {
    id: string;
    text: string;           // Estonian text
    translation: string;    // English translation
    audioUrl?: string;      // Path to audio file (optional for now, we'll use TTS as fallback)
    level: 'A1' | 'A2' | 'B1';
    category: 'greeting' | 'question' | 'statement' | 'number' | 'daily';
    phonetics?: string;     // Phonetic transcription (optional)
}

export const commonVoiceSentences: CommonVoiceSentence[] = [
    // A1 Level - Basic Greetings & Phrases
    {
        id: 'cv-001',
        text: 'Tere! Kuidas läheb?',
        translation: 'Hello! How are you?',
        level: 'A1',
        category: 'greeting',
    },
    {
        id: 'cv-002',
        text: 'Mul läheb hästi, aitäh.',
        translation: 'I am fine, thank you.',
        level: 'A1',
        category: 'greeting',
    },
    {
        id: 'cv-003',
        text: 'Minu nimi on Anna.',
        translation: 'My name is Anna.',
        level: 'A1',
        category: 'statement',
    },
    {
        id: 'cv-004',
        text: 'Ma õpin eesti keelt.',
        translation: 'I am learning Estonian.',
        level: 'A1',
        category: 'statement',
    },
    {
        id: 'cv-005',
        text: 'Kus sa elad?',
        translation: 'Where do you live?',
        level: 'A1',
        category: 'question',
    },
    {
        id: 'cv-006',
        text: 'Ma elan Tallinnas.',
        translation: 'I live in Tallinn.',
        level: 'A1',
        category: 'statement',
    },
    {
        id: 'cv-007',
        text: 'Head aega!',
        translation: 'Goodbye!',
        level: 'A1',
        category: 'greeting',
    },
    {
        id: 'cv-008',
        text: 'Palun vabandust.',
        translation: 'Excuse me / I am sorry.',
        level: 'A1',
        category: 'greeting',
    },
    {
        id: 'cv-009',
        text: 'Üks kohv, palun.',
        translation: 'One coffee, please.',
        level: 'A1',
        category: 'daily',
    },
    {
        id: 'cv-010',
        text: 'Kui palju see maksab?',
        translation: 'How much does this cost?',
        level: 'A1',
        category: 'question',
    },

    // A2 Level - Intermediate Phrases
    {
        id: 'cv-011',
        text: 'Ma tahan tellida ühe pitsa.',
        translation: 'I want to order one pizza.',
        level: 'A2',
        category: 'daily',
    },
    {
        id: 'cv-012',
        text: 'Kas sa räägid inglise keelt?',
        translation: 'Do you speak English?',
        level: 'A2',
        category: 'question',
    },
    {
        id: 'cv-013',
        text: 'Ma ei saa aru.',
        translation: 'I don\'t understand.',
        level: 'A2',
        category: 'statement',
    },
    {
        id: 'cv-014',
        text: 'Palun räägi aeglasemalt.',
        translation: 'Please speak more slowly.',
        level: 'A2',
        category: 'statement',
    },
    {
        id: 'cv-015',
        text: 'Kus on lähim apteek?',
        translation: 'Where is the nearest pharmacy?',
        level: 'A2',
        category: 'question',
    },
    {
        id: 'cv-016',
        text: 'Ma otsin raamatupoodi.',
        translation: 'I am looking for a bookstore.',
        level: 'A2',
        category: 'statement',
    },
    {
        id: 'cv-017',
        text: 'Täna on ilus ilm.',
        translation: 'Today the weather is beautiful.',
        level: 'A2',
        category: 'statement',
    },
    {
        id: 'cv-018',
        text: 'Mis kell on?',
        translation: 'What time is it?',
        level: 'A2',
        category: 'question',
    },
    {
        id: 'cv-019',
        text: 'Kell on kolm.',
        translation: 'It is three o\'clock.',
        level: 'A2',
        category: 'number',
    },
    {
        id: 'cv-020',
        text: 'Ma lähen homme tööle.',
        translation: 'I am going to work tomorrow.',
        level: 'A2',
        category: 'statement',
    },

    // B1 Level - More Complex Sentences
    {
        id: 'cv-021',
        text: 'Ma tahaksin broneerida laua kahele.',
        translation: 'I would like to reserve a table for two.',
        level: 'B1',
        category: 'daily',
    },
    {
        id: 'cv-022',
        text: 'Kas te saaksite mulle aidata?',
        translation: 'Could you help me?',
        level: 'B1',
        category: 'question',
    },
    {
        id: 'cv-023',
        text: 'Ma olen Eestis esimest korda.',
        translation: 'This is my first time in Estonia.',
        level: 'B1',
        category: 'statement',
    },
    {
        id: 'cv-024',
        text: 'Mulle meeldib eesti kultuur väga.',
        translation: 'I like Estonian culture very much.',
        level: 'B1',
        category: 'statement',
    },
    {
        id: 'cv-025',
        text: 'Kuhu see buss sõidab?',
        translation: 'Where does this bus go?',
        level: 'B1',
        category: 'question',
    },
    {
        id: 'cv-026',
        text: 'Ma pean homme varakult ärkama.',
        translation: 'I have to wake up early tomorrow.',
        level: 'B1',
        category: 'statement',
    },
    {
        id: 'cv-027',
        text: 'Eesti on väga ilus maa.',
        translation: 'Estonia is a very beautiful country.',
        level: 'B1',
        category: 'statement',
    },
    {
        id: 'cv-028',
        text: 'Ma sooviksin võtta ühe tee.',
        translation: 'I would like to have a tea.',
        level: 'B1',
        category: 'daily',
    },
    {
        id: 'cv-029',
        text: 'Kas siin lähedal on pank?',
        translation: 'Is there a bank nearby?',
        level: 'B1',
        category: 'question',
    },
    {
        id: 'cv-030',
        text: 'Ma olen siin juba kaks nädalat.',
        translation: 'I have been here for two weeks already.',
        level: 'B1',
        category: 'statement',
    },
];

// Helper function to get sentences by level
export function getSentencesByLevel(level: 'A1' | 'A2' | 'B1' | 'ALL'): CommonVoiceSentence[] {
    if (level === 'ALL') return commonVoiceSentences;
    return commonVoiceSentences.filter(s => s.level === level);
}

// Helper function to get random sentences for quiz
export function getRandomSentences(count: number, excludeId?: string): CommonVoiceSentence[] {
    const available = excludeId
        ? commonVoiceSentences.filter(s => s.id !== excludeId)
        : commonVoiceSentences;

    const shuffled = [...available].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// Helper function to generate wrong answers for listening drill
export function getWrongTranslations(correctSentence: CommonVoiceSentence, count: number = 2): string[] {
    const others = commonVoiceSentences
        .filter(s => s.id !== correctSentence.id)
        .map(s => s.translation)
        .sort(() => Math.random() - 0.5);

    return others.slice(0, count);
}
