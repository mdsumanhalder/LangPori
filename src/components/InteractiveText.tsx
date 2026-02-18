import React from 'react';

interface InteractiveTextProps {
    text: string;
    onWordClick: (word: string, rect: DOMRect) => void;
}

export const InteractiveText: React.FC<InteractiveTextProps> = ({ text, onWordClick }) => {
    // Split text into words but keep delimiters to preserve spacing/punctuation structure if needed
    // Simple split by space first
    const words = text.split(' ');

    return (
        <span className="leading-relaxed">
            {words.map((word, index) => {
                // Clean word for checking, but display original
                // We want to make the 'word part' clickable, punctuation less so?
                // For simplicity, make the whole token clickable.

                return (
                    <React.Fragment key={index}>
                        <span
                            onClick={(e) => {
                                e.stopPropagation();
                                const rect = e.currentTarget.getBoundingClientRect();
                                // Clean the word for lookup (remove trailing punctuation)
                                const cleanWord = word.replace(/[.,!?;:"'()]/g, '');
                                if (cleanWord) {
                                    onWordClick(cleanWord, rect);
                                }
                            }}
                            className="inline-block cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded px-0.5 transition-colors -mx-0.5"
                        >
                            {word}
                        </span>
                        {/* Add space if not last word */}
                        {index < words.length - 1 && ' '}
                    </React.Fragment>
                );
            })}
        </span>
    );
};
