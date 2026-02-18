import { NextRequest, NextResponse } from 'next/server';
import { WiktionaryResult, WiktionaryDefinition } from '@/types';

// Wiktionary API proxy to fetch word definitions
// Handles CORS issues with client-side fetch

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const word = searchParams.get('word');
    const lang = searchParams.get('lang') || 'et'; // Default to Estonian

    if (!word) {
        return NextResponse.json(
            { error: 'Word parameter is required' },
            { status: 400 }
        );
    }

    try {
        // Use the English Wiktionary API to look up Estonian words
        const wiktionaryUrl = `https://en.wiktionary.org/w/api.php?action=query&titles=${encodeURIComponent(word)}&prop=extracts&format=json&origin=*`;

        const response = await fetch(wiktionaryUrl);

        if (!response.ok) {
            throw new Error('Failed to fetch from Wiktionary');
        }

        const data = await response.json();
        const pages = data.query?.pages;

        if (!pages) {
            return NextResponse.json({
                word,
                language: lang === 'et' ? 'Estonian' : 'English',
                definitions: [],
                error: 'No results found'
            } as WiktionaryResult);
        }

        const pageId = Object.keys(pages)[0];
        const page = pages[pageId];

        // Check if page exists
        if (pageId === '-1' || !page.extract) {
            return NextResponse.json({
                word,
                language: lang === 'et' ? 'Estonian' : 'English',
                definitions: [],
                error: 'Word not found in Wiktionary'
            } as WiktionaryResult);
        }

        // Parse the extract to get definitions
        const definitions = parseWiktionaryExtract(page.extract, lang);

        const result: WiktionaryResult = {
            word,
            language: lang === 'et' ? 'Estonian' : 'English',
            definitions
        };

        return NextResponse.json(result);
    } catch (error) {
        console.error('Wiktionary API error:', error);
        return NextResponse.json(
            {
                word,
                language: lang === 'et' ? 'Estonian' : 'English',
                definitions: [],
                error: 'Failed to fetch word definition'
            } as WiktionaryResult,
            { status: 500 }
        );
    }
}

// Parse Wiktionary HTML extract to extract definitions
function parseWiktionaryExtract(html: string, targetLang: string): WiktionaryDefinition[] {
    const definitions: WiktionaryDefinition[] = [];

    // Simple parsing - look for Estonian section
    const langSection = targetLang === 'et' ? 'Estonian' : 'English';

    // Remove HTML tags for simpler parsing
    const text = html
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    // Try to extract definitions from text
    // This is a simplified parser - Wiktionary has complex structure
    if (text.includes(langSection)) {
        // Extract the section after the language header
        const parts = text.split(langSection);
        if (parts.length > 1) {
            const sectionText = parts[1].substring(0, 500); // Take first 500 chars

            // Look for common parts of speech
            const partsOfSpeech = ['Noun', 'Verb', 'Adjective', 'Adverb', 'Pronoun', 'Preposition'];

            for (const pos of partsOfSpeech) {
                if (sectionText.includes(pos)) {
                    const posIndex = sectionText.indexOf(pos);
                    const defText = sectionText.substring(posIndex, posIndex + 200);

                    definitions.push({
                        partOfSpeech: pos.toLowerCase(),
                        definition: defText.substring(pos.length).trim().split('.')[0] || 'Definition available on Wiktionary',
                        examples: []
                    });
                    break; // Take first match
                }
            }
        }
    }

    // Fallback if no definitions found
    if (definitions.length === 0) {
        definitions.push({
            partOfSpeech: 'unknown',
            definition: 'See Wiktionary for full definition',
            examples: []
        });
    }

    return definitions;
}
