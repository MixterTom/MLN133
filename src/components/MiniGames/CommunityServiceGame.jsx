import { useState } from 'react';
import './MiniGame.css';
import './CommunityServiceGame.css';

// Community situations
const SITUATIONS = [
    {
        id: 1,
        title: 'Ông già bị ốm',
        desc: 'Ông Năm 80 tuổi bị ốm nặng, cần đưa đi bệnh viện gấp nhưng không có tiền xe.',
        icon: '👴',
        options: [
            { text: 'Đưa ông đi bằng xe máy của mình', cost: 0, time: 2, points: 20, feedback: '✅ Tuyệt vời! Bạn đã giúp ông kịp thời!' },
            { text: 'Gọi xe cứu thương và trả tiền', cost: 50, time: 1, points: 15, feedback: '👍 Tốt! Chuyên nghiệp!' },
            { text: 'Kêu gọi hàng xóm góp tiền', cost: 0, time: 3, points: 10, feedback: '⚠️ Mất thời gian, ông có thể nguy hiểm' },
            { text: 'Bảo gia đình ông tự lo', cost: 0, time: 0, points: -10, feedback: '❌ Thiếu lòng nhân ái!' }
        ]
    },
    {
        id: 2,
        title: 'Trẻ em nghèo thiếu sách',
        desc: 'Lớp học ở làng có 20 em nhỏ nhưng thiếu sách vở, bút viết.',
        icon: '📚',
        options: [
            { text: 'Mua sách vở tặng các em', cost: 100, time: 1, points: 20, feedback: '✅ Tuyệt vời! Các em rất vui!' },
            { text: 'Kêu gọi quyên góp từ cộng đồng', cost: 0, time: 2, points: 15, feedback: '👍 Hay! Cả làng cùng giúp đỡ!' },
            { text: 'Tặng sách cũ của mình', cost: 0, time: 1, points: 10, feedback: '⚠️ Tốt nhưng không đủ cho 20 em' },
            { text: 'Bảo nhà trường tự lo', cost: 0, time: 0, points: -5, feedback: '❌ Thiếu trách nhiệm!' }
        ]
    },
    {
        id: 3,
        title: 'Đường làng hư hỏng',
        desc: 'Đường vào làng bị hư nặng, mưa là ngập, xe không vào được.',
        icon: '🛣️',
        options: [
            { text: 'Tổ chức làm đường cùng dân làng', cost: 50, time: 3, points: 20, feedback: '✅ Xuất sắc! Cả làng đoàn kết!' },
            { text: 'Đóng góp tiền sửa đường', cost: 100, time: 1, points: 15, feedback: '👍 Tốt! Nhưng thiếu sự tham gia' },
            { text: 'Viết đơn lên xã xin sửa', cost: 0, time: 2, points: 10, feedback: '⚠️ Lâu, dân làng vẫn khổ' },
            { text: 'Không quan tâm', cost: 0, time: 0, points: -10, feedback: '❌ Ích kỷ!' }
        ]
    },
    {
        id: 4,
        title: 'Tổ chức lễ hội làng',
        desc: 'Sắp đến lễ hội truyền thống, cần người tổ chức và kinh phí.',
        icon: '🎊',
        options: [
            { text: 'Tình nguyện tổ chức và đóng góp', cost: 80, time: 3, points: 20, feedback: '✅ Tuyệt vời! Lễ hội thành công!' },
            { text: 'Chỉ đóng góp tiền', cost: 100, time: 0, points: 10, feedback: '⚠️ Tốt nhưng thiếu sự tham gia' },
            { text: 'Chỉ tham gia tổ chức', cost: 0, time: 3, points: 15, feedback: '👍 Tốt! Nhiệt tình!' },
            { text: 'Không tham gia', cost: 0, time: 0, points: -10, feedback: '❌ Xa lánh cộng đồng!' }
        ]
    },
    {
        id: 5,
        title: 'Nông dân bán nông sản',
        desc: 'Mùa thu hoạch, nông dân không bán được hàng, giá rớt thảm.',
        icon: '🌾',
        options: [
            { text: 'Giúp tìm đầu ra, kết nối thương lái', cost: 0, time: 2, points: 20, feedback: '✅ Xuất sắc! Bạn giúp cả làng!' },
            { text: 'Mua hết nông sản với giá cao', cost: 150, time: 1, points: 15, feedback: '👍 Tốt bụng nhưng không bền vững' },
            { text: 'Chia sẻ trên mạng xã hội', cost: 0, time: 1, points: 10, feedback: '⚠️ Tốt nhưng hiệu quả chưa chắc' },
            { text: 'Không giúp được gì', cost: 0, time: 0, points: -5, feedback: '❌ Thiếu sáng tạo!' }
        ]
    }
];

const CommunityServiceGame = ({ onComplete }) => {
    const [gameState, setGameState] = useState('intro');
    const [currentSituation, setCurrentSituation] = useState(0);
    const [score, setScore] = useState(0);
    const [budget, setBudget] = useState(200); // 200 triệu
    const [timeSpent, setTimeSpent] = useState(0);
    const [reputation, setReputation] = useState(50);
    const [answers, setAnswers] = useState([]);
    const [showFeedback, setShowFeedback] = useState(null);

    const startGame = () => {
        setGameState('playing');
        setCurrentSituation(0);
        setScore(0);
        setBudget(200);
        setTimeSpent(0);
        setReputation(50);
        setAnswers([]);
    };

    const handleChoice = (option) => {
        // Check if enough budget
        if (option.cost > budget) {
            setShowFeedback({
                text: '❌ Không đủ tiền! Chọn cách khác!',
                points: 0
            });
            setTimeout(() => setShowFeedback(null), 1500);
            return;
        }

        const newScore = score + option.points;
        const newBudget = budget - option.cost;
        const newTime = timeSpent + option.time;
        const newReputation = Math.min(100, Math.max(0, reputation + option.points));

        setScore(newScore);
        setBudget(newBudget);
        setTimeSpent(newTime);
        setReputation(newReputation);
        setAnswers([...answers, { situation: currentSituation, option }]);

        setShowFeedback({
            text: option.feedback,
            points: option.points
        });

        setTimeout(() => {
            setShowFeedback(null);
            if (currentSituation < SITUATIONS.length - 1) {
                setCurrentSituation(currentSituation + 1);
            } else {
                setGameState('result');
            }
        }, 2000);
    };

    const getResult = () => {
        if (score >= 80 && reputation >= 80) return 'excellent';
        if (score >= 60 && reputation >= 60) return 'good';
        if (score >= 40) return 'average';
        return 'poor';
    };

    const getResultMessage = () => {
        const result = getResult();

        if (result === 'excellent') {
            return {
                title: '🌟 Người Hùng Làng!',
                desc: 'Bạn được cả làng kính trọng! Mọi người đều biết đến bạn là người tốt bụng và nhiệt tình!',
                bonusStats: { social: 30, happiness: 25, economy: -budget + 200 }
            };
        } else if (result === 'good') {
            return {
                title: '👍 Người Tốt!',
                desc: 'Bạn giúp đỡ cộng đồng rất tốt! Mọi người đều quý mến bạn!',
                bonusStats: { social: 20, happiness: 15, economy: -budget + 200 }
            };
        } else if (result === 'average') {
            return {
                title: '😐 Tạm Được',
                desc: 'Bạn có giúp đỡ nhưng chưa nhiều. Cần tích cực hơn!',
                bonusStats: { social: 10, happiness: 5, economy: -budget + 200 }
            };
        } else {
            return {
                title: '😢 Ích Kỷ',
                desc: 'Bạn ít giúp đỡ cộng đồng. Mọi người không mấy quý mến bạn.',
                bonusStats: { social: -10, happiness: -10, economy: -budget + 200 }
            };
        }
    };

    const handleComplete = () => {
        const result = getResult();
        const resultMessage = getResultMessage();

        onComplete({
            score,
            result,
            reputation,
            bonusStats: resultMessage.bonusStats,
            goodDeeds: answers.filter(a => a.option.points >= 15).length
        });
    };

    // Intro screen
    if (gameState === 'intro') {
        return (
            <div className="minigame-overlay">
                <div className="minigame-container">
                    <div className="minigame-intro">
                        <h2>🏡 Giúp Đỡ Cộng Đồng</h2>
                        <p className="intro-desc">Giúp đỡ người dân trong làng để được kính trọng!</p>

                        <div className="community-rules">
                            <h3>📋 Quy tắc:</h3>
                            <ul>
                                <li>💰 Ngân sách: 200 triệu</li>
                                <li>🎯 5 tình huống cần giúp đỡ</li>
                                <li>⭐ Chọn cách giúp phù hợp</li>
                                <li>🏆 Uy tín tăng khi giúp tốt</li>
                            </ul>
                        </div>

                        <div className="community-tips">
                            <h3>💡 Lưu ý:</h3>
                            <p>Cân nhắc giữa:</p>
                            <ul>
                                <li>💰 Chi phí</li>
                                <li>⏰ Thời gian</li>
                                <li>❤️ Hiệu quả giúp đỡ</li>
                            </ul>
                        </div>

                        <button className="start-game-btn" onClick={startGame}>
                            🚀 Bắt Đầu Giúp Đỡ!
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Playing screen
    if (gameState === 'playing') {
        const situation = SITUATIONS[currentSituation];

        return (
            <div className="minigame-overlay">
                <div className="minigame-container">
                    <div className="community-game">
                        <div className="community-header">
                            <div className="situation-progress">
                                Tình huống {currentSituation + 1}/{SITUATIONS.length}
                            </div>
                            <div className="community-stats">
                                <span>💰 {budget} triệu</span>
                                <span>⭐ Uy tín: {reputation}%</span>
                            </div>
                        </div>

                        <div className="situation-box">
                            <div className="situation-icon">{situation.icon}</div>
                            <div className="situation-content">
                                <h3>{situation.title}</h3>
                                <p>{situation.desc}</p>
                            </div>
                        </div>

                        {showFeedback ? (
                            <div className={`community-feedback ${showFeedback.points > 10 ? 'positive' : showFeedback.points > 0 ? 'neutral' : 'negative'}`}>
                                {showFeedback.text}
                            </div>
                        ) : (
                            <div className="community-options">
                                {situation.options.map((option, index) => (
                                    <button
                                        key={index}
                                        className={`community-option-btn ${option.cost > budget ? 'disabled' : ''}`}
                                        onClick={() => handleChoice(option)}
                                        disabled={option.cost > budget}
                                    >
                                        <div className="option-header">
                                            <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                                            <span className="option-cost">
                                                {option.cost > 0 ? `💰 ${option.cost}tr` : '🆓'}
                                                {option.time > 0 && ` | ⏰ ${option.time}h`}
                                            </span>
                                        </div>
                                        <span className="option-text">{option.text}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Result screen
    const result = getResult();
    const resultMessage = getResultMessage();
    const goodDeeds = answers.filter(a => a.option.points >= 15).length;

    return (
        <div className="minigame-overlay">
            <div className="minigame-container">
                <div className="minigame-result">
                    <h2>{resultMessage.title}</h2>

                    <div className="final-score">
                        <span className="score-number">{score}</span>
                        <span className="score-label">điểm</span>
                    </div>

                    <p className="result-desc">{resultMessage.desc}</p>

                    <div className="result-stats">
                        <div className="stat">
                            <span className="stat-value">{goodDeeds}</span>
                            <span className="stat-label">❤️ Việc tốt</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value">{200 - budget}tr</span>
                            <span className="stat-label">💰 Đã chi</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value">{reputation}%</span>
                            <span className="stat-label">⭐ Uy tín</span>
                        </div>
                    </div>

                    <div className={`result-badge ${result}`}>
                        {result === 'excellent' && '⭐⭐⭐'}
                        {result === 'good' && '⭐⭐'}
                        {result === 'average' && '⭐'}
                        {result === 'poor' && '💔'}
                    </div>

                    <button className="continue-btn" onClick={handleComplete}>
                        Tiếp tục →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CommunityServiceGame;
