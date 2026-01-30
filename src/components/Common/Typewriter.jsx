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

    const intervalRef = useRef(null);
    const skippedRef = useRef(false);
    const hasCompletedRef = useRef(false);

    // Skip animation function - hiển thị đầy đủ text ngay lập tức
    // KHÔNG gọi onComplete ngay - để text vẫn hiển thị cho người dùng đọc
    const skipAnimation = useCallback(() => {
        // Chỉ skip nếu đang typing và chưa complete
        if (displayedText.length >= text.length) {
            return;
        }

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        
        skippedRef.current = true;
        
        // Hiển thị toàn bộ text ngay lập tức - QUAN TRỌNG: text phải hiển thị đầy đủ
        setDisplayedText(text);
        indexRef.current = text.length;
        
        // Scroll to bottom để đảm bảo thấy hết nội dung
        setTimeout(() => {
            const el = document.querySelector('.dialogue-content');
            if (el) {
                el.scrollTop = el.scrollHeight;
            }
        }, 10);
        
        // KHÔNG gọi onComplete ở đây - để text vẫn hiển thị
        // onComplete sẽ được gọi khi text tự động hoàn thành hoặc khi người dùng click tiếp
    }, [text, displayedText.length]);

    // Keyboard shortcut: Space to skip
    useEffect(() => {
        const handleKeyPress = (e) => {
            // Only skip if typing and Space key is pressed (not when typing in input)
            if (e.code === 'Space' && displayedText.length < text.length) {
                const target = e.target;
                // Don't skip if user is typing in an input/textarea
                if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    skipAnimation();
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [displayedText.length, text.length, skipAnimation]);

    // Typewriter animation
    useEffect(() => {
        setDisplayedText('');
        indexRef.current = 0;
        skippedRef.current = false;
        hasCompletedRef.current = false;

        intervalRef.current = setInterval(() => {
            // Nếu đã skip thì không cần tiếp tục animation
            // KHÔNG gọi onComplete ở đây - sẽ được gọi khi user click tiếp
            if (skippedRef.current) {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
                return;
            }

            if (indexRef.current < text.length) {
                setDisplayedText(prev => prev + text.charAt(indexRef.current));
                indexRef.current++;

                const el = document.querySelector('.dialogue-content');
                if (el) el.scrollTop = el.scrollHeight;
            } else {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
                // Gọi onComplete khi text tự động hoàn thành
                if (!hasCompletedRef.current && onComplete) {
                    hasCompletedRef.current = true;
                    onComplete();
                }
            }
        }, speed);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [text, onComplete, speed]);

    // Show skip option only when typing and not completed
    const isTyping = displayedText.length < text.length;

    // Click anywhere on screen to skip dialogue animation hoặc tiếp tục
    useEffect(() => {
        const handleClick = (e) => {
            // Không xử lý nếu click vào button, input, hoặc các element tương tác
            const target = e.target;
            const isInteractive = target.tagName === 'BUTTON' || 
                                  target.tagName === 'INPUT' || 
                                  target.tagName === 'TEXTAREA' ||
                                  target.closest('button') ||
                                  target.closest('input') ||
                                  target.closest('textarea') ||
                                  target.closest('.choice-btn') ||
                                  target.closest('.continue-btn');
            
            if (isInteractive) {
                return;
            }

            // Nếu đang typing: skip animation và hiển thị text đầy đủ
            if (isTyping) {
                skipAnimation();
            } 
            // Nếu text đã đầy đủ và chưa gọi onComplete: gọi onComplete để tiếp tục
            else if (displayedText.length >= text.length && !hasCompletedRef.current && onComplete) {
                hasCompletedRef.current = true;
                onComplete();
            }
        };

        // Thêm listener
        window.addEventListener('click', handleClick);
        
        return () => {
            window.removeEventListener('click', handleClick);
        };
    }, [isTyping, displayedText.length, text.length, skipAnimation, onComplete]);

    return (
        <div className="typewriter-container">
            <p className="dialogue-text">{displayedText}</p>
        </div>
    );
};

export default Typewriter;
