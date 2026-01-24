/**
 * Voice Preloader - Tải trước tất cả voice cho chapter
 * Giúp voice chạy ổn định, không bị miss
 */

import { textToSpeech, CHARACTER_VOICES, VOICES } from './fptTTS';

// Cache cho preloaded audio
const voiceCache = new Map();

// Status tracking
let isPreloading = false;
let preloadProgress = 0;
let preloadTotal = 0;

/**
 * Clean text để đọc
 */
function cleanTextForSpeech(text) {
    return text
        .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
        .replace(/[📅🎓💼✈️🌙🏠💡📚📖📝🎮📱😴🎉💰🔧🤝📈💸😤🌍💪😰😢✨⚖️❤️🔊🔇🎙️]/g, '')
        .replace(/\.\.\./g, '. ')
        .replace(/\n\n/g, '. ')
        .replace(/\n/g, ' ')
        .replace(/\{state\.player\.name\}/g, 'bạn')
        .trim();
}

/**
 * Lấy giọng đọc cho character
 */
function getVoiceForCharacter(character) {
    if (CHARACTER_VOICES[character]) {
        return CHARACTER_VOICES[character];
    }
    // Default to female voice
    return VOICES.FEMALE_CENTRAL.linhsan;
}

/**
 * Preload một dialogue
 */
async function preloadDialogue(text, character = 'Narrator') {
    const cleanText = cleanTextForSpeech(text);
    if (!cleanText || cleanText.length < 2) return null;

    const cacheKey = `${character}_${cleanText.substring(0, 50)}`;

    // Skip if already cached
    if (voiceCache.has(cacheKey)) {
        return voiceCache.get(cacheKey);
    }

    const voice = getVoiceForCharacter(character);

    try {
        const audioUrl = await textToSpeech(cleanText, voice, '0');
        if (audioUrl) {
            voiceCache.set(cacheKey, { audioUrl, character, text: cleanText });
            return audioUrl;
        }
    } catch (error) {
        console.error(`[VoicePreload] Error for "${character}":`, error);
    }

    return null;
}

/**
 * Preload nhiều dialogues
 * @param {Array<{text: string, character: string}>} dialogues
 */
export async function preloadDialogues(dialogues) {
    if (isPreloading) {
        console.warn('[VoicePreload] Already preloading...');
        return;
    }

    isPreloading = true;
    preloadProgress = 0;
    preloadTotal = dialogues.length;

    console.log(`[VoicePreload] Starting preload of ${preloadTotal} dialogues...`);

    // Preload in batches of 5 to avoid overwhelming the API
    const batchSize = 5;
    for (let i = 0; i < dialogues.length; i += batchSize) {
        const batch = dialogues.slice(i, i + batchSize);

        await Promise.all(
            batch.map(async ({ text, character }) => {
                await preloadDialogue(text, character);
                preloadProgress++;
            })
        );

        console.log(`[VoicePreload] Progress: ${preloadProgress}/${preloadTotal}`);

        // Small delay between batches
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    isPreloading = false;
    console.log(`[VoicePreload] Complete! Cached ${voiceCache.size} voices.`);
}

/**
 * Lấy audio URL từ cache
 */
export function getCachedAudio(text, character = 'Narrator') {
    const cleanText = cleanTextForSpeech(text);
    const cacheKey = `${character}_${cleanText.substring(0, 50)}`;

    const cached = voiceCache.get(cacheKey);
    return cached ? cached.audioUrl : null;
}

/**
 * Phát audio từ cache hoặc generate mới
 */
export async function playVoice(text, character = 'Narrator') {
    let audioUrl = getCachedAudio(text, character);

    // If not cached, generate now
    if (!audioUrl) {
        audioUrl = await preloadDialogue(text, character);
    }

    if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.volume = 0.8;

        try {
            await audio.play();
            return audio;
        } catch (err) {
            console.log('[VoicePreload] Autoplay blocked:', err.message);
        }
    }

    return null;
}

/**
 * Lấy tiến độ preload
 */
export function getPreloadProgress() {
    return {
        isPreloading,
        progress: preloadProgress,
        total: preloadTotal,
        percent: preloadTotal > 0 ? Math.round((preloadProgress / preloadTotal) * 100) : 0
    };
}

/**
 * Clear cache
 */
export function clearVoiceCache() {
    voiceCache.clear();
    console.log('[VoicePreload] Cache cleared');
}

/**
 * Extract dialogues từ Chapter data
 * Helper function để parse dialogues từ component
 */
export function extractDialoguesFromText(textArray) {
    // textArray = [ { text: "...", speaker: "Narrator" }, ... ]
    return textArray.map(item => ({
        text: item.text,
        character: item.speaker || 'Narrator'
    }));
}

export default {
    preloadDialogues,
    getCachedAudio,
    playVoice,
    getPreloadProgress,
    clearVoiceCache,
    extractDialoguesFromText
};
