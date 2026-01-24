import { useState, useEffect } from 'react';
import Typewriter from './Typewriter';

/**
 * Reusable DialogueBox component with typewriter effect
 * @param {string} speakerName - Name of the speaker
 * @param {string} text - Dialogue text to display
 * @param {React.ReactNode} choices - Choices to show after text completes
 * @param {React.ReactNode} otherContent - Other content to show after text (e.g., continue button, input)
 * @param {boolean} skipTypewriter - Skip typewriter effect and show content immediately
 */
export default function DialogueBox({ speakerName, text, choices, otherContent, skipTypewriter = false }) {
    const [isTyping, setIsTyping] = useState(!skipTypewriter);

    // Reset typing state when text changes
    useEffect(() => {
        if (!skipTypewriter) {
            setIsTyping(true);
        }
    }, [text, skipTypewriter]);

    const handleTypingComplete = () => {
        setIsTyping(false);
    };

    return (
        <div className="dialogue-box">
            <h2 className="speaker-name">{speakerName}</h2>
            <div className="dialogue-content">
                {skipTypewriter ? (
                    <>
                        <p className="dialogue-text">{text}</p>
                        {choices}
                        {otherContent}
                    </>
                ) : (
                    <>
                        {isTyping ? (
                            <Typewriter text={text} onComplete={handleTypingComplete} />
                        ) : (
                            <>
                                {choices}
                                {otherContent}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
