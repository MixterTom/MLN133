import { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import StatsPanel from '../UI/StatsPanel';
import StatChangeNotification from '../UI/StatChangeNotification';
import SceneBackground from '../Common/SceneBackground';
import Typewriter from '../Common/Typewriter';

import StudyGroupGame from '../MiniGames/StudyGroupGame';
import WorkBalanceGame from '../MiniGames/WorkBalanceGame';
import './PrologueScreen.css';

export default function Chapter4Screen() {
    const { state, updateStats, setScreen, addChoice, setFlag } = useGame();
    const [showStatChange, setShowStatChange] = useState(false);
    const [statChanges, setStatChanges] = useState({});

    const [scenario, setScenarioState] = useState(state.flags.chapter4_scenario || 'transition');
    const [step, setStepState] = useState(state.flags.chapter4_step || 0);


    const setScenario = (newScenario) => {
        setScenarioState(newScenario);
        setFlag('chapter4_scenario', newScenario);
    };

    const setStep = (newStep) => {
        setStepState(newStep);
        setFlag('chapter4_step', newStep);
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

    // SCENARIO: Transition - Tóm tắt từ Chapter 3
    if (scenario === 'transition') {
        if (step === 0) {
            const text = `⏳ 10 năm nữa đã trôi qua...

👶 Con bạn giờ đã lớn, đang học cấp 2.

📈 Sự nghiệp của bạn cũng đạt đến đỉnh cao...`;

            if (step === 0) {
                const text = `⏳ 10 năm nữa đã trôi qua...

👶 Con bạn giờ đã lớn, đang học cấp 2.

📈 Sự nghiệp của bạn cũng đạt đến đỉnh cao...`;

                return (
                    <SceneBackground sceneKey="chapter4_career_peak">
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
                const text = `💼 Bạn là một trong những người giỏi nhất công ty...

🎯 Cơ hội thăng chức lớn đang đến...

⚖️ Nhưng điều đó cũng đồng nghĩa với việc bạn phải hy sinh nhiều hơn...`;

                return (
                    <SceneBackground sceneKey="chapter4_career_peak">
                        <StatsPanel />
                        <div className="dialogue-box">
                            <h2 className="speaker-name">Narrator</h2>
                            <div className="dialogue-content">
                                <Typewriter text={text} onComplete={() => setStep(2)} />
                            </div>
                        </div>
                    </SceneBackground>
                );
            }

            if (step === 2) {
                const text = `🌙 Đêm nay, trong giấc mơ quen thuộc...

Bà Tiên Duyên lại xuất hiện, nhưng vẻ mặt bà có chút lo lắng...`;

                return (
                    <SceneBackground sceneKey="dream">
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
                const text = `${state.player.name} ơi, con đã đi được nửa cuộc đời rồi...

Thời gian trôi nhanh lắm, con ơi!

Hãy cẩn thận với những quyết định ở tuổi trung niên nhé...

Đừng để sau này phải hối tiếc như... như ta đã từng...

À không, ý ta là như bao người khác.`;

                return (
                    <SceneBackground sceneKey="dream">
                        <StatsPanel />
                        <div className="character-container">
                            <img src="/src/assets/characters/bà_tiên_duyên_lo_lắng.png" alt="Bà Tiên Duyên" className="character-sprite left" />
                        </div>
                        <div className="dialogue-box">
                            <h2 className="speaker-name">Bà Tiên Duyên</h2>
                            <div className="dialogue-content">
                                <Typewriter text={text} onComplete={() => setStep(4)} />
                            </div>
                        </div>
                    </SceneBackground>
                );
            }

            if (step === 4) {
                const text = `Sự nghiệp quan trọng, nhưng sức khỏe và gia đình cũng quan trọng không kém...

Đừng để khi có tiền thì không còn sức khỏe...

Đừng để khi thành công thì gia đình đã xa...

Hãy cân bằng nhé con!`;

                return (
                    <SceneBackground sceneKey="dream">
                        <StatsPanel />
                        <div className="character-container">
                            <img src="/src/assets/characters/bà_tiên_duyên_nghiêm_túc.png" alt="Bà Tiên Duyên" className="character-sprite left" />
                        </div>
                        <div className="dialogue-box">
                            <h2 className="speaker-name">Bà Tiên Duyên</h2>
                            <div className="dialogue-content">
                                <Typewriter text={text} onComplete={() => setStep(5)} />
                            </div>
                        </div>
                    </SceneBackground>
                );
            }

            if (step === 5) {
                const text = `💤 Bạn tỉnh dậy với cảm giác lo lắng...

⏰ 45 tuổi - Thời điểm quan trọng của cuộc đời.

Những quyết định tiếp theo sẽ định hình phần còn lại của cuộc sống...`;

                return (
                    <SceneBackground sceneKey="chapter4_child_talk">
                        <StatsPanel />
                        <div className="dialogue-box">
                            <h2 className="speaker-name">Narrator</h2>
                            <div className="dialogue-content">
                                <Typewriter text={text} onComplete={() => {
                                    setScenario('career_peak');
                                    setStep(0);
                                }} />
                            </div>
                        </div>
                    </SceneBackground>
                );
            }
        }

        // SCENARIO: Đỉnh cao sự nghiệp
        if (scenario === 'career_peak') {
            if (step === 0) {
                return (
                    <SceneBackground sceneKey="chapter4_career_peak">
                        <StatsPanel />
                        <div className="dialogue-box fade-in">
                            <h2 className="speaker-name">Narrator</h2>
                            <div className="dialogue-content">
                                <Typewriter
                                    text={`📅 45 tuổi - Trung niên

Bạn đã làm việc 20 năm...

Đây là thời kỳ đỉnh cao sự nghiệp...`}
                                    onComplete={() => { }}
                                />

                            </div>
                        </div>
                    </SceneBackground>
                );
            }

            if (step === 1) {
                return (
                    <SceneBackground sceneKey="chapter4_career_peak">
                        <StatsPanel />
                        <div className="character-container">
                            <img src="/src/assets/characters/sếp_vui_vẻ.png" alt="Sếp" className="character-sprite left" />
                        </div>
                        <div className="dialogue-box fade-in">
                            <h2 className="speaker-name">Sếp</h2>
                            <div className="dialogue-content">
                                <Typewriter
                                    text={`Anh/Chị ${state.player.name}!

Công ty quyết định thăng chức anh/chị lên Giám đốc!

Lương tăng gấp đôi, nhưng công việc sẽ bận hơn!`}
                                    onComplete={() => { }}
                                />

                            </div>
                        </div>
                    </SceneBackground>
                );
            }

            if (step === 2) {
                return (
                    <SceneBackground sceneKey="chapter4_career_peak">
                        <StatsPanel />
                        <div className="character-container">
                            <img src={getPlayerSprite('thích_thú')} alt={state.player.name} className="character-sprite right" />
                        </div>
                        <div className="dialogue-box fade-in">
                            <h2 className="speaker-name">{state.player.name}</h2>
                            <div className="dialogue-content">
                                <Typewriter
                                    text="Cảm ơn sếp! Tôi sẽ cố gắng hết sức!"
                                    onComplete={() => { }}
                                />

                            </div>
                        </div>
                    </SceneBackground>
                );
            }
        }

        // SCENARIO: Cân bằng công việc và gia đình
        if (scenario === 'work_life_balance') {
            if (step === 0) {
                return (
                    <SceneBackground sceneKey="chapter4_work_late">
                        <StatsPanel />
                        <div className="dialogue-box fade-in">
                            <h2 className="speaker-name">Narrator</h2>
                            <div className="dialogue-content">
                                <Typewriter
                                    text={`📅 3 tháng sau...

Công việc ngày càng bận rộn...

Bạn thường xuyên về nhà muộn...`}
                                    onComplete={() => { }}
                                />

                            </div>
                        </div>
                    </SceneBackground>
                );
            }

            if (step === 1) {
                const origin = state.player.origin;

                // RICH ORIGIN - Con đòi hỏi nhiều hơn
                if (origin === 'rich') {
                    return (
                        <SceneBackground sceneKey="chapter4_home_conflict">
                            <StatsPanel />
                            <div className="character-container">
                                <img src="/src/assets/characters/con_nóng_giận.png" alt="Con" className="character-sprite left" />
                            </div>
                            <div className="dialogue-box fade-in">
                                <h2 className="speaker-name">Con (12 tuổi)</h2>
                                <div className="dialogue-content">
                                    <Typewriter
                                        text={`Bố/Mẹ ơi! Bố/Mẹ chỉ biết làm việc!

Bạn con ai cũng có bố mẹ đưa đi chơi!

Bố/Mẹ giàu mà không dành thời gian cho con! Con ghét bố/mẹ! 😠`}
                                        onComplete={() => { }}
                                    />

                                </div>
                            </div>
                        </SceneBackground>
                    );
                }

                // NORMAL ORIGIN - Con buồn nhưng hiểu
                if (origin === 'normal') {
                    return (
                        <SceneBackground sceneKey="chapter4_home_conflict">
                            <StatsPanel />
                            <div className="character-container">
                                <img src="/src/assets/characters/con_buồn.png" alt="Con" className="character-sprite left" />
                            </div>
                            <div className="dialogue-box fade-in">
                                <h2 className="speaker-name">Con (12 tuổi)</h2>
                                <div className="dialogue-content">
                                    <Typewriter
                                        text={`Bố/Mẹ ơi... Sao bố/mẹ về muộn hoài vậy? 😢

Con nhớ bố/mẹ lắm...

Bố/Mẹ không có thời gian chơi với con nữa...`}
                                        onComplete={() => { }}
                                    />

                                </div>
                            </div>
                        </SceneBackground>
                    );
                }

                // POOR ORIGIN - Con hiểu và tự lập
                if (origin === 'poor') {
                    return (
                        <SceneBackground sceneKey="chapter4_home_conflict">
                            <StatsPanel />
                            <div className="character-container">
                                <img src="/src/assets/characters/con_nghiêm_túc.png" alt="Con" className="character-sprite left" />
                            </div>
                            <div className="dialogue-box fade-in">
                                <h2 className="speaker-name">Con (12 tuổi)</h2>
                                <div className="dialogue-content">
                                    <Typewriter
                                        text={`Bố/Mẹ ơi... Con biết bố/mẹ làm việc vất vả...

Con sẽ tự làm bài tập, không làm phiền bố/mẹ...

Bố/Mẹ nghỉ ngơi đi ạ... 😊`}
                                        onComplete={() => { }}
                                    />

                                </div>
                            </div>
                        </SceneBackground>
                    );
                }
            }

            // Step 1.5: Phản ứng của player
            if (step === 1.5) {
                const origin = state.player.origin;

                // RICH ORIGIN
                if (origin === 'rich') {
                    return (
                        <SceneBackground sceneKey="chapter4_home_conflict">
                            <StatsPanel />
                            <div className="character-container">
                                <img src={getPlayerSprite('buồn')} alt={state.player.name} className="character-sprite right" />
                            </div>
                            <div className="dialogue-box fade-in">
                                <h2 className="speaker-name">{state.player.name}</h2>
                                <div className="dialogue-content">
                                    <Typewriter
                                        text={`(Suy nghĩ)

Con mình... Con mình ghét mình...

Mình đang lặp lại sai lầm của bố mẹ mình... 😢`}
                                        onComplete={() => { }}
                                    />

                                </div>
                            </div>
                        </SceneBackground>
                    );
                }

                // POOR ORIGIN
                if (origin === 'poor') {
                    return (
                        <SceneBackground sceneKey="chapter4_home_conflict">
                            <StatsPanel />
                            <div className="character-container">
                                <img src={getPlayerSprite('vui_vẻ')} alt={state.player.name} className="character-sprite right" />
                            </div>
                            <div className="dialogue-box fade-in">
                                <h2 className="speaker-name">{state.player.name}</h2>
                                <div className="dialogue-content">
                                    <Typewriter
                                        text={`(Suy nghĩ)

Con mình... Con mình hiểu mình...

Mình may mắn có con ngoan như vậy... 😊`}
                                        onComplete={() => { }}
                                    />

                                </div>
                            </div>
                        </SceneBackground>
                    );
                }
            }

            if (step === 2) {
                return (
                    <SceneBackground sceneKey="chapter4_home_conflict">
                        <StatsPanel />
                        <div className="character-container">
                            <img src={getPlayerSprite('lo_lắng')} alt={state.player.name} className="character-sprite right" />
                        </div>
                        <div className="dialogue-box fade-in">
                            <h2 className="speaker-name">{state.player.name}</h2>
                            <div className="dialogue-content">
                                <Typewriter
                                    text={`Con ơi... Bố/Mẹ xin lỗi...

Bố/Mẹ bận làm việc để kiếm tiền cho con...

(Suy nghĩ) Mình có đang đánh mất gia đình?`}
                                    onComplete={() => { }}
                                />

                            </div>
                        </div>
                    </SceneBackground>
                );
            }

            if (step === 3) {
                return (
                    <SceneBackground sceneKey="chapter4_home_conflict">
                        <StatsPanel />
                        <div className="character-container">
                            <img src={`/src/assets/characters/${partner}_lo_lắng.png`} alt={partnerName} className="character-sprite left" />
                        </div>
                        <div className="dialogue-box fade-in">
                            <h2 className="speaker-name">{partnerName}</h2>
                            <div className="dialogue-content">
                                <Typewriter
                                    text={`Anh/Em ơi... Em/Anh thấy anh/em thay đổi rồi...
                                    
Anh/Em chỉ lo công việc, không còn quan tâm gia đình...
                                    
Con cũng buồn lắm...`}
                                    onComplete={() => { }}
                                />

                            </div>
                        </div>
                    </SceneBackground>
                );
            }
        }

        // SCENARIO: Mini-game Cân bằng cuộc sống
        if (scenario === 'work_balance_game') {
            const handleGameComplete = (result) => {
                if (result.bonusStats) {
                    updateStats(result.bonusStats);
                }
                // Continue to decision
                setScenario('balance_choice');
            };

            return (
                <SceneBackground sceneKey="dream">
                    <WorkBalanceGame onComplete={handleGameComplete} />
                </SceneBackground>
            );
        }

        // CHOICE: Cân bằng công việc và gia đình
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
                    <div className="dialogue-box fade-in">
                        <h2 className="speaker-name">Bà Tiên Duyên ✨</h2>
                        <div className="dialogue-content">
                            <Typewriter
                                text={`Sự nghiệp hay gia đình?

Đây là câu hỏi khó của tuổi trung niên...

Hãy chọn khôn ngoan...`}
                                onComplete={() => { }}
                            />

                        </div>
                    </div>
                </SceneBackground>
            );
        }

        // SCENARIO: Khủng hoảng sức khỏe
        if (scenario === 'health_crisis') {
            if (step === 0) {
                return (
                    <SceneBackground sceneKey="chapter4_work_late">
                        <StatsPanel />
                        <div className="dialogue-box fade-in">
                            <h2 className="speaker-name">Narrator</h2>
                            <div className="dialogue-content">
                                <Typewriter
                                    text={`📅 50 tuổi - 5 năm sau

Bạn đột nhiên cảm thấy đau ngực...

Stress công việc đã ảnh hưởng đến sức khỏe...`}
                                    onComplete={() => { }}
                                />

                            </div>
                        </div>
                    </SceneBackground>
                );
            }

            if (step === 1) {
                return (
                    <SceneBackground sceneKey="chapter3_hospital">
                        <StatsPanel />
                        <div className="character-container">
                            <img src="/src/assets/characters/bác_sĩ_nghiêm_túc.png" alt="Bác sĩ" className="character-sprite left" />
                        </div>
                        <div className="dialogue-box fade-in">
                            <h2 className="speaker-name">Bác sĩ</h2>
                            <div className="dialogue-content">
                                <Typewriter
                                    text={`Anh/Chị bị huyết áp cao, cholesterol cao...

Nếu không thay đổi lối sống, rất nguy hiểm!

Anh/Chị cần nghỉ ngơi, ăn uống lành mạnh, tập thể dục!`}
                                    onComplete={() => { }}
                                />

                            </div>
                        </div>
                    </SceneBackground>
                );
            }
        }

        // SCENARIO: Kết thúc Chapter 4
        if (scenario === 'chapter_end') {
            const choice = state.flags.balance_choice || 'balanced';

            if (step === 0) {
                const choiceText = choice === 'career_focus'
                    ? 'Ngươi đã chọn sự nghiệp... Nhưng đã mất đi nhiều thứ...'
                    : choice === 'family_focus'
                        ? 'Ngươi đã chọn gia đình... Đó là quyết định đúng đắn...'
                        : 'Ngươi đã cố gắng cân bằng... Đó là điều khó khăn nhất...';

                return (
                    <SceneBackground sceneKey="dream">
                        <StatsPanel />
                        <div className="character-container">
                            <img src="/src/assets/characters/bà_tiên_nghiêm_túc.png" alt="Bà Tiên" className="character-sprite left" />
                        </div>
                        <div className="dialogue-box fade-in">
                            <h2 className="speaker-name">Bà Tiên Duyên ✨</h2>
                            <div className="dialogue-content">
                                <Typewriter
                                    text={`Tuổi trung niên là thời kỳ khó khăn...

${choiceText}

Giờ đây, ngươi bước vào tuổi già... Hãy tận hưởng những năm tháng còn lại...`}
                                    onComplete={() => { }}
                                />

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
                            text="Chapter 4 đang được phát triển..."
                            onComplete={() => { }}
                        />

                    </div>
                </div>
            </SceneBackground>
        );
    }
}
