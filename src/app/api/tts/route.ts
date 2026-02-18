import { NextRequest, NextResponse } from 'next/server';

// TTS API route - placeholder for future Google Cloud TTS integration
// Currently, the app uses browser-based TTS via useSpeech hook

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const text = searchParams.get('text');
    const lang = searchParams.get('lang') || 'et-EE';

    if (!text) {
        return NextResponse.json(
            { error: 'Text parameter is required' },
            { status: 400 }
        );
    }

    // For now, return a placeholder response
    // The actual TTS is handled client-side via useSpeech hook
    return NextResponse.json({
        message: 'TTS API placeholder - use browser TTS via useSpeech hook',
        text,
        lang
    });
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { text, lang = 'et-EE' } = body;

        if (!text) {
            return NextResponse.json(
                { error: 'Text is required' },
                { status: 400 }
            );
        }

        // Placeholder for future Google Cloud TTS integration
        return NextResponse.json({
            message: 'TTS API placeholder',
            text,
            lang
        });
    } catch (error) {
        console.error('TTS API error:', error);
        return NextResponse.json(
            { error: 'Failed to process TTS request' },
            { status: 500 }
        );
    }
}
