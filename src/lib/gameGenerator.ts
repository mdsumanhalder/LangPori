import { franc } from 'franc-min';
import nlp from 'compromise';

export interface GameExercise {
    type: 'matching' | 'reorder' | 'fill' | 'translation';
    question: string;
    answer: string | string[];
    options?: string[];
    context?: string;
}

export interface StoryGame {
    title: string;
    exercises: GameExercise[];
    detectedLanguage?: string;
}

// Map franc's 3-letter codes to 2-letter codes for Intl.Segmenter
const langMap: Record<string, string> = {
    'eng': 'en',
    'est': 'et',
    'swe': 'sv',
    'fin': 'fi',
    'rus': 'ru',
    'deu': 'de',
    'fra': 'fr',
    'spa': 'es',
    'ita': 'it',
    'zlm': 'et',
    'nor': 'no',
    'dan': 'da',
    'nld': 'nl',
    'por': 'pt',
    'pol': 'pl',
};

// Helper: Extract unique words from text
function extractUniqueWords(text: string, lang2: string): string[] {
    let words: string[] = [];
    try {
        const wordSegmenter = new Intl.Segmenter(lang2, { granularity: 'word' });
        const segments = wordSegmenter.segment(text);
        words = Array.from(segments)
            .filter(s => s.isWordLike)
            .map(s => s.segment.toLowerCase());
    } catch {
        words = text.toLowerCase().split(/\s+/).map(w => w.replace(/[.,!?;:()"\[\]]/g, ''));
    }
    
    // Filter to meaningful words and deduplicate
    const uniqueWords = [...new Set(words.filter(w => w.length >= 3 && !/^\d+$/.test(w)))];
    return uniqueWords;
}

// Helper: Generate word scramble exercise
function createWordScramble(word: string): GameExercise {
    const letters = word.split('');
    const scrambled = [...letters].sort(() => Math.random() - 0.5);
    // Make sure it's actually scrambled
    if (scrambled.join('') === word && word.length > 2) {
        const temp = scrambled[0];
        scrambled[0] = scrambled[scrambled.length - 1];
        scrambled[scrambled.length - 1] = temp;
    }
    return {
        type: 'reorder',
        question: `Unscramble this word: "${scrambled.join(' ')}"`,
        answer: letters,
        options: scrambled
    };
}

// Helper: Generate multiple choice word recognition
function createWordRecognition(targetWord: string, allWords: string[]): GameExercise | null {
    // Get 3 random distractor words (similar length)
    const targetLen = targetWord.length;
    const distractors = allWords
        .filter(w => w !== targetWord && Math.abs(w.length - targetLen) <= 2)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
    
    if (distractors.length < 2) return null;
    
    const options = [targetWord, ...distractors].sort(() => Math.random() - 0.5);
    
    return {
        type: 'matching',
        question: `Which word appeared in the story?`,
        answer: targetWord,
        options,
        context: targetWord
    };
}

/** Target number of game questions: 10 if text has 225+ words, else 5. */
export function getGameQuestionCount(wordCount: number): number {
    return wordCount >= 225 ? 10 : 5;
}

export function generateGameContent(
    text: string,
    title: string,
    savedWords: { original: string, translation: string }[] = [],
    languageHint?: string,
    targetCount: number = 10
): StoryGame {
    const exercises: GameExercise[] = [];

    // Handle empty or very short text
    if (!text || text.trim().length < 20) {
        console.warn('[GameGenerator] Text too short, generating minimal game');
        return {
            title: `Learn from: ${title}`,
            exercises: [{
                type: 'fill',
                question: 'The story was too short to generate exercises. Try reading a longer text!',
                answer: 'practice',
                options: ['practice', 'skip', 'continue', 'learn']
            }],
            detectedLanguage: 'und'
        };
    }

    // 1. Detect/Set Language
    let lang3 = "";
    let lang2 = "";

    if (languageHint && languageHint.length === 2) {
        lang2 = languageHint;
        lang3 = Object.keys(langMap).find(key => langMap[key] === languageHint) || 'und';
    } else {
        lang3 = franc(text);
        lang2 = langMap[lang3] || 'en';
    }

    console.log(`[GameGenerator] Context - Hint: ${languageHint}, L2: ${lang2}, L3: ${lang3}, Text length: ${text.length}`);

    // 2. Extract all unique words from text (for generating exercises)
    const allUniqueWords = extractUniqueWords(text, lang2);
    console.log(`[GameGenerator] Extracted ${allUniqueWords.length} unique words`);

    // 3. Intelligent Sentence Splitting
    let sentences: string[] = [];
    try {
        const sentenceSegmenter = new Intl.Segmenter(lang2, { granularity: 'sentence' });
        const segments = sentenceSegmenter.segment(text);
        sentences = Array.from(segments)
            .map(s => s.segment.trim())
            .filter(s => s.length > 15 && s.length < 200); // Slightly relaxed constraints
    } catch {
        sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 15 && s.length < 200);
    }

    // Also try splitting by newlines if we don't have enough sentences
    if (sentences.length < 3) {
        const lineSentences = text.split(/\n+/)
            .map(s => s.trim())
            .filter(s => s.length > 15 && s.length < 200);
        sentences = [...sentences, ...lineSentences];
    }

    console.log(`[GameGenerator] Found ${sentences.length} suitable sentences`);

    // 4. Vocabulary Matching (from saved Flashcards)
    if (savedWords.length >= 2) {
        const vocabToMatch = [...savedWords].sort(() => Math.random() - 0.5).slice(0, 5);
        vocabToMatch.forEach(word => {
            exercises.push({
                type: 'matching',
                question: word.original,
                answer: word.translation,
                options: vocabToMatch.map(w => w.translation).sort(() => Math.random() - 0.5)
            });
        });
    }

    // 5. Word Recognition from Story (auto-generated vocabulary)
    if (allUniqueWords.length >= 6) {
        const longWords = allUniqueWords.filter(w => w.length >= 5).slice(0, 10);
        const wordsForRecognition = longWords.sort(() => Math.random() - 0.5).slice(0, 3);
        
        wordsForRecognition.forEach(word => {
            const exercise = createWordRecognition(word, allUniqueWords);
            if (exercise) exercises.push(exercise);
        });
    }

    // 6. Word Scramble (letter unscrambling)
    const scrambleWords = allUniqueWords
        .filter(w => w.length >= 4 && w.length <= 10)
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);
    
    scrambleWords.forEach(word => {
        exercises.push(createWordScramble(word));
    });

    // 7. Sentence Reordering (Syntactic Logic)
    if (sentences.length > 0) {
        const reorderSentences = [...sentences].sort(() => Math.random() - 0.5).slice(0, 3);
        reorderSentences.forEach(sentence => {
            let words: string[] = [];
            try {
                const wordSegmenter = new Intl.Segmenter(lang2, { granularity: 'word' });
                const segments = wordSegmenter.segment(sentence);
                words = Array.from(segments)
                    .filter(s => s.isWordLike)
                    .map(s => s.segment);
            } catch {
                words = sentence.split(/\s+/).map(w => w.replace(/[.,!?;:]/g, '')).filter(w => w.length > 0);
            }

            if (words.length >= 4 && words.length <= 15) {
                exercises.push({
                    type: 'reorder',
                    question: `Arrange these words to form a sentence:`,
                    answer: words,
                    options: [...words].sort(() => Math.random() - 0.5),
                    context: sentence
                });
            }
        });
    }

    // 8. Smart Fill-in-the-blank (Contextual Recall)
    if (sentences.length > 0) {
        const usedSentences = new Set<string>();
        const fillSentences = sentences
            .filter(s => !usedSentences.has(s))
            .sort(() => Math.random() - 0.5)
            .slice(0, 4);

        fillSentences.forEach(sentence => {
            let targetWord = "";

            // Strategy A: For English, use POS tagging (compromise)
            if (lang3 === 'eng') {
                try {
                    const doc = nlp(sentence);
                    const candidates = doc.nouns().concat(doc.verbs()).out('array');
                    if (candidates.length > 0) {
                        targetWord = candidates[Math.floor(Math.random() * candidates.length)];
                    }
                } catch {
                    // Fall through to strategy B
                }
            }

            // Strategy B: Fallback - pick a meaningful word (not too common)
            if (!targetWord) {
                const commonWords = new Set(['the', 'a', 'an', 'is', 'are', 'was', 'were', 'to', 'of', 'and', 'in', 'on', 'at', 'for', 'with', 'it', 'that', 'this', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can']);
                const words = sentence.split(/\s+/).map(w => w.replace(/[.,!?;:()"\[\]]/g, ''));
                const candidates = words.filter(w => w.length > 3 && !commonWords.has(w.toLowerCase()));
                if (candidates.length > 0) {
                    targetWord = candidates[Math.floor(Math.random() * candidates.length)];
                }
            }

            if (targetWord && targetWord.length > 2) {
                const escapedWord = targetWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(`\\b${escapedWord}\\b`, 'i');
                const question = sentence.replace(regex, '_____');

                if (question.includes('_____') && question !== sentence) {
                    exercises.push({
                        type: 'fill',
                        question,
                        answer: targetWord,
                        context: sentence
                    });
                }
            }
        });
    }

    // 9. Ensure we always have at least some exercises
    if (exercises.length === 0) {
        console.warn('[GameGenerator] No exercises generated, creating fallback');
        
        // Create at least one word scramble if we have any words
        if (allUniqueWords.length > 0) {
            const word = allUniqueWords.find(w => w.length >= 4) || allUniqueWords[0];
            exercises.push(createWordScramble(word));
        }
        
        // Create a simple fill exercise
        if (sentences.length > 0) {
            const sentence = sentences[0];
            const words = sentence.split(/\s+/);
            if (words.length > 2) {
                const targetIdx = Math.floor(words.length / 2);
                const targetWord = words[targetIdx].replace(/[.,!?;:]/g, '');
                exercises.push({
                    type: 'fill',
                    question: words.map((w, i) => i === targetIdx ? '_____' : w).join(' '),
                    answer: targetWord,
                    context: sentence
                });
            }
        }
    }

    let result = exercises.sort(() => Math.random() - 0.5);
    if (result.length > targetCount) result = result.slice(0, targetCount);
    // Pad to targetCount when we have enough words
    const usedWords = new Set(result.map(e => (Array.isArray(e.answer) ? e.answer.join('') : String(e.answer)).toLowerCase()));
    while (result.length < targetCount && allUniqueWords.length > 0) {
        const word = allUniqueWords.find(w => w.length >= 3 && !usedWords.has(w));
        if (!word) break;
        usedWords.add(word);
        result.push(createWordScramble(word));
    }
    console.log(`[GameGenerator] Generated ${exercises.length} exercises, game has ${result.length} questions (target: ${targetCount})`);

    return {
        title: `Learn from: ${title}`,
        exercises: result,
        detectedLanguage: lang3
    };
}
