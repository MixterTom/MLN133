
import { useState, useEffect } from 'react';
import { useGame } from '../../contexts/GameContext';
import StatsPanel from '../UI/StatsPanel';
import StatChangeNotification from '../UI/StatChangeNotification';
import SceneBackground from '../Common/SceneBackground';
import Typewriter from '../Common/Typewriter';
import StudyGroupGame from '../MiniGames/StudyGroupGame';
import WeddingPlanGame from '../MiniGames/WeddingPlanGame';

import './PrologueScreen.css';

export default function Chapter2Screen() {
    const { state, updateStats, setScreen, addChoice, setFlag } = useGame();
    const [showStatChange, setShowStatChange] = useState(false);
    const [statChanges, setStatChanges] = useState({});
    const [showChoices, setShowChoices] = useState(false);

    const [scenario, setScenarioState] = useState(state.flags.chapter2_scenario || 'transition');
    const [step, setStepState] = useState(state.flags.chapter2_step || 0);

    // Debug log
    console.log('Chapter2 - Scenario:', scenario, 'Step:', step);

    // Reset showChoices when step changes
    useEffect(() => {
        setShowChoices(false);
    }, [step]);

    const setScenario = (newScenario) => {
        setScenarioState(newScenario);
        setFlag('chapter2_scenario', newScenario);
    };

    const setStep = (newStep) => {
        setStepState(newStep);
        setFlag('chapter2_step', newStep);
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
        return `/ src / assets / characters / ${gender}_${emotion}.png`;
    };

    // SCENARIO: Transition từ Chapter 1
    if (scenario === 'transition') {
        if (step === 0) {
            // Determine education path from Chapter 1
            const eduPath = state.flags.education_path || 'university';
            const pathText = eduPath === 'university'
                ? 'tốt nghiệp đại học và tìm được công việc ổn định'
                : eduPath === 'work'
                    ? 'làm việc chăm chỉ và dần thăng tiến'
                    : 'hoàn thành chương trình du học và trở về Việt Nam';

            return (
                <SceneBackground sceneKey="chapter2_family_pressure">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter text={`✨ 7 năm trôi qua...

Từ cậu học sinh 18 tuổi bỡ ngỡ ngày nào...

${state.player.name} đã ${pathText}.

Cuộc sống dần ổn định, nhưng một thử thách mới đang chờ đợi phía trước...`} onComplete={() => setStep(1)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 1) {
            return (
                <SceneBackground sceneKey="dream">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter text={`🌙 Đêm 30 Tết - Trong giấc mơ...

${state.player.name} lại thấy ánh sáng quen thuộc...

Bà Tiên Duyên xuất hiện như lần đầu gặp mặt...`} onComplete={() => setStep(2)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 2) {
            return (
                <SceneBackground sceneKey="dream">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/bà_tiên_nghiêm_túc.png" alt="Bà Tiên" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Bà Tiên Duyên ✨</h2>
                        <div className="dialogue-content">
                            <Typewriter text={`${state.player.name}... Ngươi đã lớn rồi...

7 năm qua, ngươi đã chứng minh bản thân trên con đường đã chọn.

Lúc ta 25 tuổi... À không, ý ta là... Ở độ tuổi này, ai cũng gặp áp lực cả.

Thử thách tiếp theo là về... TÌNH YÊU và GIA ĐÌNH.Hãy chuẩn bị tinh thần...`} onComplete={() => {
                                    setScenario('family_pressure');
                                    setStep(0);
                                }} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }
    }

    // SCENARIO: Áp lực gia đình
    if (scenario === 'family_pressure') {
        if (step === 0) {
            const text = `📅 25 tuổi - Tết Nguyên Đán

${state.player.name} đã có công việc ổn định, cuộc sống tự lập...

Nhưng gia đình bắt đầu lo lắng về chuyện... lập gia đình...`;

            return (
                <SceneBackground sceneKey="chapter2_family_pressure">
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

        if (step === 1) {
            const text = `Con ơi, mẹ lo cho con lắm...

Bạn bè con lấy vợ / chồng hết rồi...

Con đã 25 tuổi rồi, phải tìm người thôi!`;

            return (
                <SceneBackground sceneKey="chapter2_family_pressure">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/mẹ_lo_lắng.png" alt="Mẹ" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Mẹ</h2>
                        <div className="dialogue-content">
                            <Typewriter text={text} onComplete={() => setStep(2)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 2) {
            const origin = state.player.origin;

            // RICH ORIGIN - Bố ép phải tìm người cùng tầng lớp
            if (origin === 'rich') {
                const text = `Con phải tìm người cùng tầng lớp!

Bố đã sắp xếp cho con gặp con CEO Trang rồi!

Đừng tìm người nghèo! Họ chỉ muốn lợi dụng con!`;

                return (
                    <SceneBackground sceneKey="chapter2_family_pressure">
                        <StatsPanel />
                        <div className="character-container">
                            <img src="/src/assets/characters/bố_nghiêm_túc.png" alt="Bố" className="character-sprite left" />
                        </div>
                        <div className="dialogue-box">
                            <h2 className="speaker-name">Bố (Doanh nhân)</h2>
                            <div className="dialogue-content">
                                <Typewriter text={text} onComplete={() => setStep(2.5)} />
                            </div>
                        </div>
                    </SceneBackground>
                );
            }

            // NORMAL ORIGIN - Bố mẹ thoải mái
            if (origin === 'normal') {
                const text = `Con phải tìm người sớm thôi!

Tuổi càng lớn càng khó tìm!

Bố mẹ muốn thấy con lập gia đình!`;

                return (
                    <SceneBackground sceneKey="chapter2_family_pressure">
                        <StatsPanel />
                        <div className="character-container">
                            <img src="/src/assets/characters/bố_nghiêm_túc.png" alt="Bố" className="character-sprite left" />
                        </div>
                        <div className="dialogue-box">
                            <h2 className="speaker-name">Bố</h2>
                            <div className="dialogue-content">
                                <Typewriter text={text} onComplete={() => setStep(3)} />
                            </div>
                        </div>
                    </SceneBackground>
                );
            }

            // POOR ORIGIN - Mẹ lo lắng về tiền bạc
            if (origin === 'poor') {
                const text = `Con ơi... Mẹ lo cho con lắm...

Con phải tìm người có điều kiện tốt hơn!

Để con không phải khổ như bố mẹ... 😢`;

                return (
                    <SceneBackground sceneKey="chapter2_family_pressure">
                        <StatsPanel />
                        <div className="character-container">
                            <img src="/src/assets/characters/mẹ_lo_lắng.png" alt="Mẹ" className="character-sprite left" />
                        </div>
                        <div className="dialogue-box">
                            <h2 className="speaker-name">Mẹ</h2>
                            <div className="dialogue-content">
                                <Typewriter text={text} onComplete={() => setStep(2.5)} />
                            </div>
                        </div>
                    </SceneBackground>
                );
            }
        }

        // Step 2.5: Phản ứng của player
        if (step === 2.5) {
            const origin = state.player.origin;

            // RICH ORIGIN
            if (origin === 'rich') {
                const text = `(Suy nghĩ)

Bố lại ép mình rồi... Mình không muốn kết hôn vì lợi ích...

Mình muốn tìm tình yêu chân thành... Nhưng làm sao biết ai thật lòng ? `;

                return (
                    <SceneBackground sceneKey="chapter2_family_pressure">
                        <StatsPanel />
                        <div className="character-container">
                            <img src={getPlayerSprite('buồn')} alt={state.player.name} className="character-sprite right" />
                        </div>
                        <div className="dialogue-box">
                            <h2 className="speaker-name">{state.player.name}</h2>
                            <div className="dialogue-content">
                                <Typewriter text={text} onComplete={() => {
                                    updateStats({ happiness: -20 });
                                    setScenario('choose_partner');
                                    setStep(0);
                                }} />
                            </div>
                        </div>
                    </SceneBackground>
                );
            }

            // POOR ORIGIN
            if (origin === 'poor') {
                const text = `(Suy nghĩ)

Mẹ muốn mình tìm người giàu... Nhưng người giàu có chấp nhận mình không ?

    Mình... Mình tự ti quá...`;

                return (
                    <SceneBackground sceneKey="chapter2_family_pressure">
                        <StatsPanel />
                        <div className="character-container">
                            <img src={getPlayerSprite('lo_lắng')} alt={state.player.name} className="character-sprite right" />
                        </div>
                        <div className="dialogue-box">
                            <h2 className="speaker-name">{state.player.name}</h2>
                            <div className="dialogue-content">
                                <Typewriter text={text} onComplete={() => {
                                    updateStats({ happiness: -20, social: -10 });
                                    setStep(3);
                                }} />
                            </div>
                        </div>
                    </SceneBackground>
                );
            }
        }

        if (step === 3) {
            const text = `(Suy nghĩ)

Mình phải tìm người thôi...

Nhưng tìm ai đây...`;

            return (
                <SceneBackground sceneKey="chapter2_family_pressure">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={getPlayerSprite('lo_lắng')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{state.player.name}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={text} onComplete={() => setStep(4)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 4) {
            const text = `Đây là lúc ngươi cần tìm người đồng hành...

Trong 6 tháng tới, ngươi sẽ gặp 5 người...

Hãy chọn kỹ... Đây là quyết định quan trọng nhất đời ngươi...`;

            return (
                <SceneBackground sceneKey="dream">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/bà_tiên_nghiêm_túc.png" alt="Bà Tiên" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Bà Tiên Duyên ✨</h2>
                        <div className="dialogue-content">
                            <Typewriter text={text} onComplete={() => {
                                setScenario('meet_candidates');
                                setStep(0);
                            }} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }
    }

    // SCENARIO: Gặp 5 ứng viên
    if (scenario === 'meet_candidates') {
        if (step === 0) {
            const text = `📅 6 tháng sau...

Bạn đã gặp 5 người khác nhau...

Mỗi người đều có điểm mạnh và điểm yếu riêng...`;

            return (
                <SceneBackground sceneKey="chapter2_meet_candidates">
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

        if (step === 1) {
            const text = `Bạn thích ai nhất ?

    Mỗi người đều có ưu nhược điểm!

Bạn phải chọn người phù hợp nhất!`;

            return (
                <SceneBackground sceneKey="chapter2_meet_candidates">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/bạn_thân_vui_vẻ.png" alt="Minh" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Minh (Bạn thân)</h2>
                        <div className="dialogue-content">
                            <Typewriter text={text} onComplete={() => setScenario('choose_partner')} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }
    }

    // CHOICE: Chọn người yêu
    if (scenario === 'choose_partner') {
        const text = `Đây là quyết định quan trọng nhất đời ngươi...

Người ngươi chọn sẽ là người đồng hành suốt đời...

Hãy chọn khôn ngoan!`;

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
                            <Typewriter text={text} onComplete={() => setShowChoices(true)} />
                        ) : (
                            <div className="choices-container fade-in">
                                <button className="choice-btn" onClick={() => {
                                    handleChoice({ happiness: 30, economy: -20 }, { type: 'partner', value: 'minh' });
                                    setFlag('partner', 'minh');
                                    setScenario('dating');
                                    setStep(0);
                                }}>
                                    <span className="choice-title">🎸 MINH - Nghệ sĩ</span>
                                    <span className="choice-desc">Lãng mạn, chân thành nhưng nghèo</span>
                                </button>
                                <button className="choice-btn" onClick={() => {
                                    handleChoice({ happiness: 20, economy: 40 }, { type: 'partner', value: 'trang' });
                                    setFlag('partner', 'trang');
                                    setScenario('dating');
                                    setStep(0);
                                }}>
                                    <span className="choice-title">💼 TRANG - CEO</span>
                                    <span className="choice-desc">Giàu có, thành công nhưng bận rộn</span>
                                </button>
                                <button className="choice-btn" onClick={() => {
                                    handleChoice({ happiness: 25, economy: 20 }, { type: 'partner', value: 'hung' });
                                    setFlag('partner', 'hung');
                                    setScenario('dating');
                                    setStep(0);
                                }}>
                                    <span className="choice-title">🔧 HÙNG - Kỹ sư</span>
                                    <span className="choice-desc">Ổn định, đáng tin cậy</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </SceneBackground>
        );
    }

    // SCENARIO: Hẹn hò
    if (scenario === 'dating') {
        const partner = state.flags.partner || 'hung';
        const partnerName = partner === 'minh' ? 'Minh' : partner === 'trang' ? 'Trang' : 'Hùng';

        if (step === 0) {
            const text = `📅 2 năm sau - 27 tuổi

Bạn và ${partnerName} đã yêu nhau được 2 năm...

Mối quan hệ ngày càng sâu đậm...`;

            return (
                <SceneBackground sceneKey="chapter2_dating">
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

        if (step === 1) {
            const text = `Anh / Em ơi... Chúng mình yêu nhau 2 năm rồi...

Anh / Em nghĩ sao về... kết hôn ? `;

            return (
                <SceneBackground sceneKey="chapter2_dating">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={`/ src / assets / characters / ${partner} _vui_vẻ.png`} alt={partnerName} className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{partnerName}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={text} onComplete={() => setScenario('marriage_decision')} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }
    }

    // CHOICE: Quyết định kết hôn
    if (scenario === 'marriage_decision') {
        const partner = state.flags.partner || 'hung';
        const partnerName = partner === 'minh' ? 'Minh' : partner === 'trang' ? 'Trang' : 'Hùng';
        const text = `Kết hôn là bước ngoặt lớn...

Ngươi đã sẵn sàng chưa ? `;

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
                            <Typewriter text={text} onComplete={() => setShowChoices(true)} />
                        ) : (
                            <div className="choices-container fade-in">
                                <button className="choice-btn" onClick={() => {
                                    handleChoice({ happiness: 30, social: 20 }, { type: 'marriage', value: 'yes' });
                                    setFlag('married', true);
                                    setScenario('wedding_planning');
                                    setStep(0);
                                }}>
                                    <span className="choice-title">💍 Mình sẵn sàng kết hôn!</span>
                                    <span className="choice-desc">Chuẩn bị đám cưới (Mini-game)</span>
                                </button>
                                <button className="choice-btn" onClick={() => {
                                    handleChoice({ economy: 20, happiness: -10 }, { type: 'marriage', value: 'wait' });
                                    setScenario('marriage_registration');
                                    setStep(0);
                                }}>
                                    <span className="choice-title">⏰ Chờ thêm 1 năm nữa</span>
                                    <span className="choice-desc">Tiết kiệm thêm tiền</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </SceneBackground>
        );
    }

    // SCENARIO: Lên kế hoạch đám cưới (Mini-game)
    if (scenario === 'wedding_planning') {
        const handleGameComplete = (result) => {
            if (result.bonusStats) {
                updateStats(result.bonusStats);
            }
            // Move to registration after planning
            setScenario('marriage_registration');
            setStep(0);
        };

        return (
            <SceneBackground sceneKey="dream">
                <WeddingPlanGame
                    budget={state.player.stats.economy > 80 ? 150 : (state.player.stats.economy > 50 ? 100 : 60)}
                    onComplete={handleGameComplete}
                />
            </SceneBackground>
        );
    }

    // SCENARIO: Đăng ký kết hôn (Lồng ghép Luật Hôn nhân)
    if (scenario === 'marriage_registration') {
        const partner = state.flags.partner || 'hung';
        const partnerName = partner === 'minh' ? 'Minh' : partner === 'trang' ? 'Trang' : 'Hùng';

        if (step === 0) {
            const text = `📅 1 tháng trước đám cưới

Bạn và ${partnerName} cần đăng ký kết hôn tại UBND...`;

            return (
                <SceneBackground sceneKey="chapter2_marriage_registration">
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

        if (step === 1) {
            const text = `Anh / Em ơi! Chúng mình phải đăng ký kết hôn nhé!

Đó là theo Luật Hôn nhân và Gia đình!

Đăng ký kết hôn là bảo vệ quyền lợi của chúng mình!`;

            return (
                <SceneBackground sceneKey="chapter2_dating_home">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={`/ src / assets / characters / ${partner} _vui_vẻ.png`} alt={partnerName} className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{partnerName}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={text} onComplete={() => setStep(2)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 2) {
            const text = `🏛️ Tại UBND phường...

Hai bạn đến đăng ký kết hôn...`;

            return (
                <SceneBackground sceneKey="chapter2_marriage_registration">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter text={text} onComplete={() => setStep(3)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 3) {
            const text = `Chào hai bạn! Hai bạn đến đăng ký kết hôn à ?

    Hai bạn mang đủ giấy tờ chưa ?
        - CMND / CCCD
        - Giấy khám sức khỏe
            - Hộ khẩu`;

            return (
                <SceneBackground sceneKey="chapter2_marriage_registration">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/ông_khôn_ngoan.png" alt="Cán bộ" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Cán bộ UBND</h2>
                        <div className="dialogue-content">
                            <Typewriter text={text} onComplete={() => setStep(4)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 4) {
            const text = `Dạ, chúng em mang đủ rồi ạ!`;

            return (
                <SceneBackground sceneKey="chapter2_marriage_registration">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={getPlayerSprite('vui_vẻ')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{state.player.name}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={text} onComplete={() => setStep(5)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 5) {
            const text = `Theo Luật Hôn nhân và Gia đình năm 2014:

📜 Điều 2: Hôn nhân tự nguyện, tiến bộ, một vợ một chồng, vợ chồng bình đẳng.

📜 Điều 3: Vợ chồng có nghĩa vụ yêu thương, tôn trọng, chăm sóc lẫn nhau, cùng xây dựng gia đình hạnh phúc.

Hai bạn có hiểu không ? `;

            return (
                <SceneBackground sceneKey="chapter2_marriage_registration">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/ông_khôn_ngoan.png" alt="Cán bộ" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Cán bộ UBND</h2>
                        <div className="dialogue-content">
                            <Typewriter text={text} onComplete={() => setStep(6)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 6) {
            const text = `Dạ, chúng em hiểu ạ! 😊`;

            return (
                <SceneBackground sceneKey="chapter2_marriage_registration">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={getPlayerSprite('vui_vẻ')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{state.player.name} & {partnerName}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={text} onComplete={() => setStep(7)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 7) {
            const text = `Tốt! Chúc mừng hai bạn!

Đây là Giấy chứng nhận kết hôn!

Hãy xây dựng gia đình hạnh phúc, đóng góp cho xã hội nhé!`;

            return (
                <SceneBackground sceneKey="chapter2_marriage_registration">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/ông_vui_vẻ.png" alt="Cán bộ" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Cán bộ UBND</h2>
                        <div className="dialogue-content">
                            <Typewriter text={text} onComplete={() => {
                                updateStats({ happiness: 30, social: 20, knowledge: 10 });
                                setScenario('buy_house');
                                setStep(0);
                            }} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }
    }

    // SCENARIO: Mua nhà
    if (scenario === 'buy_house') {
        const partner = state.flags.partner || 'hung';
        const partnerName = partner === 'minh' ? 'Minh' : partner === 'trang' ? 'Trang' : 'Hùng';

        // Calculate money based on origin and partner
        let playerMoney = 0;
        if (state.player.origin === 'rich') playerMoney = 1000;
        else if (state.player.origin === 'normal') playerMoney = 500;
        else playerMoney = 200;

        let partnerMoney = 0;
        if (partner === 'trang') partnerMoney = 800;
        else if (partner === 'hung') partnerMoney = 500;
        else partnerMoney = 100;

        const totalMoney = playerMoney + partnerMoney + (state.player.stats.economy * 2);

        if (step === 0) {
            const text = `Chúng mình cần mua nhà!

Không thể ở thuê mãi được!

Mình có ${partnerMoney} triệu, anh / em có ${playerMoney} triệu.

Tổng cộng: ${totalMoney} triệu!`;

            return (
                <SceneBackground sceneKey="chapter2_dating_home">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={`/ src / assets / characters / ${partner} _nghiêm_túc.png`} alt={partnerName} className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{partnerName}</h2>
                        <div className="dialogue-content">
                            <Typewriter text={text} onComplete={() => setStep(1)} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 1) {
            const text = `Các anh chị có ${totalMoney} triệu à ?

    Tôi có 3 căn phù hợp!`;

            return (
                <SceneBackground sceneKey="chapter2_dating_home">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/đồng_nghiệp_thân_thiện.png" alt="Môi giới" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Môi giới nhà đất</h2>
                        <div className="dialogue-content">
                            <Typewriter text={text} onComplete={() => setScenario('house_choice')} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }
    }

    // CHOICE: Chọn nhà
    if (scenario === 'house_choice') {
        const totalMoney = state.flags.total_money || 1000;
        const text = `Đây là 3 căn nhà phù hợp với ngân sách của anh chị!`;

        return (
            <SceneBackground sceneKey="chapter2_dating_home">
                <StatsPanel />
                {showStatChange && (
                    <StatChangeNotification changes={statChanges} onContinue={handleContinueAfterStats} />
                )}
                <div className="character-container">
                    <img src="/src/assets/characters/đồng_nghiệp_thân_thiện.png" alt="Môi giới" className="character-sprite left" />
                </div>
                <div className="dialogue-box">
                    <h2 className="speaker-name">Môi giới nhà đất</h2>
                    <div className="dialogue-content">
                        {!showChoices ? (
                            <Typewriter text={text} onComplete={() => setShowChoices(true)} />
                        ) : (
                            <div className="choices-container fade-in">
                                <button className="choice-btn" onClick={() => {
                                    updateStats({ economy: -100, happiness: 30, social: 20 });
                                    addChoice({ type: 'house', value: 'expensive' });
                                    setFlag('house', 'expensive');
                                    setScenario('chapter_end');
                                    setStep(0);
                                }}>
                                    <span className="choice-title">🏢 Nhà trung tâm - 3 tỷ</span>
                                    <span className="choice-desc">80m2, gần chợ, trường, bệnh viện. Phải vay ngân hàng</span>
                                </button>
                                <button className="choice-btn" onClick={() => {
                                    updateStats({ economy: -50, happiness: 20, social: 10 });
                                    addChoice({ type: 'house', value: 'medium' });
                                    setFlag('house', 'medium');
                                    setScenario('chapter_end');
                                    setStep(0);
                                }}>
                                    <span className="choice-title">🏠 Nhà ngoại ô - 1.5 tỷ</span>
                                    <span className="choice-desc">100m2, rộng rãi, giá hợp lý</span>
                                </button>
                                <button className="choice-btn" onClick={() => {
                                    updateStats({ economy: -20, happiness: 10, social: 5 });
                                    addChoice({ type: 'house', value: 'cheap' });
                                    setFlag('house', 'cheap');
                                    setScenario('chapter_end');
                                    setStep(0);
                                }}>
                                    <span className="choice-title">🏡 Nhà vùng ven - 800 triệu</span>
                                    <span className="choice-desc">120m2, rất rộng nhưng xa trung tâm</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </SceneBackground>
        );
    }

    // SCENARIO: Kết thúc Chapter 2
    if (scenario === 'chapter_end') {
        const partner = state.flags.partner || 'hung';
        const partnerName = partner === 'minh' ? 'Minh' : partner === 'trang' ? 'Trang' : 'Hùng';

        if (step === 0) {
            const text = `Tốt lắm! Ngươi đã lập gia đình!

Ngươi và ${partnerName} đã kết hôn, mua nhà...

Giờ đây, ngươi sẽ bước vào giai đoạn mới... Nuôi dạy con cái...`;

            return (
                <SceneBackground sceneKey="dream">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/bà_tiên_vui_vẻ.png" alt="Bà Tiên" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Bà Tiên Duyên ✨</h2>
                        <div className="dialogue-content">
                            <Typewriter text={text} onComplete={() => {
                                updateStats({ happiness: 50, social: 30 });
                                setFlag('chapter3_scenario', 'transition');
                                setFlag('chapter3_step', 0);
                                setScreen('chapter3');
                            }} />
                        </div>
                    </div>
                </SceneBackground>
            );
        }
    }

    // Default fallback
    const text = `Chapter 2 đang được phát triển...
    
Debug: scenario="${scenario}", step=${step}`;

    return (
        <SceneBackground sceneKey="dream">
            <StatsPanel />
            <div className="dialogue-box">
                <h2 className="speaker-name">System</h2>
                <div className="dialogue-content">
                    <p className="dialogue-text" style={{ whiteSpace: 'pre-line' }}>{text}</p>
                    <button className="continue-btn" onClick={() => {
                        // Reset về đầu chapter 2
                        setScenario('transition');
                        setStep(0);
                    }}>Reset Chapter 2</button>
                    <button className="continue-btn" onClick={() => setScreen('start')}>Về màn hình chính</button>
                </div>
            </div>
        </SceneBackground>
    );
}
