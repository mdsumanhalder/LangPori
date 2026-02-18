import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const word = searchParams.get('word');
    const directUrl = searchParams.get('url');

    if (!word && !directUrl) {
        return NextResponse.json({ error: 'Missing word or url parameter' }, { status: 400 });
    }

    // Construct the Google TTS URL server-side if 'word' is provided, otherwise use 'url'
    const url = word
        ? `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(word)}&tl=et&client=tw-ob`
        : directUrl!;

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch audio: ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'audio/mpeg',
                'Cache-Control': 'public, max-age=3600',
            },
        });
    } catch (error) {
        console.error('Proxy error:', error);
        return NextResponse.json({ error: 'Failed to fetch audio' }, { status: 500 });
    }
}
