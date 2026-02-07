# Chapter 2 Screen - Code Changes Summary

## 1. IMPORTS - Thêm minigames mới

```javascript
import JobInterviewGame from '../MiniGames/JobInterviewGame';
import WorkPressureGame from '../MiniGames/WorkPressureGame';
```

## 2. INITIAL STATE - Thay đổi scenario mặc định

```javascript
// CŨ:
const [scenario, setScenarioState] = useState(state.flags.chapter2_scenario || 'transition');

// MỚI:
const [scenario, setScenarioState] = useState(state.flags.chapter2_scenario || 'graduation');
```

## 3. SCENARIO: GRADUATION (Mới - Thay thế transition)

```javascript
// SCENARIO: Tốt nghiệp đại học (22 tuổi)
if (scenario === 'graduation') {
    if (step === 0) {
        return (
            <SceneBackground sceneKey="chapter2_graduation">
                <StatsPanel />
                <div className="dialogue-box">
                    <h2 className="speaker-name">Narrator</h2>
                    <div className="dialogue-content">
                        <Typewriter text={`📅 Tháng 6/2026 - Lễ tốt nghiệp đại học

${state.player.name} đã hoàn thành 4 năm đại học...

Hôm nay là ngày nhận bằng tốt nghiệp!`} onComplete={() => setStep(1)} />
                    </div>
                </div>
            </SceneBackground>
        );
    }

    if (step === 1) {
        return (
            <SceneBackground sceneKey="chapter2_family_pressure">
                <StatsPanel />
                <div className="character-container">
                    <img src="/assets/characters/bố_vui_vẻ.png" alt="Bố" className="character-sprite left" />
                </div>
                <div className="dialogue-box">
                    <h2 className="speaker-name">Bố</h2>
                    <div className="dialogue-content">
                        <Typewriter text="Con ơi! Bố mẹ rất tự hào về con!

Con đã tốt nghiệp đại học rồi!

Giờ con định làm gì? Về quê hay ở lại thành phố?" onComplete={() => setStep(2)} />
                    </div>
                </div>
            </SceneBackground>
        );
    }

    if (step === 2) {
        return (
            <SceneBackground sceneKey="chapter2_family_pressure">
                <StatsPanel />
                <div className="character-container">
                    <img src="/assets/characters/mẹ_lo_lắng.png" alt="Mẹ" className="character-sprite left" />
                </div>
                <div className="dialogue-box">
                    <h2 className="speaker-name">Mẹ</h2>
                    <div className="dialogue-content">
                        <Typewriter text="Về quê thì bố mẹ có quen biết, dễ xin việc!

Ở thành phố thì cạnh tranh lắm con à!

Con phải suy nghĩ kỹ!" onComplete={() => setScenario('parents_call')} />
                    </div>
                </div>
            </SceneBackground>
        );
    }
}
```

## 4. SCENARIO: PARENTS_CALL (Mới - Choice nơi làm việc)

```javascript
// CHOICE: Chọn nơi làm việc
if (scenario === 'parents_call') {
    return (
        <SceneBackground sceneKey="dream">
            <StatsPanel />
            {showStatChange && (
                <StatChangeNotification changes={statChanges} onContinue={handleContinueAfterStats} />
            )}
            <div className="character-container">
                <img src="/assets/characters/bà_tiên_nghiêm_túc.png" alt="Bà Tiên" className="character-sprite left" />
            </div>
            <div className="dialogue-box">
                <h2 className="speaker-name">Bà Tiên Duyên ✨</h2>
                <div className="dialogue-content">
                    {!showChoices ? (
                        <Typewriter text="Đây là lựa chọn quan trọng...

Nơi làm việc sẽ ảnh hưởng đến cả cuộc đời ngươi!

Ngươi chọn gì?" onComplete={() => setShowChoices(true)} />
                    ) : (
                        <div className="choices-container fade-in">
                            <button className="choice-btn" onClick={() => {
                                handleChoice({ economy: 20, knowledge: 10, health: -10 }, { type: 'job_location', value: 'city' });
                                setFlag('job_location', 'city');
                                setScenario('city_job');
                                setStep(0);
                            }}>
                                <span className="choice-title">🏙️ Ở lại thành phố</span>
                                <span className="choice-desc">Làm công ty lớn, lương cao, cạnh tranh</span>
                            </button>
                            <button className="choice-btn" onClick={() => {
                                handleChoice({ economy: 10, happiness: 20, health: 10 }, { type: 'job_location', value: 'hometown' });
                                setFlag('job_location', 'hometown');
                                setScenario('hometown_job');
                                setStep(0);
                            }}>
                                <span className="choice-title">🏡 Về quê làm việc</span>
                                <span className="choice-desc">Công việc ổn định, cuộc sống yên bình</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </SceneBackground>
    );
}
```

## 5. SCENARIO: CITY_JOB (Mới - Làm việc tại thành phố)

```javascript
// SCENARIO: Làm việc tại thành phố
if (scenario === 'city_job') {
    // Step 0: Phỏng vấn
    if (step === 0) {
        const handleGameComplete = (result) => {
            if (result.bonusStats) {
                updateStats(result.bonusStats);
            }
            setFlag('job_position', result.position);
            setFlag('job_salary', result.salary);
            setStep(1);
        };

        return (
            <SceneBackground sceneKey="chapter2_office">
                <JobInterviewGame onComplete={handleGameComplete} />
            </SceneBackground>
        );
    }

    // Step 1: Kết quả phỏng vấn
    if (step === 1) {
        const position = state.flags.job_position || 'Junior';
        const salary = state.flags.job_salary || 10;

        return (
            <SceneBackground sceneKey="chapter2_office">
                <StatsPanel />
                <div className="dialogue-box">
                    <h2 className="speaker-name">Narrator</h2>
                    <div className="dialogue-content">
                        <Typewriter text={`🎉 Chúc mừng!

Bạn được nhận vào vị trí ${position}!

Lương: ${salary} triệu/tháng

Ngày đầu tiên đi làm...`} onComplete={() => setStep(2)} />
                    </div>
                </div>
            </SceneBackground>
        );
    }

    // Step 2: Ngày đầu đi làm
    if (step === 2) {
        return (
            <SceneBackground sceneKey="chapter2_office">
                <StatsPanel />
                <div className="character-container">
                    <img src="/assets/characters/sếp_nghiêm_túc.png" alt="Sếp" className="character-sprite left" />
                </div>
                <div className="dialogue-box">
                    <h2 className="speaker-name">Sếp</h2>
                    <div className="dialogue-content">
                        <Typewriter text="Chào mừng bạn đến với công ty!

Công việc ở đây rất áp lực!

Bạn phải cố gắng nhiều!" onComplete={() => setStep(3)} />
                    </div>
                </div>
            </SceneBackground>
        );
    }

    // Step 3: 6 tháng sau - Work Pressure Game
    if (step === 3) {
        return (
            <SceneBackground sceneKey="chapter2_office">
                <StatsPanel />
                <div className="dialogue-box">
                    <h2 className="speaker-name">Narrator</h2>
                    <div className="dialogue-content">
                        <Typewriter text="⏰ 6 tháng sau...

Công việc ngày càng nhiều...

Deadline chồng chất...

Bạn phải quản lý tốt công việc và sức khỏe!" onComplete={() => setStep(4)} />
                    </div>
                </div>
            </SceneBackground>
        );
    }

    // Step 4: Work Pressure Game
    if (step === 4) {
        const handleGameComplete = (result) => {
            if (result.bonusStats) {
                updateStats(result.bonusStats);
            }
            setFlag('work_outcome', result.outcome);
            setStep(5);
        };

        return (
            <SceneBackground sceneKey="chapter2_office">
                <WorkPressureGame onComplete={handleGameComplete} />
            </SceneBackground>
        );
    }

    // Step 5: Kết quả công việc
    if (step === 5) {
        const outcome = state.flags.work_outcome || 'maintain';
        let text = '';

        if (outcome === 'promoted') {
            text = `🎉 Xuất sắc!

Bạn được thăng chức lên Team Lead!

Lương tăng lên ${(state.flags.job_salary || 10) + 5} triệu!`;
        } else if (outcome === 'raise') {
            text = `👍 Tốt lắm!

Bạn được tăng lương 20%!

Lương mới: ${Math.round((state.flags.job_salary || 10) * 1.2)} triệu!`;
        } else if (outcome === 'maintain') {
            text = `😐 Tạm được...

Bạn giữ nguyên vị trí.

Tiếp tục cố gắng!`;
        } else {
            text = `😢 Không may...

Bạn bị sa thải do không hoàn thành công việc!

Phải tìm công ty khác...`;
        }

        return (
            <SceneBackground sceneKey="chapter2_office">
                <StatsPanel />
                <div className="dialogue-box">
                    <h2 className="speaker-name">Narrator</h2>
                    <div className="dialogue-content">
                        <Typewriter text={text} onComplete={() => setShowChoices(true)} />
                    </div>
                </div>
            </SceneBackground>
        );
    }

    // Step 6: Choice - Cân bằng công việc
    if (showChoices && step === 5) {
        return (
            <SceneBackground sceneKey="dream">
                <StatsPanel />
                {showStatChange && (
                    <StatChangeNotification changes={statChanges} onContinue={handleContinueAfterStats} />
                )}
                <div className="character-container">
                    <img src="/assets/characters/bà_tiên_nghiêm_túc.png" alt="Bà Tiên" className="character-sprite left" />
                </div>
                <div className="dialogue-box">
                    <h2 className="speaker-name">Bà Tiên Duyên ✨</h2>
                    <div className="dialogue-content">
                        <div className="choices-container fade-in">
                            <button className="choice-btn" onClick={() => {
                                handleChoice({ economy: 30, knowledge: 20, health: -30, happiness: -20 }, { type: 'work_balance', value: 'overtime' });
                                setFlag('work_balance', 'overtime');
                                setStep(6);
                            }}>
                                <span className="choice-title">💼 Làm thêm giờ để thăng tiến</span>
                                <span className="choice-desc">Hy sinh sức khỏe vì sự nghiệp</span>
                            </button>
                            <button className="choice-btn" onClick={() => {
                                handleChoice({ economy: 15, happiness: 10, health: 10 }, { type: 'work_balance', value: 'balance' });
                                setFlag('work_balance', 'balance');
                                setStep(6);
                            }}>
                                <span className="choice-title">⚖️ Cân bằng work-life</span>
                                <span className="choice-desc">Sức khỏe quan trọng hơn</span>
                            </button>
                            <button className="choice-btn" onClick={() => {
                                handleChoice({ economy: 20, knowledge: 10, social: -10 }, { type: 'work_balance', value: 'change' });
                                setFlag('work_balance', 'change');
                                setStep(6);
                            }}>
                                <span className="choice-title">🔄 Chuyển công ty khác</span>
                                <span className="choice-desc">Tìm môi trường tốt hơn</span>
                            </button>
                        </div>
                    </div>
                </div>
            </SceneBackground>
        );
    }

    // Step 6: 3 năm sau - Gặp người yêu
    if (step === 6) {
        return (
            <SceneBackground sceneKey="chapter2_office">
                <StatsPanel />
                <div className="dialogue-box">
                    <h2 className="speaker-name">Narrator</h2>
                    <div className="dialogue-content">
                        <Typewriter text={`⏰ 3 năm sau - 25 tuổi

Bạn đã làm việc được 3 năm...

Cuộc sống dần ổn định...

Và rồi... bạn gặp một người đặc biệt...`} onComplete={() => {
                            setScenario('dating');
                            setStep(0);
                        }} />
                    </div>
                </div>
            </SceneBackground>
        );
    }
}
```

## 6. SCENARIO: HOMETOWN_JOB (Mới - Làm việc tại quê)

```javascript
// SCENARIO: Làm việc tại quê
if (scenario === 'hometown_job') {
    // Step 0: Xin việc qua quen biết
    if (step === 0) {
        return (
            <SceneBackground sceneKey="chapter2_home">
                <StatsPanel />
                <div className="character-container">
                    <img src="/assets/characters/bố_vui_vẻ.png" alt="Bố" className="character-sprite left" />
                </div>
                <div className="dialogue-box">
                    <h2 className="speaker-name">Bố</h2>
                    <div className="dialogue-content">
                        <Typewriter text="Con ơi! Bố đã nói với ông Hiệu trưởng rồi!

Con có thể vào làm giáo viên ở trường!

Lương 8 triệu, ổn định lắm!" onComplete={() => setStep(1)} />
                    </div>
                </div>
            </SceneBackground>
        );
    }

    // Step 1: Ngày đầu đi làm
    if (step === 1) {
        return (
            <SceneBackground sceneKey="chapter2_school">
                <StatsPanel />
                <div className="dialogue-box">
                    <h2 className="speaker-name">Narrator</h2>
                    <div className="dialogue-content">
                        <Typewriter text={`📅 Ngày đầu đi làm...

Môi trường làm việc thân thiện...

Mọi người đều quen biết nhau...

Cuộc sống yên bình...`} onComplete={() => {
                            updateStats({ economy: 10, happiness: 20, health: 10 });
                            setFlag('job_position', 'Teacher');
                            setFlag('job_salary', 8);
                            setStep(2);
                        }} />
                    </div>
                </div>
            </SceneBackground>
        );
    }

    // Step 2: 2 năm sau - Áp lực kết hôn
    if (step === 2) {
        return (
            <SceneBackground sceneKey="chapter2_home">
                <StatsPanel />
                <div className="character-container">
                    <img src="/assets/characters/hàng_xóm_nhiều_chuyện.png" alt="Hàng xóm" className="character-sprite left" />
                </div>
                <div className="dialogue-box">
                    <h2 className="speaker-name">Hàng xóm</h2>
                    <div className="dialogue-content">
                        <Typewriter text="Cháu ơi! Cháu đã 24 tuổi rồi!

Bác có quen một người rất tốt!

Cháu có muốn gặp mặt không?" onComplete={() => setStep(3)} />
                    </div>
                </div>
            </SceneBackground>
        );
    }

    // Step 3: 3 năm sau - Gặp người yêu
    if (step === 3) {
        return (
            <SceneBackground sceneKey="chapter2_home">
                <StatsPanel />
                <div className="dialogue-box">
                    <h2 className="speaker-name">Narrator</h2>
                    <div className="dialogue-content">
                        <Typewriter text={`⏰ 1 năm sau - 25 tuổi

Cuộc sống ở quê yên bình...

Và rồi... bạn gặp một người đặc biệt...`} onComplete={() => {
                            setScenario('dating');
                            setStep(0);
                        }} />
                    </div>
                </div>
            </SceneBackground>
        );
    }
}
```

## 7. GIỮ NGUYÊN CÁC SCENARIO CŨ

- `dating` - Giữ nguyên
- `marriage_decision` - Đã sửa (2 lựa chọn: Cưới / Từ chối)
- `parents_pressure` - Đã có (khi từ chối cưới)
- `wedding_planning` - Giữ nguyên
- `marriage_registration` - Giữ nguyên
- `buy_house` - Giữ nguyên
- `chapter_end` - Giữ nguyên

## TỔNG KẾT THAY ĐỔI

1. ✅ Thêm 2 imports: JobInterviewGame, WorkPressureGame
2. ✅ Đổi scenario mặc định: 'transition' → 'graduation'
3. ✅ Thêm scenario: graduation (3 steps)
4. ✅ Thêm scenario: parents_call (choice)
5. ✅ Thêm scenario: city_job (6 steps + 2 minigames)
6. ✅ Thêm scenario: hometown_job (3 steps)
7. ✅ Giữ nguyên các scenario cũ

**Lưu ý**: Code trên chỉ là outline. Cần copy-paste vào đúng vị trí trong Chapter2Screen.jsx
