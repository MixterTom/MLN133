import { useGame } from '../../contexts/GameContext';
import './StartScreen.css';

export default function StartScreen() {
    const { setScreen, hasSavedGame, loadGame, getSaveDate, resetGame } = useGame();
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
                setScreen('prologue');
            }
        } else {
            setScreen('prologue');
        }
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
        </div>
    );
}
