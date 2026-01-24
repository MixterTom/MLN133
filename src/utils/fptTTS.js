/**
 * FPT AI Text-to-Speech Service
 * 
 * Hướng dẫn sử dụng:
 * 1. Đăng ký tại https://fpt.ai/
 * 2. Vào Console → Text to Speech → Tạo API Key
 * 3. Thay YOUR_API_KEY_HERE bằng API key của bạn
 */

// API Key FPT AI
const FPT_API_KEY = 'yumz6d2GbPxDxE5l4ydKK1YpFVfeFFEf';

// Các giọng đọc tiếng Việt có sẵn
export const VOICES = {
    // Giọng nữ miền Bắc
    FEMALE_NORTH: {
        banmai: 'banmai',      // Giọng Ban Mai - nữ miền Bắc
        thuminh: 'thuminh',    // Giọng Thu Minh - nữ miền Bắc
        leminh: 'leminh',      // Giọng Lê Minh - nữ miền Bắc
    },
    // Giọng nam miền Bắc
    MALE_NORTH: {
        phuongtrang: 'phuongtrang', // Giọng Phương Trang - nam miền Bắc
        minhquang: 'minhquang',     // Giọng Minh Quang - nam miền Bắc
    },
    // Giọng nữ miền Nam
    FEMALE_SOUTH: {
        myan: 'myan',           // Giọng My An - nữ miền Nam
        lannhi: 'lannhi',       // Giọng Lan Nhi - nữ miền Nam
    },
    // Giọng nam miền Nam
    MALE_SOUTH: {
        giahuy: 'giahuy',       // Giọng Gia Huy - nam miền Nam
    },
    // Giọng nữ miền Trung
    FEMALE_CENTRAL: {
        linhsan: 'linhsan',     // Giọng Linh San - nữ miền Trung
    },
};

// Map nhân vật với giọng đọc
// Nữ = linhsan (miền Trung), Nam = minhquang (miền Bắc)
export const CHARACTER_VOICES = {
    'Narrator': VOICES.FEMALE_CENTRAL.linhsan,
    'Bà Tiên Duyên': VOICES.FEMALE_CENTRAL.linhsan,
    'Bố': VOICES.MALE_NORTH.minhquang,
    'Mẹ': VOICES.FEMALE_CENTRAL.linhsan,
    'Bạn thân': VOICES.MALE_NORTH.minhquang,
    'Hùng': VOICES.MALE_NORTH.minhquang,
    // Nhân vật chính - sẽ được set dựa trên giới tính
    'player_male': VOICES.MALE_NORTH.minhquang,
    'player_female': VOICES.FEMALE_CENTRAL.linhsan,
};

// Cache audio để không gọi API lại
const audioCache = new Map();

/**
 * Tạo audio từ text sử dụng FPT AI
 * @param {string} text - Text cần chuyển thành giọng nói
 * @param {string} voice - Tên giọng đọc (default: banmai)
 * @param {string} speed - Tốc độ đọc: -3 đến 3 (default: 0)
 * @returns {Promise<string>} - URL của audio file
 */
export async function textToSpeech(text, voice = 'linhsan', speed = '0') {
    // Check cache
    const cacheKey = `${text}_${voice}_${speed}`;
    if (audioCache.has(cacheKey)) {
        return audioCache.get(cacheKey);
    }

    try {
        const response = await fetch('https://api.fpt.ai/hmi/tts/v5', {
            method: 'POST',
            headers: {
                'api-key': FPT_API_KEY,
                'speed': speed,
                'voice': voice,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: text,
        });

        if (!response.ok) {
            throw new Error(`FPT AI Error: ${response.status}`);
        }

        const data = await response.json();

        if (data.error === 0 && data.async) {
            // FPT AI trả về URL async, cần đợi file được tạo
            const audioUrl = data.async;
            audioCache.set(cacheKey, audioUrl);
            return audioUrl;
        } else {
            throw new Error(data.message || 'Unknown error');
        }
    } catch (error) {
        console.error('FPT AI TTS Error:', error);
        return null;
    }
}

/**
 * Phát audio từ URL
 * @param {string} audioUrl - URL của audio file
 * @param {number} volume - Âm lượng 0-1 (default: 1)
 * @returns {Promise<HTMLAudioElement>}
 */
export function playAudio(audioUrl, volume = 1) {
    return new Promise((resolve, reject) => {
        if (!audioUrl) {
            reject(new Error('No audio URL'));
            return;
        }

        const audio = new Audio(audioUrl);
        audio.volume = volume;

        audio.onended = () => resolve(audio);
        audio.onerror = (e) => reject(e);

        // Delay nhỏ để đảm bảo file đã được tạo xong
        setTimeout(() => {
            audio.play().catch(reject);
        }, 500);
    });
}

/**
 * Text-to-Speech và phát audio
 * @param {string} text - Text cần đọc
 * @param {string} character - Tên nhân vật (để chọn giọng)
 * @param {string} playerGender - Giới tính người chơi ('male' hoặc 'female')
 */
export async function speakText(text, character = 'Narrator', playerGender = 'male') {
    // Xác định giọng đọc dựa trên nhân vật
    let voice = CHARACTER_VOICES[character] || VOICES.FEMALE_CENTRAL.linhsan;

    // Nếu là nhân vật chính, chọn giọng theo giới tính
    if (character === 'player') {
        voice = playerGender === 'male'
            ? CHARACTER_VOICES.player_male
            : CHARACTER_VOICES.player_female;
    }

    // Gọi API và phát audio
    const audioUrl = await textToSpeech(text, voice);
    if (audioUrl) {
        await playAudio(audioUrl);
    }
}

/**
 * Dừng tất cả audio đang phát
 */
export function stopAllAudio() {
    // Tìm và dừng tất cả audio elements
    const audios = document.querySelectorAll('audio');
    audios.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
}

/**
 * Preload audio cho một scene (để giảm delay)
 * @param {Array<{text: string, character: string}>} dialogues
 */
export async function preloadSceneAudio(dialogues) {
    const promises = dialogues.map(({ text, character }) => {
        const voice = CHARACTER_VOICES[character] || VOICES.FEMALE_CENTRAL.linhsan;
        return textToSpeech(text, voice);
    });

    await Promise.all(promises);
    console.log('Scene audio preloaded!');
}

export default {
    textToSpeech,
    playAudio,
    speakText,
    stopAllAudio,
    preloadSceneAudio,
    VOICES,
    CHARACTER_VOICES,
};
