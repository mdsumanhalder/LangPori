/**
 * Language-agnostic CEFR level detection (A1–C2).
 * Uses average sentence length and average word length only (no syllables),
 * so it works for any language.
 */

const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;
export type CEFRLevel = (typeof CEFR_LEVELS)[number];

/**
 * Maps a 0–100 ease score (higher = easier) to CEFR.
 */
function easeToCEFR(ease: number): CEFRLevel {
    if (ease >= 90) return 'A1';
    if (ease >= 80) return 'A2';
    if (ease >= 70) return 'B1';
    if (ease >= 60) return 'B2';
    if (ease >= 50) return 'C1';
    return 'C2';
}

const MIN_WORDS = 20;

/**
 * Segment text into sentences (language-agnostic: split on sentence-ending punctuation).
 */
function getSentences(text: string): string[] {
    return text
        .split(/[.!?]+/g)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
}

/**
 * Segment a string into words. Uses Intl.Segmenter when available for the given locale.
 */
function getWords(sentence: string, lang: string): string[] {
    const cleaned = sentence.replace(/\s+/g, ' ').trim();
    if (!cleaned) return [];
    try {
        const segmenter = new Intl.Segmenter(lang, { granularity: 'word' });
        return Array.from(segmenter.segment(cleaned))
            .filter((s) => s.isWordLike)
            .map((s) => s.segment.toLowerCase());
    } catch {
        return cleaned.split(/\s+/).filter(Boolean);
    }
}

/**
 * Language-agnostic ease score from 0–100 (higher = easier text).
 * Based on average sentence length (words) and average word length (chars).
 */
function computeEase(avgWordsPerSentence: number, avgCharsPerWord: number): number {
    // Reference: short sentences + short words = easy (A1/A2); long = hard (C1/C2).
    const ease =
        100 -
        3 * Math.max(0, avgWordsPerSentence - 6) -
        8 * Math.max(0, avgCharsPerWord - 4);
    return Math.max(0, Math.min(100, Math.round(ease)));
}

/**
 * Detect CEFR level from text. Works for any language.
 * Uses average sentence length and average word length only.
 * @param text - Full text to analyze
 * @param languageCode - Optional ISO 639-1 code (e.g. 'en', 'et') for better word segmentation
 */
function detectCEFRLevelSync(
    text: string,
    languageCode?: string
): CEFRLevel | null {
    const trimmed = text.trim();
    if (!trimmed) return null;

    const lang = languageCode && /^[a-z]{2}$/i.test(languageCode) ? languageCode : 'en';
    const sentences = getSentences(trimmed);
    if (sentences.length === 0) return null;

    let totalWords = 0;
    let totalChars = 0;

    for (const sent of sentences) {
        const words = getWords(sent, lang);
        totalWords += words.length;
        for (const w of words) {
            totalChars += w.replace(/[\s.,!?;:()"'\[\]]/g, '').length;
        }
    }

    if (totalWords < MIN_WORDS) return null;

    const avgWordsPerSentence = totalWords / sentences.length;
    const avgCharsPerWord = totalChars / totalWords;
    const ease = computeEase(avgWordsPerSentence, avgCharsPerWord);
    return easeToCEFR(ease);
}

/**
 * Detect CEFR level from text. Works for any language.
 * Returns a Promise for API compatibility with existing callers.
 */
export function detectCEFRLevel(
    text: string,
    languageCode?: string
): Promise<CEFRLevel | null> {
    return Promise.resolve(detectCEFRLevelSync(text, languageCode));
}
