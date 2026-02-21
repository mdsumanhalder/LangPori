import { franc } from 'franc-min';
import nlp from 'compromise';

export interface QuizQuestion {
    id: string;
    type: 'multiple_choice' | 'true_false' | 'fill_blank';
    question: string;
    options?: string[];
    correctAnswer: string;
    explanation?: string;
    points: number;
}

export interface Quiz {
    title: string;
    questions: QuizQuestion[];
    totalPoints: number;
    timeLimit?: number; // in seconds
}

const langMap: Record<string, string> = {
    'eng': 'en', 'est': 'et', 'swe': 'sv', 'fin': 'fi', 'rus': 'ru',
    'deu': 'de', 'fra': 'fr', 'spa': 'es', 'ita': 'it', 'zlm': 'et',
    'nor': 'no', 'dan': 'da', 'nld': 'nl', 'por': 'pt', 'pol': 'pl',
};

function generateId(): string {
    return Math.random().toString(36).substring(2, 9);
}

function extractSentences(text: string, lang2: string, minLength: number = 30): string[] {
    let sentences: string[] = [];
    try {
        const segmenter = new Intl.Segmenter(lang2, { granularity: 'sentence' });
        sentences = Array.from(segmenter.segment(text))
            .map(s => s.segment.trim())
            .filter(s => s.length > minLength && s.length < 250);
    } catch {
        sentences = text.split(/[.!?]+/)
            .map(s => s.trim())
            .filter(s => s.length > minLength && s.length < 250);
    }
    return sentences;
}

function extractKeywords(text: string, lang3: string): string[] {
    const keywords: string[] = [];
    
    if (lang3 === 'eng') {
        try {
            const doc = nlp(text);
            const nouns = doc.nouns().out('array');
            const verbs = doc.verbs().out('array');
            keywords.push(...nouns.slice(0, 10), ...verbs.slice(0, 5));
        } catch {
            // Fallback
        }
    }
    
    if (keywords.length === 0) {
        const commonWords = new Set(['the', 'a', 'an', 'is', 'are', 'was', 'were', 'to', 'of', 'and', 'in', 'on', 'at', 'for', 'with', 'it', 'that', 'this', 'be', 'have', 'has', 'had']);
        const words = text.toLowerCase().split(/\s+/)
            .map(w => w.replace(/[.,!?;:()"\[\]]/g, ''))
            .filter(w => w.length > 4 && !commonWords.has(w));
        const uniqueWords = [...new Set(words)];
        keywords.push(...uniqueWords.slice(0, 15));
    }
    
    return keywords;
}

function createMultipleChoiceFromSentence(sentence: string, allKeywords: string[]): QuizQuestion | null {
    const words = sentence.split(/\s+/).map(w => w.replace(/[.,!?;:]/g, ''));
    const longWords = words.filter(w => w.length > 4);
    
    if (longWords.length === 0) return null;
    
    const targetWord = longWords[Math.floor(Math.random() * longWords.length)];
    const distractors = allKeywords
        .filter(k => k.toLowerCase() !== targetWord.toLowerCase() && Math.abs(k.length - targetWord.length) <= 3)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
    
    if (distractors.length < 2) return null;
    
    const escapedWord = targetWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const questionText = sentence.replace(new RegExp(`\\b${escapedWord}\\b`, 'i'), '_____');
    
    if (!questionText.includes('_____')) return null;
    
    const options = [targetWord, ...distractors].sort(() => Math.random() - 0.5);
    
    return {
        id: generateId(),
        type: 'multiple_choice',
        question: `Complete the sentence: "${questionText}"`,
        options,
        correctAnswer: targetWord,
        points: 10
    };
}

function createSimpleTrueFalseFromSentence(sentence: string): QuizQuestion {
    return {
        id: generateId(),
        type: 'true_false',
        question: `True or False: The following statement appears in the story - "${sentence.substring(0, 100)}${sentence.length > 100 ? '...' : ''}"`,
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'This statement is from the story.',
        points: 5
    };
}

function createTrueFalseQuestion(sentence: string, allSentences: string[]): QuizQuestion | null {
    const isTrue = Math.random() > 0.5;
    
    if (isTrue) {
        return createSimpleTrueFalseFromSentence(sentence);
    } else {
        // Create a false statement by modifying keywords
        const words = sentence.split(/\s+/);
        const longWordIdx = words.findIndex(w => w.replace(/[.,!?;:]/g, '').length > 4);
        
        if (longWordIdx === -1) return null;
        
        const otherSentence = allSentences.find(s => s !== sentence);
        if (!otherSentence) return null;
        
        const otherWords = otherSentence.split(/\s+/).filter(w => w.replace(/[.,!?;:]/g, '').length > 4);
        if (otherWords.length === 0) return null;
        
        const replacement = otherWords[Math.floor(Math.random() * otherWords.length)];
        const modifiedWords = [...words];
        modifiedWords[longWordIdx] = replacement;
        const falseSentence = modifiedWords.join(' ');
        
        return {
            id: generateId(),
            type: 'true_false',
            question: `True or False: The following statement appears in the story - "${falseSentence.substring(0, 100)}${falseSentence.length > 100 ? '...' : ''}"`,
            options: ['True', 'False'],
            correctAnswer: 'False',
            explanation: 'This statement has been modified and does not appear in the original story.',
            points: 5
        };
    }
}

function createVocabularyQuestion(keyword: string, allKeywords: string[]): QuizQuestion | null {
    const distractors = allKeywords
        .filter(k => k !== keyword)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
    
    if (distractors.length < 2) return null;
    
    const options = [keyword, ...distractors].sort(() => Math.random() - 0.5);
    
    return {
        id: generateId(),
        type: 'multiple_choice',
        question: `Which of these words appeared in the story?`,
        options,
        correctAnswer: keyword,
        points: 5
    };
}

function createComprehensionQuestion(sentence: string): QuizQuestion | null {
    // Extract subject and action for comprehension
    const words = sentence.split(/\s+/);
    if (words.length < 5) return null;
    
    // Simple pattern matching for who/what questions
    const patterns = [
        { regex: /^The\s+(\w+)/i, questionType: 'who/what' },
        { regex: /(\w+)\s+was\s+(\w+)/i, questionType: 'state' },
        { regex: /(\w+)\s+ran|walked|went|moved/i, questionType: 'action' }
    ];
    
    for (const pattern of patterns) {
        const match = sentence.match(pattern.regex);
        if (match) {
            const subject = match[1];
            const distractors = ['the rabbit', 'the tree', 'the wind', 'the sun', 'nobody']
                .filter(d => !d.includes(subject.toLowerCase()))
                .slice(0, 3);
            
            return {
                id: generateId(),
                type: 'multiple_choice',
                question: `Based on the story: "${sentence.substring(0, 80)}..." - What is this sentence mainly about?`,
                options: [`The ${subject}`, ...distractors].sort(() => Math.random() - 0.5),
                correctAnswer: `The ${subject}`,
                points: 15
            };
        }
    }
    
    return null;
}

export function generateQuiz(
    text: string,
    title: string,
    languageHint?: string,
    questionCount: number = 10
): Quiz {
    const questions: QuizQuestion[] = [];
    
    if (!text || text.trim().length < 50) {
        return {
            title: `Quiz: ${title}`,
            questions: [{
                id: generateId(),
                type: 'true_false',
                question: 'The text was too short to generate a meaningful quiz.',
                options: ['True', 'False'],
                correctAnswer: 'True',
                points: 5
            }],
            totalPoints: 5
        };
    }
    
    // Detect language
    let lang3 = '';
    let lang2 = '';
    
    if (languageHint && languageHint.length === 2) {
        lang2 = languageHint;
        lang3 = Object.keys(langMap).find(key => langMap[key] === languageHint) || 'und';
    } else {
        lang3 = franc(text);
        lang2 = langMap[lang3] || 'en';
    }
    
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    const minSentenceLength = wordCount < 225 ? 15 : 30;
    const sentences = extractSentences(text, lang2, minSentenceLength);
    const keywords = extractKeywords(text, lang3);
    
    console.log(`[QuizGenerator] Sentences: ${sentences.length}, Keywords: ${keywords.length}, target: ${questionCount}`);
    
    // Generate different types of questions; try at least questionCount attempts per category so we can hit the target
    const shuffledSentences = [...sentences].sort(() => Math.random() - 0.5);
    const nMult = Math.min(Math.max(4, questionCount), shuffledSentences.length);
    const nTf = Math.min(Math.max(3, questionCount), shuffledSentences.length);
    const nComp = Math.min(Math.max(2, questionCount), shuffledSentences.length);
    const shuffledKeywords = [...keywords].sort(() => Math.random() - 0.5);
    const nVocab = Math.min(Math.max(2, questionCount), shuffledKeywords.length);
    
    // 1. Multiple choice fill-in-blank
    for (let i = 0; i < nMult; i++) {
        const q = createMultipleChoiceFromSentence(shuffledSentences[i], keywords);
        if (q) questions.push(q);
    }
    
    // 2. True/False questions
    for (let i = 0; i < nTf; i++) {
        const q = createTrueFalseQuestion(shuffledSentences[i], sentences);
        if (q) questions.push(q);
    }
    
    // 3. Vocabulary questions
    for (let i = 0; i < nVocab; i++) {
        const q = createVocabularyQuestion(shuffledKeywords[i], keywords);
        if (q) questions.push(q);
    }
    
    // 4. Comprehension questions
    for (let i = 0; i < nComp; i++) {
        const q = createComprehensionQuestion(shuffledSentences[i]);
        if (q) questions.push(q);
    }
    
    // Pad to target with simple True/False from story sentences when we have too few
    while (questions.length < questionCount && shuffledSentences.length > 0) {
        const idx = questions.length % shuffledSentences.length;
        questions.push(createSimpleTrueFalseFromSentence(shuffledSentences[idx]));
    }
    
    // Shuffle and limit to exact target
    const finalQuestions = questions
        .sort(() => Math.random() - 0.5)
        .slice(0, questionCount);
    
    const totalPoints = finalQuestions.reduce((sum, q) => sum + q.points, 0);
    
    console.log(`[QuizGenerator] Generated ${finalQuestions.length} questions, total ${totalPoints} points`);
    
    return {
        title: `Quiz: ${title}`,
        questions: finalQuestions,
        totalPoints,
        timeLimit: finalQuestions.length * 30 // 30 seconds per question
    };
}

export function calculateQuizScore(
    answers: Record<string, string>,
    questions: QuizQuestion[]
): { score: number; total: number; correct: number; percentage: number } {
    let score = 0;
    let correct = 0;
    const total = questions.reduce((sum, q) => sum + q.points, 0);
    
    questions.forEach(q => {
        const userAnswer = answers[q.id];
        if (userAnswer && userAnswer.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()) {
            score += q.points;
            correct++;
        }
    });
    
    return {
        score,
        total,
        correct,
        percentage: total > 0 ? Math.round((score / total) * 100) : 0
    };
}
