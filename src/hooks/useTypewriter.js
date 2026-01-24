import { useState, useEffect } from 'react';

/**
 * Custom hook for managing typewriter effect state
 * @param {any} trigger - Value that triggers state reset (usually step or text)
 * @returns {[boolean, () => void]} - [isTyping, handleComplete]
 */
export function useTypewriter(trigger) {
    const [isTyping, setIsTyping] = useState(true);

    // Reset typing state when trigger changes
    useEffect(() => {
        setIsTyping(true);
    }, [trigger]);

    const handleComplete = () => {
        setIsTyping(false);
    };

    return [isTyping, handleComplete];
}
