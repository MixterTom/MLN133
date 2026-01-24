import SceneBackground from '../Common/SceneBackground';
import { useGame } from '../../contexts/GameContext';
import './GameOverScreen.css';

export default function GameOverScreen() {
    const { state, resetGame, setScreen } = useGame();

    // Determine which stat caused game over
    const { stats } = state.player;
    let gameOverReason = '';
    let gameOverTitle = '';
    let gameOverIcon = '';
    let gameOverAdvice = '';

    if (stats.health <= 0) {
        gameOverTitle = 'SỨC KHỎE SUY KIỆT';
        gameOverIcon = '💔';
        gameOverReason = 'Bạn đã không chăm sóc sức khỏe bản thân. Stress và làm việc quá sức đã khiến cơ thể bạn suy kiệt.';
        gameOverAdvice = 'Sức khỏe là vốn quý nhất. Không có sức khỏe, mọi thành công đều vô nghĩa. Hãy cân bằng giữa công việc và nghỉ ngơi.';
    } else if (stats.happiness <= 0) {
        gameOverTitle = 'TRẦM CẢM NẶNG';
        gameOverIcon = '😢';
        gameOverReason = 'Bạn đã đánh mất niềm vui sống. Áp lực cuộc sống và những quyết định sai lầm đã đẩy bạn vào tuyệt vọng.';
        gameOverAdvice = 'Hạnh phúc không đến từ tiền bạc hay địa vị, mà từ những mối quan hệ và sự cân bằng trong cuộc sống. Hãy tìm kiếm niềm vui mỗi ngày.';
    } else if (stats.economy <= 0) {
        gameOverTitle = 'PHÁ SẢN';
        gameOverIcon = '💸';
        gameOverReason = 'Bạn đã hết tiền và không thể tiếp tục cuộc sống. Những quyết định tài chính sai lầm đã dẫn đến kết cục này.';
        gameOverAdvice = 'Quản lý tài chính là kỹ năng quan trọng. Tiết kiệm và đầu tư thông minh sẽ giúp bạn an toàn trong mọi hoàn cảnh.';
    } else if (stats.social <= 0) {
        gameOverTitle = 'CÔ ĐƠN TUYỆT ĐỐI';
        gameOverIcon = '🚷';
        gameOverReason = 'Bạn đã đánh mất tất cả các mối quan hệ. Không có gia đình, bạn bè, bạn hoàn toàn cô đơn.';
        gameOverAdvice = 'Con người là sinh vật xã hội. Các mối quan hệ là điều quý giá nhất trong cuộc đời. Hãy trân trọng những người bên cạnh bạn.';
    } else if (stats.knowledge <= 0) {
        gameOverTitle = 'THẤT BẠI TRONG CUỘC SỐNG';
        gameOverIcon = '📉';
        gameOverReason = 'Bạn thiếu kiến thức và kỹ năng để đưa ra quyết định đúng đắn. Cuộc sống trở nên hỗn loạn.';
        gameOverAdvice = 'Học hỏi suốt đời là chìa khóa thành công. Kiến thức giúp bạn đưa ra quyết định sáng suốt và tránh những sai lầm.';
    }

    return (
        <SceneBackground sceneKey="dream">
            <div className="gameover-container">
                <div className="gameover-content">
                    <div className="gameover-icon">{gameOverIcon}</div>
                    <h1 className="gameover-title">GAME OVER</h1>
                    <p className="gameover-reason">{gameOverTitle}</p>

                    <div className="gameover-stats">
                        <h3>📊 Chỉ số cuối cùng</h3>
                        <div className="stats-grid">
                            <div className="stat-item">
                                <span className="stat-icon">❤️</span>
                                <span className={`stat-value ${stats.health <= 0 ? 'critical' : ''}`}>{stats.health}</span>
                                <span className="stat-label">Sức khỏe</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-icon">😊</span>
                                <span className={`stat-value ${stats.happiness <= 0 ? 'critical' : ''}`}>{stats.happiness}</span>
                                <span className="stat-label">Hạnh phúc</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-icon">💰</span>
                                <span className={`stat-value ${stats.economy <= 0 ? 'critical' : ''}`}>{stats.economy}</span>
                                <span className="stat-label">Kinh tế</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-icon">👥</span>
                                <span className={`stat-value ${stats.social <= 0 ? 'critical' : ''}`}>{stats.social}</span>
                                <span className="stat-label">Xã hội</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-icon">📚</span>
                                <span className={`stat-value ${stats.knowledge <= 0 ? 'critical' : ''}`}>{stats.knowledge}</span>
                                <span className="stat-label">Kiến thức</span>
                            </div>
                        </div>
                    </div>

                    <div className="gameover-advice">
                        <h4>💡 Bài học rút ra</h4>
                        <p>{gameOverAdvice}</p>
                    </div>

                    <p className="gameover-reason" style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>
                        {gameOverReason}
                    </p>

                    <div className="gameover-buttons">
                        <button className="gameover-btn primary" onClick={() => {
                            resetGame();
                            setScreen('start');
                        }}>
                            🔄 Chơi lại từ đầu
                        </button>
                        <button className="gameover-btn secondary" onClick={() => setScreen('start')}>
                            🏠 Về màn hình chính
                        </button>
                    </div>
                </div>
            </div>
        </SceneBackground>
    );
}

