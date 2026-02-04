// ADD THESE SCENARIOS TO Chapter1Screen.jsx AFTER love_choice scenario

// SCENARIO: Breakup (when choosing career over love)
if (scenario === 'breakup') {
    const loveInterestName = state.flags.lover_name || 'người yêu';
    const loveInterestGender = state.player.gender === 'male' ? 'female' : 'male';
    const loveInterestSprite = state.player.gender === 'male' ? 'bích' : 'khánh';
    const pronoun = loveInterestGender === 'female' ? 'cô ấy' : 'anh ấy';

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
                        <Typewriter text={"Hai người nói chuyện thêm một lúc...\n\n" + (hasLover ? "Nhưng bạn cứ nghĩ về " + loveInterestName + "..." : "Bạn cảm thấy thoải mái khi nói chuyện...")} onComplete={() => setScenario('marriage_choice')} enableVoice={audioEnabled} />
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
                        <Typewriter text={hasLover ?
                            "Ngươi đang có người yêu, nhưng bố mẹ muốn ngươi cưới người khác...\n\nNgươi sẽ chọn ai?" :
                            "Bố mẹ muốn ngươi cưới người họ chọn...\n\nNgươi có chấp nhận không?"
                        } onComplete={() => setShowChoices(true)} enableVoice={audioEnabled} />
                    ) : (
                        <div className="choices-container fade-in">
                            {hasLover && (
                                <button className="choice-btn" onClick={() => {
                                    handleChoice({ happiness: 30, social: -20 }, { type: 'marriage', value: 'lover' });
                                    setFlag('married_to', loveInterestName);
                                    setScenario('graduation_uni');
                                    setStep(0);
                                }}>
                                    <span className="choice-title">💕 Cưới {loveInterestName}</span>
                                    <span className="choice-desc">Mình yêu {loveInterestName}!</span>
                                </button>
                            )}
                            <button className="choice-btn" onClick={() => {
                                handleChoice({ happiness: hasLover ? -20 : 10, social: 30, economy: 20 }, { type: 'marriage', value: 'arranged' });
                                setFlag('married_to', introducedPersonName);
                                setFlag('has_lover', false);
                                setScenario('graduation_uni');
                                setStep(0);
                            }}>
                                <span className="choice-title">💍 Cưới {introducedPersonName}</span>
                                <span className="choice-desc">{hasLover ? 'Nghe lời bố mẹ...' : 'Người này có vẻ tốt!'}</span>
                            </button>
                            <button className="choice-btn" onClick={() => {
                                handleChoice({ happiness: -10, social: -10 }, { type: 'marriage', value: 'refuse' });
                                setScenario('graduation_uni');
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
