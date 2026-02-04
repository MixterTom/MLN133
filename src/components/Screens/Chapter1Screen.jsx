import { useState, useEffect } from 'react';
import { useGame } from '../../contexts/GameContext';
import StatsPanel from '../UI/StatsPanel';
import StatChangeNotification from '../UI/StatChangeNotification';
import GameModal from '../UI/GameModal';
import CafeQTE from '../MiniGames/CafeQTE';
import ExamGame from '../MiniGames/ExamGame';
import InterviewGame from '../MiniGames/InterviewGame';
import DateGame from '../MiniGames/DateGame';
import StudyGroupGame from '../MiniGames/StudyGroupGame';
import PathCollectorGame from '../MiniGames/PathCollectorGame';
import BudgetGame from '../MiniGames/BudgetGame';
import TimeManagementGame from '../MiniGames/TimeManagementGame';
import SocialNetworkGame from '../MiniGames/SocialNetworkGame';
import PresentationGame from '../MiniGames/PresentationGame';
import SceneBackground from '../Common/SceneBackground';
import Typewriter from '../Common/Typewriter';
import { preloadDialogues, getPreloadProgress } from '../../utils/voicePreloader';
import { getChapter1Dialogues } from '../../data/chapter1Dialogues';
import './PrologueScreen.css';

export default function Chapter1Screen() {
    const { state, updateStats, setScreen, addChoice, setFlag } = useGame();
    const [showStatChange, setShowStatChange] = useState(false);
    const [statChanges, setStatChanges] = useState({});

    // Load scenario and step from saved state, or use defaults
    const [scenario, setScenarioState] = useState(state.flags.chapter1_scenario || 'graduation');
    const [showChoices, setShowChoices] = useState(false); // For showing choices after typing
    const [step, setStepState] = useState(state.flags.chapter1_step || 0);
    const [showMiniGame, setShowMiniGame] = useState(false);
    const [miniGameType, setMiniGameType] = useState(null);
    const [selectedPath, setSelectedPath] = useState(null); // Track selected path for mini-game
    const [audioEnabled, setAudioEnabled] = useState(state.flags.audio_enabled || false); // Track if user has enabled audio
    const [voicePreloadDone, setVoicePreloadDone] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalConfig, setModalConfig] = useState({});

    // Helper to wrap content with GameModal
    const renderWithModal = (content) => (
        <>
            {content}
            <GameModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={() => setShowModal(false)}
                title={modalConfig.title || 'Thông báo'}
                message={modalConfig.message || ''}
                type={modalConfig.type || 'alert'}
                icon={modalConfig.icon || '✨'}
            />
        </>
    );

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

    const handleChoice = (changes, choiceData) => {
        setStatChanges(changes);
        setShowStatChange(true);
        if (choiceData) {
            addChoice(choiceData);
        }
    };

    const handleContinueAfterStats = () => {
        updateStats(statChanges);
        setShowStatChange(false);
        setStep(step + 1);
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
        } else if (currentGameType === 'budget') {
            // Budget management results
            if (score >= 200) {
                updateStats({ economy: 25, happiness: 15, knowledge: 5 });
                setFlag('budget_skill', 'excellent');
            } else if (score >= 150) {
                updateStats({ economy: 15, happiness: 10 });
                setFlag('budget_skill', 'good');
            } else if (score >= 100) {
                updateStats({ economy: 10 });
                setFlag('budget_skill', 'average');
            } else {
                updateStats({ economy: -10, happiness: -5 });
                setFlag('budget_skill', 'poor');
            }
        } else if (currentGameType === 'time_management') {
            // Time management results
            if (score >= 300) {
                updateStats({ knowledge: 25, happiness: 20, health: 10 });
                setFlag('time_management', 'excellent');
            } else if (score >= 200) {
                updateStats({ knowledge: 15, happiness: 10 });
                setFlag('time_management', 'good');
            } else if (score >= 100) {
                updateStats({ knowledge: 10 });
                setFlag('time_management', 'average');
            } else {
                updateStats({ knowledge: -10, happiness: -10, health: -5 });
                setFlag('time_management', 'poor');
            }
        } else if (currentGameType === 'social_network') {
            // Social network results
            if (score >= 150) {
                updateStats({ social: 30, happiness: 20, knowledge: 10 });
                setFlag('social_network', 'excellent');
            } else if (score >= 100) {
                updateStats({ social: 20, happiness: 10 });
                setFlag('social_network', 'good');
            } else if (score >= 50) {
                updateStats({ social: 10 });
                setFlag('social_network', 'average');
            } else {
                updateStats({ social: -10, happiness: -5 });
                setFlag('social_network', 'poor');
            }
        } else if (currentGameType === 'presentation') {
            // Presentation results
            if (score >= 150) {
                updateStats({ knowledge: 35, social: 25, happiness: 20 });
                setFlag('presentation_performance', 'excellent');
            } else if (score >= 100) {
                updateStats({ knowledge: 25, social: 15, happiness: 10 });
                setFlag('presentation_performance', 'good');
            } else if (score >= 60) {
                updateStats({ knowledge: 15, social: 10 });
                setFlag('presentation_performance', 'average');
            } else {
                updateStats({ knowledge: 5, social: -5, happiness: -10 });
                setFlag('presentation_performance', 'poor');
            }
        }

        setStep(step + 1);
    };

    // Handler for Path Collector mini-game
    const handlePathCollectorComplete = (result) => {
        setShowMiniGame(false);
        setMiniGameType(null);

        const { score, result: quality, pathType } = result;

        // Set quality flag based on result
        setFlag(`${pathType}_quality`, quality);

        // Apply stats based on path and quality
        if (pathType === 'university') {
            if (quality === 'excellent') {
                updateStats({ knowledge: 60, happiness: 20 });
                addChoice({ type: 'education', value: 'university_top' });
            } else if (quality === 'good') {
                updateStats({ knowledge: 45, happiness: 10 });
                addChoice({ type: 'education', value: 'university_good' });
            } else if (quality === 'average') {
                updateStats({ knowledge: 30 });
                addChoice({ type: 'education', value: 'university_normal' });
            } else {
                updateStats({ knowledge: 20, happiness: -10 });
                addChoice({ type: 'education', value: 'university_private' });
            }
            setFlag('education_path', 'university');
            setScenario('university');
        } else if (pathType === 'work') {
            if (quality === 'excellent') {
                updateStats({ economy: 50, social: 20 });
                addChoice({ type: 'education', value: 'work_big_company' });
            } else if (quality === 'good') {
                updateStats({ economy: 35, social: 10 });
                addChoice({ type: 'education', value: 'work_stable' });
            } else if (quality === 'average') {
                updateStats({ economy: 20 });
                addChoice({ type: 'education', value: 'work_normal' });
            } else {
                updateStats({ economy: 10, happiness: -15 });
                addChoice({ type: 'education', value: 'work_labor' });
            }
            setFlag('education_path', 'work');
            setScenario('work_early');
        } else if (pathType === 'study_abroad') {
            if (quality === 'excellent') {
                updateStats({ knowledge: 80, social: 30, economy: -50 });
                addChoice({ type: 'education', value: 'study_abroad_scholarship' });
            } else if (quality === 'good') {
                updateStats({ knowledge: 60, social: 20, economy: -80 });
                addChoice({ type: 'education', value: 'study_abroad_success' });
            } else if (quality === 'average') {
                updateStats({ knowledge: 40, social: 10, economy: -100, happiness: -10 });
                addChoice({ type: 'education', value: 'study_abroad_struggle' });
            } else {
                updateStats({ happiness: -30, economy: -20 });
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

        return renderWithModal(
            <SceneBackground sceneKey="dream">
                <StatsPanel />
                {showStatChange && (
                    <StatChangeNotification changes={statChanges} onContinue={handleContinueAfterStats} />
                )}
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
                                        setModalConfig({
                                            title: '💰 Không đủ tiền',
                                            message: 'Gia đình không đủ tiền cho con du học...',
                                            type: 'alert',
                                            icon: '💰'
                                        });
                                        setShowModal(true);
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
                            <Typewriter text={"📚 Tuần đầu tiên - Giảng đường...\n\nMôi trường đại học hoàn toàn khác THPT.\n\nKhông còn thầy cô nhắc nhở, bạn phải tự học, tự nghiên cứu...\n\nVà bạn cần xây dựng mối quan hệ với bạn bè, thầy cô!"} onComplete={() => setStep(3.5)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        // Step 3.5: Social Network Game - Xây dựng mối quan hệ
        if (step === 3.5) {
            return (
                <SceneBackground sceneKey="chapter1_lecture">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            {!showChoices ? (
                                <Typewriter text={"Bạn bắt đầu làm quen với môi trường mới...\n\nHãy tương tác với mọi người để xây dựng mối quan hệ!"} onComplete={() => setShowChoices(true)} />
                            ) : (
                                <button className="continue-btn fade-in" onClick={() => {
                                    setMiniGameType('social_network');
                                    setShowMiniGame(true);
                                }}>Xây dựng mối quan hệ 👥</button>
                            )}
                        </div>
                    </div>
                    {showMiniGame && miniGameType === 'social_network' && (
                        <SocialNetworkGame onComplete={handleMiniGameComplete} />
                    )}
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
                                <button className="continue-btn fade-in" onClick={() => {
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
                                <Typewriter text={"Wow! Bạn học nhanh quá! Giải thích rất dễ hiểu!\n\nHọc nhóm với bạn hiệu quả thật! Mình hiểu hết rồi!\n\nCảm ơn bạn nhiều!"} onComplete={() => setStep(6.5)} />
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
                                <Typewriter text={"Học nhóm vui đấy! Mình hiểu được nhiều!\n\nLần sau học tiếp nhé!"} onComplete={() => setStep(6.5)} />
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
                                <Typewriter text={"Ừm... mình vẫn chưa hiểu lắm...\n\nCó lẽ chúng mình cần học kỹ hơn..."} onComplete={() => setStep(6.5)} />
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
                                <Typewriter text={"Học nhóm mà cả hai đều không tập trung...\n\nChúng mình lãng phí thời gian rồi...\n\nLần sau phải cố gắng hơn!"} onComplete={() => setStep(6.5)} />
                            </div>
                        </div>
                    </SceneBackground>
                );
            }
        }

        // Step 6.5: Bài thuyết trình nhóm - Sau khi học nhóm
        if (step === 6.5) {
            return (
                <SceneBackground sceneKey="chapter1_lecture">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/bạn_thân_vui_vẻ.png" alt="Hùng" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Hùng</h2>
                        <div className="dialogue-content">
                            {!showChoices ? (
                                <Typewriter text={"Này bạn! Thầy giao bài thuyết trình nhóm rồi!\n\nChúng mình phải trình bày về dự án của nhóm!\n\nBạn có tự tin thuyết trình không?"} onComplete={() => setShowChoices(true)} />
                            ) : (
                                <button className="continue-btn fade-in" onClick={() => {
                                    setMiniGameType('presentation');
                                    setShowMiniGame(true);
                                }}>Bắt đầu thuyết trình! 🎤</button>
                            )}
                        </div>
                    </div>
                    {showMiniGame && miniGameType === 'presentation' && (
                        <PresentationGame onComplete={handleMiniGameComplete} />
                    )}
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
                            {!showChoices ? (
                                <Typewriter text={"📅 3 tháng sau...\n\nCuộc sống đại học đang dần quen thuộc, nhưng tiền bạc lại là vấn đề...\n\nBạn cần học cách quản lý ngân sách!"} onComplete={() => setShowChoices(true)} enableVoice={audioEnabled} />
                            ) : (
                                <button className="continue-btn fade-in" onClick={() => {
                                    setMiniGameType('budget');
                                    setShowMiniGame(true);
                                }}>Học quản lý ngân sách 💰</button>
                            )}
                        </div>
                    </div>
                    {showMiniGame && miniGameType === 'budget' && (
                        <BudgetGame onComplete={handleMiniGameComplete} />
                    )}
                </SceneBackground>
            );
        }
    }

    // SCENARIO 1.3: Học tập và làm thêm
    if (scenario === 'part_time') {
        if (step === 0) {
            return (
                <SceneBackground sceneKey="chapter1_university">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"📅 3 tháng sau...\n\nCuộc sống đại học đang dần quen thuộc, nhưng tiền bạc lại là vấn đề..."} onComplete={() => setStep(1)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 1) {
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
                                <Typewriter text={"Trời... Mình chỉ còn 500k...\n\nTiền bố mẹ cho không đủ sống..."} onComplete={() => setStep(2)} />
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
                                    setStep(2);
                                }} enableVoice={audioEnabled} />
                            </div>
                        </div>
                    </SceneBackground>
                );
            }
        }

        if (step === 2) {
            return (
                <SceneBackground sceneKey="chapter1_university">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/bạn_thân_lo_lắng.png" alt="Hùng" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Hùng</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Bạn hết tiền à? Mình cũng vậy!\n\nTiền bố mẹ cho không đủ sống...\n\nMình biết một quán cà phê đang tuyển! Chúng mình đi xin việc nhé!"} onComplete={() => setStep(3)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 3) {
            return (
                <SceneBackground sceneKey="chapter1_university">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={getPlayerSprite('vui_vẻ')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{state.player.name}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Ừ! Đi thôi!\n\nMình cũng cần kiếm thêm tiền..."} onComplete={() => setStep(4)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 4) {
            return (
                <SceneBackground sceneKey="chapter1_cafe">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/sếp_hài_lòng.png" alt="Chủ quán" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Chủ quán</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Các em có kinh nghiệm không?"} onComplete={() => setStep(5)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 5) {
            return (
                <SceneBackground sceneKey="chapter1_cafe">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={getPlayerSprite('ngại')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{state.player.name}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Dạ... em chưa có kinh nghiệm ạ...\n\nNhưng em sẽ học hỏi và cố gắng!"} onComplete={() => setStep(6)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 6) {
            return (
                <SceneBackground sceneKey="chapter1_cafe">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/sếp_hài_lòng.png" alt="Chủ quán" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Chủ quán</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Được! Em bắt đầu từ mai. Ca 4 tiếng, 25k/giờ = 100k/ca.\n\nTuần làm 5 ca = 500k/tuần.\n\nGiờ cao điểm sẽ rất bận, em phải nhanh tay nhé!"} onComplete={() => setStep(7)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 7) {
            return (
                <SceneBackground sceneKey="chapter1_cafe">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"📅 Ngày hôm sau - Giờ cao điểm 5pm...\n\nQuán đông nghẹt khách!"} onComplete={() => setShowMiniGame(true)} />
                        </div>
                    </div>
                    {showMiniGame && <CafeQTE onComplete={handleMiniGameComplete} />}
                </SceneBackground>
            );
        }

        if (step === 8) {
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
                                        setStep(9);
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
                                setStep(9);
                            }} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 9) {
            return (
                <SceneBackground sceneKey="chapter1_university">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"📅 3 tháng sau...\n\nBạn đã quen với công việc, nhưng học hành bị ảnh hưởng..."} onComplete={() => setStep(10)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 10) {
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
                {showStatChange && (
                    <StatChangeNotification changes={statChanges} onContinue={handleContinueAfterStats} />
                )}
                <div className="character-container">
                    <img src="/src/assets/characters/bà_tiên_nghiêm_túc.png" alt="Bà Tiên" className="character-sprite left" />
                </div>
                <div className="dialogue-box">
                    <h2 className="speaker-name">Bà Tiên Duyên ✨</h2>
                    <div className="dialogue-content">
                        {!showChoices ? (
                            <Typewriter text={"Ngươi phải cân bằng giữa học và làm...\n\nHãy học cách quản lý thời gian trước khi quyết định!"} onComplete={() => setShowChoices(true)} enableVoice={audioEnabled} />
                        ) : (
                            <>
                                <div className="choices-container fade-in">
                                    <button className="choice-btn" onClick={() => {
                                        setMiniGameType('time_management');
                                        setShowMiniGame(true);
                                    }}>
                                        <span className="choice-title">⏰ Học quản lý thời gian</span>
                                        <span className="choice-desc">Thử thách: Sắp xếp lịch 3 ngày cân bằng!</span>
                                    </button>
                                    <button className="choice-btn" onClick={() => {
                                        handleChoice({ economy: 20, knowledge: -15, happiness: -10 }, { type: 'work_balance', value: 'work_more' });
                                        setScenario('romance');
                                        setStep(0);
                                    }}>
                                        <span className="choice-title">💼 Tiếp tục làm 5 ca/tuần</span>
                                        <span className="choice-desc">Mình cần tiền! Mình sẽ cố gắng học!</span>
                                    </button>
                                    <button className="choice-btn" onClick={() => {
                                        handleChoice({ economy: 12, knowledge: -5, happiness: 5 }, { type: 'work_balance', value: 'balanced' });
                                        setScenario('romance');
                                        setStep(0);
                                    }}>
                                        <span className="choice-title">⚖️ Giảm xuống 3 ca/tuần</span>
                                        <span className="choice-desc">Mình sẽ cân bằng học và làm!</span>
                                    </button>
                                    <button className="choice-btn" onClick={() => {
                                        handleChoice({ economy: -20, knowledge: 20, happiness: 10 }, { type: 'work_balance', value: 'study_focus' });
                                        setScenario('romance');
                                        setStep(0);
                                    }}>
                                        <span className="choice-title">📚 Nghỉ làm, tập trung học</span>
                                        <span className="choice-desc">Mình sẽ xin bố mẹ hỗ trợ thêm!</span>
                                    </button>
                                </div>
                                {showMiniGame && miniGameType === 'time_management' && (
                                    <TimeManagementGame onComplete={(score) => {
                                        handleMiniGameComplete(score);
                                        // After time management game, continue to romance
                                        setTimeout(() => {
                                            setScenario('romance');
                                            setStep(0);
                                        }, 500);
                                    }} />
                                )}
                            </>
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
        if (step === 0) {
            return (
                <SceneBackground sceneKey="chapter1_university">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"📅 Năm 3 đại học - Tháng 3/2027...\n\nCuộc sống đã ổn định hơn. Học hành, làm thêm đều đã quen thuộc...\n\nBạn bắt đầu chú ý đến những điều khác trong cuộc sống..."} onComplete={() => setStep(1)} />
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
                            <Typewriter text={"🏫 Giảng đường - Buổi chiều...\n\nBạn đang ngồi học nhóm với bạn bè.\n\nTrong lớp có một người bạn tên Khánh, người mà bạn thường để ý đến...\n\nKhánh vừa thông minh, vừa vui tính, khiến bạn cảm thấy thoải mái mỗi khi trò chuyện..."} onComplete={() => setStep(2)} />
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
                        <img src={getPlayerSprite('thích_thú')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{state.player.name}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"(Suy nghĩ)\n\nKhánh hôm nay trông vui vẻ quá...\n\nMình... mình có thích Khánh không nhỉ?"} onComplete={() => setStep(3)} />
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
                        <img src="/src/assets/characters/bạn_thân_vui_vẻ.png" alt="Minh" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Minh (Bạn thân)</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Bạn có thích ai không?\n\nMình thấy bạn hay nhìn Khánh đấy!\n\nThử mời đi uống cà phê xem!"} onComplete={() => setStep(4)} />
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
                        <img src={getPlayerSprite('bối_rối')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{state.player.name}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Ừu... có một người...\n\nNhưng mình không biết nên làm gì..."} onComplete={() => setStep(5)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 5) {
            return (
                <SceneBackground sceneKey="chapter1_cinema">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"📅 Cuối tuần - Rạp phim...\n\nBạn đã mạnh dạn rủ Khánh đi xem phim..."} onComplete={() => setStep(6)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 6) {
            return (
                <SceneBackground sceneKey="chapter1_cinema">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/khánh_vui_vẻ.png" alt="Crush" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Khánh</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Chào! Lâu rồi không gặp!\n\nBạn rủ mình đi xem phim à? Được!"} onComplete={() => setStep(7)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 7) {
            return (
                <SceneBackground sceneKey="chapter1_cinema">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={getPlayerSprite('thích_thú')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{state.player.name}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Tuyệt! Mình thích xem phim tình cảm!\n\nCòn bạn thích xem phim gì?"} onComplete={() => setStep(8)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 8) {
            return (
                <SceneBackground sceneKey="chapter1_cinema">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/khánh_vui_vẻ.png" alt="Khánh" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Khánh</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Mình cũng thích phim tình cảm!\n\nHôm nay vui lắm! Cảm ơn bạn!"} onComplete={() => {
                                updateStats({ happiness: 20, social: 10 });
                                setStep(9);
                            }} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 9) {
            return (
                <SceneBackground sceneKey="chapter1_university">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"📅 3 tháng sau...\n\nHai bạn đã gặp nhau nhiều lần. Tình cảm ngày càng sâu đậm..."} onComplete={() => setStep(10)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 10) {
            return (
                <SceneBackground sceneKey="chapter1_dating">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/khánh_vui_vẻ.png" alt="Khánh" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Khánh</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Mình... mình có điều muốn nói...\n\nMình... mình thích bạn...\n\nBạn có thích mình không?"} onComplete={() => setStep(11)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 11) {
            return (
                <SceneBackground sceneKey="chapter1_dating">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={getPlayerSprite('vui_vẻ')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{state.player.name}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Mình cũng thích bạn! ❤️\n\nMình đã thích bạn từ lâu rồi..."} onComplete={() => {
                                updateStats({ happiness: 30 });
                                setFlag('has_lover', true);
                                setStep(12);
                            }} enableVoice={audioEnabled} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 12) {
            return (
                <SceneBackground sceneKey="chapter1_university">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            {!showChoices ? (
                                <Typewriter text={"💕 Hai bạn đã bắt đầu yêu nhau...\n\nNhưng tình yêu và học hành có thể cân bằng được không?"} onComplete={() => setShowChoices(true)} enableVoice={audioEnabled} />
                            ) : (
                                <button className="continue-btn fade-in" onClick={() => {
                                    setScenario('love_choice');
                                    setStep(0);
                                }}>Tiếp tục →</button>
                            )}
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
                {showStatChange && (
                    <StatChangeNotification changes={statChanges} onContinue={handleContinueAfterStats} />
                )}
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
                                    handleChoice({ happiness: 30, economy: -10, knowledge: -10 }, { type: 'love_career', value: 'love' });
                                    setScenario('family_pressure');
                                    setStep(0);
                                }}>
                                    <span className="choice-title">💕 Mình muốn yêu!</span>
                                    <span className="choice-desc">Tình yêu là quan trọng nhất!</span>
                                </button>
                                <button className="choice-btn" onClick={() => {
                                    handleChoice({ knowledge: 20, economy: 10, happiness: -20 }, { type: 'love_career', value: 'career' });
                                    setScenario('family_pressure');
                                    setStep(0);
                                }}>
                                    <span className="choice-title">💼 Tập trung sự nghiệp</span>
                                    <span className="choice-desc">Mình cần tập trung sự nghiệp trước...</span>
                                </button>
                                <button className="choice-btn" onClick={() => {
                                    handleChoice({ happiness: 10, economy: -5, knowledge: -5 }, { type: 'love_career', value: 'balance' });
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

    // SCENARIO 1.5: Áp lực gia đình
    if (scenario === 'family_pressure') {
        if (step === 0) {
            return (
                <SceneBackground sceneKey="prologue_childhood_normal">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/mẹ_yêu_thương.png" alt="Mẹ" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Mẹ</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Con ơi! Lâu rồi không về!\n\nCon học thế nào? Sắp tốt nghiệp rồi nhỉ?\n\nCon có người yêu chưa?"} onComplete={() => setStep(1)} />
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
                        <img src={getPlayerSprite('vui_vẻ')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{state.player.name}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Dạ, con có người yêu rồi ạ...\n\nCon đang học tốt mà!"} onComplete={() => setStep(2)} />
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
                        <img src="/src/assets/characters/bố_nghiêm_túc.png" alt="Bố" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Bố</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Bố muốn con về làm việc ở quê...\n\nỞ đó bố có quen biết, dễ xin việc...\n\nCon ở xa, bố mẹ lo lắng lắm..."} onComplete={() => setStep(3)} />
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
                        <img src={getPlayerSprite('lo_lắng')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{state.player.name}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={"Nhưng con muốn ở thành phố...\n\nCon có ước mơ của con..."} onComplete={() => setScenario('family_choice')} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }
    }

    // Family choice
    if (scenario === 'family_choice') {
        return (
            <SceneBackground sceneKey="dream">
                <StatsPanel />
                {showStatChange && (
                    <StatChangeNotification changes={statChanges} onContinue={handleContinueAfterStats} />
                )}
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
                                    handleChoice({ happiness: -15, social: 20 }, { type: 'family_decision', value: 'obey' });
                                    setScenario('graduation_uni');
                                    setStep(0);
                                }}>
                                    <span className="choice-title">🏠 Nghe lời bố mẹ</span>
                                    <span className="choice-desc">Con sẽ về quê làm việc!</span>
                                </button>
                                <button className="choice-btn" onClick={() => {
                                    handleChoice({ happiness: 20, social: -15 }, { type: 'family_decision', value: 'follow_dream' });
                                    setScenario('graduation_uni');
                                    setStep(0);
                                }}>
                                    <span className="choice-title">🌟 Theo đuổi đam mê</span>
                                    <span className="choice-desc">Con muốn theo đuổi đam mê của con!</span>
                                </button>
                                <button className="choice-btn" onClick={() => {
                                    handleChoice({ happiness: 5, social: 5 }, { type: 'family_decision', value: 'compromise' });
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
        <>
            <SceneBackground sceneKey="dream">
                <StatsPanel />
                <div className="dialogue-box">
                    <h2 className="speaker-name">System</h2>
                    <div className="dialogue-content">
                        <Typewriter text={"Chapter 1 đang được phát triển..."} onComplete={() => setScreen('start')} />
                    </div>
                </div>
            </SceneBackground>
            <GameModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={() => setShowModal(false)}
                title={modalConfig.title || 'Thông báo'}
                message={modalConfig.message || ''}
                type={modalConfig.type || 'alert'}
                icon={modalConfig.icon || '✨'}
            />
        </>
    );
}
