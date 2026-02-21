import { NextRequest, NextResponse } from 'next/server';
import { getStaticFallbackForLanguage } from '@/lib/sampleStories';

/**
 * Map app language codes (ISO 639-1 / custom) to Tatoeba ISO 639-3.
 * Tatoeba uses 3-letter codes: https://tatoeba.org/en/sentences/index
 */
const LANG_TO_TATOEBA: Record<string, string> = {
    en: 'eng', et: 'est', es: 'spa', fr: 'fra', de: 'deu', it: 'ita', pt: 'por',
    ru: 'rus', nl: 'nld', pl: 'pol', ja: 'jpn', ko: 'kor', zh: 'cmn', 'zh-CN': 'cmn', 'zh-TW': 'cmn',
    ar: 'ara', hi: 'hin', tr: 'tur', vi: 'vie', th: 'tha', id: 'ind', ms: 'zsm',
    sv: 'swe', da: 'dan', no: 'nob', fi: 'fin', el: 'ell', he: 'heb', iw: 'heb',
    hu: 'hun', ro: 'ron', cs: 'ces', sk: 'slk', bg: 'bul', uk: 'ukr', hr: 'hrv',
    sr: 'srp', sl: 'slv', lt: 'lit', lv: 'lav', eo: 'epo', af: 'afr', sq: 'sqi',
    hy: 'hye', az: 'aze', eu: 'eus', be: 'bel', bn: 'ben', ca: 'cat', ny: 'nya',
    co: 'cos', fy: 'fry', gl: 'glg', ka: 'kat', gu: 'guj', ht: 'hat', ha: 'hau',
    haw: 'haw', is: 'isl', ig: 'ibo', ga: 'gle', jw: 'jav', kn: 'kan', kk: 'kaz',
    km: 'khm', ku: 'kur', ky: 'kir', lo: 'lao', la: 'lat', lb: 'ltz', mk: 'mkd',
    mg: 'mlg', ml: 'mal', mt: 'mlt', mi: 'mri', mr: 'mar', mn: 'mon', my: 'mya',
    ne: 'nep', ps: 'pus', fa: 'pes', pa: 'pan', sm: 'smo', gd: 'gla', st: 'sot',
    sn: 'sna', sd: 'snd', si: 'sin', so: 'som', su: 'sun', sw: 'swa', tg: 'tgk',
    ta: 'tam', te: 'tel', uz: 'uzb', ur: 'urd', cy: 'cym', xh: 'xho', yi: 'yid',
    yo: 'yor', zu: 'zul', tl: 'tgl', ceb: 'ceb', hmn: 'hmn', am: 'amh',
};

const SENTENCES_MIN = 12;
const SENTENCES_MAX = 55;
const TATOEBA_LIMIT = 60;
const TATOEBA_BASE = 'https://tatoeba.org/eng/api_v0/search';

/** Common short word per language so Tatoeba returns sentences. Required by their search API. */
const QUERY_BY_LANG: Record<string, string> = {
    eng: 'the', est: 'on', spa: 'el', fra: 'le', deu: 'der', ita: 'il', por: 'o', rus: 'и', nld: 'de',
    pol: 'i', jpn: 'の', kor: '이', cmn: '的', ara: 'في', hin: 'है', tur: 've', vie: 'là', tha: 'ที่',
    ind: 'yang', swe: 'är', dan: 'er', nob: 'er', fin: 'on', ell: 'το', heb: 'הוא', hun: 'a',
    ron: 'și', ces: 'je', slk: 'je', bul: 'е', ukr: 'в', hrv: 'je', srp: 'је', slv: 'je',
    lit: 'yra', lav: 'ir', epo: 'estas',
    ben: 'আমি',  // Bengali: I
    kat: 'არის',  // Georgian
    hye: 'է',    // Armenian
    aze: 'var',  // Azerbaijani
    bel: 'і',    // Belarusian
    cat: 'el',   // Catalan
    eus: 'da',   // Basque
    gle: 'an',   // Irish
    guj: 'છે',   // Gujarati
    hat: 'se',   // Haitian Creole
    hau: 'da',   // Hausa
    isl: 'er',   // Icelandic
    ibo: 'na',   // Igbo
    jav: 'ing',  // Javanese
    kan: 'ಒಂದು', // Kannada
    kaz: 'және', // Kazakh
    khm: 'គាត់', // Khmer
    kur: 'û',    // Kurdish
    kir: 'мен',  // Kyrgyz
    lao: 'ແມ່ນ', // Lao
    lat: 'est',  // Latin
    ltz: 'et',   // Luxembourgish
    mkd: 'и',    // Macedonian
    mal: 'അവൻ', // Malayalam
    mlt: 'hu',   // Maltese
    mri: 'te',   // Maori
    mar: 'आहे',  // Marathi
    mon: 'байна', // Mongolian
    mya: 'သည်',  // Burmese
    nep: 'छ',    // Nepali
    pes: 'است', // Persian
    pan: 'ਹੈ',   // Punjabi
    gla: 'an',   // Scots Gaelic
    sin: 'ඔහු', // Sinhala
    som: 'waa',  // Somali
    sun: 'teh',  // Sundanese
    swa: 'ni',   // Swahili
    tgk: 'аст',  // Tajik
    tam: 'ஒரு',  // Tamil
    tel: 'ఒక',   // Telugu
    uzb: 'bu',   // Uzbek
    urd: 'ہے',   // Urdu
};
const DEFAULT_QUERY = 'on';

export async function GET(request: NextRequest) {
    const lang = request.nextUrl.searchParams.get('lang') || 'en';
    const lang3 = LANG_TO_TATOEBA[lang] || (lang.length === 3 ? lang : lang.slice(0, 3));
    const limit = TATOEBA_LIMIT;
    const page = Math.max(1, Math.floor(Math.random() * 60) + 1);
    const query = QUERY_BY_LANG[lang3] ?? DEFAULT_QUERY;

    const headers = {
        'Accept': 'application/json',
        'User-Agent': 'LearnByReading/1.0 (https://github.com/learn-by-reading)',
    };

    async function fetchPage(p: number): Promise<string[]> {
        const url = `${TATOEBA_BASE}?from=${lang3}&query=${encodeURIComponent(query)}&limit=${limit}&page=${p}`;
        const res = await fetch(url, { headers });
        if (!res.ok) return [];
        try {
            const data = (await res.json()) as { results?: { text?: string }[] };
            const results = data?.results ?? [];
            return results.map((r) => r?.text?.trim()).filter(Boolean) as string[];
        } catch {
            return [];
        }
    }

    try {
        const [texts1, texts2] = await Promise.all([
            fetchPage(page),
            fetchPage(page + 1),
        ]);
        const texts = [...texts1, ...texts2];
        if (texts.length < SENTENCES_MIN) {
            const fallback = getStaticFallbackForLanguage(lang);
            if (fallback) {
                return NextResponse.json({
                    title: fallback.title,
                    author: fallback.author,
                    content: fallback.content,
                });
            }
            return NextResponse.json(
                { error: 'Not enough sentences for this language', content: null },
                { status: 200 }
            );
        }
        const maxWords = 450;
        const selected = texts.slice(0, SENTENCES_MAX);
        const joined = selected.join(' ');
        const words = joined.split(/\s+/).filter(Boolean);
        const content = words.length > maxWords ? words.slice(0, maxWords).join(' ') : joined;
        const title = `Sample from Tatoeba`;
        const author = 'Tatoeba';
        return NextResponse.json({ title, author, content });
    } catch (e) {
        console.error('[tatoeba]', e);
        const fallback = getStaticFallbackForLanguage(lang);
        if (fallback) {
            return NextResponse.json({
                title: fallback.title,
                author: fallback.author,
                content: fallback.content,
            });
        }
        return NextResponse.json(
            { error: 'Failed to fetch sentences', content: null },
            { status: 200 }
        );
    }
}
