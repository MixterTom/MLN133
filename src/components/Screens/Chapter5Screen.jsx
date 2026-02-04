import { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import StatsPanel from '../UI/StatsPanel';
import StatChangeNotification from '../UI/StatChangeNotification';
import SceneBackground from '../Common/SceneBackground';
import Typewriter from '../Common/Typewriter';

import StudyGroupGame from '../MiniGames/StudyGroupGame';
import MemoryLaneGame from '../MiniGames/MemoryLaneGame';
import './PrologueScreen.css';

export default function Chapter5Screen() {
    const { state, updateStats, setScreen, addChoice, setFlag } = useGame();
    const [showStatChange, setShowStatChange] = useState(false);
    const [statChanges, setStatChanges] = useState({});

    const [scenario, setScenarioState] = useState(state.flags.chapter5_scenario || 'transition');
    const [step, setStepState] = useState(state.flags.chapter5_step || 0);



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
        return `/assets/characters/${gender}_${emotion}.png`;
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
                            <Typewriter text={text} onComplete={() => setStep(1)} />
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
                            <Typewriter text={text} onComplete={() => setStep(2)} />
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
                            <Typewriter text={text} onComplete={() => setStep(3)} />
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
                        <img src="/assets/characters/bà_tiên_duyên_vui_vẻ.png" alt="Bà Tiên Duyên" className="character-sprite left" />
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
            const text = `Cuộc đời là một chuỗi các lựa chọn...

Không có lựa chọn nào đúng hay sai tuyệt đối...

Chỉ có những lựa chọn phù hợp với con người mình!

Hãy nhìn lại và trân trọng những gì con đã có nhé!`;

            return (
                <SceneBackground sceneKey="dream">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/assets/characters/bà_tiên_duyên_hạnh_phúc.png" alt="Bà Tiên Duyên" className="character-sprite left" />
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
            const text = `💤 Bạn tỉnh dậy với nụ cười trên môi...

Hôm nay là ngày cuối cùng đi làm - ngày nghỉ hưu chính thức.

Một chương mới của cuộc đời sắp bắt đầu...`;

            return (
                <SceneBackground sceneKey="chapter5_retirement">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            <Typewriter text={text} onComplete={() => {
                                setScenario('retirement');
                                setStep(0);
                            }} />
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
                                onComplete={() => { }}
                            />

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
                        <img src="/assets/characters/sếp_vui_vẻ.png" alt="Sếp" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box fade-in">
                        <h2 className="speaker-name">Sếp</h2>
                        <div className="dialogue-content">
                            <Typewriter
                                text={`Anh/Chị ${state.player.name}!

Cảm ơn anh/chị đã cống hiến 35 năm cho công ty!

Chúc anh/chị nghỉ hưu vui vẻ, sức khỏe dồi dào!`}
                                onComplete={() => { }}
                            />

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
                                onComplete={() => { }}
                            />

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
                                onComplete={() => { }}
                            />

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
                                    onComplete={() => { }}
                                />

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
                                    onComplete={() => { }}
                                />

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
                <SceneBackground sceneKey="chapter5_reflection">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={`/assets/characters/${partner}_nghiêm_túc.png`} alt={partnerName} className="character-sprite left" />
                    </div>
                    <div className="dialogue-box fade-in">
                        <h2 className="speaker-name">{partnerName}</h2>
                        <div className="dialogue-content">
                            <Typewriter
                                text={`Anh/Em ơi... Em/Anh đang nghĩ gì vậy?

Anh/Em trông buồn quá...`}
                                onComplete={() => { }}
                            />

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
                                onComplete={() => { }}
                            />

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
                                onComplete={() => { }}
                            />

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
                        <img src="/assets/characters/con_vui_vẻ.png" alt="Con" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box fade-in">
                        <h2 className="speaker-name">Con (30 tuổi)</h2>
                        <div className="dialogue-content">
                            <Typewriter
                                text={`Bố/Mẹ ơi! Con về thăm!

Bố/Mẹ khỏe không?`}
                                onComplete={() => { }}
                            />

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
                                onComplete={() => { }}
                            />

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
                        <img src="/assets/characters/con_vui_vẻ.png" alt="Con" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box fade-in">
                        <h2 className="speaker-name">Con</h2>
                        <div className="dialogue-content">
                            <Typewriter
                                text={`Con làm tốt lắm! Công ty vừa thăng chức con!

Nhờ bố/mẹ dạy con từ nhỏ, con mới thành công được!

Con cảm ơn bố/mẹ!`}
                                onComplete={() => { }}
                            />

                        </div>
                    </div>
                </SceneBackground>
            );
        }
    }

    // CALCULATE SPECIFIC ENDING based on all choices
    const calculateSpecificEnding = () => {
        const origin = state.player.origin; // 'rich', 'normal', 'poor'
        const education = state.flags.education_path || 'university'; // 'university', 'work_early', 'study_abroad'
        const partner = state.flags.partner || 'hung'; // 'minh', 'trang', 'hung', 'khanh', 'bich'
        const parents = state.flags.parents_choice || 'old_house'; // 'new_house', 'old_house', 'send_money', 'far_house'
        const balance = state.flags.work_balance || 'balanced'; // 'career', 'balanced', 'family'

        const stats = state.player.stats;
        const avgStat = (stats.health + stats.happiness + stats.economy + stats.social + stats.knowledge) / 5;

        // 30-40 SPECIFIC ENDINGS based on combinations

        // === RICH ORIGIN ENDINGS ===
        if (origin === 'rich') {
            // Rich + Career-focused + Trang = Empire Builder (but lonely)
            if (balance === 'career' && partner === 'trang' && stats.economy >= 70) {
                return {
                    id: 'rich_empire_lonely',
                    title: '🏢 Đế Chế Cô Đơn',
                    description: `Bạn và ${partner === 'trang' ? 'Trang' : 'người bạn đời'} đã xây dựng một đế chế kinh doanh khổng lồ.\n\nNhưng con cái xa cách, bố mẹ đã mất mà bạn không kịp về...\n\nBạn có tất cả... nhưng không có ai.\n\n"Tiền bạc không mua được hạnh phúc..."`,
                    stats: { economy: 90, happiness: 20, social: 30 }
                };
            }

            // Rich + Family-focused + Minh = Redemption (gave up wealth for love)
            if (balance === 'family' && partner === 'minh' && stats.happiness >= 60) {
                return {
                    id: 'rich_redemption_love',
                    title: '💕 Chuộc Lỗi Bằng Tình Yêu',
                    description: `Sinh ra giàu có, nhưng bạn chọn tình yêu chân thành với Minh.\n\nBạn từ bỏ áp lực gia đình, sống giản đơn nhưng hạnh phúc.\n\nCon cái yêu thương, gia đình đầm ấm.\n\n"Cuối cùng mình cũng tìm được hạnh phúc thật sự..."`,
                    stats: { economy: 40, happiness: 85, social: 70 }
                };
            }

            // Rich + Balanced + Parents (new house) = Debt Hell
            if (parents === 'new_house' && stats.economy < 40) {
                return {
                    id: 'rich_debt_hell',
                    title: '💸 Địa Ngục Nợ Nần',
                    description: `Sinh ra giàu nhưng bạn đã mua nhà quá lớn để làm vừa lòng bố mẹ.\n\nNợ nần chồng chất, áp lực tài chính khủng khiếp.\n\nVợ/chồng ly hôn, con cái oán trách.\n\n"Mình đã sai khi cố gắng làm vừa lòng tất cả mọi người..."`,
                    stats: { economy: 20, happiness: 15, social: 25 }
                };
            }

            // Rich + Study abroad + Career = International Success
            if (education === 'study_abroad' && balance === 'career' && stats.knowledge >= 70) {
                return {
                    id: 'rich_international_success',
                    title: '🌍 Thành Công Quốc Tế',
                    description: `Du học, thành công rực rỡ trên trường quốc tế.\n\nCEO công ty đa quốc gia, giàu có và quyền lực.\n\nNhưng xa gia đình, xa quê hương...\n\n"Mình đã thành công... nhưng mình có hạnh phúc không?"`,
                    stats: { economy: 95, happiness: 40, knowledge: 90 }
                };
            }
        }

        // === NORMAL ORIGIN ENDINGS ===
        if (origin === 'normal') {
            // Normal + University + Hung + Balanced = Perfect Balance
            if (education === 'university' && partner === 'hung' && balance === 'balanced' && avgStat >= 50) {
                return {
                    id: 'normal_perfect_balance',
                    title: '⚖️ Cuộc Sống Cân Bằng Hoàn Hảo',
                    description: `Sinh ra bình thường, bạn đã tạo ra một cuộc sống cân bằng tuyệt vời.\n\nVợ/chồng yêu thương, con cái hiếu thảo, công việc ổn định.\n\nKhông giàu có nhưng rất hạnh phúc.\n\n"Đây chính là cuộc sống mà mình luôn mơ ước..."`,
                    stats: { economy: 55, happiness: 80, health: 75, social: 70 }
                };
            }

            // Normal + Work early + Family = Self-Made Success
            if (education === 'work_early' && balance === 'family' && stats.economy >= 60) {
                return {
                    id: 'normal_selfmade_success',
                    title: '💪 Tự Lập Thành Công',
                    description: `Không học đại học nhưng bạn đã tự lập thành công.\n\nTừ công nhân lên quản lý, nuôi gia đình ấm no.\n\nCon cái tự hào về bố/mẹ.\n\n"Mình đã chứng minh: Không cần bằng cấp vẫn thành công được!"`,
                    stats: { economy: 65, happiness: 75, social: 60 }
                };
            }

            // Normal + Minh + Poor choices = Love Conquers Poverty
            if (partner === 'minh' && stats.economy < 40 && stats.happiness >= 60) {
                return {
                    id: 'normal_love_conquers_poverty',
                    title: '❤️ Tình Yêu Chiến Thắng Nghèo Khó',
                    description: `Cuộc sống khó khăn, nhưng tình yêu với Minh vượt qua tất cả.\n\nNghèo nhưng hạnh phúc, con cái hiểu chuyện.\n\nGia đình gắn bó, yêu thương nhau.\n\n"Nghèo nhưng mình có nhau, đó là điều quan trọng nhất..."`,
                    stats: { economy: 30, happiness: 80, social: 65 }
                };
            }

            // Normal + Trang + Career = Burnout
            if (partner === 'trang' && balance === 'career' && stats.health < 40) {
                return {
                    id: 'normal_burnout_divorce',
                    title: '😰 Kiệt Sức Và Ly Hôn',
                    description: `Cố gắng theo kịp Trang giàu có, bạn đã làm việc quá sức.\n\nSức khỏe suy kiệt, Trang ly hôn vì bạn không còn thời gian.\n\nCon cái xa cách, bạn cô đơn.\n\n"Mình đã mất tất cả vì cố gắng trở thành người mình không phải..."`,
                    stats: { economy: 45, happiness: 20, health: 25 }
                };
            }
        }

        // === POOR ORIGIN ENDINGS ===
        if (origin === 'poor') {
            // Poor + University (scholarship) + Career = Rags to Riches
            if (education === 'university' && balance === 'career' && stats.economy >= 70) {
                return {
                    id: 'poor_rags_to_riches',
                    title: '🎓 Từ Nghèo Khó Đến Thành Công',
                    description: `Sinh ra nghèo, nhưng bạn đã vươn lên bằng học vấn và nỗ lực.\n\nTừ học bổng đến CEO, bạn đã thay đổi số phận.\n\nBố mẹ tự hào, con cái được học trường tốt.\n\n"Mình đã làm được! Mình đã thoát nghèo!"`,
                    stats: { economy: 75, happiness: 70, knowledge: 80 }
                };
            }

            // Poor + Work early + Family = Struggle but United
            if (education === 'work_early' && balance === 'family' && stats.happiness >= 60) {
                return {
                    id: 'poor_struggle_united',
                    title: '👨‍👩‍👧‍👦 Khó Khăn Nhưng Đoàn Kết',
                    description: `Cuộc sống vẫn khó khăn, nhưng gia đình luôn bên nhau.\n\nBố mẹ già được chăm sóc, con cái hiểu chuyện.\n\nNghèo nhưng hạnh phúc, gắn bó.\n\n"Nghèo không sao, miễn là gia đình luôn bên nhau..."`,
                    stats: { economy: 35, happiness: 75, social: 70 }
                };
            }

            // Poor + Trang + Career = Class Conflict
            if (partner === 'trang' && stats.social < 40) {
                return {
                    id: 'poor_class_conflict',
                    title: '💔 Xung Đột Giai Cấp',
                    description: `Yêu Trang giàu có, nhưng chênh lệch giai cấp quá lớn.\n\nGia đình Trang coi thường, bạn tự ti.\n\nCuối cùng ly hôn, bạn trở về với nghèo khó.\n\n"Mình đã sai khi nghĩ tình yêu có thể vượt qua mọi rào cản..."`,
                    stats: { economy: 25, happiness: 20, social: 15 }
                };
            }

            // Poor + Parents (send money) + Regret = Eternal Regret
            if (parents === 'send_money' && stats.happiness < 40) {
                return {
                    id: 'poor_eternal_regret',
                    title: '😢 Hối Hận Suốt Đời',
                    description: `Thoát nghèo nhưng bạn đã gửi bố mẹ về quê.\n\nBố mẹ mất khi bạn không kịp về.\n\nHối hận suốt đời vì không ở bên bố mẹ lúc cuối.\n\n"Mình đã đánh mất điều quan trọng nhất để đổi lấy tiền bạc..."`,
                    stats: { economy: 60, happiness: 25, social: 30 }
                };
            }

            // Poor + Minh + Family = True Happiness
            if (partner === 'minh' && balance === 'family' && stats.happiness >= 70) {
                return {
                    id: 'poor_true_happiness',
                    title: '😊 Hạnh Phúc Chân Thật',
                    description: `Nghèo nhưng bạn đã tìm được hạnh phúc với Minh.\n\nCuộc sống giản đơn, gia đình ấm áp.\n\nCon cái hiểu chuyện, bố mẹ được chăm sóc.\n\n"Mình không giàu, nhưng mình có tất cả những gì cần thiết..."`,
                    stats: { economy: 35, happiness: 85, social: 75 }
                };
            }
        }

        // === GENERIC ENDINGS based on stats ===

        // All stats high = Perfect Life
        if (avgStat >= 70) {
            return {
                id: 'perfect_life',
                title: '🌟 Cuộc Đời Hoàn Hảo',
                description: `Bạn đã cân bằng tất cả mọi thứ một cách hoàn hảo.\n\nGiàu có, hạnh phúc, khỏe mạnh, có bạn bè và kiến thức.\n\nĐây là cuộc sống mà ai cũng mơ ước.\n\n"Mình đã làm được... Mình đã sống một cuộc đời không hối tiếc..."`,
                stats: { economy: 80, happiness: 85, health: 80, social: 75, knowledge: 80 }
            };
        }

        // Economy high but happiness low = Rich but Miserable
        if (stats.economy >= 70 && stats.happiness < 40) {
            return {
                id: 'rich_miserable',
                title: '💰 Giàu Có Nhưng Bất Hạnh',
                description: `Bạn đã thành công về mặt tài chính.\n\nNhưng bạn đã mất đi gia đình, bạn bè, sức khỏe.\n\nTiền bạc không thể mua được hạnh phúc.\n\n"Mình có tất cả... nhưng mình không có gì cả..."`,
                stats: { economy: 85, happiness: 25, health: 40 }
            };
        }

        // Happiness high but economy low = Poor but Happy
        if (stats.happiness >= 70 && stats.economy < 40) {
            return {
                id: 'poor_happy',
                title: '😊 Nghèo Nhưng Hạnh Phúc',
                description: `Cuộc sống khó khăn về mặt tài chính.\n\nNhưng bạn có gia đình ấm áp, bạn bè thân thiết.\n\nHạnh phúc không đến từ tiền bạc.\n\n"Mình nghèo, nhưng mình rất hạnh phúc..."`,
                stats: { economy: 30, happiness: 80, social: 75 }
            };
        }

        // All stats low = Failed Life
        if (avgStat < 35) {
            return {
                id: 'failed_life',
                title: '😢 Cuộc Đời Thất Bại',
                description: `Mọi thứ đều sai lầm...\n\nNghèo khó, bất hạnh, bệnh tật, cô đơn.\n\nBạn hối hận về mọi quyết định đã đưa ra.\n\n"Nếu được quay lại... mình sẽ chọn khác..."`,
                stats: { economy: 20, happiness: 15, health: 25, social: 20 }
            };
        }

        // Health low = Sick and Regretful
        if (stats.health < 30) {
            return {
                id: 'sick_regretful',
                title: '🏥 Bệnh Tật Và Hối Hận',
                description: `Bạn đã làm việc quá sức, bỏ bê sức khỏe.\n\nGiờ đây bệnh tật hành hạ, không còn thời gian tận hưởng.\n\nTiền bạc có nhiều nhưng sức khỏe không còn.\n\n"Sức khỏe mới là tài sản quý giá nhất..."`,
                stats: { economy: 60, happiness: 30, health: 20 }
            };
        }

        // Social low = Lonely Success
        if (stats.social < 30 && stats.economy >= 60) {
            return {
                id: 'lonely_success',
                title: '🚶 Thành Công Cô Đơn',
                description: `Bạn đã thành công nhưng không có ai bên cạnh.\n\nKhông có bạn bè, gia đình xa cách.\n\nThành công nhưng cô đơn.\n\n"Thành công có ý nghĩa gì khi không có ai chia sẻ?"`,
                stats: { economy: 70, happiness: 35, social: 20 }
            };
        }

        // Balanced but mediocre = Ordinary Life
        if (avgStat >= 40 && avgStat < 60) {
            return {
                id: 'ordinary_life',
                title: '🏠 Cuộc Sống Bình Thường',
                description: `Cuộc sống của bạn không có gì đặc biệt.\n\nKhông giàu, không nghèo, không quá hạnh phúc, không quá buồn.\n\nMột cuộc sống bình thường của đa số người.\n\n"Cuộc sống bình thường... cũng là một loại hạnh phúc..."`,
                stats: { economy: 50, happiness: 50, health: 50, social: 50 }
            };
        }

        // Default ending
        return {
            id: 'default_ending',
            title: '🌅 Kết Thúc Hành Trình',
            description: `60 năm đã trôi qua...\n\nBạn đã trải qua nhiều thăng trầm.\n\nCó vui, có buồn, có thành công, có thất bại.\n\n"Đây là cuộc đời của mình... Và mình đã sống hết mình..."`,
            stats: state.player.stats
        };
    };

    // SCENARIO: Kết thúc game - SHOW SPECIFIC ENDING
    if (scenario === 'ending') {
        const ending = calculateSpecificEnding();

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
                                onComplete={() => { }}
                            />

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
                                onComplete={() => { }}
                            />

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
                                onComplete={() => { }}
                            />

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
                                onComplete={() => { }}
                            />

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
                                onComplete={() => { }}
                            />

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
                                onComplete={() => { }}
                            />

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
                                onComplete={() => { }}
                            />

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
                                onComplete={() => { }}
                            />

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
                                onComplete={() => { }}
                            />

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
                        <img src="/assets/characters/bà_tiên_duyên_vui_vẻ.png" alt="Bà Tiên Duyên" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box fade-in">
                        <h2 className="speaker-name">Bà Tiên Duyên ✨</h2>
                        <div className="dialogue-content">
                            <Typewriter
                                text={`${state.player.name}...

Đúng vậy. Ta chính là CON.

Ta là ${state.player.name} từ 20 năm sau, đã quay về quá khứ để hướng dẫn chính mình...

Để tránh những sai lầm... Để sống một cuộc đời không hối tiếc...`}
                                onComplete={() => { }}
                            />

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
                        <img src="/assets/characters/bà_tiên_duyên_nghiêm_túc.png" alt="Bà Tiên Duyên" className="character-sprite left" />
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
                                onComplete={() => { }}
                            />

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
                        <img src="/assets/characters/bà_tiên_duyên_lo_lắng.png" alt="Bà Tiên Duyên" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box fade-in">
                        <h2 className="speaker-name">Bà Tiên Duyên (Tương lai của bạn)</h2>
                        <div className="dialogue-content">
                            <Typewriter
                                text={`Nhưng trước khi quyết định...\n\nHãy nhìn lại cuộc đời con đã sống...\n\nĐây là kết quả của tất cả những lựa chọn con đã đưa ra...`}
                                onComplete={() => { }}
                            />

                        </div>
                    </div>
                </SceneBackground>
            );
        }

        // Step 11.5: SHOW SPECIFIC ENDING
        if (step === 11.5) {
            return (
                <SceneBackground sceneKey="chapter5_reflection">
                    <StatsPanel />
                    <div className="dialogue-box fade-in" style={{
                        backgroundColor: ending.stats.happiness >= 70 ? 'rgba(255, 215, 0, 0.2)' :
                            ending.stats.happiness < 40 ? 'rgba(255, 0, 0, 0.2)' :
                                'rgba(135, 206, 250, 0.2)',
                        borderColor: ending.stats.happiness >= 70 ? 'gold' :
                            ending.stats.happiness < 40 ? 'red' :
                                'skyblue'
                    }}>
                        <h2 className="speaker-name">📖 {ending.title}</h2>
                        <div className="dialogue-content">
                            <Typewriter
                                text={ending.description}
                                onComplete={() => { }}
                            />

                        </div>
                    </div>
                </SceneBackground>
            );
        }

        // Step 12: Bà Tiên hỏi lựa chọn cuối
        if (step === 12) {
            return (
                <SceneBackground sceneKey="dream">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/assets/characters/bà_tiên_duyên_nghiêm_túc.png" alt="Bà Tiên Duyên" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box fade-in">
                        <h2 className="speaker-name">Bà Tiên Duyên (Tương lai của bạn)</h2>
                        <div className="dialogue-content">
                            <Typewriter
                                text={`Đây là cuộc đời con đã sống...\n\nGiờ đây, con có quyền lựa chọn...\n\nCon có thể TIẾP NỐI VÒNG LẶP - trở thành Bà Tiên Duyên và hướng dẫn bản thân trẻ tuổi...\n\nHoặc con có thể PHÁ VỠ VÒNG LẶP - sống tự do, để bản thân trẻ tuổi tự tìm đường đi...\n\nCon sẽ chọn gì?`}
                                onComplete={() => { }}
                            />

                        </div>
                    </div>
                </SceneBackground>
            );
        }

        // === ENDING A: TIẾP NỐI VÒNG LẶP ===
        if (step === 13) {
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
                                onComplete={() => { }}
                            />

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
                        <img src="/assets/characters/bà_tiên_duyên_vui_vẻ.png" alt="Bà Tiên Duyên" className="character-sprite left" />
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
                                onComplete={() => { }}
                            />

                        </div>
                    </div>
                </SceneBackground>
            );
        }

        // TRUE ENDING
        if (step === 15) {
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
                                onComplete={() => { }}
                            />

                        </div>
                    </div>
                </SceneBackground>
            );
        }

        // === ENDING B: PHÁ VỠ VÒNG LẶP ===
        if (step === 16) {
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
                                onComplete={() => { }}
                            />

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
                        <img src="/assets/characters/bà_tiên_duyên_buồn.png" alt="Bà Tiên Duyên" className="character-sprite left" />
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
                                onComplete={() => { }}
                            />

                        </div>
                    </div>
                </SceneBackground>
            );
        }

        if (step === 18) {
            return (
                <SceneBackground sceneKey="dream">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/assets/characters/bà_tiên_duyên_vui_vẻ.png" alt="Bà Tiên Duyên" className="character-sprite left" />
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
                                onComplete={() => { }}
                            />

                        </div>
                    </div>
                </SceneBackground>
            );
        }

        // FREEDOM ENDING
        if (step === 19) {
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
                        text="Chapter 5 đang được phát triển..."
                        onComplete={() => { }}
                    />

                </div>
            </div>
        </SceneBackground>
    );
}
