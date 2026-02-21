'use client';

import { Suspense, useState, useRef, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { db } from '@/db/db';
import { ArrowLeft, Save, Upload, Image as ImageIcon, Loader2, Camera, X, Check, ChevronDown, Minus, Plus, Globe, Lock, User as UserIcon, FileText, BookMarked, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Tesseract from 'tesseract.js';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { SUPPORTED_LANGUAGES } from '@/lib/languages';
import { franc } from 'franc-min';
import { extractTextFromEpub } from '@/lib/epubParser';
import { useToast } from '@/contexts/ToastContext';
import { detectCEFRLevel, type CEFRLevel } from '@/lib/cefrDetector';
import { fetchSampleFromTatoeba, getRandomSampleForLanguage, hasSamplesForLanguage } from '@/lib/sampleStories';

const LANG_CODES = new Set(SUPPORTED_LANGUAGES.map((l) => l.code));
function normalizeLang(code: string): string {
    if (LANG_CODES.has(code)) return code;
    const lower = code.slice(0, 2).toLowerCase();
    if (LANG_CODES.has(lower)) return lower;
    return 'en';
}

type ImportTab = 'texts' | 'books';

const MAX_PASTE_WORDS = 450;

const LANG_MAP: Record<string, string> = {
    'eng': 'en', 'est': 'et', 'swe': 'sv', 'fin': 'fi', 'nor': 'no',
    'dan': 'da', 'nld': 'nl', 'deu': 'de', 'fra': 'fr', 'spa': 'es',
    'ita': 'it', 'rus': 'ru', 'por': 'pt', 'pol': 'pl', 'zlm': 'et'
};

// Camera constraints for mobile (back camera preferred)
const videoConstraints = {
    facingMode: "environment",
    width: { ideal: 4096 }, // Request 4K resolution
    height: { ideal: 2160 },
    focusMode: { ideal: "continuous" } // Request continuous focus
};

function ImportPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const toast = useToast();
    const editId = searchParams.get('id');
    const targetLanguage = useSelector((state: RootState) => state.settings.targetLanguage);

    const tabParam = searchParams.get('tab');
    const [activeTab, setActiveTab] = useState<ImportTab>(() => {
        if (editId) return 'texts';
        if (tabParam === 'books') return 'books';
        return 'texts';
    });
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [language, setLanguage] = useState(targetLanguage || 'et');
    const [isPublic, setIsPublic] = useState(false);
    const [content, setContent] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingStatus, setProcessingStatus] = useState('');
    const [isBookMode, setIsBookMode] = useState(false);
    const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
    const [detectedLevel, setDetectedLevel] = useState<CEFRLevel | null>(null);
    const [isDetectingLevel, setIsDetectingLevel] = useState(false);
    const [isGeneratingSample, setIsGeneratingSample] = useState(false);

    // Import Books tab state
    const [bookError, setBookError] = useState<string | null>(null);
    const [bookStatus, setBookStatus] = useState('');
    const [isProcessingBook, setIsProcessingBook] = useState(false);
    const bookFileInputRef = useRef<HTMLInputElement>(null);

    // Load existing text if in edit mode
    useEffect(() => {
        if (editId) {
            db.texts.get(Number(editId)).then(text => {
                if (text) {
                    setTitle(text.title);
                    setAuthor(text.author || '');
                    setLanguage(text.language || 'et');
                    setIsPublic(text.isPublic || false);
                    setContent(text.content);
                    if (text.pdfBlob) {
                        setPdfBlob(text.pdfBlob);
                        setIsBookMode(true);
                    }
                    setDetectedLevel(text.cefrLevel && ['A1','A2','B1','B2','C1','C2'].includes(text.cefrLevel) ? text.cefrLevel as CEFRLevel : null);
                }
            });
        }
    }, [editId]);

    // Sync language with targetLanguage if it changes (only when creating new)
    useEffect(() => {
        if (targetLanguage && !editId) {
            setLanguage(targetLanguage);
        }
    }, [targetLanguage, editId]);

    // Debounced CEFR level detection when content or language changes
    useEffect(() => {
        const words = content.trim().split(/\s+/).filter(Boolean);
        if (words.length < 20) {
            setDetectedLevel(null);
            return;
        }
        const t = setTimeout(async () => {
            setIsDetectingLevel(true);
            try {
                const level = await detectCEFRLevel(content, language);
                setDetectedLevel(level);
            } catch {
                setDetectedLevel(null);
            } finally {
                setIsDetectingLevel(false);
            }
        }, 600);
        return () => clearTimeout(t);
    }, [content, language]);

    // Camera state
    const [showCamera, setShowCamera] = useState(false);
    const [showImageOptions, setShowImageOptions] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [hasZoomSupport, setHasZoomSupport] = useState(false);
    const webcamRef = useRef<Webcam>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const wordCount = content.trim() ? content.split(/\s+/).filter(w => w).length : 0;
    const isOverWordLimit = wordCount > MAX_PASTE_WORDS;

    const handleAutoGenerate = async () => {
        setIsGeneratingSample(true);
        try {
            let sample = await fetchSampleFromTatoeba(language);
            if (!sample) sample = getRandomSampleForLanguage(language);
            if (!sample) {
                toast({ message: 'Could not load sample. Try again or paste your own text.', type: 'error' });
                return;
            }
            setTitle(sample.title);
            setAuthor(sample.author);
            setContent(sample.content);
            const fromTatoeba = sample.author === 'Tatoeba' || sample.title?.includes('Tatoeba');
            if (fromTatoeba) {
                toast({ message: 'Story filled from Tatoeba (free language database). Level will update automatically.', type: 'success' });
            } else if (!hasSamplesForLanguage(language)) {
                toast({ message: 'Sample in English (no Tatoeba data for this language). You can change the language or paste your own text.', type: 'info' });
            } else {
                toast({ message: 'Story details filled. Level will update automatically.', type: 'success' });
            }
        } catch {
            const sample = getRandomSampleForLanguage(language);
            if (sample) {
                setTitle(sample.title);
                setAuthor(sample.author);
                setContent(sample.content);
                toast({ message: 'Filled from backup sample. Level will update automatically.', type: 'info' });
            } else {
                toast({ message: 'Could not load sample. Try again or paste your own text.', type: 'error' });
            }
        } finally {
            setIsGeneratingSample(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;
        if (isOverWordLimit) {
            toast({ message: `Maximum ${MAX_PASTE_WORDS} words allowed. Please shorten your text.`, type: 'error' });
            return;
        }

        setIsSaving(true);
        try {
            if (editId) {
                await db.texts.update(Number(editId), {
                    title,
                    content,
                    author: author.trim() || undefined,
                    isPublic,
                    language,
                    pdfBlob: pdfBlob || undefined,
                    cefrLevel: detectedLevel ?? undefined
                });
            } else {
                await db.texts.add({
                    title,
                    content,
                    author: author.trim() || undefined,
                    isPublic,
                    language,
                    pdfBlob: pdfBlob || undefined,
                    cefrLevel: detectedLevel ?? undefined,
                    createdAt: Date.now()
                });
            }
            router.push('/');
        } catch (error) {
            console.error('Failed to save text:', error);
            toast({ message: 'Failed to save text. Please try again.', type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== 'text/plain' && !file.name.toLowerCase().endsWith('.txt')) {
            toast({ message: 'Please upload a .txt file only. Use Import Books for PDF or EPUB.', type: 'error' });
            e.target.value = '';
            return;
        }

        setTitle(file.name.replace(/\.[^/.]+$/, ""));
        setContent('');
        setPdfBlob(null);

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            setContent(text);
            const detected = LANG_MAP[franc(text)];
            if (detected) setLanguage(detected);
        };
        reader.readAsText(file);
    };

    const processPdfFile = async (file: File) => {
        setIsProcessing(true);
        setProcessingStatus('Loading PDF...');

        try {
            const pdfjs = await import('pdfjs-dist');
            pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';

            const reader = new FileReader();
            reader.onload = async (event) => {
                const arrayBuffer = event.target?.result as ArrayBuffer;

                // Store the original blob
                setPdfBlob(file);

                try {
                    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
                    let fullText = '';

                    for (let i = 1; i <= pdf.numPages; i++) {
                        setProcessingStatus(`Extracting page ${i} of ${pdf.numPages}...`);
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        const pageText = textContent.items
                            .map((item: any) => item.str)
                            .join(' ');
                        fullText += pageText + '\n\n';
                    }

                    const { content: cleanContent } = processOCRResult(fullText);
                    if (cleanContent.trim()) {
                        setContent(cleanContent);
                        // Auto-detect language from PDF content
                        const detected = LANG_MAP[franc(cleanContent)];
                        if (detected) setLanguage(detected);
                    } else {
                        toast({ message: 'No readable text found in PDF.', type: 'error' });
                    }
                } catch (pdfError) {
                    console.error('PDF parsing error:', pdfError);
                    toast({ message: 'Failed to parse PDF content.', type: 'error' });
                } finally {
                    setIsProcessing(false);
                    setProcessingStatus('');
                }
            };
            reader.readAsArrayBuffer(file);
        } catch (error) {
            console.error('Failed to load pdfjs:', error);
            toast({ message: 'Failed to initialize PDF processor.', type: 'error' });
            setIsProcessing(false);
            setProcessingStatus('');
        }
    };

    const processOCRResult = (text: string) => {
        // 1. Initial Cleanup: Split and remove obvious noise
        const lines = text
            .split('\n')
            .map(line => line.trim())
            .filter(line => {
                if (line.length < 2) return false;
                // Filter lines with > 50% non-alphanumeric chars (OCR garbage)
                const alphaDiff = line.replace(/[^a-zA-Z0-9äõüöÄÕÜÖ]/g, '').length;
                if (alphaDiff / line.length < 0.5) return false;
                return true;
            });

        if (lines.length === 0) return { content: '' };

        // Remove footer garbage (often last line is short noise like "lsh")
        if (lines.length > 0) {
            const lastLine = lines[lines.length - 1];
            if (lastLine.length < 5 && !/[.!?;]$/.test(lastLine)) {
                lines.pop();
            }
        }

        let formattedContent = "";

        // Whitelist for short capitalized words that are valid
        const validShortCaps = new Set(['OK', 'TV', 'CD', 'DVD', 'DJ', 'VP', 'PS', 'NB', 'CV', 'PR', 'USA', 'UNK']);

        // 2. Smart Formatting & Token Cleaning
        lines.forEach((line) => {
            // Strict list detection: Bullet/Number followed by space
            const isListItem = /^([•\-\*>]|\d+\.)\s/.test(line);

            // Token-based cleaning
            const tokens = line.split(/\s+/);
            const cleanTokens = tokens.filter(token => {
                // Remove specific garbage symbols
                if (/[|§$«»_]/.test(token)) return false;

                // Remove isolated numbers (like page numbers) except reasonable years
                if (/^\d+$/.test(token) && parseInt(token) < 1900) return false;

                // RELAXED FILTER: Allow I, a, and common OCR errors for I (l, 1) if isolated
                if (token.length === 1 && !/[IaAil1]/.test(token)) return false;

                // Remove garbage caps artifacts (e.g. "FP", "EWA", "ES")
                // Pattern: 2-3 Uppercase letters, NOT in whitelist
                if (/^[A-Z]{2,3}$/.test(token) && !validShortCaps.has(token)) return false;

                // Remove tokens that are purely Symbols
                if (/^[^a-zA-Z0-9äõüöÄÕÜÖ.,!?]+$/.test(token)) return false;

                return true;
            });

            let cleanLine = cleanTokens.join(' ');
            if (cleanLine.length < 1) return;

            // Restore bullet if preserved
            if (isListItem && !/^([•\-\*>]|\d+\.)/.test(cleanLine)) {
                cleanLine = `• ${cleanLine}`;
            }

            // 3. Split Merged Sentences
            // Look for pattern: end-punctuation + space + Uppercase
            // "butterflies! What" -> "butterflies!\nWhat" (Single newline)
            cleanLine = cleanLine.replace(/([.!?])\s+([A-ZÄÕÜÖ])/g, '$1\n$2');

            // Spacer Logic: Use single newline to match image density
            formattedContent += formattedContent ? `\n${cleanLine}` : cleanLine;
        });

        // Final cleanup: Replace isolated "1" or "l" with "I" if they look like pronouns
        formattedContent = formattedContent.replace(/(^|\s)[l1](\s)/g, '$1I$2');

        return {
            content: formattedContent.trim()
        };
    };

    // Shared processing logic for both File Upload and Camera Capture
    const processImageFile = async (file: File) => {
        // Auto-clear and set title from filename (or "Captured Image")
        setTitle(file.name.replace(/\.[^/.]+$/, ""));
        setContent('');

        setIsProcessing(true);
        setProcessingStatus('Processing image...');

        try {
            // Convert HEIC to JPEG if needed
            if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
                setProcessingStatus('Converting HEIC image...');
                const heic2any = (await import('heic2any')).default;
                const converted = await heic2any({
                    blob: file,
                    toType: 'image/jpeg',
                    quality: 0.8
                });
                const blob = Array.isArray(converted) ? converted[0] : converted;
                file = new File([blob], file.name.replace(/\.heic$/i, '.jpg'), { type: 'image/jpeg' });
            }

            setProcessingStatus('Initializing OCR...');
            // Map ISO language code to Tesseract language code
            const langMap: { [key: string]: string } = {
                'et': 'est',
                'en': 'eng',
                'fi': 'fin',
                'ru': 'rus',
                'de': 'deu',
                'fr': 'fra',
                'es': 'spa'
            };
            const ocrLang = langMap[language] || 'eng';
            const worker = await Tesseract.createWorker(ocrLang + (ocrLang !== 'eng' ? '+eng' : ''));

            setProcessingStatus('Recognizing text...');
            const ret = await worker.recognize(file);

            setProcessingStatus('Formatting text...');
            const { data: { text, confidence } } = ret;
            const { content: newContent } = processOCRResult(text);

            // Validation:
            // 1. Confidence < 50 (relaxed from 60)
            // 2. Word Count < 2 words of 3+ letters (filters single garbage words like "Lada")
            const meaningfulWords = newContent.split(/\s+/).filter(w => w.replace(/[^a-zA-ZäõüöÄÕÜÖ]/g, '').length >= 3);

            if (confidence < 50 || meaningfulWords.length < 2) {
                toast({ message: 'Image is too unclear or contains no meaningful text (must have at least two 3+ letter words).', type: 'error' });
                setTitle('');
                setContent('');
            } else {
                setContent(newContent);
            }

            await worker.terminate();
        } catch (error) {
            console.error('OCR/Image Error:', error);
            toast({ message: 'Failed to process image. Please try another file.', type: 'error' });
        } finally {
            setIsProcessing(false);
            setProcessingStatus('');
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        processImageFile(file);
    };

    const capturePhoto = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            // Convert base64 to File
            fetch(imageSrc)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], `captured_photo_${Date.now()}.jpg`, { type: "image/jpeg" });
                    setShowCamera(false); // Close camera modal
                    setZoom(1); // Reset zoom
                    processImageFile(file); // Process the file
                });
        }
    }, [webcamRef, processImageFile]);

    // Apply zoom constraints
    const handleZoomChange = useCallback((value: number) => {
        setZoom(value);
        const videoTrack = webcamRef.current?.video?.srcObject instanceof MediaStream
            ? webcamRef.current.video.srcObject.getVideoTracks()[0]
            : null;

        if (videoTrack && typeof videoTrack.applyConstraints === 'function') {
            const capabilities = videoTrack.getCapabilities() as any;
            if (capabilities.zoom) {
                videoTrack.applyConstraints({
                    advanced: [{ zoom: value }]
                } as any).catch(e => console.error("Hardware zoom failed:", e));
            }
        }
    }, [webcamRef]);

    // Check zoom support when camera opens
    useEffect(() => {
        if (showCamera) {
            const checkZoom = () => {
                const videoTrack = webcamRef.current?.video?.srcObject instanceof MediaStream
                    ? webcamRef.current.video.srcObject.getVideoTracks()[0]
                    : null;

                if (videoTrack) {
                    const capabilities = videoTrack.getCapabilities() as any;
                    if (capabilities.zoom) {
                        setHasZoomSupport(true);
                    }
                }
            };
            // Small delay to allow stream to initialize
            const timer = setTimeout(checkZoom, 1000);
            return () => clearTimeout(timer);
        }
    }, [showCamera]);

    // --- Import Books tab: process PDF and save to library, redirect to read ---
    const processPdfBook = async (file: File): Promise<{ title: string; content: string; pdfBlob: Blob; language: string }> => {
        const pdfjs = await import('pdfjs-dist');
        pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            setBookStatus(`Reading PDF page ${i} of ${pdf.numPages}...`);
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item) => ('str' in item ? item.str : '')).join(' ');
            fullText += pageText + '\n\n';
        }
        return {
            title: file.name.replace(/\.pdf$/i, ''),
            content: fullText.replace(/\n{3,}/g, '\n\n').trim(),
            pdfBlob: file,
            language: targetLanguage || 'en'
        };
    };

    const processEpubBook = async (file: File): Promise<{ title: string; content: string; author?: string; language: string }> => {
        setBookStatus('Opening EPUB...');
        const { text, meta } = await extractTextFromEpub(file);
        if (!text.trim()) throw new Error('No text content found in this EPUB.');
        return {
            title: meta.title,
            content: text,
            author: meta.author,
            language: normalizeLang(meta.language || targetLanguage || 'en')
        };
    };

    const handleBookFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setBookError(null);
        const name = file.name.toLowerCase();
        const isPdf = name.endsWith('.pdf');
        const isEpub = name.endsWith('.epub');
        if (!isPdf && !isEpub) {
            setBookError('Please choose a .epub or .pdf file.');
            e.target.value = '';
            return;
        }
        setIsProcessingBook(true);
        setBookStatus(isPdf ? 'Loading PDF...' : 'Loading EPUB...');
        try {
            if (isPdf) {
                const { title, content, pdfBlob, language } = await processPdfBook(file);
                const cefrLevel = await detectCEFRLevel(content, language);
                const id = await db.texts.add({ title, content, language, pdfBlob, cefrLevel: cefrLevel ?? undefined, createdAt: Date.now() });
                router.push(`/read/${id}`);
                return;
            }
            const { title, content, author, language } = await processEpubBook(file);
            const cefrLevel = await detectCEFRLevel(content, language);
            const id = await db.texts.add({ title, content, author: author || undefined, language, cefrLevel: cefrLevel ?? undefined, createdAt: Date.now() });
            router.push(`/read/${id}`);
        } catch (err) {
            console.error(err);
            setBookError(err instanceof Error ? err.message : 'Failed to process file.');
        } finally {
            setIsProcessingBook(false);
            setBookStatus('');
            e.target.value = '';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
                {/* Header */}
                <motion.header 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <div className="flex items-center gap-4 mb-2">
                        <Link 
                            href="/" 
                            className="p-2.5 -ml-2 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 hover:shadow-lg transition-all duration-300 group"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:-translate-x-0.5 transition-transform" />
                        </Link>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                                {editId ? 'Edit Story' : 'Import'}
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                Add content to your learning library
                            </p>
                        </div>
                    </div>
                </motion.header>

                {/* Tabs: Import Texts | Import Books (hidden when editing) */}
                {!editId && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="mb-6"
                >
                    <div className="flex bg-gray-100 dark:bg-gray-800/80 p-1.5 rounded-2xl w-full max-w-md">
                        <button
                            type="button"
                            onClick={() => setActiveTab('texts')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                activeTab === 'texts'
                                    ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-md'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                        >
                            <Upload className="w-4 h-4" />
                            Import Texts
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('books')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                activeTab === 'books'
                                    ? 'bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-md'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                        >
                            <BookMarked className="w-4 h-4" />
                            Import Books
                        </button>
                    </div>
                </motion.div>
                )}

                {/* Tab content: Import Texts (or full form when editing) */}
                {(activeTab === 'texts' || editId) && (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
                    {/* Left Column - Form (3/5 width on large screens) */}
                    <motion.form
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        onSubmit={handleSave}
                        className="lg:col-span-3 space-y-6"
                    >
                        {/* Content Card - First for importance */}
                        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-xl shadow-gray-200/20 dark:shadow-none overflow-hidden">
                            <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-4">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                                    <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg shadow-blue-500/20">
                                        <Save className="w-4 h-4 text-white" />
                                    </div>
                                    Story Details
                                </h2>
                                <motion.button
                                    type="button"
                                    onClick={handleAutoGenerate}
                                    disabled={isGeneratingSample}
                                    whileHover={{ scale: isGeneratingSample ? 1 : 1.02 }}
                                    whileTap={{ scale: isGeneratingSample ? 1 : 0.98 }}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-70 disabled:cursor-wait text-white text-sm font-bold shadow-lg shadow-amber-500/30 transition-all"
                                >
                                    {isGeneratingSample ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                    {isGeneratingSample ? 'Loading…' : 'Auto generate'}
                                </motion.button>
                            </div>

                            <div className="p-5 sm:p-6 space-y-5">
                                {/* Title & Author Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    {/* Title Input */}
                                    <div className="space-y-2">
                                        <label htmlFor="title" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Title <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="title"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Enter story title..."
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium placeholder:text-gray-400"
                                            required
                                        />
                                    </div>

                                    {/* Author Input */}
                                    <div className="space-y-2">
                                        <label htmlFor="author" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                            <UserIcon className="w-4 h-4 text-purple-500" />
                                            Author
                                        </label>
                                        <input
                                            type="text"
                                            id="author"
                                            value={author}
                                            onChange={(e) => setAuthor(e.target.value)}
                                            placeholder="Author name (optional)"
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium placeholder:text-gray-400"
                                        />
                                    </div>
                                </div>

                                {/* Language & Visibility Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    {/* Language Select */}
                                    <div className="space-y-2">
                                        <label htmlFor="language" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                            <Globe className="w-4 h-4 text-emerald-500" />
                                            Language
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="language"
                                                value={language}
                                                onChange={(e) => setLanguage(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none transition-all cursor-pointer font-medium text-gray-900 dark:text-white"
                                            >
                                                {SUPPORTED_LANGUAGES.map((lang) => (
                                                    <option key={lang.code} value={lang.code}>
                                                        {lang.name} ({lang.nativeName})
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-gray-200 dark:bg-gray-700 rounded-lg pointer-events-none">
                                                <ChevronDown className="w-4 h-4 text-gray-500" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Visibility Toggle */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                            <Lock className="w-4 h-4 text-amber-500" />
                                            Visibility
                                        </label>
                                        <div className="flex bg-gray-100 dark:bg-gray-800/50 p-1 rounded-xl">
                                            <button
                                                type="button"
                                                onClick={() => setIsPublic(false)}
                                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                                                    !isPublic 
                                                        ? 'bg-white dark:bg-gray-900 text-blue-600 shadow-md' 
                                                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                                }`}
                                            >
                                                <Lock className="w-4 h-4" />
                                                Private
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsPublic(true)}
                                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                                                    isPublic 
                                                        ? 'bg-white dark:bg-gray-900 text-emerald-600 shadow-md' 
                                                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                                }`}
                                            >
                                                <Globe className="w-4 h-4" />
                                                Public
                                            </button>
                                        </div>
                                    </div>

                                    {/* Detected Level (auto) */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                            Level
                                            <span className="text-gray-400 font-normal text-xs">(auto)</span>
                                        </label>
                                        <div className="min-h-[44px] px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 flex items-center">
                                            {isDetectingLevel ? (
                                                <span className="text-amber-600 dark:text-amber-400 text-sm font-medium flex items-center gap-2">
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Detecting…
                                                </span>
                                            ) : detectedLevel ? (
                                                <span className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-sm font-bold rounded-lg border border-emerald-200 dark:border-emerald-800">
                                                    {detectedLevel}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 dark:text-gray-500 text-sm">Paste at least 20 words to detect level</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Content Textarea */}
                                <div className="space-y-2">
                                    <label htmlFor="content" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Paste Text <span className="text-red-500">*</span>
                                        <span className="text-gray-400 font-normal ml-1">(max {MAX_PASTE_WORDS} words)</span>
                                    </label>
                                    <div className="relative">
                                        <textarea
                                            id="content"
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            placeholder="Paste or type your story content here..."
                                            rows={14}
                                            className={`w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border outline-none transition-all resize-none font-serif text-base leading-relaxed placeholder:text-gray-400 placeholder:font-sans ${
                                                isOverWordLimit
                                                    ? 'border-red-400 dark:border-red-600 focus:ring-2 focus:ring-red-500 focus:border-transparent'
                                                    : 'border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                            }`}
                                            required
                                        />
                                        {content && (
                                            <div className="absolute bottom-4 right-4">
                                                <span className={`px-3 py-1.5 backdrop-blur-sm rounded-full text-xs font-semibold border ${
                                                    isOverWordLimit
                                                        ? 'bg-red-50 dark:bg-red-950/80 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800'
                                                        : 'bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
                                                }`}>
                                                    {wordCount} / {MAX_PASTE_WORDS} words
                                                </span>
                                            </div>
                                        )}
                                        {isOverWordLimit && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                                Maximum {MAX_PASTE_WORDS} words allowed. Please shorten your text.
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Book Mode Toggle (PDF Only) */}
                                <AnimatePresence>
                                    {pdfBlob && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-4 border border-blue-200/50 dark:border-blue-800/30 flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg shadow-blue-500/30">
                                                        <ImageIcon className="w-4 h-4 text-white" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 dark:text-white text-sm">Book Mode</h3>
                                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                                            Preserve PDF layout
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsBookMode(!isBookMode)}
                                                    className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${
                                                        isBookMode ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-gray-300 dark:bg-gray-700'
                                                    }`}
                                                >
                                                    <span
                                                        className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition-all duration-300 ease-in-out ${
                                                            isBookMode ? 'translate-x-5' : 'translate-x-0'
                                                        }`}
                                                    />
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Action Buttons - Inside the card */}
                            <div className="px-5 sm:px-6 py-4 bg-gray-50/50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3">
                                <Link href="/">
                                    <motion.button
                                        type="button"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-5 py-2.5 rounded-xl font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                                    >
                                        Cancel
                                    </motion.button>
                                </Link>
                                <motion.button
                                    type="submit"
                                    disabled={isSaving || !title.trim() || !content.trim() || isOverWordLimit}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30"
                                >
                                    {isSaving ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Check className="w-4 h-4" />
                                    )}
                                    {editId ? 'Save Changes' : 'Save to Library'}
                                </motion.button>
                            </div>
                        </div>
                    </motion.form>

                    {/* Right Column - Quick Import (2/5 width on large screens) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-xl shadow-gray-200/20 dark:shadow-none lg:sticky lg:top-6">
                            <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-gray-800">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                                    <div className="p-2.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg shadow-purple-500/20">
                                        <Upload className="w-4 h-4 text-white" />
                                    </div>
                                    Quick Import
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">
                                    or choose a file to import
                                </p>
                            </div>
                            
                            <div className="p-5 sm:p-6 space-y-4">
                                {/* Upload Text File Button */}
                                <motion.button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isProcessing}
                                    whileHover={{ scale: 1.01, y: -2 }}
                                    whileTap={{ scale: 0.99 }}
                                    className="group w-full relative flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-950/30 dark:to-indigo-950/30 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-950/50 dark:hover:to-indigo-950/50 transition-all duration-300"
                                >
                                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/30 group-hover:shadow-xl group-hover:shadow-blue-500/40 transition-all">
                                        <Upload className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="text-left flex-1">
                                        <span className="font-semibold text-gray-900 dark:text-white block">Upload Text File</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">.txt only</span>
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                        accept=".txt"
                                        className="hidden"
                                    />
                                </motion.button>

                                {/* Import Image Button */}
                                <div className="relative" style={{ zIndex: showImageOptions ? 50 : 'auto' }}>
                                    <motion.button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowImageOptions(!showImageOptions);
                                        }}
                                        disabled={isProcessing}
                                        whileHover={{ scale: 1.01, y: -2 }}
                                        whileTap={{ scale: 0.99 }}
                                        className={`group w-full relative flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed transition-all duration-300 ${
                                            showImageOptions 
                                                ? 'border-purple-400 dark:border-purple-500 bg-purple-100 dark:bg-purple-950/50' 
                                                : 'border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500 bg-gradient-to-br from-purple-50/80 to-pink-50/80 dark:from-purple-950/30 dark:to-pink-950/30 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-950/50 dark:hover:to-pink-950/50'
                                        }`}
                                    >
                                        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg shadow-purple-500/30 group-hover:shadow-xl group-hover:shadow-purple-500/40 transition-all">
                                            {isProcessing ? (
                                                <Loader2 className="w-5 h-5 text-white animate-spin" />
                                            ) : (
                                                <ImageIcon className="w-5 h-5 text-white" />
                                            )}
                                        </div>
                                        <div className="text-left flex-1">
                                            <span className="font-semibold text-gray-900 dark:text-white block">
                                                {isProcessing ? processingStatus : 'Import from Image'}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">OCR text extraction</span>
                                        </div>
                                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${showImageOptions ? 'rotate-180' : ''}`} />
                                    </motion.button>

                                    {/* Image Options Dropdown */}
                                    <AnimatePresence>
                                        {showImageOptions && !isProcessing && (
                                            <>
                                                {/* Backdrop to close dropdown when clicking outside */}
                                                <div
                                                    className="fixed inset-0"
                                                    style={{ zIndex: 40 }}
                                                    onClick={() => setShowImageOptions(false)}
                                                />
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700"
                                                    style={{ 
                                                        zIndex: 50,
                                                        top: '100%',
                                                        boxShadow: '0 10px 40px -5px rgba(0,0,0,0.15), 0 4px 6px -2px rgba(0,0,0,0.05)'
                                                    }}
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            imageInputRef.current?.click();
                                                            setShowImageOptions(false);
                                                        }}
                                                        className="w-full flex items-center gap-4 p-4 hover:bg-blue-50 dark:hover:bg-gray-800/50 transition-colors rounded-t-2xl"
                                                    >
                                                        <div className="p-2.5 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 rounded-xl">
                                                            <Upload className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                        </div>
                                                        <div className="text-left">
                                                            <div className="font-semibold text-gray-900 dark:text-white text-sm">Upload Image</div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">JPG, PNG, HEIC</div>
                                                        </div>
                                                    </button>

                                                    <div className="h-px bg-gray-100 dark:bg-gray-800 mx-3" />

                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setShowCamera(true);
                                                            setShowImageOptions(false);
                                                        }}
                                                        className="w-full flex items-center gap-4 p-4 hover:bg-purple-50 dark:hover:bg-gray-800/50 transition-colors rounded-b-2xl"
                                                    >
                                                        <div className="p-2.5 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 rounded-xl">
                                                            <Camera className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                                        </div>
                                                        <div className="text-left">
                                                            <div className="font-semibold text-gray-900 dark:text-white text-sm">Take Photo</div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">Use camera</div>
                                                        </div>
                                                    </button>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>

                                    <input
                                        type="file"
                                        ref={imageInputRef}
                                        onChange={handleImageUpload}
                                        accept="image/*,.heic"
                                        className="hidden"
                                    />
                                </div>

                                {/* Helpful Tips */}
                                <div className="mt-6 p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-xl border border-amber-200/50 dark:border-amber-800/30">
                                    <h3 className="font-semibold text-amber-800 dark:text-amber-200 text-sm mb-2 flex items-center gap-2">
                                        <span className="text-base">💡</span> Tips
                                    </h3>
                                    <ul className="text-xs text-amber-700 dark:text-amber-300/80 space-y-1.5">
                                        <li>• Use Import Books tab for PDF and EPUB</li>
                                        <li>• Images are processed with OCR for text</li>
                                        <li>• Supported here: .txt, images</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
                )}

                {/* Tab content: Import Books */}
                {!editId && activeTab === 'books' && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl"
                >
                    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-xl shadow-gray-200/20 dark:shadow-none overflow-hidden">
                        <div className="p-6 sm:p-8">
                            <div
                                onClick={() => !isProcessingBook && bookFileInputRef.current?.click()}
                                className={`relative flex flex-col items-center justify-center gap-4 py-12 px-6 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer ${
                                    isProcessingBook
                                        ? 'border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-950/30 cursor-wait'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 bg-gray-50/50 dark:bg-gray-800/30 hover:bg-blue-50/50 dark:hover:bg-blue-950/20'
                                }`}
                            >
                                <input ref={bookFileInputRef} type="file" accept=".epub,.pdf" onChange={handleBookFileChange} className="hidden" />
                                {isProcessingBook ? (
                                    <>
                                        <div className="p-4 bg-blue-500 rounded-2xl">
                                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                                        </div>
                                        <p className="font-semibold text-gray-900 dark:text-white">{bookStatus}</p>
                                    </>
                                ) : (
                                    <>
                                        <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl shadow-lg shadow-blue-500/30">
                                            <BookMarked className="w-8 h-8 text-white" />
                                        </div>
                                        <p className="font-semibold text-gray-900 dark:text-white text-center">Choose EPUB or PDF file</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">.epub and .pdf supported • DRM-free only</p>
                                    </>
                                )}
                            </div>
                            {bookError && (
                                <div className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
                                    {bookError}
                                </div>
                            )}
                            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-blue-500" />
                                    PDF — read as book or extracted text
                                </span>
                                <span className="flex items-center gap-2">
                                    <BookMarked className="w-4 h-4 text-indigo-500" />
                                    EPUB — text extracted for reading
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>
                )}

                {/* Camera Modal */}
                <AnimatePresence>
                    {showCamera && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-black flex flex-col"
                        >
                            {/* Camera Preview Area */}
                            <div className="relative flex-1 flex items-center justify-center overflow-hidden">
                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    videoConstraints={videoConstraints}
                                    className="absolute min-w-full min-h-full object-cover transition-all duration-300 ease-out"
                                    style={{ transform: !hasZoomSupport ? `scale(${zoom})` : 'none' }}
                                />

                                {/* Corner Guards/Focus Frame */}
                                <div className="absolute inset-8 border-2 border-white/20 pointer-events-none rounded-3xl">
                                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white/60 rounded-tl-xl" />
                                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white/60 rounded-tr-xl" />
                                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white/60 rounded-bl-xl" />
                                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white/60 rounded-br-xl" />
                                </div>
                            </div>

                            {/* Camera Bottom Controls - Design Refined */}
                            <div className="bg-black py-8 px-6 flex flex-col items-center gap-8">
                                {/* Zoom Controls Bar */}
                                <div className="w-full max-w-sm flex items-center gap-4 bg-white/10 backdrop-blur-xl rounded-full px-5 py-3 border border-white/10 shadow-lg">
                                    <button
                                        type="button"
                                        onClick={() => handleZoomChange(Math.max(1, zoom - 0.2))}
                                        className="p-2 -m-2 text-white/70 hover:text-white transition-colors active:scale-90"
                                    >
                                        <Minus className="w-5 h-5" />
                                    </button>

                                    <input
                                        type="range"
                                        min="1"
                                        max="3"
                                        step="0.1"
                                        value={zoom}
                                        onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
                                        className="flex-1 accent-white h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => handleZoomChange(Math.min(3, zoom + 0.2))}
                                        className="p-2 -m-2 text-white/70 hover:text-white transition-colors active:scale-90"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>

                                    <span className="text-[10px] font-bold text-white/50 w-8 text-right tabular-nums">
                                        {zoom.toFixed(1)}x
                                    </span>
                                </div>

                                {/* Main Actions */}
                                <div className="w-full flex items-center justify-between max-w-sm">
                                    {/* Close Button */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowCamera(false);
                                            setZoom(1);
                                        }}
                                        className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all border border-white/5"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>

                                    {/* Shutter Button Container */}
                                    <div className="relative group">
                                        <motion.button
                                            whileTap={{ scale: 0.85 }}
                                            onClick={capturePhoto}
                                            className="relative z-10 w-20 h-20 rounded-full bg-white flex items-center justify-center"
                                        >
                                            <div className="w-[calc(100%-6px)] h-[calc(100%-6px)] rounded-full border-2 border-black/5" />
                                        </motion.button>
                                        {/* Shutter Outer Ring */}
                                        <div className="absolute inset-[-8px] border-4 border-white/20 rounded-full group-active:border-white/40 transition-all duration-300" />
                                    </div>

                                    {/* Empty Space for alignment */}
                                    <div className="w-12" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default function ImportPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full" />
            </div>
        }>
            <ImportPageContent />
        </Suspense>
    );
}
