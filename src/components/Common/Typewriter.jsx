import { useState, useEffect, useRef, useCallback } from 'react';
import { textToSpeech, CHARACTER_VOICES, VOICES } from '../../utils/fptTTS';

// Global audio reference để dừng audio khi chuyển dialogue
let globalAudio = null;
let currentTextId = 0; // Track which dialogue we're on

/**
 * Stop any currently playing audio
 */
function stopCurrentAudio() {
    if (globalAudio) {
        globalAudio.pause();
        globalAudio.currentTime = 0;
        globalAudio = null;
    }
}

/**
 * Typewriter component with FPT AI Voice
 */
const Typewriter = ({
    text,
    onComplete,
    speed = 70,
    enableVoice = true,
}) => {
    const [displayedText, setDisplayedText] = useState('');
    const indexRef = useRef(0);
    const lastTextRef = useRef('');
    const textIdRef = useRef(0);

    // Get speaker from DOM
    const getSpeaker = useCallback(() => {
        const el = document.querySelector('.speaker-name');
        if (el) {
            return el.textContent
                .replace(/[✨🎙️?]/g, '')
                .replace(/\s*\(.*\)\s*/g, '')
                .trim() || 'Narrator';
        }
        return 'Narrator';
    }, []);

    // Clean text for TTS
    const cleanText = useCallback((t) => {
        return t
            .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
            .replace(/[📅🎓💼✈️🌙🏠💡📚📖📝🎮📱😴🎉💰🔧🤝📈💸😤🌍💪😰😢✨⚖️❤️🔊🔇🎙️]/g, '')
            .replace(/\.\.\./g, '. ')
            .replace(/\n+/g, ' ')
            .trim();
    }, []);

    // Play voice - runs when text changes
    useEffect(() => {
        // ALWAYS stop previous audio first
        stopCurrentAudio();

        if (!enableVoice || !text || text.length < 5) return;

        // Prevent same text from playing again
        if (lastTextRef.current === text) return;

        lastTextRef.current = text;

        // Increment and save current text ID
        currentTextId++;
        const myTextId = currentTextId;
        textIdRef.current = myTextId;

        const speaker = getSpeaker();
        const voice = CHARACTER_VOICES[speaker] || VOICES.FEMALE_CENTRAL.linhsan;
        const cleanedText = cleanText(text);

        if (cleanedText.length < 5) return;

        console.log(`[TTS] #${myTextId} ${speaker}: "${cleanedText.substring(0, 30)}..."`);

        // Call FPT API
        textToSpeech(cleanedText, voice, '0')
            .then(audioUrl => {
                // Only skip if a NEWER dialogue has started
                if (currentTextId !== myTextId) {
                    console.log(`[TTS] #${myTextId} Newer dialogue exists, skip`);
                    return;
                }

                if (!audioUrl) {
                    console.log(`[TTS] #${myTextId} No URL`);
                    return;
                }

                console.log(`[TTS] #${myTextId} Got URL, waiting for FPT...`);

                // Wait for FPT to generate the audio file
                setTimeout(() => {
                    // Check again if we're still the current dialogue
                    if (currentTextId !== myTextId) {
                        console.log(`[TTS] #${myTextId} Newer dialogue, skip play`);
                        return;
                    }

                    // Stop any current audio
                    stopCurrentAudio();

                    const audio = new Audio(audioUrl);
                    audio.volume = 0.8;
                    globalAudio = audio;

                    audio.onended = () => {
                        if (globalAudio === audio) {
                            globalAudio = null;
                        }
                    };

                    audio.onerror = () => {
                        console.log(`[TTS] #${myTextId} Audio error`);
                    };

                    audio.play()
                        .then(() => console.log(`[TTS] #${myTextId} Playing!`))
                        .catch(err => console.log(`[TTS] #${myTextId} Play failed:`, err.message));
                }, 1200);
            })
            .catch(err => {
                console.error(`[TTS] #${myTextId} API Error:`, err);
            });

        // Cleanup
        return () => {
            stopCurrentAudio();
        };
    }, [text, enableVoice, getSpeaker, cleanText]);

    // Typewriter animation
    useEffect(() => {
        setDisplayedText('');
        indexRef.current = 0;

        const intervalId = setInterval(() => {
            if (indexRef.current < text.length) {
                setDisplayedText(prev => prev + text.charAt(indexRef.current));
                indexRef.current++;

                const el = document.querySelector('.dialogue-content');
                if (el) el.scrollTop = el.scrollHeight;
            } else {
                clearInterval(intervalId);
                if (onComplete) onComplete();
            }
        }, speed);

        return () => clearInterval(intervalId);
    }, [text, onComplete, speed]);

    return <p className="dialogue-text">{displayedText}</p>;
};

export default Typewriter;
