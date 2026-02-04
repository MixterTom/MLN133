import { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import GameModal from '../UI/GameModal';
import './StartScreen.css';

export default function StartScreen() {
    const { setScreen, hasSavedGame, loadGame, getSaveDate, resetGame } = useGame();
    const hasSave = hasSavedGame();
    const saveDate = getSaveDate();
    const [showConfirmModal, setShowConfirmModal] = useState(false);

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
            setShowConfirmModal(true);
        } else {
            setScreen('prologue');
        }
    };

    const handleConfirmNewGame = () => {
        resetGame();
        setScreen('prologue');
        setShowConfirmModal(false);
    };

    return (
        <>
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
            </div>

            <GameModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleConfirmNewGame}
                title="⚠️ Xác nhận bắt đầu game mới"
                message="Bắt đầu game mới sẽ xóa tiến trình hiện tại. Bạn có chắc không?"
                type="confirm"
                confirmText="Xác nhận"
                cancelText="Hủy"
                icon="⚠️"
            />
        </>
    );
}
