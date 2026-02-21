'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { usePdfTextExtraction, WordInfo } from '@/hooks/usePdfTextExtraction';

interface PdfReaderProps {
    blob: Blob;
    pageNumber: number;
    scale: number;
    onWordClick: (word: string, position: { x: number, y: number }) => void;
    onLoad?: (numPages: number) => void;
    onRenderingUpdate?: (isRendering: boolean) => void;
    highlightRange?: { start: number; end: number } | null;
    onTextExtracted?: (text: string) => void;
}

export default function PdfReader({
    blob,
    pageNumber,
    scale,
    onWordClick,
    onLoad,
    onRenderingUpdate,
    highlightRange,
    onTextExtracted
}: PdfReaderProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [pdf, setPdf] = useState<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [numPages, setNumPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [rendering, setRendering] = useState(false);
    const [words, setWords] = useState<WordInfo[]>([]);
    const [isOCRActive, setIsOCRActive] = useState(false);
    const renderTaskRef = useRef<any>(null);

    const { extractFromPdfPage, extractViaOCR, extractionLoading, extractionProgress, reconstructParagraphs } = usePdfTextExtraction();

    useEffect(() => {
        const loadPdf = async () => {
            try {
                const pdfjs = await import('pdfjs-dist');
                // Use a version-matched CDN worker as it's more reliable across different environments
                // but keep the local path as a fallback if desired.
                // Version 4.4.168 matches package.json
                pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs`;

                const arrayBuffer = await blob.arrayBuffer();
                const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
                const pdfDoc = await loadingTask.promise;

                setPdf(pdfDoc);
                setNumPages(pdfDoc.numPages);
                onLoad?.(pdfDoc.numPages);
                setLoading(false);
            } catch (error) {
                console.error('Error loading PDF:', error);
                setLoading(false);
            }
        };

        loadPdf();
    }, [blob, onLoad]);

    const isBusyRef = useRef(false);
    const nextRequestRef = useRef<{ pageNum: number, scale: number } | null>(null);

    const performRender = useCallback(async () => {
        if (isBusyRef.current || !nextRequestRef.current || !pdf || !canvasRef.current) return;

        isBusyRef.current = true;

        try {
            while (nextRequestRef.current) {
                const { pageNum, scale: currentScale } = nextRequestRef.current;
                nextRequestRef.current = null; // Clear it to handle this specific request

                // 1. If there's an existing task, cancel it and wait
                if (renderTaskRef.current) {
                    try {
                        renderTaskRef.current.cancel();
                        await renderTaskRef.current.promise;
                    } catch (e) { /* ignore cancellation errors */ }
                    renderTaskRef.current = null;
                }

                setRendering(true);
                onRenderingUpdate?.(true);

                const page = await pdf.getPage(pageNum);
                const viewport = page.getViewport({ scale: currentScale });
                const canvas = canvasRef.current;
                const context = canvas.getContext('2d');

                if (!context) continue;

                // Setting dimensions clears the canvas and is required to avoid "same canvas" error
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                const renderContext = {
                    canvasContext: context,
                    viewport: viewport,
                };

                const renderTask = page.render(renderContext);
                renderTaskRef.current = renderTask;

                try {
                    await renderTask.promise;
                } catch (error: any) {
                    if (error.name === 'RenderingCancelledException') {
                        continue; // If cancelled, the loop will pick up the next request
                    }
                    throw error;
                }

                // If a new request came in while we were rendering, don't finish yet
                if (nextRequestRef.current) continue;

                renderTaskRef.current = null;

                // Layer 2: Text Extraction
                let extractionResult = await extractFromPdfPage(page, pageNum, viewport);

                // If no text found, try OCR
                if (extractionResult.words.length === 0) {
                    setIsOCRActive(true);
                    extractionResult = await extractViaOCR(canvas, pageNum);
                } else {
                    setIsOCRActive(false);
                }

                setWords(extractionResult.words);
                onTextExtracted?.(reconstructParagraphs(extractionResult.words));
            }
        } catch (error) {
            console.error('Error in render pipeline:', error);
        } finally {
            isBusyRef.current = false;
            setRendering(false);
            onRenderingUpdate?.(false);

            // Check if a request came in at the very last moment
            if (nextRequestRef.current) {
                performRender();
            }
        }
    }, [pdf, onRenderingUpdate, extractFromPdfPage, extractViaOCR, onTextExtracted, reconstructParagraphs]);

    const queueRender = useCallback((pageNum: number, currentScale: number) => {
        nextRequestRef.current = { pageNum, scale: currentScale };

        // If already rendering, the current loop will pick up nextRequestRef
        // We just need to trigger the cancellation of the current task if possible
        if (renderTaskRef.current) {
            try {
                renderTaskRef.current.cancel();
            } catch (e) { }
        }

        if (!isBusyRef.current) {
            performRender();
        }
    }, [performRender]);

    useEffect(() => {
        if (pdf) {
            queueRender(pageNumber, scale);
        }

        return () => {
            if (renderTaskRef.current) {
                renderTaskRef.current.cancel();
            }
        };
    }, [pdf, pageNumber, scale, queueRender]);

    // Word Highlighting Logic
    const activeWordIndex = useMemo(() => {
        if (!highlightRange || words.length === 0) return -1;
        // The highlightRange comes from useSpeech which estimates char index in fullText
        // We need to map that back to our words array
        let charAcc = 0;
        for (let i = 0; i < words.length; i++) {
            const wordLen = words[i].text.length;
            if (highlightRange.start >= charAcc && highlightRange.start < charAcc + wordLen) {
                return i;
            }
            charAcc += wordLen + 1; // +1 for space
        }
        return -1;
    }, [highlightRange, words]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <p className="text-slate-500 font-medium">Preparing PDF Engine...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-6">
            <div
                ref={containerRef}
                className="relative bg-white shadow-2xl rounded-sm overflow-hidden"
                style={{
                    width: canvasRef.current?.width || 'auto',
                    height: canvasRef.current?.height || 'auto'
                }}
            >
                {/* Layer 1: Visual Canvas */}
                <canvas ref={canvasRef} className="block" />

                {/* Loading State for OCR/Rendering */}
                {(rendering || extractionLoading) && (
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center gap-3">
                        <div className="bg-white/90 px-6 py-4 rounded-2xl shadow-2xl border border-slate-100 flex flex-col items-center gap-3">
                            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                            <div className="text-center">
                                <p className="text-sm font-bold text-slate-800">
                                    {isOCRActive ? 'Running OCR...' : 'Rendering Page...'}
                                </p>
                                {isOCRActive && (
                                    <p className="text-[10px] text-slate-500 mt-1">
                                        Progress: {Math.round(extractionProgress * 100)}%
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Layer 3: Interactive Text Overlay */}
                <div className="absolute inset-0 z-10 pointer-events-none">
                    {words.map((word, idx) => (
                        <span
                            key={`${word.page}-${idx}`}
                            className={`absolute cursor-pointer pointer-events-auto transition-all duration-200
                                ${activeWordIndex === idx ? 'bg-yellow-400/40 border-b-2 border-yellow-600' : 'hover:bg-blue-400/20'}
                            `}
                            style={{
                                left: word.x,
                                top: word.y,
                                width: word.w,
                                height: word.h,
                                color: 'transparent',
                                userSelect: 'none',
                                fontSize: word.h * 0.8, // Approximation for font size logic if needed
                                lineHeight: `${word.h}px`
                            }}
                            onClick={(e) => {
                                const rect = (e.target as HTMLElement).getBoundingClientRect();
                                onWordClick(word.text, { x: rect.left, y: rect.top });
                            }}
                        >
                            {word.text}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
