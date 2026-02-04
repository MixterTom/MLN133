import { useState, useEffect } from 'react';
import { useGame } from '../../contexts/GameContext';
import { getSceneBackground } from '../../utils/backgroundManager';
import SceneBackground from '../Common/SceneBackground';
import Typewriter from '../Common/Typewriter';
import StatsPanel from '../UI/StatsPanel';
import DiceOfDestiny from '../MiniGames/DiceOfDestiny';
import GameModal from '../UI/GameModal';
import './PrologueScreen.css';

export default function PrologueScreen() {
    const { dispatch, setScreen } = useGame();
    const [step, setStep] = useState(0);
    const [showChoices, setShowChoices] = useState(false);
    const [showDiceGame, setShowDiceGame] = useState(false);
    const [playerData, setPlayerData] = useState({
        name: '',
        gender: '',
        origin: '',
        detailedOrigin: ''
    });
    const [showModal, setShowModal] = useState(false);
    const [modalConfig, setModalConfig] = useState({});
    const [nameError, setNameError] = useState('');
    const [nameTouched, setNameTouched] = useState(false);

    // Reset showChoices when step changes
    useEffect(() => {
        setShowChoices(false);
    }, [step]);

    const handleOriginChoice = (origin) => {
        setPlayerData({ ...playerData, origin });
        setShowDiceGame(true);
    };

    const handleDiceGameComplete = (result) => {
        // Update player data with detailed origin
        setPlayerData({ ...playerData, detailedOrigin: result.detailedOrigin });

        // Update stats based on dice result
        dispatch({
            type: 'UPDATE_STATS',
            payload: result.bonusStats
        });

        setShowDiceGame(false);
        setStep(1);
    };

    const handleGenderChoice = (gender) => {
        setPlayerData({ ...playerData, gender });
        setStep(2);
    };

    // Validation rules for name
    const validateName = (name) => {
        const trimmedName = name.trim();
        
        if (!trimmedName) {
            return {
                isValid: false,
                error: 'Tên không được để trống!'
            };
        }
        
        if (trimmedName.length < 2) {
            return {
                isValid: false,
                error: 'Tên phải có ít nhất 2 ký tự!'
            };
        }
        
        if (trimmedName.length > 20) {
            return {
                isValid: false,
                error: 'Tên không được vượt quá 20 ký tự!'
            };
        }
        
        // Allow Vietnamese characters, letters, numbers, spaces, and common Vietnamese name characters
        // Pattern: Vietnamese letters (including accented), numbers, spaces, and common name separators
        const validNamePattern = /^[a-zA-ZÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴĐđ\s]+$/;
        
        if (!validNamePattern.test(trimmedName)) {
            return {
                isValid: false,
                error: 'Tên chỉ được chứa chữ cái, số và dấu cách!'
            };
        }
        
        // Check for consecutive spaces
        if (trimmedName.includes('  ')) {
            return {
                isValid: false,
                error: 'Tên không được có nhiều khoảng trắng liên tiếp!'
            };
        }
        
        // Check for leading/trailing spaces (shouldn't happen after trim, but just in case)
        if (name !== trimmedName) {
            return {
                isValid: false,
                error: 'Tên không được có khoảng trắng ở đầu hoặc cuối!'
            };
        }
        
        return {
            isValid: true,
            error: ''
        };
    };

    const handleNameChange = (e) => {
        const newName = e.target.value;
        setPlayerData({ ...playerData, name: newName });
        
        if (nameTouched) {
            const validation = validateName(newName);
            setNameError(validation.error);
        }
    };

    const handleNameBlur = () => {
        setNameTouched(true);
        const validation = validateName(playerData.name);
        setNameError(validation.error);
    };

    const handleNameSubmit = () => {
        setNameTouched(true);
        const validation = validateName(playerData.name);
        
        if (!validation.isValid) {
            setNameError(validation.error);
            setModalConfig({
                title: '⚠️ Tên không hợp lệ',
                message: validation.error,
                type: 'alert',
                icon: '⚠️'
            });
            setShowModal(true);
            return;
        }
        
        // Name is valid, proceed
        dispatch({ type: 'SET_PLAYER_DATA', payload: { ...playerData, name: playerData.name.trim() } });
        setNameError('');
        setStep(3);
    };

    const handleComplete = () => {
        setScreen('chapter1');
    };

    // Show Dice Game
    if (showDiceGame) {
        return (
            <SceneBackground sceneKey="dream">
                <StatsPanel />
                <DiceOfDestiny origin={playerData.origin} onComplete={handleDiceGameComplete} />
            </SceneBackground>
        );
    }

    // Step 0: Gặp Bà Tiên - Giới thiệu
    if (step === 0) {
        const text = `Chào ngươi, linh hồn trẻ tuổi...

Ta là Bà Tiên Duyên, người dẫn dắt các linh hồn đến với cuộc đời mới.

Ngươi sắp được sinh ra, bắt đầu một cuộc hành trình từ lúc chào đời đến lúc nhắm mắt...

Cuộc đời là một chuỗi lựa chọn. Mỗi quyết định của ngươi sẽ định hình số phận của ngươi.

Giờ đây... Hãy chọn xuất thân của ngươi...`;

        return (
            <SceneBackground sceneKey="dream">
                <StatsPanel />
                <div className="character-container">
                    <img
                        src="/src/assets/characters/bà_tiên_bth.png"
                        alt="Bà Tiên Duyên"
                        className="character-sprite left"
                    />
                </div>
                <div className="dialogue-box">
                    <h2 className="speaker-name">Bà Tiên Duyên ✨</h2>
                    <div className="dialogue-content">
                        {!showChoices ? (
                            <Typewriter text={text} onComplete={() => setShowChoices(true)} />
                        ) : (
                            <div className="choices-container fade-in">
                                <button
                                    className="choice-btn"
                                    onClick={() => handleOriginChoice('rich')}
                                >
                                    <span className="choice-title">🏰 Gia đình giàu có</span>
                                    <span className="choice-desc">Doanh nhân, có tiền có quyền, nhiều cơ hội nhưng áp lực lớn</span>
                                </button>

                                <button
                                    className="choice-btn"
                                    onClick={() => handleOriginChoice('normal')}
                                >
                                    <span className="choice-title">🏡 Gia đình bình thường</span>
                                    <span className="choice-desc">Công nhân, giáo viên - cuộc sống cân bằng, ít áp lực</span>
                                </button>

                                <button
                                    className="choice-btn"
                                    onClick={() => handleOriginChoice('poor')}
                                >
                                    <span className="choice-title">🏚️ Gia đình nghèo</span>
                                    <span className="choice-desc">Nông dân, công nhân nghèo - khó khăn nhưng ý chí mạnh mẽ</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </SceneBackground>
        );
    }

    // Step 1: Chọn giới tính
    if (step === 1) {
        const text = `Tốt lắm! Ngươi đã chọn xuất thân...

Giờ đây, ngươi muốn là nam hay nữ?`;

        return (
            <SceneBackground sceneKey="dream">
                <StatsPanel />
                <div className="character-container">
                    <img
                        src="/src/assets/characters/bà_tiên_vui_vẻ.png"
                        alt="Bà Tiên Duyên"
                        className="character-sprite left"
                    />
                </div>
                <div className="dialogue-box">
                    <h2 className="speaker-name">Bà Tiên Duyên ✨</h2>
                    <div className="dialogue-content">
                        {!showChoices ? (
                            <Typewriter text={text} onComplete={() => setShowChoices(true)} />
                        ) : (
                            <div className="choices-container fade-in">
                                <button
                                    className="choice-btn"
                                    onClick={() => handleGenderChoice('male')}
                                >
                                    <span className="choice-title">👨 Nam giới</span>
                                    <span className="choice-desc">Ít áp lực sinh con, dễ thăng tiến nhưng phải gánh vác gia đình</span>
                                </button>

                                <button
                                    className="choice-btn"
                                    onClick={() => handleGenderChoice('female')}
                                >
                                    <span className="choice-title">👩 Nữ giới</span>
                                    <span className="choice-desc">Áp lực sinh con và chăm sóc gia đình, khó thăng tiến hơn</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </SceneBackground>
        );
    }

    // Step 2: Nhập tên
    if (step === 2) {
        const text = `Tuyệt vời! Giờ đây... Ngươi muốn có tên gì?`;

        return (
            <>
                <SceneBackground sceneKey="dream">
                    <StatsPanel />
                    <div className="character-container">
                        <img
                            src="/src/assets/characters/bà_tiên_khôn_ngoang.png"
                            alt="Bà Tiên Duyên"
                            className="character-sprite left"
                        />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Bà Tiên Duyên ✨</h2>
                        <div className="dialogue-content">
                            {!showChoices ? (
                                <Typewriter text={text} onComplete={() => setShowChoices(true)} />
                            ) : (
                                <div className="input-container fade-in">
                                    <input
                                        type="text"
                                        className={`name-input ${nameError ? 'error' : ''} ${!nameError && playerData.name.trim() ? 'valid' : ''}`}
                                        placeholder="Nhập tên của bạn... (Enter để tiếp tục)"
                                        value={playerData.name}
                                        onChange={handleNameChange}
                                        onBlur={handleNameBlur}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                handleNameSubmit();
                                            }
                                        }}
                                        autoFocus
                                        maxLength={20}
                                    />
                                    {nameError && (
                                        <div className="name-error-message">
                                            <span className="error-icon">⚠️</span>
                                            {nameError}
                                        </div>
                                    )}
                                    {!nameError && playerData.name.trim() && (
                                        <div className="name-hint">
                                            <span className="hint-icon">✓</span>
                                            Tên hợp lệ! Nhấn Enter để tiếp tục
                                        </div>
                                    )}
                                </div>
                            )}
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

    // Step 3: Sinh ra - Cốt truyện theo xuất thân
    if (step === 3) {
        const { origin } = playerData;
        let sceneKey, text;

        // RICH ORIGIN
        if (origin === 'rich') {
            sceneKey = 'prologue_birth_rich';
            text = `🏥 Bệnh viện tư cao cấp - Phòng VIP

Tiếng khóc em bé vang lên...

👶 "Oa oa oa..."`;
        }
        // NORMAL ORIGIN
        else if (origin === 'normal') {
            sceneKey = 'prologue_birth_normal';
            text = `🏥 Bệnh viện công - Phòng thường

Tiếng khóc em bé vang lên...

👶 "Oa oa oa..."`;
        }
        // POOR ORIGIN
        else {
            sceneKey = 'prologue_birth_poor';
            text = `🏚️ Nhà tranh - Quê nghèo

Tiếng khóc em bé vang lên...

👶 "Oa oa oa..."`;
        }

        return (
            <SceneBackground sceneKey={sceneKey}>
                <StatsPanel />
                <div className="dialogue-box">
                    <h2 className="speaker-name">Narrator</h2>
                    <div className="dialogue-content">
                        <Typewriter text={text} onComplete={() => setStep(3.1)} />
                    </div>
                </div>
            </SceneBackground>
        );
    }

    // Step 3.1: Phản ứng của bố mẹ theo xuất thân
    if (step === 3.1) {
        const { origin } = playerData;
        let characterImg, speakerName, text;
        let sceneKey; // Xác định sceneKey để giữ background

        if (origin === 'rich') {
            sceneKey = 'prologue_birth_rich';
            characterImg = "/src/assets/characters/bố_vui_vẻ.png";
            speakerName = "Bố (Doanh nhân)";
            text = `Con trai/gái của tôi! Tuyệt vời!

Con sẽ kế thừa công ty của bố! Bố sẽ cho con học trường tốt nhất!

Con phải thành công hơn bố! Đừng làm bố thất vọng!`;
        } else if (origin === 'normal') {
            sceneKey = 'prologue_birth_normal';
            characterImg = "/src/assets/characters/mẹ_vui_vẻ.png";
            speakerName = "Mẹ (Giáo viên)";
            text = `Con yêu của mẹ! 😊

Mẹ sẽ nuôi con khỏe mạnh, vui vẻ!

Con muốn làm gì thì làm, mẹ sẽ ủng hộ con!`;
        } else {
            sceneKey = 'prologue_birth_poor';
            characterImg = "/src/assets/characters/mẹ_lo_lắng.png";
            speakerName = "Mẹ (Nông dân)";
            text = `Con ơi... Mẹ xin lỗi con... 😢

Nhà mình nghèo, mẹ không biết nuôi con thế nào...

Nhưng mẹ sẽ cố gắng hết sức! Con phải học hành chăm chỉ để thoát nghèo nhé!`;
        }

        return (
            <SceneBackground sceneKey={sceneKey}>
                <StatsPanel />
                <div className="character-container">
                    <img src={characterImg} alt={speakerName} className="character-sprite left" />
                </div>
                <div className="dialogue-box">
                    <h2 className="speaker-name">{speakerName}</h2>
                    <div className="dialogue-content">
                        <Typewriter text={text} onComplete={() => setStep(3.2)} />
                    </div>
                </div>
            </SceneBackground>
        );
    }

    // Step 3.2: Thời thơ ấu theo xuất thân
    if (step === 3.2) {
        const { origin } = playerData;
        let sceneKey, text;

        if (origin === 'rich') {
            sceneKey = "prologue_childhood_rich";
            text = `📅 0-18 tuổi - Thời thơ ấu

Bạn lớn lên trong gia đình giàu có...

🏫 Học trường quốc tế, học thêm nhiều môn
🎹 Piano, violin, tiếng Anh, toán nâng cao...
🚗 Bố đưa đón bằng xe sang
💰 Tiền tiêu vặt 5 triệu/tháng

Nhưng... Bố mẹ luôn áp lực bạn phải học giỏi, phải thành công...
Bạn ít có bạn bè thật lòng... Nhiều người chỉ thân với bạn vì tiền...`;
        } else if (origin === 'normal') {
            sceneKey = "prologue_childhood_normal";
            text = `📅 0-18 tuổi - Thời thơ ấu

Bạn lớn lên trong gia đình bình thường...

🏫 Học trường công lập, cuộc sống giản đơn
⚽ Chơi đá bóng với bạn bè sau giờ học
🚲 Đi học bằng xe đạp
💰 Tiền tiêu vặt 200k/tháng

Bố mẹ không áp lực bạn... Bạn có nhiều bạn bè thân thiết...
Cuộc sống tuy không giàu có nhưng rất hạnh phúc!`;
        } else {
            sceneKey = "prologue_childhood_poor";
            text = `📅 0-18 tuổi - Thời thơ ấu

Bạn lớn lên trong gia đình nghèo...

🏫 Học trường công lập, sách vở cũ kỹ
🌾 Phải giúp bố mẹ làm ruộng sau giờ học
🚶 Đi bộ 5km đến trường mỗi ngày
💰 Không có tiền tiêu vặt

Bạn bị bạn bè chê nghèo... Nhưng bạn học rất chăm chỉ!
Bạn quyết tâm phải thoát nghèo! Ý chí của bạn rất mạnh mẽ!`;
        }

        return (
            <SceneBackground sceneKey={sceneKey}>
                <StatsPanel />
                <div className="dialogue-box">
                    <h2 className="speaker-name">Narrator</h2>
                    <div className="dialogue-content">
                        <Typewriter text={text} onComplete={() => setStep(4)} />
                    </div>
                </div>
            </SceneBackground>
        );
    }

    // Step 4: Kết thúc prologue
    if (step === 4) {
        const text = `Tốt lắm! Tên ngươi là ${playerData.name}!

Giờ đây, hãy bắt đầu cuộc hành trình...

Từ 18 tuổi đến 60 tuổi, ngươi sẽ trải qua:
• Tuổi trẻ (18-25): Tìm kiếm con đường
• Lập gia đình (25-35): Tìm người đồng hành
• Nuôi con (35-45): Trách nhiệm làm cha mẹ
• Trung niên (45-55): Khủng hoảng tuổi trung niên
• Tuổi già (55-60): Hưởng thụ cuộc sống

Mỗi giai đoạn đều có thử thách riêng... Hãy chọn khôn ngoan!`;

        return (
            <SceneBackground sceneKey="dream">
                <StatsPanel />
                <div className="character-container">
                    <img
                        src="/src/assets/characters/bà_tiên_vui_vẻ.png"
                        alt="Bà Tiên Duyên"
                        className="character-sprite left"
                    />
                </div>
                <div className="dialogue-box">
                    <h2 className="speaker-name">Bà Tiên Duyên ✨</h2>
                    <div className="dialogue-content">
                        <Typewriter text={text} onComplete={handleComplete} />
                    </div>
                </div>
            </SceneBackground>
        );
    }
}
