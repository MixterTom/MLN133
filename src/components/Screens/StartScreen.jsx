import { useGame } from '../../contexts/GameContext';
import { useState } from 'react';
import './StartScreen.css';

export default function StartScreen() {
    const { setScreen, hasSavedGame, loadGame, getSaveDate, resetGame, setVoiceEnabled } = useGame();
    const [showVoiceModal, setShowVoiceModal] = useState(false);
    const hasSave = hasSavedGame();
    const saveDate = getSaveDate();

    const handleContinue = () => {
        if (hasSave) {
            loadGame();
            // loadGame will restore the saved screen state automatically
            // The screen is stored in the saved state, so after loading,
            // app will re-render with the correct screen from saved state
        }
    };

    const handleNewGame = () => {
        if (hasSave) {
            if (confirm('Bắt đầu game mới sẽ xóa tiến trình hiện tại. Bạn có chắc không?')) {
                resetGame();
                setShowVoiceModal(true);
            }
        } else {
            setShowVoiceModal(true);
        }
    };

    const handleVoiceChoice = (enabled) => {
        setVoiceEnabled(enabled);
        setShowVoiceModal(false);
        setScreen('prologue');
    };

    return (
        <div className="start-screen">
            <div className="start-content">
                <div className="start-buttons">
                    <button
                        className="start-btn primary"
                        onClick={handleNewGame}
                    >
                        {hasSave ? 'GAME MỚI' : 'BẮT ĐẦU'}
                    </button>
                    <button
                        className={`start-btn continue ${!hasSave ? 'disabled' : ''}`}
                        onClick={handleContinue}
                        disabled={!hasSave}
                    >
                        TIẾP TỤC
                        {hasSave && saveDate && (
                            <span className="save-date">
                                {saveDate.toLocaleDateString('vi-VN')} {saveDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        )}
                    </button>
                    <button className="start-btn settings">
                        CÀI ĐẶT
                    </button>
                </div>

                <p className="game-info">
                    Visual Novel • Life Simulation • 16+
                </p>
            </div>

            {/* Voice Narration Modal */}
            {showVoiceModal && (
                <div className="voice-modal-overlay">
                    <div className="voice-modal">
                        <h2>🎙️ Thuyết Minh</h2>
                        <p>Bạn có muốn bật thuyết minh bằng giọng nói không?</p>
                        <div className="voice-modal-buttons">
                            <button
                                className="voice-btn yes"
                                onClick={() => handleVoiceChoice(true)}
                            >
                                🔊 Có, bật thuyết minh
                            </button>
                            <button
                                className="voice-btn no"
                                onClick={() => handleVoiceChoice(false)}
                            >
                                🔇 Không, chỉ đọc text
                            </button>
                        </div>
                        <p className="voice-note">Bạn có thể thay đổi sau bằng nút loa ở góc màn hình</p>
                    </div>
                </div>
            )}
        </div>
    );
}
