'use client';

import { useState, useCallback } from 'react';
import { createWorker } from 'tesseract.js';

export interface WordInfo {
    text: string;
    x: number;
    y: number;
    w: number;
    h: number;
    page: number;
    index: number;
}

export interface TextData {
    words: WordInfo[];
    fullText: string;
    isOCR: boolean;
}

export function usePdfTextExtraction() {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const extractFromPdfPage = useCallback(async (page: any, pageNum: number, viewport: any): Promise<TextData> => {
        setLoading(true);
        try {
            const textContent = await page.getTextContent();
            const words: WordInfo[] = [];
            let fullText = '';
            let wordIndex = 0;

            if (textContent.items.length > 0) {
                // native text available
                textContent.items.forEach((item: any) => {
                    const tx = item.transform; // [scaleX, skewY, skewX, scaleY, translateX, translateY]

                    // PDF coordinates are bottom-up, viewport/DOM are top-down
                    // Convert transform to viewport coordinates
                    const transform = page.getViewport({ scale: viewport.scale }).transform;

                    // Simple split by whitespace for now, but pdf.js often gives chunks
                    const subWords = item.str.split(/(\s+)/);
                    let charOffset = 0;

                    subWords.forEach((word: string) => {
                        if (word.trim().length > 0) {
                            // Rough estimation of word width based on chunk width
                            const wordWidth = (item.width / item.str.length) * word.length;
                            const x = tx[4] * (viewport.width / page.view[2]) + (charOffset * (item.width / item.str.length)) * (viewport.width / page.view[2]);
                            const y = (page.view[3] - tx[5]) * (viewport.height / page.view[3]) - (item.height * viewport.scale);

                            words.push({
                                text: word,
                                x: x,
                                y: y,
                                w: wordWidth * (viewport.width / page.view[2]),
                                h: item.height * viewport.scale,
                                page: pageNum,
                                index: wordIndex++
                            });
                            fullText += word;
                        } else {
                            fullText += word;
                        }
                        charOffset += word.length;
                    });
                });

                return { words, fullText, isOCR: false };
            }

            return { words: [], fullText: '', isOCR: false };
        } catch (error) {
            console.error('Error extracting text:', error);
            return { words: [], fullText: '', isOCR: false };
        } finally {
            setLoading(false);
        }
    }, []);

    const extractViaOCR = useCallback(async (canvas: HTMLCanvasElement, pageNum: number): Promise<TextData> => {
        setLoading(true);
        setProgress(0);
        let worker: any = null;
        try {
            // In Tesseract.js v5+, createWorker is async and can take language as first arg
            worker = await createWorker('est+eng', 1, {
                logger: m => {
                    if (m.status === 'recognizing text') {
                        setProgress(m.progress);
                    }
                }
            });

            // Explicitly load and initialize to be safe across different versions
            // worker.loadLanguage and worker.initialize are sometimes needed if createWorker didn't finish it

            const result = await worker.recognize(canvas);

            if (!result || !result.data) {
                throw new Error('OCR result or data is missing');
            }

            const ocrWords = result.data.words || [];
            const text = result.data.text || '';

            const words: WordInfo[] = ocrWords.map((w: any, idx: number) => ({
                text: w.text,
                x: w.bbox.x0,
                y: w.bbox.y0,
                w: w.bbox.x1 - w.bbox.x0,
                h: w.bbox.y1 - w.bbox.y0,
                page: pageNum,
                index: idx
            }));

            return { words, fullText: text, isOCR: true };
        } catch (error) {
            console.error('OCR Error:', error);
            return { words: [], fullText: '', isOCR: true };
        } finally {
            if (worker) {
                await worker.terminate();
            }
            setLoading(false);
        }
    }, []);

    const reconstructParagraphs = useCallback((words: WordInfo[]): string => {
        if (words.length === 0) return '';

        // Group words by their Y coordinate (approximate lines)
        const lines: { y: number, words: WordInfo[] }[] = [];
        words.forEach(w => {
            const existingLine = lines.find(l => Math.abs(l.y - w.y) < 5); // 5px tolerance
            if (existingLine) {
                existingLine.words.push(w);
            } else {
                lines.push({ y: w.y, words: [w] });
            }
        });

        // Sort lines by Y (top to bottom)
        lines.sort((a, b) => a.y - b.y);

        // Filter lines that look like page numbers or short headers/footers
        const filteredLines = lines.filter(line => {
            const lineText = line.words.map(w => w.text).join(' ').trim();
            // Ignore lines that are just numbers (page numbers)
            if (/^\d+$/.test(lineText)) return false;
            // Ignore very short lines at the extreme top/bottom (often headers/footers)
            // (Note: this is a heuristic, real logic might need viewport height)
            return true;
        });

        return filteredLines.map(line =>
            line.words.sort((a, b) => a.x - b.x).map(w => w.text).join(' ')
        ).join('\n');
    }, []);

    return {
        extractFromPdfPage,
        extractViaOCR,
        reconstructParagraphs,
        extractionLoading: loading,
        extractionProgress: progress
    };
}
