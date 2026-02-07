import { useState, useEffect } from 'react';
import './MiniGame.css';
import './CulturalAdaptationGame.css';

// Cultural scenarios for study abroad students
const CULTURAL_SCENARIOS = [
    {
        id: 1,
        situation: '🎉 Bạn được mời đến tiệc sinh nhật của bạn quốc tế. Bạn nên mang gì?',
        image: '🎁',
        options: [
            { text: 'Mang một món quà nhỏ (rượu vang, chocolate, hoa)', points: 20, feedback: '✅ Hoàn hảo! Đây là phép lịch sự quốc tế!' },
            { text: 'Không mang gì, chỉ đến chúc mừng', points: 5, feedback: '⚠️ Hơi thiếu lịch sự trong văn hóa phương Tây' },
            { text: 'Mang tiền mặt trong phong bì đỏ', points: -5, feedback: '❌ Đây là văn hóa Á Đông, không phù hợp!' },
            { text: 'Mang đồ ăn Việt Nam tự nấu', points: 10, feedback: '👍 Độc đáo nhưng hơi rủi ro nếu họ không quen' }
        ]
    },
    {
        id: 2,
        situation: '👨‍🏫 Giáo sư gọi tên bạn sai. Bạn nên làm gì?',
        image: '🙋',
        options: [
            { text: 'Lịch sự sửa ngay: "Actually, it\'s pronounced..."', points: 20, feedback: '✅ Đúng! Họ sẽ đánh giá cao sự tự tin của bạn!' },
            { text: 'Im lặng, để họ gọi sai mãi', points: -10, feedback: '❌ Bạn sẽ mất danh tính của mình!' },
            { text: 'Cười ngượng và không nói gì', points: 0, feedback: '⚠️ Họ sẽ không biết và tiếp tục gọi sai' },
            { text: 'Sau giờ học mới nói riêng với giáo sư', points: 15, feedback: '👍 Cũng được, nhưng hơi lâu' }
        ]
    },
    {
        id: 3,
        situation: '🍺 Bạn bè rủ đi bar nhưng bạn không uống rượu. Bạn làm gì?',
        image: '🚫',
        options: [
            { text: 'Đi cùng nhưng uống nước ngọt/nước ép', points: 20, feedback: '✅ Hoàn hảo! Giao lưu mà không cần uống rượu!' },
            { text: 'Từ chối và ở nhà', points: -10, feedback: '❌ Bạn sẽ bị cô lập khỏi nhóm bạn!' },
            { text: 'Uống một chút cho có', points: 5, feedback: '⚠️ Không nên làm điều mình không muốn' },
            { text: 'Nói dối là bạn bị ốm', points: -5, feedback: '❌ Không nên nói dối bạn bè' }
        ]
    },
    {
        id: 4,
        situation: '🍽️ Ăn tối với gia đình bạn, họ hỏi "Do you want more food?"',
        image: '🍕',
        options: [
            { text: 'Nếu muốn thì nói "Yes, please!", không muốn thì "No, thank you"', points: 20, feedback: '✅ Chính xác! Phương Tây thích sự thẳng thắn!' },
            { text: 'Nói "No" nhưng mong họ gắp thêm cho mình', points: -10, feedback: '❌ Văn hóa Á Đông! Họ sẽ không gắp thêm!' },
            { text: 'Im lặng và chờ họ tự gắp', points: -15, feedback: '❌ Họ sẽ nghĩ bạn không muốn!' },
            { text: 'Nói "I\'m fine" (mặc dù còn đói)', points: -5, feedback: '⚠️ "I\'m fine" = Không muốn!' }
        ]
    },
    {
        id: 5,
        situation: '💬 Trong lớp, giáo sư hỏi "Any questions?". Bạn không hiểu bài.',
        image: '❓',
        options: [
            { text: 'Giơ tay hỏi ngay: "Could you explain that again?"', points: 20, feedback: '✅ Xuất sắc! Hỏi là quyền của sinh viên!' },
            { text: 'Im lặng, về nhà tự học', points: -10, feedback: '❌ Bạn sẽ ngày càng tụt hậu!' },
            { text: 'Hỏi bạn bên cạnh sau giờ học', points: 10, feedback: '👍 Cũng được, nhưng hỏi thầy tốt hơn' },
            { text: 'Gửi email cho giáo sư sau', points: 15, feedback: '👍 Tốt, nhưng hỏi trực tiếp hiệu quả hơn' }
        ]
    },
    {
        id: 6,
        situation: '🚪 Bạn đến văn phòng giáo sư, cửa đóng. Bạn làm gì?',
        image: '🚪',
        options: [
            { text: 'Gõ cửa và chờ họ nói "Come in"', points: 20, feedback: '✅ Đúng phép lịch sự quốc tế!' },
            { text: 'Mở cửa và bước vào luôn', points: -15, feedback: '❌ Rất bất lịch sự!' },
            { text: 'Đứng đợi bên ngoài không gõ cửa', points: -5, feedback: '⚠️ Họ không biết bạn đang đợi!' },
            { text: 'Gửi email thay vì đến trực tiếp', points: 10, feedback: '👍 An toàn nhưng kém hiệu quả' }
        ]
    },
    {
        id: 7,
        situation: '🤝 Gặp bố mẹ bạn lần đầu, bạn nên chào hỏi thế nào?',
        image: '👋',
        options: [
            { text: 'Bắt tay và nói "Nice to meet you, Mr./Mrs. [Last name]"', points: 20, feedback: '✅ Lịch sự và chuyên nghiệp!' },
            { text: 'Cúi đầu chào kiểu Á Đông', points: 5, feedback: '⚠️ Họ có thể thấy lạ, nhưng cũng dễ thương' },
            { text: 'Ôm họ như ôm bạn bè', points: -10, feedback: '❌ Quá thân mật với người lạ!' },
            { text: 'Chỉ nói "Hi" và vẫy tay', points: 10, feedback: '👍 Được, nhưng hơi casual' }
        ]
    },
    {
        id: 8,
        situation: '💰 Đi ăn nhóm, hóa đơn đến. Bạn nên làm gì?',
        image: '🧾',
        options: [
            { text: 'Đề nghị chia đều hoặc trả phần của mình', points: 20, feedback: '✅ Đúng văn hóa phương Tây!' },
            { text: 'Chờ người khác trả', points: -15, feedback: '❌ Rất bất lịch sự!' },
            { text: 'Tranh nhau trả hết', points: -5, feedback: '⚠️ Văn hóa Á Đông, họ sẽ thấy lạ' },
            { text: 'Nói "Lần sau mình trả"', points: 10, feedback: '👍 Được, nhưng nên trả ngay' }
        ]
    },
    {
        id: 9,
        situation: '📱 Bạn nhận được tin nhắn từ bạn: "Let\'s hang out sometime!"',
        image: '💬',
        options: [
            { text: 'Đề xuất ngày giờ cụ thể: "How about Saturday at 2pm?"', points: 20, feedback: '✅ Chủ động và rõ ràng!' },
            { text: 'Trả lời "Sure!" và chờ họ hẹn', points: 10, feedback: '👍 Được, nhưng hơi thụ động' },
            { text: 'Trả lời "Ok" và không làm gì thêm', points: -10, feedback: '❌ Họ sẽ nghĩ bạn không quan tâm!' },
            { text: 'Không trả lời, chờ họ nhắn lại', points: -15, feedback: '❌ Rất bất lịch sự!' }
        ]
    },
    {
        id: 10,
        situation: '🎓 Làm việc nhóm, bạn không đồng ý với ý kiến của leader.',
        image: '💭',
        options: [
            { text: 'Nói lịch sự: "I see your point, but what if we try..."', points: 20, feedback: '✅ Tuyệt vời! Góp ý mang tính xây dựng!' },
            { text: 'Im lặng và làm theo', points: -10, feedback: '❌ Bạn sẽ không được đánh giá cao!' },
            { text: 'Nói thẳng: "That\'s wrong!"', points: -15, feedback: '❌ Quá thẳng thắn, thiếu tế nhị!' },
            { text: 'Nói riêng với leader sau', points: 15, feedback: '👍 Tốt, nhưng nên nói trong nhóm' }
        ]
    }
];

const CulturalAdaptationGame = ({ onComplete }) => {
    const [gameState, setGameState] = useState('intro'); // intro, playing, result
    const [currentScenario, setCurrentScenario] = useState(0);
    const [score, setScore] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [showFeedback, setShowFeedback] = useState(null);
    const [timeLeft, setTimeLeft] = useState(10);
    const [scenarios] = useState(() => {
        // Randomly select 8 scenarios and shuffle their options
        const shuffled = [...CULTURAL_SCENARIOS].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, 8);

        // Shuffle options for each scenario
        return selected.map(scenario => ({
            ...scenario,
            options: [...scenario.options].sort(() => Math.random() - 0.5)
        }));
    });

    // Timer for each scenario
    useEffect(() => {
        if (gameState !== 'playing' || showFeedback) return;

        const timer = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    // Time's up, auto select worst answer
                    const scenario = scenarios[currentScenario];
                    const worstOption = scenario.options.reduce((worst, opt) =>
                        opt.points < worst.points ? opt : worst
                    );
                    handleAnswer(worstOption, true);
                    return 10;
                }
                return t - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [gameState, currentScenario, showFeedback, scenarios]);

    const startGame = () => {
        setGameState('playing');
        setCurrentScenario(0);
        setScore(0);
        setAnswers([]);
        setTimeLeft(10);
    };

    const handleAnswer = (option, isTimeout = false) => {
        const newScore = score + option.points;
        setScore(newScore);
        setAnswers([...answers, { scenario: currentScenario, option, isTimeout }]);

        setShowFeedback({
            text: isTimeout ? '⏰ Hết giờ! ' + option.feedback : option.feedback,
            points: option.points
        });

        setTimeout(() => {
            setShowFeedback(null);
            if (currentScenario < scenarios.length - 1) {
                setCurrentScenario(currentScenario + 1);
                setTimeLeft(10);
            } else {
                setGameState('result');
            }
        }, 2500);
    };

    const getResult = () => {
        if (score >= 140) return 'excellent';
        if (score >= 100) return 'good';
        if (score >= 60) return 'average';
        return 'poor';
    };

    const getResultMessage = () => {
        const result = getResult();

        if (result === 'excellent') {
            return {
                title: '🌟 Xuất Sắc!',
                desc: 'Bạn thích nghi văn hóa rất tốt! Bạn hiểu rõ văn hóa phương Tây và biết cách ứng xử phù hợp!',
                bonusStats: { social: 25, happiness: 15, knowledge: 10 }
            };
        } else if (result === 'good') {
            return {
                title: '👍 Tốt Lắm!',
                desc: 'Bạn đã thích nghi khá tốt! Còn một vài điểm cần cải thiện nhưng nhìn chung bạn hòa nhập tốt.',
                bonusStats: { social: 15, happiness: 10, knowledge: 5 }
            };
        } else if (result === 'average') {
            return {
                title: '😐 Tạm Được',
                desc: 'Bạn còn lúng túng trong một số tình huống văn hóa. Cần học hỏi thêm về văn hóa địa phương.',
                bonusStats: { social: 10, happiness: 5, knowledge: 0 }
            };
        } else {
            return {
                title: '😢 Khó Khăn',
                desc: 'Bạn gặp nhiều khó khăn trong việc thích nghi văn hóa. Bạn có thể bị cô lập nếu không cải thiện.',
                bonusStats: { social: 5, happiness: -10, knowledge: -5 }
            };
        }
    };

    const handleComplete = () => {
        const result = getResult();
        const resultMessage = getResultMessage();

        onComplete({
            score,
            result,
            bonusStats: resultMessage.bonusStats,
            answers: answers.length,
            correctAnswers: answers.filter(a => a.option.points >= 15).length
        });
    };

    // Intro screen
    if (gameState === 'intro') {
        return (
            <div className="minigame-overlay">
                <div className="minigame-container">
                    <div className="minigame-intro">
                        <h2>🌍 Thích Nghi Văn Hóa</h2>
                        <p className="intro-desc">Học cách ứng xử phù hợp trong các tình huống văn hóa khác nhau!</p>

                        <div className="cultural-rules">
                            <h3>📋 Quy tắc:</h3>
                            <ul>
                                <li>⏱️ Mỗi tình huống có 10 giây để quyết định</li>
                                <li>💡 Chọn cách ứng xử phù hợp nhất</li>
                                <li>⭐ Điểm số phản ánh khả năng thích nghi của bạn</li>
                                <li>🎯 Tổng cộng 8 tình huống</li>
                            </ul>
                        </div>

                        <div className="cultural-tips">
                            <h3>💡 Lưu ý:</h3>
                            <p>Văn hóa phương Tây khác Á Đông:</p>
                            <ul>
                                <li>✅ Thẳng thắn, rõ ràng</li>
                                <li>✅ Tôn trọng không gian cá nhân</li>
                                <li>✅ Tự lập, chủ động</li>
                                <li>❌ Không ngại ngùng, khiêm tốn quá mức</li>
                            </ul>
                        </div>

                        <button className="start-game-btn" onClick={startGame}>
                            🚀 Bắt Đầu!
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Playing screen
    if (gameState === 'playing') {
        const scenario = scenarios[currentScenario];

        return (
            <div className="minigame-overlay">
                <div className="minigame-container">
                    <div className="cultural-game">
                        <div className="cultural-header">
                            <div className="scenario-progress">
                                Tình huống {currentScenario + 1}/{scenarios.length}
                            </div>
                            <div className="cultural-score">
                                🏆 {score} điểm
                            </div>
                            <div className={`cultural-timer ${timeLeft <= 3 ? 'urgent' : ''}`}>
                                ⏱️ {timeLeft}s
                            </div>
                        </div>

                        <div className="scenario-box">
                            <div className="scenario-icon">{scenario.image}</div>
                            <div className="scenario-text">
                                <p>{scenario.situation}</p>
                            </div>
                        </div>

                        {showFeedback ? (
                            <div className={`cultural-feedback ${showFeedback.points >= 15 ? 'positive' : showFeedback.points >= 5 ? 'neutral' : 'negative'}`}>
                                {showFeedback.text}
                            </div>
                        ) : (
                            <div className="cultural-options">
                                {scenario.options.map((option, index) => (
                                    <button
                                        key={index}
                                        className="cultural-option-btn"
                                        onClick={() => handleAnswer(option)}
                                    >
                                        <span className="option-letter">{String.fromCharCode(65 + index)}</span>
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
                            <span className="stat-value">{answers.filter(a => a.option.points >= 15).length}</span>
                            <span className="stat-label">✅ Ứng xử tốt</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value">{answers.filter(a => a.option.points < 0).length}</span>
                            <span className="stat-label">❌ Sai lầm</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value">{answers.filter(a => a.isTimeout).length}</span>
                            <span className="stat-label">⏰ Hết giờ</span>
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

export default CulturalAdaptationGame;
