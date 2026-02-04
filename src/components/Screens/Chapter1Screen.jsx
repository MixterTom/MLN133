import { useState, useEffect } from 'react';
import { useGame } from '../../contexts/GameContext';
import StatsPanel from '../UI/StatsPanel';
import CafeQTE from '../MiniGames/CafeQTE';
import LatteArtGame from '../MiniGames/LatteArtGame';
import ExamGame from '../MiniGames/ExamGame';
import InterviewGame from '../MiniGames/InterviewGame';
import DateGame from '../MiniGames/DateGame';
import StudyGroupGame from '../MiniGames/StudyGroupGame';
import PathCollectorGame from '../MiniGames/PathCollectorGame';
import SceneBackground from '../Common/SceneBackground';
import Typewriter from '../Common/Typewriter';
import { preloadDialogues, getPreloadProgress } from '../../utils/voicePreloader';
import { getChapter1Dialogues } from '../../data/chapter1Dialogues';
import './PrologueScreen.css';

export default function Chapter1Screen() {
    const { state, updateStats, setScreen, addChoice, setFlag } = useGame();

    // Load scenario and step from saved state, or use defaults
    const [scenario, setScenarioState] = useState(state.flags.chapter1_scenario || 'graduation');
    const [showChoices, setShowChoices] = useState(false); // For showing choices after typing
    const [step, setStepState] = useState(state.flags.chapter1_step || 0);
    const [showMiniGame, setShowMiniGame] = useState(false);
    const [miniGameType, setMiniGameType] = useState(null);
    const [selectedPath, setSelectedPath] = useState(null); // Track selected path for mini-game
    const [audioEnabled, setAudioEnabled] = useState(state.flags.audio_enabled || false); // Track if user has enabled audio
    const [voicePreloadDone, setVoicePreloadDone] = useState(false);

    // Reset showChoices when step changes
    useEffect(() => {
        setShowChoices(false);
    }, [step]);

    // Sync local state with flags when they change (e.g., after loading saved game)
    useEffect(() => {
        if (state.flags.chapter1_scenario && state.flags.chapter1_scenario !== scenario) {
            setScenarioState(state.flags.chapter1_scenario);
        }
        if (state.flags.chapter1_step !== undefined && state.flags.chapter1_step !== step) {
            setStepState(state.flags.chapter1_step);
        }
        if (state.flags.audio_enabled !== undefined && state.flags.audio_enabled !== audioEnabled) {
            setAudioEnabled(state.flags.audio_enabled);
        }
    }, [state.flags]);

    // Preload voices when audio is enabled
    useEffect(() => {
        if (audioEnabled && !voicePreloadDone) {
            console.log('[Chapter1] Starting voice preload...');
            const dialogues = getChapter1Dialogues();
            preloadDialogues(dialogues).then(() => {
                setVoicePreloadDone(true);
                console.log('[Chapter1] Voice preload complete!');
            });
        }
    }, [audioEnabled, voicePreloadDone]);

    // Enable audio function (needed for browser autoplay policy)
    const enableAudio = async () => {
        // First unlock audio context with silent audio
        const silentAudio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA');
        try {
            await silentAudio.play();
        } catch (e) {
            console.log('Silent audio failed, continuing...');
        }

        // Enable state immediately
        setAudioEnabled(true);
        setFlag('audio_enabled', true);

        // Play test voice using FPT AI
        try {
            const { textToSpeech } = await import('../../utils/fptTTS');
            const testText = 'Xin chào! Lồng tiếng đã được bật. Chúc bạn chơi game vui vẻ!';
            const audioUrl = await textToSpeech(testText, 'banmai', '0');

            if (audioUrl) {
                setTimeout(() => {
                    const testAudio = new Audio(audioUrl);
                    testAudio.volume = 0.8;
                    testAudio.play().catch(err => console.log('Test audio failed:', err));
                }, 500);
            }
        } catch (err) {
            console.log('Test voice failed:', err);
        }
    };

    // Wrapper functions to save scenario/step to flags
    const setScenario = (newScenario) => {
        setScenarioState(newScenario);
        setFlag('chapter1_scenario', newScenario);
    };

    const setStep = (newStep) => {
        setStepState(newStep);
        setFlag('chapter1_step', newStep);
    };



    const handleMiniGameComplete = (score) => {
        const currentGameType = miniGameType; // Lưu lại trước khi reset
        setShowMiniGame(false);
        setMiniGameType(null);

        // Handle different mini-game results
        if (currentGameType === 'study_group') {
            // Study group results with feedback
            if (score >= 80) {
                // Xuất sắc - Học nhóm hiệu quả
                updateStats({ knowledge: 30, social: 15, happiness: 10 });
                setFlag('study_performance', 'excellent');
            } else if (score >= 50) {
                // Tốt - Học được nhiều
                updateStats({ knowledge: 20, social: 10 });
                setFlag('study_performance', 'good');
            } else if (score >= 30) {
                // Trung bình - Học được ít
                updateStats({ knowledge: 10, social: 5 });
                setFlag('study_performance', 'average');
            } else {
                // Kém - Mất tập trung, không hiệu quả
                updateStats({ knowledge: -10, happiness: -10 });
                setFlag('study_performance', 'poor');
            }
        } else if (currentGameType === 'latte_art') {
            // Latte Art results - determines cafe type
            // Result already contains bonusStats, just apply them
            // Cafe type is stored in flags by the game
            // Don't apply stats here, will be applied after CafeQTE
        } else if (currentGameType === 'cafe') {
            // Cafe QTE results with feedback
            if (score >= 80) {
                // Xuất sắc - Được khen
                updateStats({ economy: 30, happiness: 15, social: 10 });
                setFlag('cafe_performance', 'excellent');
            } else if (score >= 60) {
                // Tốt - Bình thường
                updateStats({ economy: 20, happiness: 5 });
                setFlag('cafe_performance', 'good');
            } else {
                // Kém - Bị chê và trừ điểm
                updateStats({ economy: 10, happiness: -15, social: -5 });
                setFlag('cafe_performance', 'poor');
            }
        } else if (currentGameType === 'exam') {
            if (score >= 80) {
                updateStats({ knowledge: 30, happiness: 20 });
            } else if (score >= 60) {
                updateStats({ knowledge: 20, happiness: 10 });
            } else {
                updateStats({ knowledge: 10, happiness: -10 });
            }
        } else if (currentGameType === 'interview') {
            if (score >= 50) {
                updateStats({ economy: 25, social: 15 });
                setFlag('got_job', true);
            } else {
                updateStats({ happiness: -15 });
                setFlag('got_job', false);
            }
        } else if (currentGameType === 'date') {
            if (score >= 80) {
                updateStats({ happiness: 30, social: 20 });
            } else if (score >= 50) {
                updateStats({ happiness: 15, social: 10 });
            } else {
                updateStats({ happiness: 5, social: 5 });
            }
        }

        setStep(step + 1);
    };

    // Handler for Path Collector mini-game
    const handlePathCollectorComplete = (result) => {
        setShowMiniGame(false);
        setMiniGameType(null);

        const { score, result: quality, pathType, bonusStats } = result;

        // Set quality flag based on result
        setFlag(`${pathType}_quality`, quality);

        // Apply bonus stats from mini-game
        if (bonusStats) {
            updateStats(bonusStats);
        }

        // Add choice based on path and quality
        if (pathType === 'university') {
            if (quality === 'excellent') {
                addChoice({ type: 'education', value: 'university_top' });
            } else if (quality === 'good') {
                addChoice({ type: 'education', value: 'university_good' });
            } else if (quality === 'average') {
                addChoice({ type: 'education', value: 'university_normal' });
            } else {
                addChoice({ type: 'education', value: 'university_private' });
            }
            setFlag('education_path', 'university');
            setScenario('university');
        } else if (pathType === 'work') {
            if (quality === 'excellent') {
                addChoice({ type: 'education', value: 'work_big_company' });
            } else if (quality === 'good') {
                addChoice({ type: 'education', value: 'work_good_company' });
            } else if (quality === 'average') {
                addChoice({ type: 'education', value: 'work_normal' });
            } else {
                addChoice({ type: 'education', value: 'work_labor' });
            }
            setFlag('education_path', 'work');
            setScenario('work_early');
        } else if (pathType === 'study_abroad') {
            if (quality === 'excellent') {
                addChoice({ type: 'education', value: 'study_abroad_scholarship' });
            } else if (quality === 'good') {
                addChoice({ type: 'education', value: 'study_abroad_success' });
            } else if (quality === 'average') {
                addChoice({ type: 'education', value: 'study_abroad_struggle' });
            } else {
                addChoice({ type: 'education', value: 'study_abroad_failed' });
                // If failed study abroad, stay in Vietnam
                setFlag('education_path', 'university');
                setScenario('university');
                setStep(0);
                setSelectedPath(null);
                return;
            }
            setFlag('education_path', 'study_abroad');
            setScenario('study_abroad');
        }

        setStep(0);
        setSelectedPath(null);
    };

    // Handler for Latte Art mini-game
    const handleLatteArtComplete = (result) => {
        setShowMiniGame(false);
        setMiniGameType(null);

        const { score, accuracy, result: quality, cafeType, bonusStats } = result;

        // Store cafe type in flags
        setFlag('cafe_type', cafeType);
        setFlag('latte_art_score', score);

        // Apply bonus stats from latte art
        if (bonusStats) {
            updateStats(bonusStats);
        }

        // Continue to next step (meeting cafe owner)
        setStep(step + 1);
    };

    // Helper function to get player sprite based on gender and emotion
    const getPlayerSprite = (emotion = 'nghiêm_túc') => {
        const gender = state.player.gender === 'male' ? 'con_trai' : 'con_gái';
        return `/src/assets/characters/${gender}_${emotion}.png`;
    };

    // SCENARIO 1.1: Tốt nghiệp phổ thông (IMPROVED)
    if (scenario === 'graduation') {
        // Show audio enable overlay if not enabled yet
        if (!audioEnabled && step === 0) {
            return (
                <SceneBackground sceneKey="chapter1_memory">
                    <StatsPanel />
                    <div className="audio-enable-overlay">
                        <div className="audio-enable-box">
                            <h2>🎙️ Bật Lồng Tiếng</h2>
                            <p>Game có hỗ trợ lồng tiếng AI cho các nhân vật.</p>
                            <p>Bạn có muốn bật lồng tiếng không?</p>
                            <div className="audio-buttons">
                                <button className="choice-btn" onClick={enableAudio}>
                                    <span className="choice-title">🔊 Có, bật lồng tiếng</span>
                                </button>
                                <button className="choice-btn secondary" onClick={() => setAudioEnabled(true)}>
                                    <span className="choice-title">🔇 Không, chơi không tiếng</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        // Step 0: Flashback - Ước mơ tuổi thơ
        if (step === 0) {
            const text = `✨ Hồi ức - 10 năm trước...

"Con lớn lên muốn làm gì?"

Câu hỏi đó vang vọng trong ký ức của ${state.player.name}...

Ngày đó, câu trả lời thật đơn giản. Nhưng giờ đây, khi đứng trước ngưỡng cửa cuộc đời...`;

            return (
                <SceneBackground sceneKey="chapter1_memory">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter text={text} onComplete={() => setStep(1)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        // Step 1: Đêm trước lễ tốt nghiệp
        if (step === 1) {
            return (
                <SceneBackground sceneKey="chapter1_night_before_grad">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter text={`🌙 Đêm trước lễ tốt nghiệp...

${state.player.name} trằn trọc không ngủ được.

12 năm đèn sách... Bao nhiêu kỷ niệm, bao nhiêu người bạn...

Và ngày mai, tất cả sẽ thay đổi.`} onComplete={() => setStep(2)} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        // Step 2: Sáng - Mẹ đánh thức
        if (step === 2) {
            return (
                <SceneBackground sceneKey="chapter1_wakeup">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/mẹ_vui_vẻ.png" alt="Mẹ" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Mẹ</h2>
                        <div className="dialogue-content">
                            <Typewriter text={`Con ơi, dậy đi! Hôm nay là ngày trọng đại của con rồi!

Mẹ đã chuẩn bị áo dài cho con mặc. Nhanh lên kẻo trễ lễ tốt nghiệp!

Bố con đang đợi ở dưới nhà rồi đấy!`} onComplete={() => setStep(3)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        // Step 3: Lễ tốt nghiệp
        if (step === 3) {
            return (
                <SceneBackground sceneKey="chapter1_graduation">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter text={`🎓 Lễ tốt nghiệp - Trường THPT...

Sân trường rực rỡ cờ hoa. Tiếng vỗ tay vang lên khi từng học sinh lên nhận bằng.

Khi ${state.player.name} cầm tấm bằng trên tay, tim đập thật nhanh...

Vừa vui, vừa lo... Tương lai đang chờ phía trước.`} onComplete={() => setStep(4)} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        // Step 4: Gặp bạn thân Minh
        if (step === 4) {
            return (
                <SceneBackground sceneKey="chapter1_graduation">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/bạn_thân_vui_vẻ.png" alt="Minh" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Minh (Bạn thân)</h2>
                        <div className="dialogue-content">
                            <Typewriter text={`${state.player.name} ơi! Chúng mình tốt nghiệp rồi!

12 năm học chung, giờ cuối cùng cũng xong rồi!

Mà này, mày định làm gì sau này? Tao nghe nói mày được mấy trường đại học nhận rồi phải không?`} onComplete={() => setStep(5)} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        // Step 5: Player trả lời Minh
        if (step === 5) {
            return (
                <SceneBackground sceneKey="chapter1_graduation">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={getPlayerSprite('lo_lắng')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{state.player.name}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={`Ừ... tao được mấy trường nhận, nhưng tao chưa biết chọn đâu...

Đại học, đi làm, hay du học... Mỗi con đường đều có cái hay riêng.

Tao đang phân vân lắm, Minh ạ...`} onComplete={() => setStep(6)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        // Step 6: Minh động viên
        if (step === 6) {
            return (
                <SceneBackground sceneKey="chapter1_graduation">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/bạn_thân_nghiêm_túc.png" alt="Minh" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Minh (Bạn thân)</h2>
                        <div className="dialogue-content">
                            <Typewriter text={`Mày đừng lo quá! Dù chọn gì thì chúng mình vẫn là bạn thân mà!

Tao thì chắc đi học đại học. Còn mày... mày thông minh, chắc làm gì cũng được!

Thôi, về nhà đi! Bố mẹ mày chắc đang đợi mừng đấy!`} onComplete={() => setStep(7)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        // Step 7: Về nhà - Bữa ăn tối
        if (step === 7) {
            return (
                <SceneBackground sceneKey="chapter1_dinner">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter text={`🏠 Về nhà - Bữa ăn tối...

Cả gia đình quây quần bên mâm cơm. Mẹ nấu toàn món ${state.player.name} thích.

Không khí vui vẻ nhưng cũng có chút căng thẳng...

Ai cũng biết, sau bữa ăn này sẽ là một cuộc nói chuyện nghiêm túc.`} onComplete={() => setStep(8)} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        // Step 8: Bố hỏi
        if (step === 8) {
            return (
                <SceneBackground sceneKey="chapter1_dinner">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/bố_nghiêm_túc.png" alt="Bố" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Bố</h2>
                        <div className="dialogue-content">
                            <Typewriter text={`Con à, bố muốn nói chuyện với con về tương lai.

Con tốt nghiệp rồi, bố mẹ rất tự hào! Nhưng giờ con phải nghĩ xem con muốn đi con đường nào.

Đại học, đi làm, hay du học... Mỗi lựa chọn đều có hệ quả riêng.`} onComplete={() => setStep(9)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        // Step 9: Mẹ bảo vệ
        if (step === 9) {
            return (
                <SceneBackground sceneKey="chapter1_dinner">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/mẹ_lo_lắng.png" alt="Mẹ" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Mẹ</h2>
                        <div className="dialogue-content">
                            <Typewriter text={`Ông để con nghỉ ngơi đã! Con mới tốt nghiệp mà đã gây áp lực!

Con ơi, mẹ chỉ mong con hạnh phúc. Dù con chọn gì, mẹ cũng ủng hộ.

Nhưng con phải nhớ... mỗi quyết định đều có giá của nó.`} onComplete={() => setStep(10)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        // Step 10: Player trả lời bố mẹ
        if (step === 10) {
            return (
                <SceneBackground sceneKey="chapter1_dinner">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={getPlayerSprite('nghiêm_túc')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{state.player.name}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={`Con hiểu ạ... Con sẽ suy nghĩ thật kỹ.

Con biết đây là quyết định quan trọng nhất cuộc đời con.

Con hứa sẽ không làm bố mẹ thất vọng!`} onComplete={() => setStep(11)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        // Step 11: Đêm - Suy nghĩ
        if (step === 11) {
            return (
                <SceneBackground sceneKey="chapter1_decision_night">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter text={`🌙 Đêm khuya - Phòng ngủ...

${state.player.name} nằm trên giường, mắt nhìn trần nhà.

Đại học... Đi làm... Du học... Ba con đường, ba cuộc đời khác nhau.

Nếu như... có ai đó có thể chỉ cho mình con đường đúng đắn...`} onComplete={() => setStep(12)} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        // Step 12: Ánh sáng kỳ lạ
        if (step === 12) {
            return (
                <SceneBackground sceneKey="chapter1_decision_night">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter text={`Đột nhiên... góc phòng bắt đầu phát sáng.

Một luồng ánh sáng vàng nhạt, ấm áp... như không thuộc về thế giới này.

${state.player.name} ngồi bật dậy, tim đập thình thịch...

"Ai... ai đó?"`} onComplete={() => setStep(13)} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        // Step 13: Bà Tiên xuất hiện
        if (step === 13) {
            return (
                <SceneBackground sceneKey="dream">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/bà_tiên_bí_ẩn.png" alt="Bà Tiên" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Bà Tiên Duyên ✨</h2>
                        <div className="dialogue-content">
                            <Typewriter text={`Đừng sợ, hỡi đứa trẻ...

Ta đã theo dõi ngươi từ lâu. Ngươi đang đứng trước ngã rẽ cuộc đời...

Và ta... ta có thể giúp ngươi nhìn thấy những con đường phía trước.`} onComplete={() => setStep(14)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        // Step 14: Bà Tiên giới thiệu
        if (step === 14) {
            return (
                <SceneBackground sceneKey="dream">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/bà_tiên_nghiêm_túc.png" alt="Bà Tiên" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Bà Tiên Duyên ✨</h2>
                        <div className="dialogue-content">
                            <Typewriter text={`Ta là Bà Tiên Duyên - người giữ sợi dây số phận của cuộc đời ngươi.

Cuộc sống không có lựa chọn đúng hay sai tuyệt đối. Chỉ có lựa chọn phù hợp với con người ngươi.

Nhưng trước khi chọn con đường... ngươi phải chứng minh quyết tâm của mình!`} onComplete={() => setStep(15)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        // Step 15: Giải thích thử thách
        if (step === 15) {
            return (
                <SceneBackground sceneKey="dream">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/bà_tiên_vui_vẻ.png" alt="Bà Tiên" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Bà Tiên Duyên ✨</h2>
                        <div className="dialogue-content">
                            <Typewriter text={`Ta sẽ cho ngươi một thử thách nhỏ.

Khi ngươi chọn con đường, hãy thu thập những thứ cần thiết cho hành trình đó!

Càng thu thập nhiều, con đường của ngươi càng suôn sẻ. Nhưng hãy cẩn thận... cũng có những thứ sẽ kéo ngươi xuống!

Giờ thì... hãy chọn đi!`} onComplete={() => setScenario('choice')} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }
    }

    // CHOICE 1.1: Con đường tương lai
    if (scenario === 'choice') {
        const canAffordStudyAbroad = state.player.stats.economy >= 100;

        // Show PathCollectorGame if selected
        if (showMiniGame && miniGameType === 'path_collector' && selectedPath) {
            return (
                <PathCollectorGame
                    pathType={selectedPath}
                    onComplete={handlePathCollectorComplete}
                />
            );
        }

        return (
            <SceneBackground sceneKey="dream">
                <StatsPanel />
                <div className="character-container">
                    <img src="/src/assets/characters/bà_tiên_nghiêm_túc.png" alt="Bà Tiên Duyên" className="character-sprite left" />
                </div>
                <div className="dialogue-box">
                    <h2 className="speaker-name">Bà Tiên Duyên ✨</h2>
                    <div className="dialogue-content">
                        {!showChoices ? (
                            <Typewriter text={"Đây là quyết định đầu tiên của ngươi...\n\nHãy chọn khôn ngoan... và chứng minh bản thân qua thử thách!"} onComplete={() => setShowChoices(true)} enableVoice={audioEnabled} />
                        ) : (
                            <div className="choices-container fade-in">
                                <button className="choice-btn" onClick={() => {
                                    setSelectedPath('university');
                                    setMiniGameType('path_collector');
                                    setShowMiniGame(true);
                                }}>
                                    <span className="choice-title">🎓 Đại học (4 năm)</span>
                                    <span className="choice-desc">Đi học đại học, lấy bằng cử nhân. Hãy hứng sách vở để vào trường tốt!</span>
                                </button>
                                <button className="choice-btn" onClick={() => {
                                    setSelectedPath('work');
                                    setMiniGameType('path_collector');
                                    setShowMiniGame(true);
                                }}>
                                    <span className="choice-title">💼 Đi làm ngay</span>
                                    <span className="choice-desc">Đi làm ngay, kiếm tiền sớm. Hãy thu thập kỹ năng để có việc tốt!</span>
                                </button>
                                <button className="choice-btn" onClick={() => {
                                    if (canAffordStudyAbroad) {
                                        setSelectedPath('study_abroad');
                                        setMiniGameType('path_collector');
                                        setShowMiniGame(true);
                                    } else {
                                        alert('Gia đình không đủ tiền cho con du học...');
                                    }
                                }} style={{ opacity: canAffordStudyAbroad ? 1 : 0.5, cursor: canAffordStudyAbroad ? 'pointer' : 'not-allowed' }}>
                                    <span className="choice-title">✈️ Du học (4 năm)</span>
                                    <span className="choice-desc">Đi du học nước ngoài. Chuẩn bị hành trang! {!canAffordStudyAbroad && '(Không đủ tiền)'}</span>
                                </button>
                            </div>
                        )}
                        <div className="dialogue-controls">
                            <button className="control-btn">⚙️ AUTO</button>
                            <button className="control-btn">⏭️ SKIP</button>
                        </div>
                    </div>
                </div>
            </SceneBackground>
        );
    }

    // SCENARIO 1.2A: Đại học
    if (scenario === 'university') {
        if (step === 0) {
            return (
                <SceneBackground sceneKey="chapter1_university">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"📅 Tháng 9/2024 - Năm 1 đại học\n\nBạn đã quyết định theo học đại học.\n\nHôm nay là ngày đầu tiên đến ký túc xá. Mọi thứ đều mới mẻ và xa lạ...\n\nBạn mang theo vali, bước vào phòng KTX..."} onComplete={() => setStep(1)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 1) {
            return (
                <SceneBackground sceneKey="chapter1_university">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/bạn_thân_thích_thú.png" alt="Bạn cùng phòng" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Bạn cùng phòng</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Chào! Mình là Hùng! Bạn cùng phòng đây!\n\nBạn học ngành gì? Mình học Công nghệ thông tin!"} onComplete={() => setStep(2)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 2) {
            return (
                <SceneBackground sceneKey="chapter1_university">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={getPlayerSprite('vui_vẻ')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{state.player.name}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Chào Hùng! Mình cũng học Công nghệ thông tin!\n\nVậy là chúng mình cùng lớp rồi! Tuyệt vời!"} onComplete={() => {
                                updateStats({ social: 10, knowledge: 10 });
                                setStep(2.5);
                            }} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        // Step 2.5: Trải nghiệm khác nhau theo xuất thân
        if (step === 2.5) {
            const origin = state.player.origin;

            // RICH ORIGIN
            if (origin === 'rich') {
                return (
                    <SceneBackground sceneKey="chapter1_university">
                        <StatsPanel />
                        <div className="character-container">
                            <img src="/src/assets/characters/bạn_thân_thích_thú.png" alt="Hùng" className="character-sprite left" />
                        </div>
                        <div className="dialogue-box">
                            <h2 className="speaker-name">Hùng</h2>
                            <div className="dialogue-content">
                                <Typewriter text={"Bạn ở KTX à? Hay bạn thuê chung cư?\n\nMình thấy nhiều bạn giàu thuê chung cư riêng!"} onComplete={() => setStep(2.6)} />
                            </div>
                        </div>
                    </SceneBackground>
                );
            }

            // NORMAL ORIGIN
            if (origin === 'normal') {
                return (
                    <SceneBackground sceneKey="chapter1_university">
                        <StatsPanel />
                        <div className="character-container">
                            <img src="/src/assets/characters/bạn_thân_vui_vẻ.png" alt="Hùng" className="character-sprite left" />
                        </div>
                        <div className="dialogue-box">
                            <h2 className="speaker-name">Hùng</h2>
                            <div className="dialogue-content">
                                <Typewriter text={"Ở KTX vui lắm! Có nhiều bạn!\n\nChúng mình cùng học, cùng chơi nhé!"} onComplete={() => setStep(3)} />
                            </div>
                        </div>
                    </SceneBackground>
                );
            }

            // POOR ORIGIN
            if (origin === 'poor') {
                return (
                    <SceneBackground sceneKey="chapter1_university">
                        <StatsPanel />
                        <div className="character-container">
                            <img src="/src/assets/characters/bạn_thân_lo_lắng.png" alt="Hùng" className="character-sprite left" />
                        </div>
                        <div className="dialogue-box">
                            <h2 className="speaker-name">Hùng</h2>
                            <div className="dialogue-content">
                                <Typewriter text={"Bạn có học bổng không?\n\nMình nghe nói học phí đại học đắt lắm...\n\nBạn phải làm thêm không?"} onComplete={() => setStep(2.6)} />
                            </div>
                        </div>
                    </SceneBackground>
                );
            }
        }

        // Step 2.6: Phản ứng của player theo xuất thân
        if (step === 2.6) {
            const origin = state.player.origin;

            // RICH ORIGIN
            if (origin === 'rich') {
                return (
                    <SceneBackground sceneKey="chapter1_university">
                        <StatsPanel />
                        <div className="character-container">
                            <img src={getPlayerSprite('nghiêm_túc')} alt={state.player.name} className="character-sprite right" />
                        </div>
                        <div className="dialogue-box">
                            <h2 className="speaker-name">{state.player.name}</h2>
                            <div className="dialogue-content">
                                <Typewriter text={"Bố mẹ mình thuê chung cư cho mình rồi...\n\nNhưng mình muốn ở KTX để có trải nghiệm sinh viên!\n\n(Suy nghĩ) Mình không muốn bị xa cách bạn bè..."} onComplete={() => {
                                    updateStats({ happiness: 10, social: 5 });
                                    setStep(3);
                                }} enableVoice={audioEnabled} />
                            </div>
                        </div>
                    </SceneBackground>
                );
            }

            // POOR ORIGIN
            if (origin === 'poor') {
                return (
                    <SceneBackground sceneKey="chapter1_university">
                        <StatsPanel />
                        <div className="character-container">
                            <img src={getPlayerSprite('lo_lắng')} alt={state.player.name} className="character-sprite right" />
                        </div>
                        <div className="dialogue-box">
                            <h2 className="speaker-name">{state.player.name}</h2>
                            <div className="dialogue-content">
                                <Typewriter text={"Mình... Mình có học bổng toàn phần!\n\nNhưng tiền sinh hoạt không đủ... Mình phải làm thêm...\n\n(Suy nghĩ) Mình phải cố gắng! Mình không thể thất bại!"} onComplete={() => {
                                    updateStats({ happiness: -10, knowledge: 10 });
                                    setFlag('has_scholarship', true);
                                    setStep(3);
                                }} enableVoice={audioEnabled} />
                            </div>
                        </div>
                    </SceneBackground>
                );
            }
        }

        if (step === 3) {
            return (
                <SceneBackground sceneKey="chapter1_lecture">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"📚 Tuần đầu tiên - Giảng đường...\n\nMôi trường đại học hoàn toàn khác THPT.\n\nKhông còn thầy cô nhắc nhở, bạn phải tự học, tự nghiên cứu..."} onComplete={() => setStep(4)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 4) {
            return (
                <SceneBackground sceneKey="chapter1_lecture">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/bạn_thân_lo_lắng.png" alt="Hùng" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Hùng</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Bạn có hiểu bài không? Mình không hiểu gì cả!\n\nKhó quá... Chúng mình phải học nhóm thôi!\n\nMột mình thì không hiểu được đâu!"} onComplete={() => setStep(5)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 5) {
            return (
                <SceneBackground sceneKey="chapter1_lecture">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={getPlayerSprite('lo_lắng')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{state.player.name}</h2>
                        <div className="dialogue-content">
                            {!showChoices ? (
                                <Typewriter text={"Mình cũng thấy khó... Học nhóm là ý hay đấy!\n\nChúng mình cùng học nhé!"} onComplete={() => setShowChoices(true)} enableVoice={audioEnabled} />
                            ) : (
                                <button className="continue-btn action-btn fade-in" onClick={() => {
                                    setMiniGameType('study_group');
                                    setShowMiniGame(true);
                                }}>Bắt đầu học nhóm! 📚</button>
                            )}
                        </div>
                    </div>
                    {showMiniGame && miniGameType === 'study_group' && (
                        <StudyGroupGame onComplete={handleMiniGameComplete} />
                    )}
                </SceneBackground>
            );
        }

        if (step === 6) {
            const performance = state.flags.study_performance || 'average';

            // Excellent performance
            if (performance === 'excellent') {
                return (
                    <SceneBackground sceneKey="chapter1_lecture">
                        <StatsPanel />
                        <div className="character-container">
                            <img src="/src/assets/characters/bạn_thân_vui_vẻ.png" alt="Hùng" className="character-sprite left" />
                        </div>
                        <div className="dialogue-box">
                            <h2 className="speaker-name">Hùng</h2>
                            <div className="dialogue-content">
                                <Typewriter text={"Wow! Bạn học nhanh quá! Giải thích rất dễ hiểu!\n\nHọc nhóm với bạn hiệu quả thật! Mình hiểu hết rồi!\n\nCảm ơn bạn nhiều!"} onComplete={() => setStep(7)} />
                            </div>
                        </div>
                    </SceneBackground>
                );
            }

            // Good performance
            if (performance === 'good') {
                return (
                    <SceneBackground sceneKey="chapter1_lecture">
                        <StatsPanel />
                        <div className="character-container">
                            <img src="/src/assets/characters/bạn_thân_vui_vẻ.png" alt="Hùng" className="character-sprite left" />
                        </div>
                        <div className="dialogue-box">
                            <h2 className="speaker-name">Hùng</h2>
                            <div className="dialogue-content">
                                <Typewriter text={"Học nhóm vui đấy! Mình hiểu được nhiều!\n\nLần sau học tiếp nhé!"} onComplete={() => setStep(7)} />
                            </div>
                        </div>
                    </SceneBackground>
                );
            }

            // Average performance
            if (performance === 'average') {
                return (
                    <SceneBackground sceneKey="chapter1_lecture">
                        <StatsPanel />
                        <div className="character-container">
                            <img src="/src/assets/characters/bạn_thân_lo_lắng.png" alt="Hùng" className="character-sprite left" />
                        </div>
                        <div className="dialogue-box">
                            <h2 className="speaker-name">Hùng</h2>
                            <div className="dialogue-content">
                                <Typewriter text={"Ừm... mình vẫn chưa hiểu lắm...\n\nCó lẽ chúng mình cần học kỹ hơn..."} onComplete={() => setStep(7)} />
                            </div>
                        </div>
                    </SceneBackground>
                );
            }

            // Poor performance
            if (performance === 'poor') {
                return (
                    <SceneBackground sceneKey="chapter1_lecture">
                        <StatsPanel />
                        <div className="character-container">
                            <img src="/src/assets/characters/bạn_thân_buồn.png" alt="Hùng" className="character-sprite left" />
                        </div>
                        <div className="dialogue-box">
                            <h2 className="speaker-name">Hùng</h2>
                            <div className="dialogue-content">
                                <Typewriter text={"Học nhóm mà cả hai đều không tập trung...\n\nChúng mình lãng phí thời gian rồi...\n\nLần sau phải cố gắng hơn!"} onComplete={() => setStep(7)} />
                            </div>
                        </div>
                    </SceneBackground>
                );
            }
        }

        if (step === 7) {
            return (
                <SceneBackground sceneKey="chapter1_university">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"📅 3 tháng sau...\n\nCuộc sống đại học đang dần quen thuộc, nhưng tiền bạc lại là vấn đề..."} onComplete={() => {
                                setScenario('part_time');
                                setStep(0);
                            }} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }
    }

    // SCENARIO 1.3: Học tập và làm thêm
    if (scenario === 'part_time') {
        if (step === 0) {
            const origin = state.player.origin;

            // RICH ORIGIN - Không cần làm thêm
            if (origin === 'rich') {
                return (
                    <SceneBackground sceneKey="chapter1_university">
                        <StatsPanel />
                        <div className="character-container">
                            <img src={getPlayerSprite('vui_vẻ')} alt={state.player.name} className="character-sprite right" />
                        </div>
                        <div className="dialogue-box">
                            <h2 className="speaker-name">{state.player.name}</h2>
                            <div className="dialogue-content">
                                <Typewriter text={"Bố mẹ cho mình 10 triệu/tháng...\n\nMình không cần lo tiền bạc!\n\n(Suy nghĩ) Mình may mắn quá... Nhưng mình có đang lãng phí không?"} onComplete={() => {
                                    updateStats({ economy: 20, happiness: 10 });
                                    setScenario('romance');
                                    setStep(0);
                                }} enableVoice={audioEnabled} />
                            </div>
                        </div>
                    </SceneBackground>
                );
            }

            // NORMAL ORIGIN - Làm thêm vừa phải
            if (origin === 'normal') {
                return (
                    <SceneBackground sceneKey="chapter1_university">
                        <StatsPanel />
                        <div className="character-container">
                            <img src={getPlayerSprite('lo_lắng')} alt={state.player.name} className="character-sprite right" />
                        </div>
                        <div className="dialogue-box">
                            <h2 className="speaker-name">{state.player.name}</h2>
                            <div className="dialogue-content">
                                <Typewriter text={"Trời... Mình chỉ còn 500k...\n\nTiền bố mẹ cho không đủ sống..."} onComplete={() => setStep(1)} />
                            </div>
                        </div>
                    </SceneBackground>
                );
            }

            // POOR ORIGIN - Phải làm thêm nhiều
            if (origin === 'poor') {
                return (
                    <SceneBackground sceneKey="chapter1_university">
                        <StatsPanel />
                        <div className="character-container">
                            <img src={getPlayerSprite('buồn')} alt={state.player.name} className="character-sprite right" />
                        </div>
                        <div className="dialogue-box">
                            <h2 className="speaker-name">{state.player.name}</h2>
                            <div className="dialogue-content">
                                <Typewriter text={"Mình... Mình hết tiền rồi...\n\nBố mẹ không có tiền cho mình... Học bổng chỉ miễn học phí...\n\nMình phải làm thêm! Không có cách nào khác!"} onComplete={() => {
                                    updateStats({ happiness: -20 });
                                    setStep(1);
                                }} enableVoice={audioEnabled} />
                            </div>
                        </div>
                    </SceneBackground>
                );
            }
        }

        if (step === 1) {
            return (
                <SceneBackground sceneKey="chapter1_university">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/bạn_thân_lo_lắng.png" alt="Hùng" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Hùng</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Bạn hết tiền à? Mình cũng vậy!\n\nTiền bố mẹ cho không đủ sống...\n\nMình biết một quán cà phê đang tuyển! Chúng mình đi xin việc nhé!"} onComplete={() => setStep(2)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 2) {
            return (
                <SceneBackground sceneKey="chapter1_university">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={getPlayerSprite('vui_vẻ')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{state.player.name}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Ừ! Đi thôi!\n\nMình cũng cần kiếm thêm tiền..."} onComplete={() => setStep(3)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        // Show Latte Art mini-game to determine cafe type
        if (step === 3 && showMiniGame && miniGameType === 'latte_art') {
            return <LatteArtGame onComplete={handleLatteArtComplete} />;
        }

        if (step === 3) {
            return (
                <SceneBackground sceneKey="chapter1_cafe">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"☕ Tại quán cà phê...\n\nChủ quán muốn test kỹ năng của bạn trước khi nhận vào làm!"} onComplete={() => {
                                setMiniGameType('latte_art');
                                setShowMiniGame(true);
                            }} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 4) {
            const cafeType = state.flags.cafe_type || 'street';
            const cafeInfo = {
                highlands: {
                    name: 'Highlands Coffee',
                    salary: '50.000đ/giờ',
                    desc: 'Quán cà phê cao cấp, khách hàng văn minh, môi trường chuyên nghiệp!'
                },
                normal: {
                    name: 'The Coffee House',
                    salary: '35.000đ/giờ',
                    desc: 'Quán cà phê bình thường, khách hàng ổn, công việc vừa phải.'
                },
                street: {
                    name: 'Quán Cafe Vỉa Hè',
                    salary: '20.000đ/giờ',
                    desc: 'Quán nhỏ, khách hàng khó tính, công việc vất vả...'
                }
            };

            const cafe = cafeInfo[cafeType];

            return (
                <SceneBackground sceneKey="chapter1_cafe">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/sếp_hài_lòng.png" alt="Chủ quán" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Chủ quán</h2>
                        <div className="dialogue-content">
                            <Typewriter text={`${cafeType === 'highlands' ? 'Xuất sắc! Kỹ năng của em rất tốt!' : cafeType === 'normal' ? 'Ổn đấy! Em có thể làm được!' : 'Hmm... Kỹ năng còn hạn chế nhưng em có thể học!'}\n\n${cafe.desc}\n\nLương: ${cafe.salary}. Ca 4 tiếng, tuần làm 5 ca.\n\nGiờ cao điểm sẽ rất bận, em phải nhanh tay nhé!`} onComplete={() => setStep(5)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 5) {
            return (
                <SceneBackground sceneKey="chapter1_cafe">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"📅 Ngày hôm sau - Giờ cao điểm 5pm...\n\nQuán đông nghẹt khách!"} onComplete={() => {
                                setMiniGameType('cafe');
                                setShowMiniGame(true);
                            }} />
                        </div>
                    </div>
                    {showMiniGame && miniGameType === 'cafe' && <CafeQTE onComplete={handleMiniGameComplete} />}
                </SceneBackground>
            );
        }

        if (step === 6) {
            const performance = state.flags.cafe_performance || 'poor';

            // Excellent or Good performance - Được khen
            if (performance === 'excellent' || performance === 'good') {
                return (
                    <SceneBackground sceneKey="chapter1_cafe">
                        <StatsPanel />
                        <div className="character-container">
                            <img src="/src/assets/characters/sếp_hài_lòng.png" alt="Chủ quán" className="character-sprite left" />
                        </div>
                        <div className="dialogue-box">
                            <h2 className="speaker-name">Chủ quán</h2>
                            <div className="dialogue-content">
                                <Typewriter text={`${performance === 'excellent' ? 'Xuất sắc! Em làm việc rất tốt!' : 'Em làm tốt đấy!'}

Khách hàng đều hài lòng! ${performance === 'excellent' ? 'Đây là tiền thưởng thêm!' : 'Ngày mai tiếp tục nhé!'}

${performance === 'excellent' ? 'Em có tài năng làm việc này đấy!' : 'Cứ giữ phong độ này!'}`} onComplete={() => {
                                        updateStats({ social: 10, knowledge: -10 });
                                        setStep(7);
                                    }} />
                            </div>
                        </div>
                    </SceneBackground>
                );
            }

            // Poor performance - Bị chê
            return (
                <SceneBackground sceneKey="chapter1_cafe">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/sếp_nóng_giận.png" alt="Chủ quán" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Chủ quán</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Em làm việc chậm quá! Khách phàn nàn nhiều lắm!\n\nNếu ngày mai vẫn thế này thì chị không thể giữ em được!\n\nEm phải cố gắng hơn nữa!"} onComplete={() => {
                                updateStats({ social: 10, knowledge: -10 });
                                setStep(7);
                            }} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 7) {
            return (
                <SceneBackground sceneKey="chapter1_university">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"📅 3 tháng sau...\n\nBạn đã quen với công việc, nhưng học hành bị ảnh hưởng..."} onComplete={() => setStep(8)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 8) {
            return (
                <SceneBackground sceneKey="chapter1_university">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/bạn_thân_lo_lắng.png" alt="Hùng" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Hùng</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Bạn có vẻ mệt? Làm part-time vất vả lắm!\n\nNhưng học hành quan trọng hơn!\n\nBạn nên cân bằng giữa học và làm!"} onComplete={() => setScenario('balance_choice')} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }
    }

    // CHOICE 1.2: Cân bằng học và làm
    if (scenario === 'balance_choice') {
        return (
            <SceneBackground sceneKey="dream">
                <StatsPanel />
                <div className="character-container">
                    <img src="/src/assets/characters/bà_tiên_nghiêm_túc.png" alt="Bà Tiên" className="character-sprite left" />
                </div>
                <div className="dialogue-box">
                    <h2 className="speaker-name">Bà Tiên Duyên ✨</h2>
                    <div className="dialogue-content">
                        {!showChoices ? (
                            <Typewriter text={"Ngươi phải cân bằng giữa học và làm...\n\nChọn khôn ngoan..."} onComplete={() => setShowChoices(true)} enableVoice={audioEnabled} />
                        ) : (
                            <div className="choices-container fade-in">
                                <button className="choice-btn" onClick={() => {
                                    updateStats({ economy: 20, knowledge: -15, happiness: -10 });
                                    addChoice({ type: 'work_balance', value: 'work_more' });
                                    setScenario('romance');
                                    setStep(0);
                                }}>
                                    <span className="choice-title">💼 Tiếp tục làm 5 ca/tuần</span>
                                    <span className="choice-desc">Mình cần tiền! Mình sẽ cố gắng học!</span>
                                </button>
                                <button className="choice-btn" onClick={() => {
                                    updateStats({ economy: 12, knowledge: -5, happiness: 5 });
                                    addChoice({ type: 'work_balance', value: 'balanced' });
                                    setScenario('romance');
                                    setStep(0);
                                }}>
                                    <span className="choice-title">⚖️ Giảm xuống 3 ca/tuần</span>
                                    <span className="choice-desc">Mình sẽ cân bằng học và làm!</span>
                                </button>
                                <button className="choice-btn" onClick={() => {
                                    updateStats({ economy: -20, knowledge: 20, happiness: 10 });
                                    addChoice({ type: 'work_balance', value: 'study_focus' });
                                    setScenario('romance');
                                    setStep(0);
                                }}>
                                    <span className="choice-title">📚 Nghỉ làm, tập trung học</span>
                                    <span className="choice-desc">Mình sẽ xin bố mẹ hỗ trợ thêm!</span>
                                </button>
                            </div>
                        )}
                        <div className="dialogue-controls">
                            <button className="control-btn">⚙️ AUTO</button>
                            <button className="control-btn">⏭️ SKIP</button>
                        </div>
                    </div>
                </div>
            </SceneBackground>
        );
    }

    // SCENARIO 1.4: Gặp người đặc biệt
    if (scenario === 'romance') {
        // Determine love interest based on player gender - OPPOSITE gender
        // Male player meets Bích (female), Female player meets Khánh (male)
        const loveInterestGender = state.player.gender === 'male' ? 'female' : 'male';
        const loveInterestName = state.player.gender === 'male' ? 'Bích' : 'Khánh';
        const loveInterestSprite = state.player.gender === 'male' ? 'bích' : 'khánh';
        const pronoun = loveInterestGender === 'female' ? 'cô ấy' : 'anh ấy';
        const possessive = loveInterestGender === 'female' ? 'của cô ấy' : 'của anh ấy';

        if (step === 0) {
            return (
                <SceneBackground sceneKey="chapter1_university">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"📅 Năm 2 đại học - Tháng 10...\n\nCuộc sống đã ổn định hơn. Học hành, làm thêm đều đã quen thuộc...\n\nBạn bắt đầu chú ý đến những điều khác trong cuộc sống..."} onComplete={() => setStep(1)} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 1) {
            return (
                <SceneBackground sceneKey="chapter1_lecture">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"🏫 Giảng đường - Buổi chiều...\n\nBạn đang ngồi học nhóm với bạn bè.\n\nTrong lớp có một người bạn tên " + loveInterestName + ", người mà bạn thường để ý đến..."} onComplete={() => setStep(2)} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 2) {
            return (
                <SceneBackground sceneKey="chapter1_lecture">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={`/src/assets/characters/${loveInterestSprite}_vui_vẻ.png`} alt={loveInterestName} className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{loveInterestName}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Này, bài tập môn Toán khó quá!\n\nBạn làm được bài 5 chưa? Mình không hiểu lắm..."} onComplete={() => setStep(3)} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 3) {
            return (
                <SceneBackground sceneKey="chapter1_lecture">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={getPlayerSprite('nghiêm_túc')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{state.player.name}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"À, bài đó à? Để mình giải thích cho...\n\nBạn phải dùng công thức này, rồi thay số vào..."} onComplete={() => setStep(4)} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 4) {
            return (
                <SceneBackground sceneKey="chapter1_lecture">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={`/src/assets/characters/${loveInterestSprite}_vui_vẻ.png`} alt={loveInterestName} className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{loveInterestName}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Ồ! Mình hiểu rồi! Cảm ơn bạn nhiều!\n\nBạn giỏi quá! Lần sau mình gặp khó khăn lại nhờ bạn nhé!"} onComplete={() => setStep(5)} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 5) {
            return (
                <SceneBackground sceneKey="chapter1_lecture">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={getPlayerSprite('thích_thú')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{state.player.name}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"(Suy nghĩ)\n\n" + loveInterestName + " hôm nay trông vui vẻ quá...\n\nNụ cười " + possessive + " thật đẹp..."} onComplete={() => setStep(6)} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 6) {
            return (
                <SceneBackground sceneKey="chapter1_university">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"📅 2 tuần sau...\n\nBạn và " + loveInterestName + " đã gặp nhau nhiều lần hơn.\n\nMỗi lần gặp, bạn đều cảm thấy vui vẻ và thoải mái..."} onComplete={() => setStep(7)} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 7) {
            return (
                <SceneBackground sceneKey="chapter1_cafe">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/bạn_thân_thích_thú.png" alt="Hùng" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Hùng (Bạn thân)</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Này này! Mình thấy bạn hay nhìn " + loveInterestName + " đấy!\n\nBạn có thích " + pronoun + " không?\n\nThử mời đi uống cà phê xem!"} onComplete={() => setStep(8)} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 8) {
            return (
                <SceneBackground sceneKey="chapter1_cafe">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={getPlayerSprite('bối_rối')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{state.player.name}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Ừm... có một người...\n\nNhưng mình không biết " + pronoun + " có thích mình không...\n\nMình... mình sợ bị từ chối..."} onComplete={() => setStep(9)} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 9) {
            return (
                <SceneBackground sceneKey="chapter1_cafe">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/bạn_thân_vui_vẻ.png" alt="Hùng" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Hùng (Bạn thân)</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Đừng sợ! Mạnh dạn lên!\n\nNếu không thử thì làm sao biết được?\n\nThôi, mình sẽ giúp bạn!"} onComplete={() => setStep(10)} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 10) {
            return (
                <SceneBackground sceneKey="chapter1_university">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"📅 Cuối tuần - Rạp phim...\n\nVới sự động viên của Hùng, bạn đã mạnh dạn rủ " + loveInterestName + " đi xem phim..."} onComplete={() => setStep(11)} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 11) {
            return (
                <SceneBackground sceneKey="chapter1_cinema">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={`/src/assets/characters/${loveInterestSprite}_vui_vẻ.png`} alt={loveInterestName} className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{loveInterestName}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Chào! Lâu rồi không gặp!\n\nBạn rủ mình đi xem phim à? Được chứ!\n\nMình cũng đang muốn xem phim này lắm!"} onComplete={() => setStep(12)} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 12) {
            return (
                <SceneBackground sceneKey="chapter1_cinema">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={getPlayerSprite('vui_vẻ')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{state.player.name}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"(Suy nghĩ) Tuyệt! " + loveInterestName + " đồng ý rồi!\n\nTim mình đập thình thịch quá..."} onComplete={() => setStep(13)} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 13) {
            return (
                <SceneBackground sceneKey="chapter1_cinema">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"🎬 Trong rạp phim...\n\nPhim rất hay, nhưng bạn không thể tập trung.\n\nBạn cứ liếc nhìn " + loveInterestName + " ngồi bên cạnh..."} onComplete={() => setStep(14)} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 14) {
            return (
                <SceneBackground sceneKey="chapter1_cinema">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={`/src/assets/characters/${loveInterestSprite}_vui_vẻ.png`} alt={loveInterestName} className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{loveInterestName}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Phim hay quá! Bạn thấy sao?\n\nHôm nay vui lắm! Cảm ơn bạn đã rủ mình!"} onComplete={() => setStep(15)} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 15) {
            return (
                <SceneBackground sceneKey="chapter1_cinema">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={getPlayerSprite('thích_thú')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{state.player.name}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Mình cũng vui lắm!\n\nLần sau... lần sau mình đi chơi nữa nhé?"} onComplete={() => {
                                updateStats({ happiness: 15, social: 10 });
                                setStep(16);
                            }} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 16) {
            return (
                <SceneBackground sceneKey="chapter1_cinema">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={`/src/assets/characters/${loveInterestSprite}_vui_vẻ.png`} alt={loveInterestName} className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{loveInterestName}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Được chứ! Mình rất thích đi chơi với bạn!\n\nBạn vui tính và dễ thương lắm!"} onComplete={() => setStep(17)} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 17) {
            return (
                <SceneBackground sceneKey="chapter1_university">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"📅 3 tháng sau...\n\nHai bạn đã gặp nhau nhiều lần. Đi cà phê, đi chơi, học chung...\n\nTình cảm ngày càng sâu đậm..."} onComplete={() => setStep(18)} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 18) {
            return (
                <SceneBackground sceneKey="chapter1_dating">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={`/src/assets/characters/${loveInterestSprite}_nghiêm_túc.png`} alt={loveInterestName} className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{loveInterestName}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Mình... mình có điều muốn nói...\n\nMình nghĩ... mình đã thích bạn từ lâu rồi...\n\nBạn có thích mình không?"} onComplete={() => setStep(19)} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 19) {
            return (
                <SceneBackground sceneKey="chapter1_dating">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={getPlayerSprite('vui_vẻ')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{state.player.name}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Mình cũng thích bạn! ❤️\n\nMình đã thích bạn từ lần đầu tiên gặp...\n\nMình rất vui khi được ở bên bạn!"} onComplete={() => {
                                updateStats({ happiness: 30 });
                                setFlag('has_lover', true);
                                setFlag('lover_name', loveInterestName);
                                setStep(20);
                            }} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 20) {
            return (
                <SceneBackground sceneKey="chapter1_dating">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={`/src/assets/characters/${loveInterestSprite}_vui_vẻ.png`} alt={loveInterestName} className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{loveInterestName}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Vậy... chúng mình là người yêu của nhau rồi nhé! 💕\n\nMình hứa sẽ luôn ở bên bạn!"} onComplete={() => setStep(21)} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 21) {
            return (
                <SceneBackground sceneKey="chapter1_university">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"💕 Hai bạn đã bắt đầu yêu nhau...\n\nNhưng tình yêu và học hành có thể cân bằng được không?"} onComplete={() => {
                                setScenario('love_choice');
                                setStep(0);
                            }} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }
    }

    // CHOICE 1.3: Tình yêu hay sự nghiệp
    if (scenario === 'love_choice') {
        return (
            <SceneBackground sceneKey="dream">
                <StatsPanel />
                <div className="character-container">
                    <img src="/src/assets/characters/bà_tiên_bí_ẩn.png" alt="Bà Tiên" className="character-sprite left" />
                </div>
                <div className="dialogue-box">
                    <h2 className="speaker-name">Bà Tiên Duyên ✨</h2>
                    <div className="dialogue-content">
                        {!showChoices ? (
                            <Typewriter text={"Tình yêu đầu đời... Ngọt ngào...\n\nNhưng ngươi còn trẻ, sự nghiệp chưa ổn định...\n\nNgươi sẽ chọn gì?"} onComplete={() => setShowChoices(true)} enableVoice={audioEnabled} />
                        ) : (
                            <div className="choices-container fade-in">
                                <button className="choice-btn" onClick={() => {
                                    updateStats({ happiness: 30, economy: -10, knowledge: -10 });
                                    addChoice({ type: 'love_career', value: 'love' });
                                    setScenario('family_pressure');
                                    setStep(0);
                                }}>
                                    <span className="choice-title">💕 Mình muốn yêu!</span>
                                    <span className="choice-desc">Tình yêu là quan trọng nhất!</span>
                                </button>
                                <button className="choice-btn" onClick={() => {
                                    // Choose career = breakup with lover
                                    updateStats({ knowledge: 20, economy: 10, happiness: -20 });
                                    addChoice({ type: 'love_career', value: 'career' });
                                    setFlag('has_lover', false); // Break up
                                    setScenario('breakup');
                                    setStep(0);
                                }}>
                                    <span className="choice-title">💼 Tập trung sự nghiệp</span>
                                    <span className="choice-desc">Mình cần tập trung sự nghiệp trước...</span>
                                </button>
                                <button className="choice-btn" onClick={() => {
                                    updateStats({ happiness: 10, economy: -5, knowledge: -5 });
                                    addChoice({ type: 'love_career', value: 'balance' });
                                    setScenario('family_pressure');
                                    setStep(0);
                                }}>
                                    <span className="choice-title">⚖️ Cân bằng cả hai</span>
                                    <span className="choice-desc">Mình sẽ cân bằng cả hai!</span>
                                </button>
                            </div>
                        )}
                        <div className="dialogue-controls">
                            <button className="control-btn">⚙️ AUTO</button>
                            <button className="control-btn">⏭️ SKIP</button>
                        </div>
                    </div>
                </div>
            </SceneBackground>
        );
    }

    // SCENARIO: Breakup (when choosing career over love)
    if (scenario === 'breakup') {
        const loveInterestName = state.flags.lover_name || 'người yêu';
        const loveInterestGender = state.player.gender === 'male' ? 'female' : 'male';
        const loveInterestSprite = state.player.gender === 'male' ? 'bích' : 'khánh';

        if (step === 0) {
            return (
                <SceneBackground sceneKey="chapter1_cafe">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"📅 Vài ngày sau...\n\nBạn đã quyết định nói chuyện với " + loveInterestName + "..."} onComplete={() => setStep(1)} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 1) {
            return (
                <SceneBackground sceneKey="chapter1_cafe">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={getPlayerSprite('buồn')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{state.player.name}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Mình... mình cần nói chuyện với bạn...\n\nMình nghĩ... mình cần tập trung cho sự nghiệp...\n\nMình xin lỗi..."} onComplete={() => setStep(2)} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 2) {
            return (
                <SceneBackground sceneKey="chapter1_cafe">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={`/src/assets/characters/${loveInterestSprite}_buồn.png`} alt={loveInterestName} className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{loveInterestName}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Mình... mình hiểu...\n\nMình biết sự nghiệp quan trọng với bạn...\n\nMình hy vọng bạn sẽ thành công..."} onComplete={() => setStep(3)} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 3) {
            return (
                <SceneBackground sceneKey="chapter1_cafe">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={getPlayerSprite('buồn')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{state.player.name}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Mình xin lỗi... Mình thật sự xin lỗi...\n\n(Suy nghĩ) Đây có phải quyết định đúng không?"} onComplete={() => {
                                updateStats({ happiness: -30 });
                                setStep(4);
                            }} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 4) {
            return (
                <SceneBackground sceneKey="chapter1_university">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"💔 Hai người đã chia tay...\n\nBạn cảm thấy buồn, nhưng quyết tâm tập trung cho tương lai..."} onComplete={() => {
                                setScenario('family_pressure');
                                setStep(0);
                            }} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }
    }

    // SCENARIO 1.5: Áp lực gia đình (IMPROVED - check if has lover)
    if (scenario === 'family_pressure') {
        const hasLover = state.flags.has_lover;
        const loveInterestName = state.flags.lover_name || 'người yêu';

        if (step === 0) {
            return (
                <SceneBackground sceneKey="prologue_childhood_normal">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"📅 Năm 4 đại học - Sắp tốt nghiệp...\n\nBạn về nhà thăm bố mẹ..."} onComplete={() => setStep(1)} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 1) {
            return (
                <SceneBackground sceneKey="prologue_childhood_normal">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/mẹ_yêu_thương.png" alt="Mẹ" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Mẹ</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Con ơi! Lâu rồi không về!\n\nCon học thế nào? Sắp tốt nghiệp rồi nhỉ?\n\nCon có người yêu chưa?"} onComplete={() => setStep(2)} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 2) {
            // Different response based on relationship status
            if (hasLover) {
                return (
                    <SceneBackground sceneKey="prologue_childhood_normal">
                        <StatsPanel />
                        <div className="character-container">
                            <img src={getPlayerSprite('vui_vẻ')} alt={state.player.name} className="character-sprite right" />
                        </div>
                        <div className="dialogue-box">
                            <h2 className="speaker-name">{state.player.name}</h2>
                            <div className="dialogue-content">
                                <Typewriter text={"Dạ, con có người yêu rồi ạ!\n\nTên " + loveInterestName + ", rất tốt với con!"} onComplete={() => setStep(3)} enableVoice={audioEnabled} />
                            </div>
                        </div>
                    </SceneBackground>
                );
            } else {
                return (
                    <SceneBackground sceneKey="prologue_childhood_normal">
                        <StatsPanel />
                        <div className="character-container">
                            <img src={getPlayerSprite('lo_lắng')} alt={state.player.name} className="character-sprite right" />
                        </div>
                        <div className="dialogue-box">
                            <h2 className="speaker-name">{state.player.name}</h2>
                            <div className="dialogue-content">
                                <Typewriter text={"Dạ... con chưa có người yêu ạ...\n\nCon đang tập trung học..."} onComplete={() => setStep(5)} enableVoice={audioEnabled} />
                            </div>
                        </div>
                    </SceneBackground>
                );
            }
        }

        // Branch 1: Has lover - parents want to introduce someone else
        if (step === 3 && hasLover) {
            return (
                <SceneBackground sceneKey="prologue_childhood_normal">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/bố_nghiêm_túc.png" alt="Bố" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Bố</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Người yêu à... Gia đình người ta thế nào?\n\nBố có quen con nhà hàng xóm, gia đình tử tế lắm...\n\nCon gặp nói chuyện xem sao?"} onComplete={() => setStep(4)} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 4 && hasLover) {
            return (
                <SceneBackground sceneKey="prologue_childhood_normal">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={getPlayerSprite('bối_rối')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{state.player.name}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Nhưng con đã có người yêu rồi mà...\n\n(Suy nghĩ) Bố mẹ muốn con gặp người khác?"} onComplete={() => setStep(10)} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        // Branch 2: No lover - parents introduce someone
        if (step === 5 && !hasLover) {
            return (
                <SceneBackground sceneKey="prologue_childhood_normal">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/mẹ_vui_vẻ.png" alt="Mẹ" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Mẹ</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Con đã lớn rồi, mẹ lo lắm!\n\nMẹ có quen con nhà hàng xóm, rất tốt!\n\nCon gặp nói chuyện xem sao?"} onComplete={() => setStep(6)} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 6 && !hasLover) {
            return (
                <SceneBackground sceneKey="prologue_childhood_normal">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={getPlayerSprite('bối_rối')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{state.player.name}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Dạ... con sẽ gặp...\n\n(Suy nghĩ) Mình chưa sẵn sàng lắm..."} onComplete={() => setStep(10)} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        // Common: Meet the person parents introduce
        if (step === 10) {
            const introducedPersonGender = state.player.gender === 'male' ? 'female' : 'male';
            const introducedPersonName = introducedPersonGender === 'female' ? 'Trang' : 'Hùng';
            const introducedPersonSprite = introducedPersonGender === 'female' ? 'trang' : 'hùng';

            return (
                <SceneBackground sceneKey="chapter1_cafe">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"📅 Vài ngày sau - Quán cà phê...\n\nBạn gặp " + introducedPersonName + " - người mà bố mẹ giới thiệu..."} onComplete={() => {
                                setFlag('introduced_person_name', introducedPersonName);
                                setFlag('introduced_person_sprite', introducedPersonSprite);
                                setStep(11);
                            }} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 11) {
            const introducedPersonName = state.flags.introduced_person_name;
            const introducedPersonSprite = state.flags.introduced_person_sprite;

            return (
                <SceneBackground sceneKey="chapter1_cafe">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={`/src/assets/characters/${introducedPersonSprite}_vui_vẻ.png`} alt={introducedPersonName} className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{introducedPersonName}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Chào! Mình là " + introducedPersonName + "!\n\nBố mẹ mình và bố mẹ bạn quen nhau lâu rồi!\n\nRất vui được gặp bạn!"} onComplete={() => setStep(12)} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 12) {
            return (
                <SceneBackground sceneKey="chapter1_cafe">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={getPlayerSprite('nghiêm_túc')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{state.player.name}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Chào... Mình cũng vui được gặp bạn...\n\n(Suy nghĩ) " + (hasLover ? loveInterestName + " sẽ nghĩ sao?" : "Người này có vẻ tốt...")} onComplete={() => setStep(13)} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 13) {
            const introducedPersonName = state.flags.introduced_person_name;
            const introducedPersonSprite = state.flags.introduced_person_sprite;

            return (
                <SceneBackground sceneKey="chapter1_cafe">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={`/src/assets/characters/${introducedPersonSprite}_vui_vẻ.png`} alt={introducedPersonName} className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{introducedPersonName}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Mình nghe nói bạn sắp tốt nghiệp đại học!\n\nBạn định làm gì sau khi tốt nghiệp?\n\nMình đang làm việc ở công ty gia đình..."} onComplete={() => setStep(14)} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 14) {
            return (
                <SceneBackground sceneKey="chapter1_cafe">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Hai người nói chuyện thêm một lúc...\n\n" + (hasLover ? "Nhưng bạn cứ nghĩ về " + loveInterestName + "..." : "Bạn cảm thấy thoải mái khi nói chuyện...")} onComplete={() => {
                                setScenario('marriage_choice');
                                setStep(0);
                            }} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }
    }

    // CHOICE: Marriage decision
    if (scenario === 'marriage_choice') {
        const hasLover = state.flags.has_lover;
        const loveInterestName = state.flags.lover_name || 'người yêu';
        const introducedPersonName = state.flags.introduced_person_name;

        return (
            <SceneBackground sceneKey="dream">
                <StatsPanel />
                <div className="character-container">
                    <img src="/src/assets/characters/bà_tiên_nghiêm_túc.png" alt="Bà Tiên" className="character-sprite left" />
                </div>
                <div className="dialogue-box">
                    <h2 className="speaker-name">Bà Tiên Duyên ✨</h2>
                    <div className="dialogue-content">
                        {!showChoices ? (
                            <Typewriter text={hasLover ?
                                "Ngươi đang có người yêu, nhưng bố mẹ muốn ngươi cưới người khác...\n\nNgươi sẽ chọn ai?" :
                                "Bố mẹ muốn ngươi cưới người họ chọn...\n\nNgươi có chấp nhận không?"
                            } onComplete={() => setShowChoices(true)} enableVoice={audioEnabled} />
                        ) : (
                            <div className="choices-container fade-in">
                                {hasLover && (
                                    <button className="choice-btn" onClick={() => {
                                        updateStats({ happiness: 30, social: -20 });
                                        addChoice({ type: 'marriage', value: 'lover' });
                                        setFlag('married_to', loveInterestName);
                                        setScenario('family_choice');
                                        setStep(0);
                                    }}>
                                        <span className="choice-title">💕 Cưới {loveInterestName}</span>
                                        <span className="choice-desc">Mình yêu {loveInterestName}!</span>
                                    </button>
                                )}
                                <button className="choice-btn" onClick={() => {
                                    updateStats({ happiness: hasLover ? -20 : 10, social: 30, economy: 20 });
                                    addChoice({ type: 'marriage', value: 'arranged' });
                                    setFlag('married_to', introducedPersonName);
                                    setFlag('has_lover', false);
                                    setScenario('family_choice');
                                    setStep(0);
                                }}>
                                    <span className="choice-title">💍 Cưới {introducedPersonName}</span>
                                    <span className="choice-desc">{hasLover ? 'Nghe lời bố mẹ...' : 'Người này có vẻ tốt!'}</span>
                                </button>
                                <button className="choice-btn" onClick={() => {
                                    updateStats({ happiness: -10, social: -10 });
                                    addChoice({ type: 'marriage', value: 'refuse' });
                                    setScenario('family_choice');
                                    setStep(0);
                                }}>
                                    <span className="choice-title">🚫 Từ chối cưới</span>
                                    <span className="choice-desc">Mình chưa sẵn sàng!</span>
                                </button>
                            </div>
                        )}
                        <div className="dialogue-controls">
                            <button className="control-btn">⚙️ AUTO</button>
                            <button className="control-btn">⏭️ SKIP</button>
                        </div>
                    </div>
                </div>
            </SceneBackground>
        );
    }

    // Family choice
    if (scenario === 'family_choice') {
        return (
            <SceneBackground sceneKey="dream">
                <StatsPanel />
                <div className="character-container">
                    <img src="/src/assets/characters/bà_tiên_nghiêm_túc.png" alt="Bà Tiên" className="character-sprite left" />
                </div>
                <div className="dialogue-box">
                    <h2 className="speaker-name">Bà Tiên Duyên ✨</h2>
                    <div className="dialogue-content">
                        {!showChoices ? (
                            <Typewriter text={"Gia đình hay đam mê?\n\nĐây là quyết định khó khăn..."} onComplete={() => setShowChoices(true)} enableVoice={audioEnabled} />
                        ) : (
                            <div className="choices-container fade-in">
                                <button className="choice-btn" onClick={() => {
                                    updateStats({ happiness: -15, social: 20 });
                                    addChoice({ type: 'family_decision', value: 'obey' });
                                    setScenario('graduation_uni');
                                    setStep(0);
                                }}>
                                    <span className="choice-title">🏠 Nghe lời bố mẹ</span>
                                    <span className="choice-desc">Con sẽ về quê làm việc!</span>
                                </button>
                                <button className="choice-btn" onClick={() => {
                                    updateStats({ happiness: 20, social: -15 });
                                    addChoice({ type: 'family_decision', value: 'follow_dream' });
                                    setScenario('graduation_uni');
                                    setStep(0);
                                }}>
                                    <span className="choice-title">🌟 Theo đuổi đam mê</span>
                                    <span className="choice-desc">Con muốn theo đuổi đam mê của con!</span>
                                </button>
                                <button className="choice-btn" onClick={() => {
                                    updateStats({ happiness: 5, social: 5 });
                                    addChoice({ type: 'family_decision', value: 'compromise' });
                                    setScenario('graduation_uni');
                                    setStep(0);
                                }}>
                                    <span className="choice-title">⚖️ Thỏa hiệp</span>
                                    <span className="choice-desc">Con sẽ thử ở thành phố trước!</span>
                                </button>
                            </div>
                        )}
                        <div className="dialogue-controls">
                            <button className="control-btn">⚙️ AUTO</button>
                            <button className="control-btn">⏭️ SKIP</button>
                        </div>
                    </div>
                </div>
            </SceneBackground>
        );
    }

    // SCENARIO 1.6: Tốt nghiệp đại học
    if (scenario === 'graduation_uni') {
        if (step === 0) {
            return (
                <SceneBackground sceneKey="chapter1_graduation">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/bạn_thân_vui_vẻ.png" alt="Minh" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Minh (Bạn thân)</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Chúc mừng! Chúng ta đã tốt nghiệp đại học rồi!\n\n4 năm qua thật tuyệt vời!\n\nGiờ bạn định làm gì?"} onComplete={() => setStep(1)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 1) {
            return (
                <SceneBackground sceneKey="chapter1_graduation">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={getPlayerSprite('thích_thú')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{state.player.name}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Mình sẽ đi xin việc làm!\n\nMình đã sẵn sàng cho bước tiếp theo!"} onComplete={() => setStep(2)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 2) {
            return (
                <SceneBackground sceneKey="prologue_childhood_normal">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/bố_vui_vẻ.png" alt="Bố" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Bố</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Con tốt nghiệp rồi! Bố mẹ tự hào về con!\n\nGiờ con sẽ đi xin việc làm!\n\nBố tin con sẽ thành công!"} onComplete={() => setStep(3)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 3) {
            return (
                <SceneBackground sceneKey="prologue_childhood_normal">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={getPlayerSprite('vui_vẻ')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{state.player.name}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Cảm ơn bố mẹ đã nuôi con ăn học!\n\nCon sẽ cố gắng hết sức!"} onComplete={() => setStep(4)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 4) {
            return (
                <SceneBackground sceneKey="dream">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/bà_tiên_vui_vẻ.png" alt="Bà Tiên" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Bà Tiên Duyên ✨</h2>
                        <div className="dialogue-content">
                            {!showChoices ? (
                                <Typewriter text={"Tốt lắm! Ngươi đã hoàn thành giai đoạn đầu!\n\nGiờ đây, ngươi sẽ bước vào giai đoạn mới...\n\nLập gia đình, tìm người đồng hành..."} onComplete={() => setShowChoices(true)} enableVoice={audioEnabled} />
                            ) : (
                                <button className="continue-btn fade-in" onClick={() => {
                                    updateStats({ happiness: 50, knowledge: 40 });
                                    setScreen('chapter2');
                                }}>Hoàn thành Chapter 1 ✨</button>
                            )}
                        </div>
                    </div>
                </SceneBackground>
            );
        }
    }

    // Work early path (if chose to work instead of university)
    if (scenario === 'work_early') {
        if (step === 0) {
            return (
                <SceneBackground sceneKey="chapter1_office">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"📅 18 tuổi - Tháng 7/2024\n\nBạn quyết định đi làm ngay thay vì học đại học...\n\nHôm nay là ngày đầu tiên đi xin việc..."} onComplete={() => setStep(1)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 1) {
            return (
                <SceneBackground sceneKey="chapter1_office">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={getPlayerSprite('lo_lắng')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{state.player.name}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"(Suy nghĩ)\n\nMình chỉ có bằng THPT... Không biết có ai nhận không...\n\nNhưng mình phải cố gắng! Mình cần kiếm tiền sớm!"} onComplete={() => setStep(2)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 2) {
            return (
                <SceneBackground sceneKey="chapter1_interview">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/sếp_nghiêm_túc.png" alt="Sếp" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Sếp công ty</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Em mới 18 tuổi, chưa có kinh nghiệm...\n\nKhông có bằng đại học thì lương thấp thôi! 8 triệu/tháng!\n\nNhưng nếu em chăm chỉ, sẽ có cơ hội thăng tiến!"} onComplete={() => setStep(3)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 3) {
            return (
                <SceneBackground sceneKey="chapter1_interview">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={getPlayerSprite('vui_vẻ')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{state.player.name}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Dạ! Em sẽ cố gắng hết sức! Cảm ơn sếp!\n\n(Suy nghĩ) Mình đã có việc rồi! Mình sẽ kiếm tiền sớm!"} onComplete={() => {
                                updateStats({ economy: 20, happiness: 20 });
                                setStep(4);
                            }} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 4) {
            return (
                <SceneBackground sceneKey="chapter1_office">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"📅 Năm 1 làm việc - 19 tuổi\n\nBạn làm việc chăm chỉ, học hỏi từ đồng nghiệp...\n\nNhưng..."} onComplete={() => setStep(5)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 5) {
            return (
                <SceneBackground sceneKey="chapter1_office">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/đồng_nghiệp_nghiêm_túc.png" alt="Đồng nghiệp" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Đồng nghiệp (có bằng đại học)</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Em mới vào à? Em học đại học nào?\n\nCông ty này toàn người có bằng đại học!"} onComplete={() => setStep(6)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 6) {
            return (
                <SceneBackground sceneKey="chapter1_office">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={getPlayerSprite('buồn')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{state.player.name}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Em... Em không học đại học ạ...\n\n(Suy nghĩ) Mình cảm thấy tự ti quá..."} onComplete={() => {
                                updateStats({ happiness: -10, social: -5 });
                                setStep(7);
                            }} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 7) {
            return (
                <SceneBackground sceneKey="chapter1_office">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"📅 Năm 2 - 20 tuổi\n\nBạn làm việc chăm chỉ, được sếp khen ngợi..."} onComplete={() => setStep(8)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 8) {
            return (
                <SceneBackground sceneKey="chapter1_office">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/sếp_hài_lòng.png" alt="Sếp" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Sếp</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Em làm việc tốt! Em lên trưởng nhóm!\n\nLương tăng lên 12 triệu/tháng!\n\nCố gắng nhé!"} onComplete={() => {
                                updateStats({ economy: 30, happiness: 20, social: 10 });
                                setStep(9);
                            }} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 9) {
            return (
                <SceneBackground sceneKey="chapter1_office">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"📅 Năm 4 - 22 tuổi\n\nBạn bè học đại học đã tốt nghiệp, bắt đầu xin việc..."} onComplete={() => setStep(10)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 10) {
            return (
                <SceneBackground sceneKey="chapter1_cafe">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/bạn_thân_vui_vẻ.png" alt="Minh" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Minh (Bạn thân - tốt nghiệp đại học)</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Mình tốt nghiệp rồi! Giờ mình xin việc!\n\nCòn bạn? Bạn làm việc 4 năm rồi, có kinh nghiệm rồi nhỉ?"} onComplete={() => setStep(11)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 11) {
            return (
                <SceneBackground sceneKey="chapter1_cafe">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={getPlayerSprite('vui_vẻ')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{state.player.name}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Ừ! Mình đã có 4 năm kinh nghiệm!\n\nMình đã thăng chức trưởng nhóm rồi!\n\nBạn mới bắt đầu, phải cố gắng nhé!"} onComplete={() => {
                                updateStats({ happiness: 20, social: 10 });
                                setStep(12);
                            }} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 12) {
            return (
                <SceneBackground sceneKey="chapter1_office">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"📅 Năm 10 - 28 tuổi\n\nBạn bè có bằng đại học đã vượt mặt bạn..."} onComplete={() => setStep(13)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 13) {
            return (
                <SceneBackground sceneKey="chapter1_cafe">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/bạn_thân_vui_vẻ.png" alt="Minh" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Minh (Bạn thân)</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Mình được thăng chức Giám đốc! Lương 50 triệu/tháng!\n\nCòn bạn? Bạn vẫn là trưởng nhóm à?"} onComplete={() => setStep(14)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 14) {
            return (
                <SceneBackground sceneKey="chapter1_cafe">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={getPlayerSprite('buồn')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{state.player.name}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Chúc mừng bạn... 😢\n\n(Suy nghĩ) Mình... mình hối hận vì không học đại học..."} onComplete={() => setStep(15)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 15) {
            return (
                <SceneBackground sceneKey="chapter1_office">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/sếp_nghiêm_túc.png" alt="Sếp" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Sếp</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Em không có bằng đại học, khó thăng tiến lên cao...\n\nNếu em muốn, em có thể học thêm để thăng tiến!\n\nNhưng em đã 28 tuổi rồi, học lại sẽ khó khăn..."} onComplete={() => {
                                updateStats({ happiness: -30, knowledge: -10 });
                                setFlag('work_early_regret', true);
                                setScenario('chapter_end');
                                setStep(0);
                            }} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }
    }

    // Study abroad path
    if (scenario === 'study_abroad') {
        if (step === 0) {
            return (
                <SceneBackground sceneKey="chapter1_airport">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"📅 18 tuổi - Tháng 8/2024\n\nBạn quyết định du học nước ngoài...\n\nHôm nay là ngày lên máy bay..."} onComplete={() => setStep(1)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 1) {
            return (
                <SceneBackground sceneKey="chapter1_airport">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/bố_buồn.png" alt="Bố" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Bố</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Con đi cẩn thận! Nhớ gọi điện về!\n\nBố mẹ sẽ nhớ con lắm... 😢\n\nCon phải cố gắng học hành nhé!"} onComplete={() => setStep(2)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 2) {
            return (
                <SceneBackground sceneKey="chapter1_airport">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={getPlayerSprite('buồn')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{state.player.name}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Dạ! Con sẽ cố gắng! Con yêu bố mẹ! 😢\n\n(Suy nghĩ) Mình sẽ xa nhà 4 năm... Mình có làm được không?"} onComplete={() => {
                                updateStats({ happiness: -20, social: -10 });
                                setStep(3);
                            }} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 3) {
            return (
                <SceneBackground sceneKey="chapter1_airplane">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"✈️ Trên máy bay...\n\n12 giờ bay... Bạn cảm thấy lo lắng về tương lai..."} onComplete={() => setStep(4)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 4) {
            return (
                <SceneBackground sceneKey="chapter1_foreign_university">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"📅 Năm 1 - Nước ngoài\n\nMọi thứ đều xa lạ... Ngôn ngữ, văn hóa, con người..."} onComplete={() => setStep(5)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 5) {
            return (
                <SceneBackground sceneKey="chapter1_foreign_dorm">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={getPlayerSprite('lo_lắng')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{state.player.name}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"(Suy nghĩ)\n\nMình... Mình nhớ nhà quá...\n\nTiếng Anh mình còn kém... Bài giảng khó hiểu quá... 😢"} onComplete={() => {
                                updateStats({ happiness: -20, knowledge: -10 });
                                setStep(6);
                            }} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 6) {
            return (
                <SceneBackground sceneKey="chapter1_foreign_university">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/bạn_thân_thích_thú.png" alt="Bạn quốc tế" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Bạn quốc tế</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Hey! You're from Vietnam?\n\nThat's cool! I'm John! Let's be friends!\n\nDon't worry, you'll get used to it!"} onComplete={() => {
                                updateStats({ social: 20, happiness: 10 });
                                setStep(7);
                            }} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 7) {
            return (
                <SceneBackground sceneKey="chapter1_foreign_university">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"📅 Năm 2 - 20 tuổi\n\nBạn đã quen với cuộc sống nước ngoài...\n\nTiếng Anh đã tốt hơn nhiều!"} onComplete={() => setStep(8)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 8) {
            return (
                <SceneBackground sceneKey="chapter1_foreign_dorm">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={getPlayerSprite('vui_vẻ')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{state.player.name}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Mình đã quen rồi!\n\nTiếng Anh mình tốt hơn! Bài giảng dễ hiểu hơn!\n\nMình có nhiều bạn quốc tế!"} onComplete={() => {
                                updateStats({ knowledge: 30, social: 20, happiness: 20 });
                                setStep(9);
                            }} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 9) {
            return (
                <SceneBackground sceneKey="chapter1_foreign_university">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"📅 Năm 3 - 21 tuổi\n\nNhưng có một vấn đề..."} onComplete={() => setStep(10)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 10) {
            return (
                <SceneBackground sceneKey="chapter1_foreign_dorm">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={getPlayerSprite('lo_lắng')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{state.player.name}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"(Suy nghĩ)\n\nMình đã xa nhà 3 năm...\n\nMình không còn mối quan hệ ở Việt Nam...\n\nBạn bè cũ đã xa cách... 😢"} onComplete={() => {
                                updateStats({ social: -20, happiness: -10 });
                                setStep(11);
                            }} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 11) {
            return (
                <SceneBackground sceneKey="chapter1_foreign_university">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"📅 Năm 4 - 22 tuổi - Tốt nghiệp\n\nBạn đã tốt nghiệp với bằng giỏi!\n\nGiờ đây, bạn phải quyết định: Ở lại hay về Việt Nam?"} onComplete={() => setStep(12)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 12) {
            return (
                <SceneBackground sceneKey="chapter1_airport">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={getPlayerSprite('nghiêm_túc')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{state.player.name}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Mình sẽ về Việt Nam!\n\nMình nhớ gia đình, nhớ quê hương!\n\nMình sẽ áp dụng kiến thức học được để phát triển đất nước!"} onComplete={() => {
                                updateStats({ knowledge: 60, happiness: 20 });
                                setStep(13);
                            }} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 13) {
            return (
                <SceneBackground sceneKey="chapter1_office">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"📅 Về Việt Nam - Xin việc\n\nNhưng..."} onComplete={() => setStep(14)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 14) {
            return (
                <SceneBackground sceneKey="chapter1_interview">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/sếp_nghiêm_túc.png" alt="Nhà tuyển dụng" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Nhà tuyển dụng</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Anh/Chị học nước ngoài à? Tốt!\n\nNhưng anh/chị không có kinh nghiệm làm việc ở Việt Nam...\n\nVà không có mối quan hệ... Khó xin việc lắm!"} onComplete={() => {
                                updateStats({ economy: -20, happiness: -20 });
                                setFlag('study_abroad_difficulty', true);
                                setScenario('chapter_end');
                                setStep(0);
                            }} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }
    }

    // SCENARIO: Chapter End - Kết thúc Chapter 1
    if (scenario === 'chapter_end') {
        const educationPath = state.flags.education_path || 'university';

        if (step === 0) {
            return (
                <SceneBackground sceneKey="dream">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/bà_tiên_vui_vẻ.png" alt="Bà Tiên" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Bà Tiên Duyên ✨</h2>
                        <div className="dialogue-content">
                            <Typewriter text={`Ngươi đã hoàn thành giai đoạn đầu tiên của cuộc đời...

${educationPath === 'university' ? 'Ngươi đã học đại học, có bằng cấp và kiến thức...' : ''}
${educationPath === 'work' ? 'Ngươi đã đi làm sớm, có kinh nghiệm thực tế nhưng thiếu bằng cấp...' : ''}
${educationPath === 'study_abroad' ? 'Ngươi đã du học, có kiến thức cao nhưng thiếu mối quan hệ...' : ''}

Mỗi con đường đều có ưu nhược điểm riêng...

Giờ đây, ngươi bước vào giai đoạn tiếp theo: Lập gia đình...`} onComplete={() => {
                                    updateStats({ happiness: 20, knowledge: 10 });
                                    setScreen('chapter2');
                                }} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }
    }

    // Default fallback
    return (
        <SceneBackground sceneKey="dream">
            <StatsPanel />
            <div className="dialogue-box">
                <h2 className="speaker-name">System</h2>
                <div className="dialogue-content">
                    <Typewriter text={"Chapter 1 đang được phát triển..."} onComplete={() => setScreen('start')} />
                </div>
            </div>
        </SceneBackground>
    );
}
