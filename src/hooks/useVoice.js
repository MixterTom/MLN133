import { useState, useCallback, useRef } from 'react';
import { speakText, stopAllAudio, VOICES, CHARACTER_VOICES } from '../utils/fptTTS';

/**
 * Hook để sử dụng FPT AI Text-to-Speech trong components
 * 
 * Cách dùng:
 * const { speak, stop, isSpeaking, isEnabled, toggleVoice } = useVoice();
 * 
 * // Phát giọng nói
 * speak("Xin chào!", "Narrator");
 * 
 * // Dừng
 * stop();
 */
export function useVoice(playerGender = 'male') {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isEnabled, setIsEnabled] = useState(true);
    const currentAudioRef = useRef(null);

    // Phát giọng nói
    const speak = useCallback(async (text, character = 'Narrator') => {
        if (!isEnabled || !text) return;

        try {
            setIsSpeaking(true);
            await speakText(text, character, playerGender);
        } catch (error) {
            console.error('Voice error:', error);
        } finally {
            setIsSpeaking(false);
        }
    }, [isEnabled, playerGender]);

    // Dừng audio
    const stop = useCallback(() => {
        stopAllAudio();
        setIsSpeaking(false);
    }, []);

    // Bật/tắt voice
    const toggleVoice = useCallback(() => {
        setIsEnabled(prev => !prev);
        if (isSpeaking) {
            stop();
        }
    }, [isSpeaking, stop]);

    return {
        speak,
        stop,
        isSpeaking,
        isEnabled,
        toggleVoice,
        setIsEnabled,
    };
}

export default useVoice;
