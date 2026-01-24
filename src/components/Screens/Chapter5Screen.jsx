import { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import StatsPanel from '../UI/StatsPanel';
import StatChangeNotification from '../UI/StatChangeNotification';
import SceneBackground from '../Common/SceneBackground';
import Typewriter from '../Common/Typewriter';
import { useTypewriter } from '../../hooks/useTypewriter';
import StudyGroupGame from '../MiniGames/StudyGroupGame';
import MemoryLaneGame from '../MiniGames/MemoryLaneGame';
import './PrologueScreen.css';

export default function Chapter5Screen() {
    const { state, updateStats, setScreen, addChoice, setFlag } = useGame();
    const [showStatChange, setShowStatChange] = useState(false);
    const [statChanges, setStatChanges] = useState({});

    const [scenario, setScenarioState] = useState(state.flags.chapter5_scenario || 'transition');
    const [step, setStepState] = useState(state.flags.chapter5_step || 0);

    const [isTyping, handleTypingComplete] = useTypewriter(step);

    const setScenario = (newScenario) => {
        setScenarioState(newScenario);
        setFlag('chapter5_scenario', newScenario);
    };

    const setStep = (newStep) => {
        setStepState(newStep);
        setFlag('chapter5_step', newStep);
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

    const getPlayerSprite = (emotion = 'nghiêm_túc') => {
        const gender = state.player.gender === 'male' ? 'con_trai' : 'con_gái';
        return `/src/assets/characters/${gender}_${emotion}.png`;
    };

    const partner = state.flags.partner || 'hung';
    const partnerName = partner === 'minh' ? 'Minh' : partner === 'trang' ? 'Trang' : 'Hùng';

    // SCENARIO: Transition - Tóm tắt từ Chapter 4
    if (scenario === 'transition') {
        if (step === 0) {
            const text = `⏳ 15 năm cuối cùng của hành trình...

🎓 Con bạn đã trưởng thành, có công việc và cuộc sống riêng.

👴 Còn bạn, 60 tuổi, đã đến lúc nghỉ ngơi...`;

            return (
                <SceneBackground sceneKey="chapter5_retirement">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            {isTyping ? (
                                <Typewriter text={text} onComplete={handleTypingComplete} />
                            ) : (
                                <button className="continue-btn fade-in" onClick={() => setStep(1)}>Tiếp tục →</button>
                            )}
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 1) {
            const text = `💭 Nhìn lại chặng đường đã qua...

Những quyết định, những lựa chọn, những con đường đã đi...

Liệu bạn có hài lòng với cuộc sống của mình?`;

            return (
                <SceneBackground sceneKey="chapter5_retirement">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            {isTyping ? (
                                <Typewriter text={text} onComplete={handleTypingComplete} />
                            ) : (
                                <button className="continue-btn fade-in" onClick={() => setStep(2)}>Tiếp tục →</button>
                            )}
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 2) {
            const text = `🌙 Đêm nay, lần cuối cùng, Bà Tiên Duyên xuất hiện trong giấc mơ...

Bà mỉm cười, ánh mắt đầy tự hào và thương yêu...`;

            return (
                <SceneBackground sceneKey="dream">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            {isTyping ? (
                                <Typewriter text={text} onComplete={handleTypingComplete} />
                            ) : (
                                <button className="continue-btn fade-in" onClick={() => setStep(3)}>Tiếp tục →</button>
                            )}
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 3) {
            const text = `${state.player.name} ơi...

Con đã đi hết hành trình của mình rồi!

Bà rất tự hào về con, dù con chọn con đường nào...

Vì con đã sống hết mình, đã yêu thương hết lòng!`;

            return (
                <SceneBackground sceneKey="dream">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/bà_tiên_duyên_vui_vẻ.png" alt="Bà Tiên Duyên" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Bà Tiên Duyên</h2>
                        <div className="dialogue-content">
                            {isTyping ? (
                                <Typewriter text={text} onComplete={handleTypingComplete} />
                            ) : (
                                <button className="continue-btn fade-in" onClick={() => setStep(4)}>Tiếp tục →</button>
                            )}
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 4) {
            const text = `Cuộc đời là một chuỗi các lựa chọn...

Không có lựa chọn nào đúng hay sai tuyệt đối...

Chỉ có những lựa chọn phù hợp với con người mình!

Hãy nhìn lại và trân trọng những gì con đã có nhé!`;

            return (
                <SceneBackground sceneKey="dream">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/bà_tiên_duyên_hạnh_phúc.png" alt="Bà Tiên Duyên" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Bà Tiên Duyên</h2>
                        <div className="dialogue-content">
                            {isTyping ? (
                                <Typewriter text={text} onComplete={handleTypingComplete} />
                            ) : (
                                <button className="continue-btn fade-in" onClick={() => setStep(5)}>Tiếp tục →</button>
                            )}
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 5) {
            const text = `💤 Bạn tỉnh dậy với nụ cười trên môi...

Hôm nay là ngày cuối cùng đi làm - ngày nghỉ hưu chính thức.

Một chương mới của cuộc đời sắp bắt đầu...`;

            return (
                <SceneBackground sceneKey="chapter5_retirement">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            {isTyping ? (
                                <Typewriter text={text} onComplete={handleTypingComplete} />
                            ) : (
                                <button className="continue-btn fade-in" onClick={() => {
                                    setScenario('retirement');
                                    setStep(0);
                                }}>Bắt đầu Chapter 5 →</button>
                            )}
                        </div>
                    </div>
                </SceneBackground>
            );
        }
    }

    // SCENARIO: Nghỉ hưu
    if (scenario === 'retirement') {
        if (step === 0) {
            return (
                <SceneBackground sceneKey="chapter5_retirement">
                    <StatsPanel />
                    <div className="dialogue-box fade-in">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter
                                text={`📅 60 tuổi - Nghỉ hưu

Sau 35 năm làm việc...

Bạn đã đến tuổi nghỉ hưu...`}
                                onComplete={handleTypingComplete}
                            />
                            {!isTyping && (
                                <button className="continue-btn fade-in" onClick={() => setStep(1)}>Tiếp tục →</button>
                            )}
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 1) {
            return (
                <SceneBackground sceneKey="chapter5_retirement">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/sếp_vui_vẻ.png" alt="Sếp" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box fade-in">
                        <h2 className="speaker-name">Sếp</h2>
                        <div className="dialogue-content">
                            <Typewriter
                                text={`Anh/Chị ${state.player.name}!

Cảm ơn anh/chị đã cống hiến 35 năm cho công ty!

Chúc anh/chị nghỉ hưu vui vẻ, sức khỏe dồi dào!`}
                                onComplete={handleTypingComplete}
                            />
                            {!isTyping && (
                                <button className="continue-btn fade-in" onClick={() => setStep(2)}>Tiếp tục →</button>
                            )}
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 2) {
            return (
                <SceneBackground sceneKey="chapter5_retirement">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={getPlayerSprite('buồn')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box fade-in">
                        <h2 className="speaker-name">{state.player.name}</h2>
                        <div className="dialogue-content">
                            <Typewriter
                                text={`(Suy nghĩ)

35 năm qua nhanh quá...

Giờ mình nghỉ hưu rồi... Mình sẽ làm gì đây?`}
                                onComplete={handleTypingComplete}
                            />
                            {!isTyping && (
                                <button className="continue-btn fade-in" onClick={() => {
                                    updateStats({ happiness: -20, economy: 30 });
                                    setScenario('life_reflection');
                                    setStep(0);
                                }}>Tiếp tục →</button>
                            )}
                        </div>
                    </div>
                </SceneBackground>
            );
        }
    }

    // SCENARIO: Nhìn lại cuộc đời
    if (scenario === 'life_reflection') {
        if (step === 0) {
            return (
                <SceneBackground sceneKey="chapter5_reflection">
                    <StatsPanel />
                    <div className="dialogue-box fade-in">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter
                                text={`📅 Một buổi tối yên tĩnh...

Bạn ngồi nhìn lại cuộc đời mình...`}
                                onComplete={handleTypingComplete}
                            />
                            {!isTyping && (
                                <button className="continue-btn fade-in" onClick={() => setStep(1)}>Tiếp tục →</button>
                            )}
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 1) {
            const origin = state.player.origin;

            // RICH ORIGIN - Nhìn lại với hối hận
            if (origin === 'rich') {
                return (
                    <SceneBackground sceneKey="chapter5_reflection">
                        <StatsPanel />
                        <div className="character-container">
                            <img src={getPlayerSprite('buồn')} alt={state.player.name} className="character-sprite right" />
                        </div>
                        <div className="dialogue-box fade-in">
                            <h2 className="speaker-name">{state.player.name}</h2>
                            <div className="dialogue-content">
                                <Typewriter
                                    text={`(Suy nghĩ)

60 năm qua... Mình sinh ra trong gia đình giàu có...

Mình có tất cả... Nhưng mình có hạnh phúc không?

Bố mẹ luôn áp lực mình... Con mình cũng xa cách mình...

Tiền bạc... Có thể mua được hạnh phúc không? 😢`}
                                    onComplete={handleTypingComplete}
                                />
                                {!isTyping && (
                                    <button className="continue-btn fade-in" onClick={() => setStep(2)}>Tiếp tục →</button>
                                )}
                            </div>
                        </div>
                    </SceneBackground>
                );
            }

            // NORMAL ORIGIN - Nhìn lại với bình yên
            if (origin === 'normal') {
                return (
                    <SceneBackground sceneKey="chapter5_reflection">
                        <StatsPanel />
                        <div className="character-container">
                            <img src={getPlayerSprite('vui_vẻ')} alt={state.player.name} className="character-sprite right" />
                        </div>
                        <div className="dialogue-box fade-in">
                            <h2 className="speaker-name">{state.player.name}</h2>
                            <div className="dialogue-content">
                                <Typewriter
                                    text={`(Suy nghĩ)

60 năm qua... Mình đã trải qua bao nhiêu điều...

Từ lúc sinh ra, đến trường, đại học, làm việc, lập gia đình, nuôi con...

Cuộc đời mình tuy không giàu có, nhưng rất hạnh phúc!

Mình không hối hận! 😊`}
                                    onComplete={handleTypingComplete}
                                />
                                {!isTyping && (
                                    <button className="continue-btn fade-in" onClick={() => setStep(2)}>Tiếp tục →</button>
                                )}
                            </div>
                        </div>
                    </SceneBackground>
                );
            }

            // POOR ORIGIN - Nhìn lại với tự hào
            if (origin === 'poor') {
                return (
                    <SceneBackground sceneKey="chapter5_reflection">
                        <StatsPanel />
                        <div className="character-container">
                            <img src={getPlayerSprite('vui_vẻ')} alt={state.player.name} className="character-sprite right" />
                        </div>
                        <div className="dialogue-box fade-in">
                            <h2 className="speaker-name">{state.player.name}</h2>
                            <div className="dialogue-content">
                                <Typewriter
                                    text={`(Suy nghĩ)

60 năm qua... Mình sinh ra trong gia đình nghèo...

Mình đã vượt qua bao nhiêu khó khăn...

Từ nghèo khó, mình đã tự lập, thành công!

Mình tự hào về bản thân! Mình đã làm được! 💪`}
                                    onComplete={handleTypingComplete}
                                />
                                {!isTyping && (
                                    <button className="continue-btn fade-in" onClick={() => setStep(2)}>Tiếp tục →</button>
                                )}
                            </div>
                        </div>
                    </SceneBackground>
                );
            }
        }

        if (step === 2) {
            return (
                <SceneBackground sceneKey="chapter5_reflection">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={`/src/assets/characters/${partner}_nghiêm_túc.png`} alt={partnerName} className="character-sprite left" />
                    </div>
                    <div className="dialogue-box fade-in">
                        <h2 className="speaker-name">{partnerName}</h2>
                        <div className="dialogue-content">
                            <Typewriter
                                text={`Anh/Em ơi... Em/Anh đang nghĩ gì vậy?

Anh/Em trông buồn quá...`}
                                onComplete={handleTypingComplete}
                            />
                            {!isTyping && (
                                <button className="continue-btn fade-in" onClick={() => setStep(3)}>Tiếp tục →</button>
                            )}
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 3) {
            return (
                <SceneBackground sceneKey="chapter5_reflection">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={getPlayerSprite('vui_vẻ')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box fade-in">
                        <h2 className="speaker-name">{state.player.name}</h2>
                        <div className="dialogue-content">
                            <Typewriter
                                text={`Không... Anh/Em chỉ đang nhìn lại cuộc đời mình...
                                
Mình đã trải qua bao nhiêu điều... Có vui, có buồn...
                                
Nhưng mình không hối hận... Mình đã cố gắng hết sức...`}
                                onComplete={handleTypingComplete}
                            />
                            {!isTyping && (
                                <button className="continue-btn fade-in" onClick={() => setScenario('memory_lane_game')}>
                                    Nhìn lại ký ức (Mini-game)
                                </button>
                            )}
                        </div>
                    </div>
                </SceneBackground>
            );
        }
    }

    // SCENARIO: Mini-game Ký ức
    if (scenario === 'memory_lane_game') {
        const handleGameComplete = (result) => {
            if (result.bonusStats) {
                updateStats(result.bonusStats);
            }
            // Continue to family gathering
            setScenario('family_gathering');
            setStep(0);
        };

        return (
            <SceneBackground sceneKey="dream">
                <MemoryLaneGame onComplete={handleGameComplete} />
            </SceneBackground>
        );
    }

    // SCENARIO: Họp mặt gia đình
    if (scenario === 'family_gathering') {
        if (step === 0) {
            return (
                <SceneBackground sceneKey="chapter5_family_gathering">
                    <StatsPanel />
                    <div className="dialogue-box fade-in">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter
                                text={`📅 Cuối tuần - Họp mặt gia đình

Con cháu về thăm...`}
                                onComplete={handleTypingComplete}
                            />
                            {!isTyping && (
                                <button className="continue-btn fade-in" onClick={() => setStep(1)}>Tiếp tục →</button>
                            )}
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 1) {
            return (
                <SceneBackground sceneKey="chapter5_family_gathering">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/con_vui_vẻ.png" alt="Con" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box fade-in">
                        <h2 className="speaker-name">Con (30 tuổi)</h2>
                        <div className="dialogue-content">
                            <Typewriter
                                text={`Bố/Mẹ ơi! Con về thăm!

Bố/Mẹ khỏe không?`}
                                onComplete={handleTypingComplete}
                            />
                            {!isTyping && (
                                <button className="continue-btn fade-in" onClick={() => setStep(2)}>Tiếp tục →</button>
                            )}
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 2) {
            return (
                <SceneBackground sceneKey="chapter5_family_gathering">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={getPlayerSprite('vui_vẻ')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box fade-in">
                        <h2 className="speaker-name">{state.player.name}</h2>
                        <div className="dialogue-content">
                            <Typewriter
                                text={`Bố/Mẹ khỏe! Con về thăm bố/mẹ vui quá!

Con làm việc thế nào?`}
                                onComplete={handleTypingComplete}
                            />
                            {!isTyping && (
                                <button className="continue-btn fade-in" onClick={() => setStep(3)}>Tiếp tục →</button>
                            )}
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 3) {
            return (
                <SceneBackground sceneKey="chapter5_family_gathering">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/con_vui_vẻ.png" alt="Con" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box fade-in">
                        <h2 className="speaker-name">Con</h2>
                        <div className="dialogue-content">
                            <Typewriter
                                text={`Con làm tốt lắm! Công ty vừa thăng chức con!

Nhờ bố/mẹ dạy con từ nhỏ, con mới thành công được!

Con cảm ơn bố/mẹ!`}
                                onComplete={handleTypingComplete}
                            />
                            {!isTyping && (
                                <button className="continue-btn fade-in" onClick={() => {
                                    updateStats({ happiness: 50, social: 30 });
                                    setScenario('ending');
                                    setStep(0);
                                }}>Tiếp tục →</button>
                            )}
                        </div>
                    </div>
                </SceneBackground>
            );
        }
    }

    // SCENARIO: Kết thúc game - PLOT TWIST REVEAL
    if (scenario === 'ending') {
        // Step 0: Dọn phòng cũ
        if (step === 0) {
            return (
                <SceneBackground sceneKey="chapter5_family_gathering">
                    <StatsPanel />
                    <div className="dialogue-box fade-in">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter
                                text={`📦 Một buổi chiều yên tĩnh...

Bạn quyết định dọn dẹp căn phòng cũ của mẹ, nơi còn lưu giữ nhiều kỷ vật...

Trong đống đồ cũ, bạn tìm thấy một chiếc hộp gỗ đã ngả màu thời gian...`}
                                onComplete={handleTypingComplete}
                            />
                            {!isTyping && (
                                <button className="continue-btn fade-in" onClick={() => setStep(1)}>Mở chiếc hộp →</button>
                            )}
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        // Step 1: Tìm thấy bức thư
        if (step === 1) {
            return (
                <SceneBackground sceneKey="chapter5_family_gathering">
                    <StatsPanel />
                    <div className="dialogue-box fade-in">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter
                                text={`📜 Bên trong hộp là một bức thư cũ...

Chữ viết tay của mẹ, đã ố vàng theo năm tháng...

Trên phong bì ghi: "Gửi con yêu của mẹ - ${state.player.name}"

"Chỉ mở khi con 60 tuổi"`}
                                onComplete={handleTypingComplete}
                            />
                            {!isTyping && (
                                <button className="continue-btn fade-in" onClick={() => setStep(2)}>Đọc thư →</button>
                            )}
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        // Step 2: Đọc thư - Phần 1
        if (step === 2) {
            return (
                <SceneBackground sceneKey="chapter5_family_gathering">
                    <StatsPanel />
                    <div className="dialogue-box fade-in">
                        <h2 className="speaker-name">Thư của Mẹ ✉️</h2>
                        <div className="dialogue-content">
                            <Typewriter
                                text={`"Con yêu của mẹ,

Khi con đọc bức thư này, có lẽ mẹ đã không còn ở bên con nữa...

Mẹ có một bí mật đã giấu con suốt nhiều năm...

Về một giấc mơ kỳ lạ mà mẹ đã gặp vào đêm con ra đời..."`}
                                onComplete={handleTypingComplete}
                            />
                            {!isTyping && (
                                <button className="continue-btn fade-in" onClick={() => setStep(3)}>Tiếp tục đọc →</button>
                            )}
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        // Step 3: Đọc thư - Phần 2 (REVEAL)
        if (step === 3) {
            return (
                <SceneBackground sceneKey="chapter5_family_gathering">
                    <StatsPanel />
                    <div className="dialogue-box fade-in">
                        <h2 className="speaker-name">Thư của Mẹ ✉️</h2>
                        <div className="dialogue-content">
                            <Typewriter
                                text={`"Đêm đó, mẹ mơ thấy một người phụ nữ lớn tuổi xuất hiện...

Bà ấy tự xưng là 'Tiên Duyên'...

Nhưng điều kỳ lạ nhất...

Bà ấy có nốt ruồi bên má trái, GIỐNG HỆT con...

Và bà ấy biết TÊN con trước khi mẹ đặt tên..."`}
                                onComplete={handleTypingComplete}
                            />
                            {!isTyping && (
                                <button className="continue-btn fade-in" onClick={() => setStep(4)}>Tiếp tục đọc →</button>
                            )}
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        // Step 4: Đọc thư - Phần 3 (Chi tiết REVEAL)
        if (step === 4) {
            return (
                <SceneBackground sceneKey="chapter5_family_gathering">
                    <StatsPanel />
                    <div className="dialogue-box fade-in">
                        <h2 className="speaker-name">Thư của Mẹ ✉️</h2>
                        <div className="dialogue-content">
                            <Typewriter
                                text={`"Bà ấy nói với mẹ:

'Con gái của bà sẽ trải qua nhiều thử thách...

Tốt nghiệp, yêu đương, kết hôn, sinh con, sự nghiệp...

Nhưng đừng lo, ta sẽ luôn dẫn dắt nó trong những giấc mơ...'

Mẹ không hiểu lúc đó... Nhưng bây giờ con có hiểu không?"`}
                                onComplete={handleTypingComplete}
                            />
                            {!isTyping && (
                                <button className="continue-btn fade-in" onClick={() => setStep(5)}>Tiếp tục đọc →</button>
                            )}
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        // Step 5: Thư kết thúc + Choáng váng
        if (step === 5) {
            return (
                <SceneBackground sceneKey="chapter5_family_gathering">
                    <StatsPanel />
                    <div className="dialogue-box fade-in">
                        <h2 className="speaker-name">Thư của Mẹ ✉️</h2>
                        <div className="dialogue-content">
                            <Typewriter
                                text={`"Mẹ tin rằng... Bà Tiên Duyên chính là CON từ tương lai.

Con đã quay về quá khứ để hướng dẫn chính mình...

Và bây giờ, đến lượt con...

Yêu con nhiều lắm,
Mẹ ❤️"

...

Bức thư rơi khỏi tay bạn.`}
                                onComplete={handleTypingComplete}
                            />
                            {!isTyping && (
                                <button className="continue-btn fade-in" onClick={() => setStep(6)}>...</button>
                            )}
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        // Step 6: Nhận ra sự thật
        if (step === 6) {
            return (
                <SceneBackground sceneKey="chapter5_family_gathering">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={getPlayerSprite('sốc')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box fade-in">
                        <h2 className="speaker-name">{state.player.name}</h2>
                        <div className="dialogue-content">
                            <Typewriter
                                text={`Không... Không thể nào...

Tất cả những giấc mơ đó... Bà Tiên Duyên...

Nốt ruồi bên má... Cách bà ấy biết mọi thứ về mình...

"Lúc ta còn trẻ, ta cũng từng..."

CHÍNH LÀ MÌNH?!`}
                                onComplete={handleTypingComplete}
                            />
                            {!isTyping && (
                                <button className="continue-btn fade-in" onClick={() => setStep(7)}>Tiếp tục →</button>
                            )}
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        // Step 7: Flashback - Tổng hợp các Easter eggs
        if (step === 7) {
            return (
                <SceneBackground sceneKey="chapter5_family_gathering">
                    <StatsPanel />
                    <div className="dialogue-box fade-in">
                        <h2 className="speaker-name">💭 Hồi ức...</h2>
                        <div className="dialogue-content">
                            <Typewriter
                                text={`Mọi thứ bắt đầu có ý nghĩa...

🔹 Bà Tiên luôn xuất hiện đúng lúc mình cần...

🔹 Bà ấy biết mọi quyết định mình sẽ đối mặt...

🔹 "Lúc ta còn trẻ, ta cũng từng đau khổ như con..."

🔹 Nốt ruồi bên má trái - GIỐNG HỆT mình...

🔹 Cách bà ấy nhìn mình - như nhìn vào quá khứ của chính mình...`}
                                onComplete={handleTypingComplete}
                            />
                            {!isTyping && (
                                <button className="continue-btn fade-in" onClick={() => setStep(8)}>Tiếp tục →</button>
                            )}
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        // Step 8: Bà Tiên xuất hiện xác nhận
        if (step === 8) {
            return (
                <SceneBackground sceneKey="dream">
                    <StatsPanel />
                    <div className="dialogue-box fade-in">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter
                                text={`🌟 Đột nhiên, căn phòng tràn ngập ánh sáng...

Không phải giấc mơ... Mà là thật...

Bà Tiên Duyên xuất hiện, lần cuối cùng...

Nhưng lần này... Bà ấy trông khác...`}
                                onComplete={handleTypingComplete}
                            />
                            {!isTyping && (
                                <button className="continue-btn fade-in" onClick={() => setStep(9)}>Tiếp tục →</button>
                            )}
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        // Step 9: Bà Tiên xác nhận sự thật
        if (step === 9) {
            return (
                <SceneBackground sceneKey="dream">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/bà_tiên_duyên_vui_vẻ.png" alt="Bà Tiên Duyên" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box fade-in">
                        <h2 className="speaker-name">Bà Tiên Duyên ✨</h2>
                        <div className="dialogue-content">
                            <Typewriter
                                text={`${state.player.name}...

Đúng vậy. Ta chính là CON.

Ta là ${state.player.name} từ 20 năm sau, đã quay về quá khứ để hướng dẫn chính mình...

Để tránh những sai lầm... Để sống một cuộc đời không hối tiếc...`}
                                onComplete={handleTypingComplete}
                            />
                            {!isTyping && (
                                <button className="continue-btn fade-in" onClick={() => setStep(10)}>Tiếp tục →</button>
                            )}
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        // Step 10: Giải thích vòng lặp
        if (step === 10) {
            return (
                <SceneBackground sceneKey="dream">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/bà_tiên_duyên_nghiêm_túc.png" alt="Bà Tiên Duyên" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box fade-in">
                        <h2 className="speaker-name">Bà Tiên Duyên (Tương lai của bạn)</h2>
                        <div className="dialogue-content">
                            <Typewriter
                                text={`Đây là một vòng lặp thời gian...

Ở tuổi 80, ta học được cách quay về quá khứ thông qua giấc mơ...

Ta đã dẫn dắt con suốt cuộc đời...

Và bây giờ... ĐẾN LƯỢT CON.

Con phải trở thành "Bà Tiên Duyên" cho chính mình lúc còn trẻ...`}
                                onComplete={handleTypingComplete}
                            />
                            {!isTyping && (
                                <button className="continue-btn fade-in" onClick={() => setStep(11)}>Tiếp tục →</button>
                            )}
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        // Step 11: LỰA CHỌN CUỐI CÙNG
        if (step === 11) {
            return (
                <SceneBackground sceneKey="dream">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/bà_tiên_duyên_lo_lắng.png" alt="Bà Tiên Duyên" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box fade-in">
                        <h2 className="speaker-name">Bà Tiên Duyên (Tương lai của bạn)</h2>
                        <div className="dialogue-content">
                            <Typewriter
                                text={`Nhưng con có quyền lựa chọn...

Con có thể TIẾP NỐI VÒNG LẶP - trở thành Bà Tiên Duyên và hướng dẫn bản thân trẻ tuổi...

Hoặc con có thể PHÁ VỠ VÒNG LẶP - sống tự do, để bản thân trẻ tuổi tự tìm đường đi...

Con sẽ chọn gì?`}
                                onComplete={handleTypingComplete}
                            />
                            {!isTyping && (
                                <div className="choice-buttons">
                                    <button className="choice-btn fade-in" onClick={() => {
                                        setFlag('final_choice', 'continue_loop');
                                        setStep(12);
                                    }}>🔄 Tiếp nối vòng lặp - Trở thành Bà Tiên Duyên</button>
                                    <button className="choice-btn fade-in" onClick={() => {
                                        setFlag('final_choice', 'break_loop');
                                        setStep(15);
                                    }}>💫 Phá vỡ vòng lặp - Sống tự do</button>
                                </div>
                            )}
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        // === ENDING A: TIẾP NỐI VÒNG LẶP ===
        if (step === 12) {
            return (
                <SceneBackground sceneKey="dream">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={getPlayerSprite('nghiêm_túc')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box fade-in">
                        <h2 className="speaker-name">{state.player.name}</h2>
                        <div className="dialogue-content">
                            <Typewriter
                                text={`Mình hiểu rồi...

Những năm tháng Bà Tiên dẫn dắt mình... Chính là mình dẫn dắt mình...

Mình sẽ tiếp nối. Mình sẽ trở thành Bà Tiên Duyên.

Để bản thân trẻ tuổi không phải đau khổ một mình...

Để mình có được cuộc sống hôm nay...`}
                                onComplete={handleTypingComplete}
                            />
                            {!isTyping && (
                                <button className="continue-btn fade-in" onClick={() => setStep(13)}>Tiếp tục →</button>
                            )}
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 13) {
            return (
                <SceneBackground sceneKey="dream">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/bà_tiên_duyên_vui_vẻ.png" alt="Bà Tiên Duyên" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box fade-in">
                        <h2 className="speaker-name">Bà Tiên Duyên ✨</h2>
                        <div className="dialogue-content">
                            <Typewriter
                                text={`Ta tự hào về con...

Con đã hiểu được ý nghĩa của sự hy sinh và yêu thương...

Từ giờ, con sẽ là "Bà Tiên Duyên" cho chính mình...

Hãy nhớ: Mọi lựa chọn của con sẽ định hình cuộc đời...

Vòng lặp sẽ tiếp tục... Mãi mãi...`}
                                onComplete={handleTypingComplete}
                            />
                            {!isTyping && (
                                <button className="continue-btn fade-in" onClick={() => setStep(14)}>Tiếp tục →</button>
                            )}
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        // TRUE ENDING
        if (step === 14) {
            return (
                <SceneBackground sceneKey="dream">
                    <StatsPanel />
                    <div className="dialogue-box fade-in" style={{ backgroundColor: 'rgba(255, 215, 0, 0.2)', borderColor: 'gold' }}>
                        <h2 className="speaker-name">🌟 TRUE ENDING: VÒNG LẶP VĨNH CỬU 🌟</h2>
                        <div className="dialogue-content">
                            <Typewriter
                                text={`✨ 20 năm sau...

Bạn đã 80 tuổi. Ngồi bên cửa sổ, nhắm mắt lại...

Và lần đầu tiên, bạn xuất hiện trong giấc mơ của chính mình lúc 18 tuổi...

"Con ơi... Ta là Bà Tiên Duyên... Ta đến để hướng dẫn con..."

Vòng lặp đã hoàn thành. Vòng lặp tiếp tục. Mãi mãi.

💫 CẢM ƠN BẠN ĐÃ CHƠI GAME "TẾ BÀO XÃ HỘI" 💫`}
                                onComplete={handleTypingComplete}
                            />
                            {!isTyping && (
                                <button className="continue-btn fade-in" onClick={() => {
                                    alert('🌟 TRUE ENDING: VÒNG LẶP VĨNH CỬU 🌟\n\n' +
                                        'Bạn đã khám phá bí mật lớn nhất của game!\n\n' +
                                        'Bà Tiên Duyên chính là BẠN từ tương lai.\n' +
                                        'Bạn đã chọn tiếp nối vòng lặp thời gian,\n' +
                                        'để hướng dẫn bản thân trẻ tuổi...\n\n' +
                                        `Stats cuối cùng:\n` +
                                        `Sức khỏe: ${state.player.stats.health}\n` +
                                        `Hạnh phúc: ${state.player.stats.happiness}\n` +
                                        `Kinh tế: ${state.player.stats.economy}\n` +
                                        `Xã hội: ${state.player.stats.social}\n` +
                                        `Kiến thức: ${state.player.stats.knowledge}`);
                                    setScreen('start');
                                }}>🌟 Kết thúc game 🌟</button>
                            )}
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        // === ENDING B: PHÁ VỠ VÒNG LẶP ===
        if (step === 15) {
            return (
                <SceneBackground sceneKey="dream">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={getPlayerSprite('nghiêm_túc')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box fade-in">
                        <h2 className="speaker-name">{state.player.name}</h2>
                        <div className="dialogue-content">
                            <Typewriter
                                text={`Không...

Mình không muốn sống trong một vòng lặp mãi mãi...

Mình muốn bản thân trẻ tuổi tự tìm đường đi...

Tự đưa ra quyết định... Dù đúng hay sai...

Đó mới là cuộc sống THẬT SỰ.`}
                                onComplete={handleTypingComplete}
                            />
                            {!isTyping && (
                                <button className="continue-btn fade-in" onClick={() => setStep(16)}>Tiếp tục →</button>
                            )}
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 16) {
            return (
                <SceneBackground sceneKey="dream">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/bà_tiên_duyên_buồn.png" alt="Bà Tiên Duyên" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box fade-in">
                        <h2 className="speaker-name">Bà Tiên Duyên ✨</h2>
                        <div className="dialogue-content">
                            <Typewriter
                                text={`Ta hiểu con...

Đây cũng là một lựa chọn dũng cảm...

Nhưng con có biết không? Nếu con phá vỡ vòng lặp...

Bản thân trẻ tuổi sẽ không có ai hướng dẫn...

Cuộc đời con... Có thể sẽ khác đi hoàn toàn...`}
                                onComplete={handleTypingComplete}
                            />
                            {!isTyping && (
                                <button className="continue-btn fade-in" onClick={() => setStep(17)}>Mình chấp nhận →</button>
                            )}
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 17) {
            return (
                <SceneBackground sceneKey="dream">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/bà_tiên_duyên_vui_vẻ.png" alt="Bà Tiên Duyên" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box fade-in">
                        <h2 className="speaker-name">Bà Tiên Duyên ✨</h2>
                        <div className="dialogue-content">
                            <Typewriter
                                text={`Vậy thì... Đây là lời tạm biệt cuối cùng...

Ta sẽ biến mất... Vòng lặp sẽ kết thúc...

Nhưng con sẽ được TỰ DO...

Cảm ơn con đã cho ta được tồn tại suốt bao năm qua...

Tạm biệt... ${state.player.name}...`}
                                onComplete={handleTypingComplete}
                            />
                            {!isTyping && (
                                <button className="continue-btn fade-in" onClick={() => setStep(18)}>Tạm biệt... →</button>
                            )}
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        // FREEDOM ENDING
        if (step === 18) {
            return (
                <SceneBackground sceneKey="chapter5_reflection">
                    <StatsPanel />
                    <div className="dialogue-box fade-in" style={{ backgroundColor: 'rgba(135, 206, 250, 0.2)', borderColor: 'skyblue' }}>
                        <h2 className="speaker-name">💫 FREEDOM ENDING: TỰ DO 💫</h2>
                        <div className="dialogue-content">
                            <Typewriter
                                text={`✨ Bà Tiên Duyên mờ dần... và biến mất mãi mãi...

Vòng lặp thời gian đã bị phá vỡ.

Ở một dòng thời gian khác, ${state.player.name} 18 tuổi thức dậy...
Không có Bà Tiên Duyên hướng dẫn... Nhưng hoàn toàn TỰ DO.

Mỗi quyết định sẽ hoàn toàn là của riêng em...
Cuộc đời sẽ là một cuộc phiêu lưu chưa ai từng viết sẵn...

💫 CẢM ƠN BẠN ĐÃ CHƠI GAME "TẾ BÀO XÃ HỘI" 💫`}
                                onComplete={handleTypingComplete}
                            />
                            {!isTyping && (
                                <button className="continue-btn fade-in" onClick={() => {
                                    alert('💫 FREEDOM ENDING: TỰ DO 💫\n\n' +
                                        'Bạn đã khám phá bí mật lớn nhất của game!\n\n' +
                                        'Bà Tiên Duyên chính là BẠN từ tương lai.\n' +
                                        'Nhưng bạn đã chọn phá vỡ vòng lặp thời gian,\n' +
                                        'để bản thân trẻ tuổi sống TỰ DO...\n\n' +
                                        `Stats cuối cùng:\n` +
                                        `Sức khỏe: ${state.player.stats.health}\n` +
                                        `Hạnh phúc: ${state.player.stats.happiness}\n` +
                                        `Kinh tế: ${state.player.stats.economy}\n` +
                                        `Xã hội: ${state.player.stats.social}\n` +
                                        `Kiến thức: ${state.player.stats.knowledge}`);
                                    setScreen('start');
                                }}>💫 Kết thúc game 💫</button>
                            )}
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
            <div className="dialogue-box fade-in">
                <h2 className="speaker-name">System</h2>
                <div className="dialogue-content">
                    <Typewriter
                        text="Chapter 5 đang được phát triển..."
                        onComplete={handleTypingComplete}
                    />
                    {!isTyping && (
                        <button className="continue-btn fade-in" onClick={() => setScreen('start')}>Về màn hình chính</button>
                    )}
                </div>
            </div>
        </SceneBackground>
    );
}
