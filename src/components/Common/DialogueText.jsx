import Typewriter from './Typewriter';

/**
 * DialogueText - Simplified wrapper for Typewriter
 * Automatically advances to next dialogue on second click
 * No need for "Continue" button
 */
export default function DialogueText({ text, onComplete }) {
    return <Typewriter text={text} onComplete={onComplete} />;
}
