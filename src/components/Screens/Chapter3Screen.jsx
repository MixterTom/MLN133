import { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import StatsPanel from '../UI/StatsPanel';
import StatChangeNotification from '../UI/StatChangeNotification';
import SceneBackground from '../Common/SceneBackground';
import Typewriter from '../Common/Typewriter';
import { useTypewriter } from '../../hooks/useTypewriter';
import StudyGroupGame from '../MiniGames/StudyGroupGame';
import ParentingGame from '../MiniGames/ParentingGame';
import WorkBalanceGame from '../MiniGames/WorkBalanceGame';
import './PrologueScreen.css';

export default function Chapter3Screen() {
    const { state, updateStats, setScreen, addChoice, setFlag } = useGame();
    const [showStatChange, setShowStatChange] = useState(false);
    const [statChanges, setStatChanges] = useState({});

    const [scenario, setScenarioState] = useState(state.flags.chapter3_scenario || 'transition');
    const [step, setStepState] = useState(state.flags.chapter3_step || 0);

    // Typewriter effect
    const [isTyping, handleTypingComplete] = useTypewriter(step);

    const setScenario = (newScenario) => {
        setScenarioState(newScenario);
        setFlag('chapter3_scenario', newScenario);
    };

    const setStep = (newStep) => {
        setStepState(newStep);
        setFlag('chapter3_step', newStep);
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

    // SCENARIO: Transition - Tóm tắt từ Chapter 2
    if (scenario === 'transition') {
        if (step === 0) {
            const text = `⏳ 10 năm đã trôi qua kể từ ngày cưới...

🏠 Bạn và ${partnerName} đã xây dựng một tổ ấm nhỏ.

💑 Cuộc sống vợ chồng có lúc vui, lúc buồn, nhưng hai người vẫn luôn bên nhau...`;

            return (
                <SceneBackground sceneKey="chapter3_family_discussion">
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
            const text = `💼 Công việc đã ổn định, tài chính đã vững vàng...

🏡 Căn nhà đầu tiên đã được mua, dù còn trả góp...

👪 Nhưng gia đình hai bên bắt đầu hỏi về... con cái.`;

            return (
                <SceneBackground sceneKey="chapter3_family_discussion">
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
            const text = `🌙 Đêm nay, bạn lại mơ thấy Bà Tiên Duyên...

Bà hiện ra trong một vùng sáng dịu nhẹ, nụ cười hiền hậu như ngày nào...`;

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

Con đã vượt qua nhiều thử thách rồi!

Nhưng hành trình làm cha/mẹ là thử thách lớn nhất đời người...

Ta nhớ mãi cảm giác lần đầu... À, ta muốn nói là... Bất kỳ ai làm cha mẹ cũng sẽ nhớ mãi khoảnh khắc này.

Con có sẵn sàng không?`;

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
            const text = `Làm cha/mẹ không chỉ là sinh con...

Mà còn là nuôi dạy, yêu thương, và hy sinh...

Hãy suy nghĩ kỹ trước khi quyết định nhé!

...`;

            return (
                <SceneBackground sceneKey="dream">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/bà_tiên_duyên_nghiêm_túc.png" alt="Bà Tiên Duyên" className="character-sprite left" />
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
            const text = `💤 Bạn tỉnh dậy...

Ánh nắng buổi sáng chiếu qua cửa sổ...

Bên cạnh, ${partnerName} vẫn đang ngủ say.

Lời Bà Tiên vẫn văng vẳng trong đầu...`;

            return (
                <SceneBackground sceneKey="chapter3_bedroom_talk">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            {isTyping ? (
                                <Typewriter text={text} onComplete={handleTypingComplete} />
                            ) : (
                                <button className="continue-btn fade-in" onClick={() => {
                                    setScenario('child_birth');
                                    setStep(0);
                                }}>Bắt đầu Chapter 3 →</button>
                            )}
                        </div>
                    </div>
                </SceneBackground>
            );
        }
    }

    // SCENARIO: Con chào đời
    if (scenario === 'child_birth') {
        if (step === 0) {
            const text = `📅 35 tuổi - Sau 7 năm kết hôn

Cuộc sống vợ chồng đã ổn định...

Và một tin vui đang chờ đợi...`;

            return (
                <SceneBackground sceneKey="chapter3_family_discussion">
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
            const text = `Anh/Em ơi... Em/Anh có tin vui!

Em/Anh... em/anh có thai rồi! 😄`;

            return (
                <SceneBackground sceneKey="chapter3_family_discussion">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={`/src/assets/characters/${partner}_vui_vẻ.png`} alt={partnerName} className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{partnerName}</h2>
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
            const text = `Thật à?! Tuyệt vời! 😄

Chúng mình sẽ có con rồi!`;

            return (
                <SceneBackground sceneKey="chapter3_family_discussion">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={getPlayerSprite('vui_vẻ')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{state.player.name}</h2>
                        <div className="dialogue-content">
                            {isTyping ? (
                                <Typewriter text={text} onComplete={handleTypingComplete} />
                            ) : (
                                <button className="continue-btn fade-in" onClick={() => {
                                    updateStats({ happiness: 50, social: 30 });
                                    setStep(3);
                                }}>Tiếp tục →</button>
                            )}
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 3) {
            const text = `📅 9 tháng sau - Bệnh viện

Tiếng khóc em bé vang lên...

👶 "Oa oa oa..."`;

            return (
                <SceneBackground sceneKey="chapter3_child_birth">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
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
            const text = `Chúc mừng! Bé rất khỏe mạnh!

Bé nặng 3.2kg, cao 50cm!`;

            return (
                <SceneBackground sceneKey="chapter3_child_birth">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/bác_sĩ_vui_vẻ.png" alt="Bác sĩ" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Bác sĩ</h2>
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
            const text = `Con mình... Con mình đây... 😭😊

Con đẹp quá!`;

            return (
                <SceneBackground sceneKey="chapter3_child_birth">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={getPlayerSprite('vui_vẻ')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{state.player.name}</h2>
                        <div className="dialogue-content">
                            {isTyping ? (
                                <Typewriter text={text} onComplete={handleTypingComplete} />
                            ) : (
                                <button className="continue-btn fade-in" onClick={() => {
                                    updateStats({ happiness: 100 });
                                    setFlag('has_child', true);
                                    setScenario('parenting_intro');
                                    setStep(0);
                                }}>Tiếp tục →</button>
                            )}
                        </div>
                    </div>
                </SceneBackground>
            );
        }
    }

    // SCENARIO: Giới thiệu nuôi dạy con
    if (scenario === 'parenting_intro') {
        if (step === 0) {
            const text = `📅 5 năm sau...
            
Con bạn đã lớn lên nhanh chóng! 🏃
            
Và bắt đầu có những rắc rối trẻ thơ...`;

            return (
                <SceneBackground sceneKey="chapter3_family_discussion">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            {isTyping ? (
                                <Typewriter text={text} onComplete={handleTypingComplete} />
                            ) : (
                                <button className="continue-btn fade-in" onClick={() => setScenario('parenting_challenge')}>
                                    Thử thách làm cha mẹ! (Mini-game)
                                </button>
                            )}
                        </div>
                    </div>
                </SceneBackground>
            );
        }
    }

    // SCENARIO: Mini-game Nuôi dạy con
    if (scenario === 'parenting_challenge') {
        const handleGameComplete = (result) => {
            if (result.bonusStats) {
                updateStats(result.bonusStats);
            }
            // Continue story
            setScenario('parents_request');
            setStep(0);
        };

        return (
            <SceneBackground sceneKey="dream">
                <ParentingGame
                    onComplete={handleGameComplete}
                    onStatChange={(delta) => updateStats(delta)}
                    childAge={5}
                />
            </SceneBackground>
        );
    }

    // SCENARIO: Ông bà muốn ở cùng
    if (scenario === 'parents_request') {
        if (step === 0) {
            const text = `📅 Con 3 tuổi - Một buổi tối

📱 Điện thoại reo...`;

            return (
                <SceneBackground sceneKey="chapter3_parents_request">
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
            const origin = state.player.origin;

            // RICH ORIGIN - Bố mẹ giàu không cần ở cùng
            if (origin === 'rich') {
                const text = `Con ơi... Bố với mẹ muốn lên thăm cháu...

Bố mẹ có nhà riêng rồi, nhưng muốn ở gần con và cháu...

Con có thể mua thêm căn hộ cho bố mẹ ở gần không?`;

                return (
                    <SceneBackground sceneKey="chapter3_parents_request">
                        <StatsPanel />
                        <div className="character-container">
                            <img src="/src/assets/characters/bố_nghiêm_túc.png" alt="Bố" className="character-sprite left" />
                        </div>
                        <div className="dialogue-box">
                            <h2 className="speaker-name">Bố (qua điện thoại)</h2>
                            <div className="dialogue-content">
                                {isTyping ? (
                                    <Typewriter text={text} onComplete={handleTypingComplete} />
                                ) : (
                                    <button className="continue-btn fade-in" onClick={() => setStep(1.5)}>Tiếp tục →</button>
                                )}
                            </div>
                        </div>
                    </SceneBackground>
                );
            }

            // NORMAL ORIGIN - Bố mẹ muốn ở cùng
            if (origin === 'normal') {
                const text = `Con ơi... Bố muốn nói chuyện với con...

Bố với mẹ già rồi... Ở quê một mình... Cô đơn lắm...

Con có thể cho bố mẹ lên ở cùng không? 😢`;

                return (
                    <SceneBackground sceneKey="chapter3_parents_request">
                        <StatsPanel />
                        <div className="character-container">
                            <img src="/src/assets/characters/bố_lo_lắng.png" alt="Bố" className="character-sprite left" />
                        </div>
                        <div className="dialogue-box">
                            <h2 className="speaker-name">Bố (qua điện thoại)</h2>
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

            // POOR ORIGIN - Bố mẹ nghèo, cần giúp đỡ
            if (origin === 'poor') {
                const text = `Con ơi... Mẹ xin lỗi con... 😢

Bố mẹ già yếu rồi... Làm ruộng không nổi...

Con có thể cho bố mẹ lên ở cùng không? Mẹ sẽ giúp con chăm cháu...`;

                return (
                    <SceneBackground sceneKey="chapter3_parents_request">
                        <StatsPanel />
                        <div className="character-container">
                            <img src="/src/assets/characters/mẹ_buồn.png" alt="Mẹ" className="character-sprite left" />
                        </div>
                        <div className="dialogue-box">
                            <h2 className="speaker-name">Mẹ (qua điện thoại)</h2>
                            <div className="dialogue-content">
                                {isTyping ? (
                                    <Typewriter text={text} onComplete={handleTypingComplete} />
                                ) : (
                                    <button className="continue-btn fade-in" onClick={() => setStep(1.5)}>Tiếp tục →</button>
                                )}
                            </div>
                        </div>
                    </SceneBackground>
                );
            }
        }

        // Step 1.5: Phản ứng của player theo xuất thân
        if (step === 1.5) {
            const origin = state.player.origin;

            // RICH ORIGIN
            if (origin === 'rich') {
                const text = `(Suy nghĩ)

Mua thêm căn hộ cho bố mẹ... Khoảng 3 tỷ...

Mình có đủ tiền... Nhưng có nên không?`;

                return (
                    <SceneBackground sceneKey="chapter3_parents_request">
                        <StatsPanel />
                        <div className="character-container">
                            <img src={getPlayerSprite('nghiêm_túc')} alt={state.player.name} className="character-sprite right" />
                        </div>
                        <div className="dialogue-box">
                            <h2 className="speaker-name">{state.player.name}</h2>
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

            // POOR ORIGIN
            if (origin === 'poor') {
                const text = `(Suy nghĩ)

Bố mẹ đã nuôi mình lớn... Giờ mình phải báo hiếu...

Nhưng nhà mình nhỏ... Mình phải làm sao đây... 😢`;

                return (
                    <SceneBackground sceneKey="chapter3_parents_request">
                        <StatsPanel />
                        <div className="character-container">
                            <img src={getPlayerSprite('buồn')} alt={state.player.name} className="character-sprite right" />
                        </div>
                        <div className="dialogue-box">
                            <h2 className="speaker-name">{state.player.name}</h2>
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
        }

        if (step === 2) {
            const text = `Dạ... Con sẽ bàn với vợ/chồng con ạ...

(Suy nghĩ) Mình phải làm sao đây...`;

            return (
                <SceneBackground sceneKey="chapter3_parents_request">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={getPlayerSprite('lo_lắng')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{state.player.name}</h2>
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
            const text = `Anh/Em cũng muốn chăm sóc bố mẹ...

Nhưng nhà mình nhỏ... 3 phòng ngủ thôi...

Bố mẹ ở đâu? 😰`;

            return (
                <SceneBackground sceneKey="chapter3_family_discussion">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={`/src/assets/characters/${partner}_lo_lắng.png`} alt={partnerName} className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{partnerName}</h2>
                        <div className="dialogue-content">
                            {isTyping ? (
                                <Typewriter text={text} onComplete={handleTypingComplete} />
                            ) : (
                                <button className="continue-btn fade-in" onClick={() => setScenario('parents_decision')}>Tiếp tục →</button>
                            )}
                        </div>
                    </div>
                </SceneBackground>
            );
        }
    }

    // CHOICE: Quyết định về ông bà
    if (scenario === 'parents_decision') {
        const text = `Đây là quyết định khó khăn...

Không có lựa chọn nào hoàn hảo...

Hãy chọn khôn ngoan...`;

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
                        {isTyping ? (
                            <Typewriter text={text} onComplete={handleTypingComplete} />
                        ) : (
                            <>
                                <div className="choices-container fade-in">
                                    <button className="choice-btn" onClick={() => {
                                        handleChoice({ economy: -100, happiness: 30, social: 20 }, { type: 'parents', value: 'buy_new_house' });
                                        setFlag('parents_decision', 'buy_new_house');
                                        setScenario('parents_move_in_intro');
                                        setStep(0);
                                    }}>
                                        <span className="choice-title">🏠 Mua nhà mới 4 phòng</span>
                                        <span className="choice-desc">Nợ 40 triệu/tháng x 20 năm. Bố mẹ vui nhưng áp lực tài chính</span>
                                    </button>
                                    <button className="choice-btn" onClick={() => {
                                        handleChoice({ happiness: 10, social: 10 }, { type: 'parents', value: 'stay_old_house' });
                                        setFlag('parents_decision', 'stay_old_house');
                                        setScenario('parents_move_in_intro');
                                        setStep(0);
                                    }}>
                                        <span className="choice-title">🏡 Ở nhà cũ</span>
                                        <span className="choice-desc">Chật chội, con và bố mẹ không thoải mái</span>
                                    </button>
                                    <button className="choice-btn" onClick={() => {
                                        handleChoice({ economy: 20, happiness: -30, social: -20 }, { type: 'parents', value: 'send_money' });
                                        setFlag('parents_decision', 'send_money');
                                        setScenario('parents_move_in_intro');
                                        setStep(0);
                                    }}>
                                        <span className="choice-title">💰 Gửi tiền về quê</span>
                                        <span className="choice-desc">Bố mẹ buồn, cảm giác tội lỗi</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </SceneBackground>
        );
    }

    // SCENARIO: Ba mẹ lên ở chung (intro)
    if (scenario === 'parents_move_in_intro') {
        if (step === 0) {
            const text = `📅 Vài ngày sau...

Bạn và ${partnerName} bắt đầu dọn dẹp, chuẩn bị một góc nhỏ cho bố mẹ.`;

            return (
                <SceneBackground sceneKey="chapter3_family_discussion">
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
            const text = `${partnerName}: "Anh/Em ơi... mình sắp xếp phòng thế nào đây?" 😰

Bạn: "Mình cố gắng thôi... miễn bố mẹ lên ở cùng, yên tâm tuổi già..."`;

            return (
                <SceneBackground sceneKey="chapter3_family_discussion">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={`/src/assets/characters/${partner}_lo_lắng.png`} alt={partnerName} className="character-sprite left" />
                        <img src={getPlayerSprite('nghiêm_túc')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            {isTyping ? (
                                <Typewriter text={text} onComplete={handleTypingComplete} />
                            ) : (
                                <button className="continue-btn fade-in" onClick={() => {
                                    updateStats({ happiness: 10, social: 10 });
                                    setScenario('parents_move_in_conflict');
                                    setStep(0);
                                }}>Đón bố mẹ lên →</button>
                            )}
                        </div>
                    </div>
                </SceneBackground>
            );
        }
    }

    // SCENARIO: Ba mẹ lên ở chung (va chạm thế hệ)
    if (scenario === 'parents_move_in_conflict') {
        if (step === 0) {
            const text = `🚉 Tuần sau...

Bố mẹ lên thành phố, mang theo nhiều đồ quê.

Bố: "Con ơi! Bố nhớ con quá!"

Mẹ: "Cháu đâu rồi? Bà nhớ cháu!"`;

            return (
                <SceneBackground sceneKey="chapter3_parents_request">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/bố_vui_vẻ.png" alt="Bố" className="character-sprite left" />
                    </div>
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
            const text = `🌅 Tuần đầu tiên...

5:00 AM - tiếng nồi niêu khua lạch cạch.

Mẹ: "Con ơi! Dậy ăn sáng!" 😐

${partnerName} (mệt): "Sớm quá..." 😵`;

            return (
                <SceneBackground sceneKey="chapter3_family_discussion">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/mẹ_nghiêm_túc.png" alt="Mẹ" className="character-sprite left" />
                        <img src={`/src/assets/characters/${partner}_lo_lắng.png`} alt={partnerName} className="character-sprite right" />
                    </div>
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
            const text = `📺 Buổi tối...

Bố bật TV rất to.

Bạn: "Bố ơi... nhỏ tiếng xuống được không ạ?" 😰

Bố: "Tai bố kém, phải to mới nghe!" 😠`;

            return (
                <SceneBackground sceneKey="chapter3_family_discussion">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/bố_tức_giận.png" alt="Bố" className="character-sprite left" />
                        <img src={getPlayerSprite('lo_lắng')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            {isTyping ? (
                                <Typewriter text={text} onComplete={handleTypingComplete} />
                            ) : (
                                <button className="continue-btn fade-in" onClick={() => {
                                    updateStats({ happiness: -10, social: -5 });
                                    setScenario('parents_move_in_resolution');
                                    setStep(0);
                                }}>Tiếp tục →</button>
                            )}
                        </div>
                    </div>
                </SceneBackground>
            );
        }
    }

    // SCENARIO: Ba mẹ lên ở chung (chốt hòa giải)
    if (scenario === 'parents_move_in_resolution') {
        if (step === 0) {
            const text = `🌙 Đêm đó...

Bạn nhận ra: nếu không nói chuyện rõ ràng, mọi người sẽ càng buồn.

Bạn mời cả nhà ngồi lại.`;

            return (
                <SceneBackground sceneKey="chapter3_family_discussion">
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
            const text = `Bạn: "Con biết bố mẹ muốn giúp... và vợ/chồng con cũng cần được tôn trọng."

"Mình thống nhất vài điều nhé:"

- Sáng dậy sớm thì nhỏ tiếng
- TV giảm âm lượng
- Chăm cháu thì hỏi ý kiến bố/mẹ

Cả nhà gật đầu. Không hoàn hảo, nhưng là một khởi đầu.`;

            return (
                <SceneBackground sceneKey="chapter3_family_discussion">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/mẹ_yêu_thương.png" alt="Mẹ" className="character-sprite left" />
                        <img src={`/src/assets/characters/${partner}_vui_vẻ.png`} alt={partnerName} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            {isTyping ? (
                                <Typewriter text={text} onComplete={handleTypingComplete} />
                            ) : (
                                <button className="continue-btn fade-in" onClick={() => {
                                    updateStats({ happiness: 20, social: 20, knowledge: 10 });
                                    setFlag('chapter3_parents_moved_in', true);
                                    setScenario('parenting_teach_intro');
                                    setStep(0);
                                }}>Đi tiếp: Dạy con học →</button>
                            )}
                        </div>
                    </div>
                </SceneBackground>
            );
        }
    }

    // SCENARIO: Dạy con học (intro + mini-game)
    if (scenario === 'parenting_teach_intro') {
        if (step === 0) {
            const text = `📚 36 tuổi - Con vào lớp 1

Con bắt đầu có bài tập về nhà...

Và bạn nhận ra: Dạy con học là một hành trình dài.`;

            return (
                <SceneBackground sceneKey="chapter3_family_discussion">
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
            const text = `Con: "Bố/Mẹ ơi! Con không biết làm bài này!" 😰

Bạn sẽ phản ứng như thế nào?`;

            return (
                <SceneBackground sceneKey="chapter3_family_discussion">
                    <StatsPanel />
                    {showStatChange && (
                        <StatChangeNotification changes={statChanges} onContinue={handleContinueAfterStats} />
                    )}
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            {isTyping ? (
                                <Typewriter text={text} onComplete={handleTypingComplete} />
                            ) : (
                                <>
                                    <div className="choices-container fade-in">
                                        <button className="choice-btn" onClick={() => {
                                            handleChoice({ happiness: 10, knowledge: 10 }, { type: 'teach', value: 'guide' });
                                            setFlag('chapter3_teach_style', 'guide');
                                        }}>
                                            <span className="choice-title">📖 Hướng dẫn con tự làm</span>
                                            <span className="choice-desc">Chậm hơn, nhưng con học được cách tư duy</span>
                                        </button>
                                        <button className="choice-btn" onClick={() => {
                                            handleChoice({ happiness: -5, knowledge: -5 }, { type: 'teach', value: 'do_for_child' });
                                            setFlag('chapter3_teach_style', 'do_for_child');
                                        }}>
                                            <span className="choice-title">🎯 Làm hộ con cho nhanh</span>
                                            <span className="choice-desc">Nhanh nhưng con dễ phụ thuộc</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        // Sau khi apply stat change (step tăng lên), chuyển sang mini-game
        if (step === 2) {
            const text = `Để con tiến bộ, bạn quyết định dành thời gian cùng con ôn bài.

Hãy chơi mini-game "Học nhóm" như một bài luyện tập trí nhớ!`;

            return (
                <SceneBackground sceneKey="chapter3_family_discussion">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            {isTyping ? (
                                <Typewriter text={text} onComplete={handleTypingComplete} />
                            ) : (
                                <button className="continue-btn fade-in" onClick={() => {
                                    setScenario('parenting_teach_game');
                                    setStep(0);
                                }}>Bắt đầu mini-game →</button>
                            )}
                        </div>
                    </div>
                </SceneBackground>
            );
        }
    }

    if (scenario === 'parenting_teach_game') {
        const handleGameComplete = (score) => {
            const bonus = {
                knowledge: Math.max(5, Math.round(score / 20)),
                happiness: Math.max(0, Math.round(score / 40))
            };
            updateStats(bonus);
            setScenario('child_sick_intro');
            setStep(0);
        };

        return (
            <SceneBackground sceneKey="chapter3_family_discussion">
                <StudyGroupGame onComplete={handleGameComplete} />
            </SceneBackground>
        );
    }

    // SCENARIO: Con ốm (intro + mini-game cân bằng)
    if (scenario === 'child_sick_intro') {
        if (step === 0) {
            const text = `🤒 37 tuổi - Nửa đêm

Con (khóc): "Bố/Mẹ ơi... con đau..." 😢

Bạn choàng dậy, sờ trán con...`;

            return (
                <SceneBackground sceneKey="chapter3_hospital_night">
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
            const text = `🌡️ Con sốt cao và phải vào viện.

Sau ca cấp cứu, một vấn đề khác xuất hiện:

Công việc vẫn không chờ bạn...`;

            return (
                <SceneBackground sceneKey="chapter3_hospital">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            {isTyping ? (
                                <Typewriter text={text} onComplete={handleTypingComplete} />
                            ) : (
                                <button className="continue-btn fade-in" onClick={() => {
                                    setScenario('child_sick_balance_game');
                                    setStep(0);
                                }}>Cân bằng công việc & gia đình (Mini-game) →</button>
                            )}
                        </div>
                    </div>
                </SceneBackground>
            );
        }
    }

    if (scenario === 'child_sick_balance_game') {
        const handleGameComplete = (result) => {
            if (result?.bonusStats) {
                updateStats(result.bonusStats);
            }
            setScenario('child_study_bad_intro');
            setStep(0);
        };

        return (
            <SceneBackground sceneKey="chapter3_hospital">
                <WorkBalanceGame onComplete={handleGameComplete} />
            </SceneBackground>
        );
    }

    // SCENARIO: Con học kém (intro + choice)
    if (scenario === 'child_study_bad_intro') {
        if (step === 0) {
            const text = `📉 38 tuổi - Họp phụ huynh

Giáo viên: "Phụ huynh ơi... con anh/chị học kém..." 😐

Bạn cảm thấy lo lắng và áp lực.`;

            return (
                <SceneBackground sceneKey="chapter3_family_discussion">
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
            const text = `Về nhà, con im lặng...

Bạn sẽ xử lý như thế nào?`;

            return (
                <SceneBackground sceneKey="chapter3_family_discussion">
                    <StatsPanel />
                    {showStatChange && (
                        <StatChangeNotification changes={statChanges} onContinue={handleContinueAfterStats} />
                    )}
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            {isTyping ? (
                                <Typewriter text={text} onComplete={handleTypingComplete} />
                            ) : (
                                <>
                                    <div className="choices-container fade-in">
                                        <button className="choice-btn" onClick={() => {
                                            handleChoice({ happiness: 20, knowledge: 10 }, { type: 'study', value: 'find_reason' });
                                            setFlag('chapter3_study_style', 'find_reason');
                                        }}>
                                            <span className="choice-title">💡 Tìm hiểu nguyên nhân & giúp con</span>
                                            <span className="choice-desc">Mất thời gian nhưng bền vững</span>
                                        </button>
                                        <button className="choice-btn" onClick={() => {
                                            handleChoice({ happiness: -20, knowledge: -10 }, { type: 'study', value: 'punish' });
                                            setFlag('chapter3_study_style', 'punish');
                                        }}>
                                            <span className="choice-title">😠 Phạt con, ép học</span>
                                            <span className="choice-desc">Nhanh nhưng dễ phản tác dụng</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 2) {
            const text = `Dù lựa chọn thế nào, bạn cũng nhận ra:

Nuôi dạy con là chuỗi những quyết định không hoàn hảo.

Bạn đã đi hết một chặng đường dài của Chapter 3.`;

            return (
                <SceneBackground sceneKey="dream">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            {isTyping ? (
                                <Typewriter text={text} onComplete={handleTypingComplete} />
                            ) : (
                                <button className="continue-btn fade-in" onClick={() => {
                                    setScenario('chapter_end');
                                    setStep(0);
                                }}>Tổng kết Chapter 3 →</button>
                            )}
                        </div>
                    </div>
                </SceneBackground>
            );
        }
    }

    // SCENARIO: Kết thúc Chapter 3
    if (scenario === 'chapter_end') {
        const decision = state.flags.parents_decision || 'stay_old_house';

        if (step === 0) {
            const decisionText = decision === 'buy_new_house'
                ? 'Ngươi chọn mua nhà mới, dù phải nợ nần... Đó là lòng hiếu thảo...'
                : decision === 'stay_old_house'
                    ? 'Ngươi chọn ở nhà cũ, dù chật chội... Đó là sự cố gắng...'
                    : 'Ngươi chọn gửi tiền về quê... Đó là quyết định khó khăn...';

            const text = `Ngươi đã đưa ra quyết định...

${decisionText}

Bạn đã trải qua:
- Sinh con và làm cha/mẹ
- Dạy con học
- Cân bằng công việc và gia đình
- Đối diện áp lực khi con gặp khó khăn

Giờ đây, bạn bước vào Chapter 4...`;

            return (
                <SceneBackground sceneKey="dream">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/bà_tiên_vui_vẻ.png" alt="Bà Tiên" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Bà Tiên Duyên ✨</h2>
                        <div className="dialogue-content">
                            {isTyping ? (
                                <Typewriter text={text} onComplete={handleTypingComplete} />
                            ) : (
                                <button className="continue-btn fade-in" onClick={() => {
                                    updateStats({ happiness: 30, knowledge: 20 });
                                    setScreen('chapter4');
                                }}>Hoàn thành Chapter 3 ✨</button>
                            )}
                        </div>
                    </div>
                </SceneBackground>
            );
        }
    }

    // Default fallback
    const text = `Chapter 3 đang được phát triển...`;

    return (
        <SceneBackground sceneKey="dream">
            <StatsPanel />
            <div className="dialogue-box">
                <h2 className="speaker-name">System</h2>
                <div className="dialogue-content">
                    {isTyping ? (
                        <Typewriter text={text} onComplete={handleTypingComplete} />
                    ) : (
                        <button className="continue-btn fade-in" onClick={() => setScreen('start')}>Về màn hình chính</button>
                    )}
                </div>
            </div>
        </SceneBackground>
    );
}
