import { useState, useEffect, useRef, useCallback } from 'react';

export interface AudioPlayerState {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    playbackRate: number;
    isLoading: boolean;
    error: string | null;
}

export interface AudioPlayerControls {
    play: () => void;
    pause: () => void;
    seek: (time: number) => void;
    setPlaybackRate: (rate: number) => void;
    togglePlayPause: () => void;
}

export function useAudioPlayer(audioUrl: string): [AudioPlayerState, AudioPlayerControls] {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [state, setState] = useState<AudioPlayerState>({
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        playbackRate: 1,
        isLoading: true,
        error: null
    });

    // Initialize audio element
    useEffect(() => {
        if (!audioUrl) {
            setState(prev => ({ ...prev, isLoading: false, error: 'No audio URL provided' }));
            return;
        }

        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        // Event handlers
        const handleLoadedMetadata = () => {
            setState(prev => ({
                ...prev,
                duration: audio.duration,
                isLoading: false,
                error: null
            }));
        };

        const handleTimeUpdate = () => {
            setState(prev => ({
                ...prev,
                currentTime: audio.currentTime
            }));
        };

        const handlePlay = () => {
            setState(prev => ({ ...prev, isPlaying: true }));
        };

        const handlePause = () => {
            setState(prev => ({ ...prev, isPlaying: false }));
        };

        const handleEnded = () => {
            setState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
            audio.currentTime = 0;
        };

        const handleError = (e: ErrorEvent) => {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: 'Failed to load audio'
            }));
        };

        const handleLoadStart = () => {
            setState(prev => ({ ...prev, isLoading: true }));
        };

        const handleCanPlay = () => {
            setState(prev => ({ ...prev, isLoading: false }));
        };

        // Attach event listeners
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('error', handleError as any);
        audio.addEventListener('loadstart', handleLoadStart);
        audio.addEventListener('canplay', handleCanPlay);

        // Load audio
        audio.load();

        // Cleanup
        return () => {
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('error', handleError as any);
            audio.removeEventListener('loadstart', handleLoadStart);
            audio.removeEventListener('canplay', handleCanPlay);
            audio.pause();
            audio.src = '';
        };
    }, [audioUrl]);

    // Control functions
    const play = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.play().catch(err => {
                console.error('Play error:', err);
                setState(prev => ({ ...prev, error: 'Failed to play audio' }));
            });
        }
    }, []);

    const pause = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
    }, []);

    const seek = useCallback((time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = Math.max(0, Math.min(time, audioRef.current.duration));
        }
    }, []);

    const setPlaybackRate = useCallback((rate: number) => {
        if (audioRef.current) {
            audioRef.current.playbackRate = rate;
            setState(prev => ({ ...prev, playbackRate: rate }));
        }
    }, []);

    const togglePlayPause = useCallback(() => {
        if (state.isPlaying) {
            pause();
        } else {
            play();
        }
    }, [state.isPlaying, play, pause]);

    const controls: AudioPlayerControls = {
        play,
        pause,
        seek,
        setPlaybackRate,
        togglePlayPause
    };

    return [state, controls];
}
