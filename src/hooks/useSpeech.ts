'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { getAllAudioUrls } from 'google-tts-api';

interface UseSpeechReturn {
    speak: (text: string, lang?: string, options?: { highlight?: boolean, onEnd?: () => void }) => Promise<void>;
    startRecording: () => Promise<void>;
    stopRecording: () => string;
    isRecording: boolean;
    isSpeaking: boolean;
    transcript: string;
    isSupported: boolean;
    stopSpeaking: () => void;
    pauseSpeaking: () => void;
    resumeSpeaking: () => void;
    isPaused: boolean;
    currentWordRange: { start: number; end: number } | null;
    speakStateless: (text: string, lang?: string) => Promise<void>;
    playbackRate: number;
    setPlaybackRate: (rate: number) => void;
}


export function useSpeech(): UseSpeechReturn {
    const [isRecording, setIsRecording] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [isSupported, setIsSupported] = useState(false);
    const [currentWordRange, setCurrentWordRange] = useState<{ start: number; end: number } | null>(null);

    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const playbackTokenRef = useRef(0);
    const playbackRateRef = useRef(1.0);
    const [playbackRate, setPlaybackRateState] = useState(1.0);

    const setPlaybackRate = useCallback((rate: number) => {
        playbackRateRef.current = rate;
        setPlaybackRateState(rate);
        // Apply to currently playing audio immediately
        if (audioRef.current) {
            audioRef.current.playbackRate = rate;
        }
    }, []);

    // Check browser support
    useEffect(() => {
        const hasSpeechRecognition = typeof window !== 'undefined' &&
            ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
        const hasSpeechSynthesis = typeof window !== 'undefined' && 'speechSynthesis' in window;

        // eslint-disable-next-line react-hooks/exhaustive-deps
        setIsSupported(Boolean(hasSpeechRecognition || hasSpeechSynthesis));
    }, []);

    const stopSpeaking = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        setIsSpeaking(false);
        setIsPaused(false);
        setCurrentWordRange(null);
        playbackTokenRef.current++;
    }, []);

    const pauseSpeaking = useCallback(() => {
        if (audioRef.current && !audioRef.current.paused) {
            audioRef.current.pause();
            setIsSpeaking(false);
            setIsPaused(true);
        }
        if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking) {
            window.speechSynthesis.pause();
            setIsSpeaking(false);
            setIsPaused(true);
        }
    }, []);

    const resumeSpeaking = useCallback(() => {
        if (audioRef.current && audioRef.current.paused) {
            audioRef.current.play().catch(e => console.error("Resume failed", e));
            setIsSpeaking(true);
            setIsPaused(false);
        }
        if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
            setIsSpeaking(true);
            setIsPaused(false);
        }
    }, []);


    // Moved tryGoogleTTS up to be used as fallback
    const tryGoogleTTS = useCallback(async (text: string, lang: string, token: number): Promise<void> => {
        return new Promise((resolve, reject) => {
            try {
                // Get URLs from google-tts-api
                const results = getAllAudioUrls(text, {
                    lang: lang === 'et' ? 'et' : lang, // Google TTS uses 'et' for Estonian, 'bn' for Bengali, etc.
                    slow: false,
                    host: 'https://translate.google.com',
                    splitPunct: ',.?!'
                });

                // Calculate cumulative ranges for chunks
                let charOffset = 0;
                const chunks = results.map(r => {
                    const start = charOffset;
                    const end = start + r.shortText.length;
                    charOffset = end + 1; // +1 to approximate space/gap
                    return {
                        url: `/api/proxy-audio?url=${encodeURIComponent(r.url)}`,
                        text: r.shortText,
                        start,
                        end
                    };
                });

                if (chunks.length === 0) {
                    resolve();
                    return;
                }

                const playNext = (index: number) => {
                    if (token !== playbackTokenRef.current) {
                        resolve();
                        return;
                    }
                    if (index >= chunks.length) {
                        resolve();
                        return;
                    }

                    const chunk = chunks[index];
                    const audio = new Audio(chunk.url);
                    audio.playbackRate = playbackRateRef.current;
                    audioRef.current = audio;

                    // Simulated Highlighting Loop
                    const updateProgress = () => {
                        // Stop if audio is no longer the current one or paused/ended
                        if (audioRef.current !== audio || audio.paused || audio.ended) return;

                        const duration = audio.duration;
                        const currentTime = audio.currentTime;

                        if (Number.isFinite(duration) && duration > 0) {
                            const progress = currentTime / duration;
                            // Estimate character position based on progress
                            const estimatedCharOffset = Math.floor(chunk.text.length * progress);
                            const globalCharIndex = chunk.start + estimatedCharOffset;

                            // Update range to be a "cursor" (1 char wide) so ReaderPage can check "contains"
                            setCurrentWordRange({
                                start: globalCharIndex,
                                end: globalCharIndex + 1
                            });
                        }

                        requestAnimationFrame(updateProgress);
                    };

                    audio.onplay = () => {
                        requestAnimationFrame(updateProgress);
                    };

                    audio.onended = () => {
                        playNext(index + 1);
                    };

                    audio.onerror = () => {
                        reject(new Error('Google TTS Audio playback failed'));
                    };

                    audio.play().catch(reject);
                };

                playNext(0);
            } catch (error) {
                setIsSpeaking(false);
                reject(error);
            }
        });
    }, []);


    // Moved trySpeechSynthesis up
    const trySpeechSynthesis = useCallback(async (text: string, lang: string, token: number): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (!('speechSynthesis' in window)) {
                reject(new Error('No TTS available'));
                return;
            }

            const utterance = new SpeechSynthesisUtterance(text);
            const voices = window.speechSynthesis.getVoices();

            const findBestVoice = (langPrefix: string) => {
                const langVoices = voices.filter(v => v.lang.startsWith(langPrefix));
                // Prioritize high quality voices
                const naturalVoice = langVoices.find(v =>
                    /natural|neural|premium|enhanced|wavenet/i.test(v.name)
                );
                const cloudVoice = langVoices.find(v => !v.localService);
                return naturalVoice || cloudVoice || langVoices[0];
            };

            // Generalized Voice Selection
            // 1. Try exact match (e.g., 'et-EE' or 'bn-BD')
            // 2. Try language prefix match (e.g., 'et' or 'bn')
            // 3. Fallback to specific hardcoded favorites if needed (like Estonian/Finnish)

            let selectedVoice = findBestVoice(lang);

            // Special handling for Estonian fallback to Finnish if needed (legacy logic preserved)
            if (!selectedVoice && lang === 'et') {
                selectedVoice = findBestVoice('fi');
            }

            // Fallback for Chinese (zh) - try zh-CN, zh-TW
            if (!selectedVoice && lang === 'zh') {
                selectedVoice = findBestVoice('zh-CN') || findBestVoice('zh-TW');
            }

            if (selectedVoice) {
                utterance.voice = selectedVoice;
                // Ensure utterance lang matches voice lang to avoid browser confusion
                utterance.lang = selectedVoice.lang;
            } else {
                // Critical: If NO voice found for this language, we cannot use Browser TTS reliably.
                // It will likely default to English and read garbage.
                // We should reject here so the caller can fallback to Google TTS.
                console.warn(`No Browser TTS voice found for language: ${lang}. Falling back.`);
                reject(new Error(`No voice found for ${lang}`));
                return;
            }

            utterance.rate = playbackRateRef.current;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;

            // Handle Boundary Events for Highlighting
            utterance.onboundary = (event) => {
                if (token !== playbackTokenRef.current) return;

                if (event.name === 'word') {
                    setCurrentWordRange({
                        start: event.charIndex,
                        end: event.charIndex + (event.charLength || 0)
                    });
                }
            };

            utterance.onend = () => {
                if (token !== playbackTokenRef.current) {
                    resolve();
                    return;
                }
                setCurrentWordRange(null);
                resolve();
            };

            utterance.onerror = (event) => {
                // Ignore interruption errors
                if (event.error !== 'interrupted' && event.error !== 'canceled') {
                    console.warn('Speech synthesis error:', event.error);
                }
                setCurrentWordRange(null);
                resolve(); // Resolve to allow flow to continue
            };

            window.speechSynthesis.speak(utterance);
        });
    }, []);


    const speak = useCallback(async (text: string, lang: string = 'et', options: { highlight?: boolean, onEnd?: () => void } = {}): Promise<void> => {
        return new Promise((resolve, reject) => {
            try {
                stopSpeaking(); // Use the new function to clear previous state
                setIsSpeaking(true);
                setIsPaused(false);
                setCurrentWordRange(null);
                const token = playbackTokenRef.current;

                // Strategy Update: Prefer High Quality Google TTS for EVERYTHING.
                // It now supports chunk highlighting (sentence/phrase level).

                // 1. Try Google TTS first (High Quality + Chunk Highlighting)
                tryGoogleTTS(text, lang, token)
                    .then(() => {
                        if (token === playbackTokenRef.current) {
                            options.onEnd?.();
                        }
                        resolve();
                    })
                    .catch((err) => {
                        console.warn('Google TTS failed, falling back to Browser TTS:', err);

                        // 2. Fallback to Browser TTS (Robotic + Word Highlighting)
                        return trySpeechSynthesis(text, lang, token);
                    })
                    .then(() => {
                        if (token === playbackTokenRef.current) {
                            options.onEnd?.();
                        }
                        resolve();
                    })
                    .catch(reject)
                    .finally(() => {
                        if (token !== playbackTokenRef.current) return;
                        setIsSpeaking(false);
                    });
            } catch (error) {
                setIsSpeaking(false);
                setCurrentWordRange(null);
                reject(error);
            }
        });
    }, [stopSpeaking, tryGoogleTTS, trySpeechSynthesis]);

    // Start speech recognition
    const startRecording = useCallback(async (): Promise<void> => {
        if (typeof window === 'undefined') return;

        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognitionAPI) {
            console.warn('Speech recognition not supported');
            return;
        }

        try {
            const recognition = new SpeechRecognitionAPI();
            recognitionRef.current = recognition;

            recognition.lang = 'et-EE';
            recognition.continuous = false;
            recognition.interimResults = true; // Show interim results for better UX
            recognition.maxAlternatives = 3;

            recognition.onstart = () => {
                setIsRecording(true);
                setTranscript('');
            };

            recognition.onresult = (event) => {
                let finalTranscript = '';
                let interimTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const result = event.results[i];
                    if (result.isFinal) {
                        finalTranscript += result[0].transcript;
                    } else {
                        interimTranscript += result[0].transcript;
                    }
                }

                setTranscript(finalTranscript || interimTranscript);
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsRecording(false);
            };

            recognition.onend = () => {
                setIsRecording(false);
            };

            recognition.start();
        } catch (error) {
            console.error('Failed to start speech recognition:', error);
            setIsRecording(false);
        }
    }, []);

    // Stop speech recognition
    const stopRecording = useCallback((): string => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }
        setIsRecording(false);
        return transcript;
    }, [transcript]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            if (audioRef.current) {
                audioRef.current.pause();
            }
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    // Load voices when component mounts
    useEffect(() => {
        if ('speechSynthesis' in window) {
            // Voices might not be loaded immediately
            window.speechSynthesis.getVoices();

            // Add listener for when voices are loaded
            window.speechSynthesis.onvoiceschanged = () => {
                window.speechSynthesis.getVoices();
            };
        }
    }, []);

    const speakStateless = useCallback(async (text: string, lang: string = 'et'): Promise<void> => {
        return new Promise((resolve, reject) => {
            try {
                const results = getAllAudioUrls(text, {
                    lang: lang === 'et' ? 'et' : lang,
                    slow: false,
                    host: 'https://translate.google.com',
                    splitPunct: ',.?!'
                });

                const urls = results.map(r => {
                    return `/api/proxy-audio?url=${encodeURIComponent(r.url)}`;
                });

                if (urls.length === 0) {
                    resolve();
                    return;
                }

                const playNext = (index: number) => {
                    if (index >= urls.length) {
                        resolve();
                        return;
                    }

                    const audio = new Audio(urls[index]);
                    // Don't assign to audioRef to avoid state interference

                    audio.onended = () => {
                        playNext(index + 1);
                    };

                    audio.onerror = () => {
                        reject(new Error('Audio playback failed'));
                    };

                    audio.play().catch(reject);
                };

                playNext(0);
            } catch (error) {
                reject(error);
            }
        });
    }, []);

    return {
        speak,
        speakStateless,
        startRecording,
        stopRecording,
        isRecording,
        isSpeaking,
        transcript,
        isSupported,
        stopSpeaking,
        pauseSpeaking,
        resumeSpeaking,
        isPaused,
        currentWordRange,
        playbackRate,
        setPlaybackRate
    };
}
