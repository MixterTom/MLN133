/**
 * CHAPTER 1 - GRADUATION SCENARIO (IMPROVED VERSION)
 * 
 * Copy nội dung này thay thế vào Chapter1Screen.jsx
 * từ dòng "// SCENARIO 1.1: Tốt nghiệp phổ thông" 
 * đến hết block if (scenario === 'graduation') { ... }
 */

// ============== PASTE VÀO CHAPTER1SCREEN.JSX ==============

/*
    // SCENARIO 1.1: Tốt nghiệp phổ thông (PHIÊN BẢN CẢI TIẾN)
    if (scenario === 'graduation') {
        // Show audio enable overlay if not enabled yet
        if (!audioEnabled && step === 0) {
            return (
                <div className="prologue-screen">
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
                </div>
            );
        }

        // Step 0: Flashback - Ước mơ tuổi thơ
        if (step === 0) {
            const text = `✨ Hồi ức - 10 năm trước...

"Con lớn lên muốn làm gì?"

Câu hỏi đó vang vọng trong ký ức của ${state.player.name}...

Ngày đó, câu trả lời thật đơn giản. Nhưng giờ đây, khi đứng trước ngưỡng cửa cuộc đời...`;

            return (
                <div className="prologue-screen">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            {isTyping ? (
                                <Typewriter text={text} onComplete={handleTypingComplete} enableVoice={audioEnabled} />
                            ) : (
                                <button className="continue-btn fade-in" onClick={() => setStep(1)}>Tiếp tục →</button>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        // Step 1: Đêm trước lễ tốt nghiệp
        if (step === 1) {
            return (
                <div className="prologue-screen">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            {isTyping ? (
                                <Typewriter text={`🌙 Đêm trước lễ tốt nghiệp...

${state.player.name} trằn trọc không ngủ được.

12 năm đèn sách... Bao nhiêu kỷ niệm, bao nhiêu người bạn...

Và ngày mai, tất cả sẽ thay đổi.`} onComplete={handleTypingComplete} />
                            ) : (
                                <button className="continue-btn fade-in" onClick={() => setStep(2)}>Tiếp tục →</button>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        // Step 2: Sáng - Mẹ đánh thức
        if (step === 2) {
            return (
                <div className="prologue-screen">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/mẹ_vui_vẻ.png" alt="Mẹ" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Mẹ</h2>
                        <div className="dialogue-content">
                            {isTyping ? (
                                <Typewriter text={`Con ơi, dậy đi! Hôm nay là ngày trọng đại của con rồi!

Mẹ đã chuẩn bị áo dài cho con mặc. Nhanh lên kẻo trễ lễ tốt nghiệp!

Bố con đang đợi ở dưới nhà rồi đấy!`} onComplete={handleTypingComplete} />
                            ) : (
                                <button className="continue-btn fade-in" onClick={() => setStep(3)}>Tiếp tục →</button>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        // Step 3: Lễ tốt nghiệp
        if (step === 3) {
            return (
                <div className="prologue-screen">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            {isTyping ? (
                                <Typewriter text={`🎓 Lễ tốt nghiệp - Trường THPT...

Sân trường rực rỡ cờ hoa. Tiếng vỗ tay vang lên khi từng học sinh lên nhận bằng.

Khi ${state.player.name} cầm tấm bằng trên tay, tim đập thật nhanh...

Vừa vui, vừa lo... Tương lai đang chờ phía trước.`} onComplete={handleTypingComplete} />
                            ) : (
                                <button className="continue-btn fade-in" onClick={() => setStep(4)}>Tiếp tục →</button>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        // Step 4: Gặp bạn thân Minh
        if (step === 4) {
            return (
                <div className="prologue-screen">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/bạn_thân_vui_vẻ.png" alt="Minh" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Minh (Bạn thân)</h2>
                        <div className="dialogue-content">
                            {isTyping ? (
                                <Typewriter text={`${state.player.name} ơi! Chúng mình tốt nghiệp rồi!

12 năm học chung, giờ cuối cùng cũng xong rồi!

Mà này, mày định làm gì sau này? Tao nghe nói mày được mấy trường đại học nhận rồi phải không?`} onComplete={handleTypingComplete} />
                            ) : (
                                <button className="continue-btn fade-in" onClick={() => setStep(5)}>Tiếp tục →</button>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        // Step 5: Player trả lời Minh
        if (step === 5) {
            return (
                <div className="prologue-screen">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={getPlayerSprite('lo_lắng')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{state.player.name}</h2>
                        <div className="dialogue-content">
                            {isTyping ? (
                                <Typewriter text={`Ừ... tao được mấy trường nhận, nhưng tao chưa biết chọn đâu...

Đại học, đi làm, hay du học... Mỗi con đường đều có cái hay riêng.

Tao đang phân vân lắm, Minh ạ...`} onComplete={handleTypingComplete} />
                            ) : (
                                <button className="continue-btn fade-in" onClick={() => setStep(6)}>Tiếp tục →</button>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        // Step 6: Minh động viên
        if (step === 6) {
            return (
                <div className="prologue-screen">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/bạn_thân_nghiêm_túc.png" alt="Minh" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Minh (Bạn thân)</h2>
                        <div className="dialogue-content">
                            {isTyping ? (
                                <Typewriter text={`Mày đừng lo quá! Dù chọn gì thì chúng mình vẫn là bạn thân mà!

Tao thì chắc đi học đại học. Còn mày... mày thông minh, chắc làm gì cũng được!

Thôi, về nhà đi! Bố mẹ mày chắc đang đợi mừng đấy!`} onComplete={handleTypingComplete} />
                            ) : (
                                <button className="continue-btn fade-in" onClick={() => setStep(7)}>Tiếp tục →</button>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        // Step 7: Về nhà - Bữa ăn tối
        if (step === 7) {
            return (
                <div className="prologue-screen">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            {isTyping ? (
                                <Typewriter text={`🏠 Về nhà - Bữa ăn tối...

Cả gia đình quây quần bên mâm cơm. Mẹ nấu toàn món ${state.player.name} thích.

Không khí vui vẻ nhưng cũng có chút căng thẳng...

Ai cũng biết, sau bữa ăn này sẽ là một cuộc nói chuyện nghiêm túc.`} onComplete={handleTypingComplete} />
                            ) : (
                                <button className="continue-btn fade-in" onClick={() => setStep(8)}>Tiếp tục →</button>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        // Step 8: Bố hỏi
        if (step === 8) {
            return (
                <div className="prologue-screen">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/bố_nghiêm_túc.png" alt="Bố" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Bố</h2>
                        <div className="dialogue-content">
                            {isTyping ? (
                                <Typewriter text={`Con à, bố muốn nói chuyện với con về tương lai.

Con tốt nghiệp rồi, bố mẹ rất tự hào! Nhưng giờ con phải nghĩ xem con muốn đi con đường nào.

Đại học, đi làm, hay du học... Mỗi lựa chọn đều có hệ quả riêng.`} onComplete={handleTypingComplete} />
                            ) : (
                                <button className="continue-btn fade-in" onClick={() => setStep(9)}>Tiếp tục →</button>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        // Step 9: Mẹ bảo vệ
        if (step === 9) {
            return (
                <div className="prologue-screen">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/mẹ_lo_lắng.png" alt="Mẹ" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Mẹ</h2>
                        <div className="dialogue-content">
                            {isTyping ? (
                                <Typewriter text={`Ông để con nghỉ ngơi đã! Con mới tốt nghiệp mà đã gây áp lực!

Con ơi, mẹ chỉ mong con hạnh phúc. Dù con chọn gì, mẹ cũng ủng hộ.

Nhưng con phải nhớ... mỗi quyết định đều có giá của nó.`} onComplete={handleTypingComplete} />
                            ) : (
                                <button className="continue-btn fade-in" onClick={() => setStep(10)}>Tiếp tục →</button>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        // Step 10: Player trả lời bố mẹ
        if (step === 10) {
            return (
                <div className="prologue-screen">
                    <StatsPanel />
                    <div className="character-container">
                        <img src={getPlayerSprite('nghiêm_túc')} alt={state.player.name} className="character-sprite right" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">{state.player.name}</h2>
                        <div className="dialogue-content">
                            {isTyping ? (
                                <Typewriter text={`Con hiểu ạ... Con sẽ suy nghĩ thật kỹ.

Con biết đây là quyết định quan trọng nhất cuộc đời con.

Con hứa sẽ không làm bố mẹ thất vọng!`} onComplete={handleTypingComplete} />
                            ) : (
                                <button className="continue-btn fade-in" onClick={() => setStep(11)}>Tiếp tục →</button>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        // Step 11: Đêm - Suy nghĩ
        if (step === 11) {
            return (
                <div className="prologue-screen">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            {isTyping ? (
                                <Typewriter text={`🌙 Đêm khuya - Phòng ngủ...

${state.player.name} nằm trên giường, mắt nhìn trần nhà.

Đại học... Đi làm... Du học... Ba con đường, ba cuộc đời khác nhau.

Nếu như... có ai đó có thể chỉ cho mình con đường đúng đắn...`} onComplete={handleTypingComplete} />
                            ) : (
                                <button className="continue-btn fade-in" onClick={() => setStep(12)}>Tiếp tục →</button>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        // Step 12: Ánh sáng kỳ lạ
        if (step === 12) {
            return (
                <div className="prologue-screen">
                    <StatsPanel />
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Narrator</h2>
                        <div className="dialogue-content">
                            {isTyping ? (
                                <Typewriter text={`Đột nhiên... góc phòng bắt đầu phát sáng.

Một luồng ánh sáng vàng nhạt, ấm áp... như không thuộc về thế giới này.

${state.player.name} ngồi bật dậy, tim đập thình thịch...

"Ai... ai đó?"`} onComplete={handleTypingComplete} />
                            ) : (
                                <button className="continue-btn fade-in" onClick={() => setStep(13)}>Tiếp tục →</button>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        // Step 13: Bà Tiên xuất hiện
        if (step === 13) {
            return (
                <div className="prologue-screen">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/bà_tiên_bí_ẩn.png" alt="Bà Tiên" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">??? ✨</h2>
                        <div className="dialogue-content">
                            {isTyping ? (
                                <Typewriter text={`Đừng sợ, hỡi đứa trẻ...

Ta đã theo dõi ngươi từ lâu. Ngươi đang đứng trước ngã rẽ cuộc đời...

Và ta... ta có thể giúp ngươi nhìn thấy những con đường phía trước.`} onComplete={handleTypingComplete} />
                            ) : (
                                <button className="continue-btn fade-in" onClick={() => setStep(14)}>Tiếp tục →</button>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        // Step 14: Bà Tiên giới thiệu
        if (step === 14) {
            return (
                <div className="prologue-screen">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/bà_tiên_nghiêm_túc.png" alt="Bà Tiên" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Bà Tiên Duyên ✨</h2>
                        <div className="dialogue-content">
                            {isTyping ? (
                                <Typewriter text={`Ta là Bà Tiên Duyên - người giữ sợi dây số phận của cuộc đời ngươi.

Cuộc sống không có lựa chọn đúng hay sai tuyệt đối. Chỉ có lựa chọn phù hợp với con người ngươi.

Nhưng trước khi chọn con đường... ngươi phải chứng minh quyết tâm của mình!`} onComplete={handleTypingComplete} />
                            ) : (
                                <button className="continue-btn fade-in" onClick={() => setStep(15)}>Tiếp tục →</button>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        // Step 15: Giải thích thử thách
        if (step === 15) {
            return (
                <div className="prologue-screen">
                    <StatsPanel />
                    <div className="character-container">
                        <img src="/src/assets/characters/bà_tiên_vui_vẻ.png" alt="Bà Tiên" className="character-sprite left" />
                    </div>
                    <div className="dialogue-box">
                        <h2 className="speaker-name">Bà Tiên Duyên ✨</h2>
                        <div className="dialogue-content">
                            {isTyping ? (
                                <Typewriter text={`Ta sẽ cho ngươi một thử thách nhỏ.

Khi ngươi chọn con đường, hãy thu thập những thứ cần thiết cho hành trình đó!

Càng thu thập nhiều, con đường của ngươi càng suôn sẻ. Nhưng hãy cẩn thận... cũng có những thứ sẽ kéo ngươi xuống!

Giờ thì... hãy chọn đi!`} onComplete={handleTypingComplete} />
                            ) : (
                                <button className="continue-btn fade-in" onClick={() => setScenario('choice')}>Chọn con đường →</button>
                            )}
                        </div>
                    </div>
                </div>
            );
        }
    }
*/

// ============== END PASTE ==============

/**
 * THAY ĐỔI CHÍNH:
 * 
 * 1. THÊM FLASHBACK (Step 0): "Con lớn lên muốn làm gì?" - hồi ức tuổi thơ
 * 
 * 2. THÊM ĐÊM TRƯỚC LỄ TỐT NGHIỆP (Step 1): Player trằn trọc suy nghĩ
 * 
 * 3. THÊM MẸ ĐÁNH THỨC (Step 2): Mẹ vui vẻ đánh thức con đi lễ tốt nghiệp
 * 
 * 4. ĐẶT TÊN BẠN THÂN = "MINH" (Step 4-6): 
 *    - Minh nói chuyện tự nhiên hơn (xưng mày/tao)
 *    - Minh động viên player
 * 
 * 5. THÊM SCENE MẸ BẢO VỆ (Step 9): Mẹ bảo vệ con trước áp lực của Bố
 * 
 * 6. BUILD-UP BÀ TIÊN TỰ NHIÊN HƠN (Step 11-15):
 *    - Player ước có ai chỉ đường → Ánh sáng xuất hiện
 *    - Bà Tiên xuất hiện bí ẩn (???) → Giới thiệu bản thân
 *    - Giải thích về thử thách mini-game
 * 
 * 7. TỔNG CỘNG: 16 steps (0-15) thay vì 9 steps cũ
 *    → Cốt truyện chậm hơn, chi tiết hơn, cảm xúc hơn
 */

console.log('Improved story loaded!');
