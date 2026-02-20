'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/db/db';
import { ArrowLeft, Save, Upload, Image as ImageIcon, Loader2, Camera, X, Check, ChevronDown, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import Tesseract from 'tesseract.js';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';

// Camera constraints for mobile (back camera preferred)
const videoConstraints = {
    facingMode: "environment",
    width: { ideal: 4096 }, // Request 4K resolution
    height: { ideal: 2160 },
    focusMode: { ideal: "continuous" } // Request continuous focus
};

export default function ImportPage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingStatus, setProcessingStatus] = useState('');
    const [isBookMode, setIsBookMode] = useState(false);
    const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

    // Camera state
    const [showCamera, setShowCamera] = useState(false);
    const [showImageOptions, setShowImageOptions] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [hasZoomSupport, setHasZoomSupport] = useState(false);
    const webcamRef = useRef<Webcam>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;

        setIsSaving(true);
        try {
            await db.texts.add({
                title,
                content,
                pdfBlob: pdfBlob || undefined,
                createdAt: Date.now()
            });
            router.push('/');
        } catch (error) {
            console.error('Failed to save text:', error);
            alert('Failed to save text. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Auto-clear and set title from filename
        setTitle(file.name.replace(/\.[^/.]+$/, ""));
        setContent('');
        setPdfBlob(null);

        if (file.type === 'text/plain' || file.name.endsWith('.md')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target?.result as string;
                setContent(text);
            };
            reader.readAsText(file);
        } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
            processPdfFile(file);
        } else {
            alert('Please upload a .txt, .md, or .pdf file');
        }
    };

    const processPdfFile = async (file: File) => {
        setIsProcessing(true);
        setProcessingStatus('Loading PDF...');

        try {
            const pdfjs = await import('pdfjs-dist');
            // Set worker source to local public folder
            pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

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
                    } else {
                        alert('No readable text found in PDF.');
                    }
                } catch (pdfError) {
                    console.error('PDF parsing error:', pdfError);
                    alert('Failed to parse PDF content.');
                } finally {
                    setIsProcessing(false);
                    setProcessingStatus('');
                }
            };
            reader.readAsArrayBuffer(file);
        } catch (error) {
            console.error('Failed to load pdfjs:', error);
            alert('Failed to initialize PDF processor.');
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
            const worker = await Tesseract.createWorker('est+eng');

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
                alert('Image is too unclear or contains no meaningful text (must have at least two 3+ letter words).');
                setTitle('');
                setContent('');
            } else {
                setContent(newContent);
            }

            await worker.terminate();
        } catch (error) {
            console.error('OCR/Image Error:', error);
            alert('Failed to process image. Please try another file.');
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

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-3xl mx-auto space-y-6">
                <header className="flex items-center gap-3 sm:gap-4">
                    <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </Link>
                    <h1 className="text-xl sm:text-2xl font-bold">Import Text</h1>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isProcessing}
                        className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-gray-600 dark:text-gray-400"
                    >
                        <Upload className="w-5 h-5" />
                        <span>Upload Text File</span>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept=".txt,.md,.pdf"
                            className="hidden"
                        />
                    </button>

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowImageOptions(!showImageOptions)}
                            disabled={isProcessing}
                            className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-gray-600 dark:text-gray-400"
                        >
                            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
                            <span className="truncate">{isProcessing ? processingStatus : 'Import Image'}</span>
                            <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform ${showImageOptions ? 'rotate-180' : ''}`} />
                        </button>

                        {showImageOptions && !isProcessing && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-10 p-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        imageInputRef.current?.click();
                                        setShowImageOptions(false);
                                    }}
                                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
                                >
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                                        <Upload className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900 dark:text-gray-100">Upload File</div>
                                        <div className="text-xs text-gray-500">JPG, PNG, HEIC</div>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCamera(true);
                                        setShowImageOptions(false);
                                    }}
                                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
                                >
                                    <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                                        <Camera className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900 dark:text-gray-100">Take Photo</div>
                                        <div className="text-xs text-gray-500">Use Camera</div>
                                    </div>
                                </button>
                            </div>
                        )}

                        {/* Hidden Inputs */}
                        <input
                            type="file"
                            ref={imageInputRef}
                            onChange={handleImageUpload}
                            accept="image/*,.heic"
                            className="hidden"
                        />
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="title" className="text-sm font-medium text-muted-foreground">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., My First Estonian Story"
                            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="content" className="text-sm font-medium text-muted-foreground">
                            Content (Estonian)
                        </label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Paste your Estonian text here..."
                            rows={8}
                            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none font-serif text-base sm:text-lg leading-relaxed sm:rows-15"
                            required
                        />
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
                                <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl p-5 border border-blue-100 dark:border-blue-900/30 flex items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <ImageIcon className="w-4 h-4 text-blue-600" />
                                            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Book Mode (Layout Preservation)</h3>
                                        </div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            Keep the original PDF layout with images and formatting. Highly recommended for books and study materials.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setIsBookMode(!isBookMode)}
                                        className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isBookMode ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                                    >
                                        <span
                                            className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isBookMode ? 'translate-x-5' : 'translate-x-0'}`}
                                        />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={isSaving || !title.trim() || !content.trim() || isProcessing}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 sm:py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/30 font-medium"
                        >
                            {isSaving ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Save className="w-5 h-5" />
                            )}
                            <span>Save to Library</span>
                        </button>
                    </div>
                </form>

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
