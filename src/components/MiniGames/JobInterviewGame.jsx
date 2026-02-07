import { useState, useEffect } from 'react';
import './MiniGame.css';
import './JobInterviewGame.css';

// Interview questions
const INTERVIEW_QUESTIONS = [
    {
        question: 'Giới thiệu về bản thân bạn?',
        options: [
            { text: 'Tôi là sinh viên mới tốt nghiệp, nhiệt huyết, sẵn sàng học hỏi', points: 20, feedback: '✅ Tuyệt vời! Thái độ tích cực!' },
            { text: 'Tôi giỏi lắm, công ty nhận tôi là may mắn đấy', points: -10, feedback: '❌ Quá tự tin, thiếu khiêm tốn!' },
            { text: 'Tôi... không biết nói gì...', points: 0, feedback: '⚠️ Thiếu chuẩn bị!' },
            { text: 'Tôi có bằng đại học, GPA 3.5, có kinh nghiệm thực tập', points: 15, feedback: '👍 Tốt, nhưng thiếu nhiệt huyết' }
        ]
    },
    {
        question: 'Tại sao bạn muốn làm việc tại công ty chúng tôi?',
        options: [
            { text: 'Vì công ty gần nhà, lương cao', points: -5, feedback: '❌ Chỉ quan tâm lợi ích cá nhân!' },
            { text: 'Tôi ngưỡng mộ văn hóa công ty và muốn đóng góp', points: 20, feedback: '✅ Xuất sắc! Hiểu rõ công ty!' },
            { text: 'Tôi nộp nhiều chỗ, chỗ nào nhận thì làm', points: -10, feedback: '❌ Không chuyên nghiệp!' },
            { text: 'Tôi thấy công ty có tiềm năng phát triển', points: 15, feedback: '👍 Tốt, nhưng chưa cụ thể' }
        ]
    },
    {
        question: 'Điểm mạnh của bạn là gì?',
        options: [
            { text: 'Tôi làm việc chăm chỉ, có trách nhiệm, học hỏi nhanh', points: 20, feedback: '✅ Hoàn hảo! Đúng điểm mạnh cần thiết!' },
            { text: 'Tôi giỏi mọi thứ', points: -10, feedback: '❌ Không thuyết phục!' },
            { text: 'Tôi không có điểm yếu', points: -5, feedback: '❌ Thiếu tự nhận thức!' },
            { text: 'Tôi... chưa nghĩ ra...', points: 0, feedback: '⚠️ Chưa chuẩn bị!' }
        ]
    },
    {
        question: 'Bạn xử lý thế nào khi gặp áp lực công việc?',
        options: [
            { text: 'Tôi sẽ ưu tiên công việc, lập kế hoạch, và xin hỗ trợ nếu cần', points: 20, feedback: '✅ Tuyệt vời! Biết quản lý áp lực!' },
            { text: 'Tôi sẽ làm thêm giờ đến khi xong', points: 10, feedback: '👍 Tốt nhưng cần cân bằng sức khỏe' },
            { text: 'Tôi sẽ bỏ việc nếu quá áp lực', points: -10, feedback: '❌ Thiếu cam kết!' },
            { text: 'Tôi chưa gặp áp lực bao giờ', points: -5, feedback: '⚠️ Thiếu kinh nghiệm thực tế' }
        ]
    },
    {
        question: 'Mức lương bạn mong muốn?',
        options: [
            { text: '8-10 triệu, phù hợp với vị trí mới vào nghề', points: 20, feedback: '✅ Thực tế và hợp lý!' },
            { text: '20 triệu trở lên, tôi có bằng đại học mà', points: -10, feedback: '❌ Quá cao cho fresher!' },
            { text: 'Tùy công ty quyết định', points: 5, feedback: '⚠️ Thiếu tự tin' },
            { text: '10-12 triệu, có thể thương lượng', points: 15, feedback: '👍 Tốt, linh hoạt' }
        ]
    }
];

const JobInterviewGame = ({ onComplete }) => {
    const [gameState, setGameState] = useState('intro');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(20);
    const [answers, setAnswers] = useState([]);
    const [showFeedback, setShowFeedback] = useState(null);

    // Timer
    useEffect(() => {
        if (gameState !== 'playing' || showFeedback) return;

        const timer = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    // Time's up
                    handleAnswer(INTERVIEW_QUESTIONS[currentQuestion].options[2], true);
                    return 20;
                }
                return t - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [gameState, currentQuestion, showFeedback]);

    const startGame = () => {
        setGameState('playing');
        setCurrentQuestion(0);
        setScore(0);
        setTimeLeft(20);
        setAnswers([]);
    };

    const handleAnswer = (option, isTimeout = false) => {
        const newScore = score + option.points;
        setScore(newScore);
        setAnswers([...answers, { question: currentQuestion, option, isTimeout }]);

        setShowFeedback({
            text: isTimeout ? '⏰ Hết giờ! ' + option.feedback : option.feedback,
            points: option.points
        });

        setTimeout(() => {
            setShowFeedback(null);
            if (currentQuestion < INTERVIEW_QUESTIONS.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
                setTimeLeft(20);
            } else {
                setGameState('result');
            }
        }, 2000);
    };

    const getResult = () => {
        if (score >= 80) return 'excellent';
        if (score >= 60) return 'good';
        if (score >= 40) return 'average';
        return 'poor';
    };

    const getResultMessage = () => {
        const result = getResult();

        if (result === 'excellent') {
            return {
                title: '🎉 Xuất sắc!',
                desc: 'Bạn được nhận vào vị trí Senior với lương 15 triệu!',
                position: 'Senior',
                salary: 15,
                bonusStats: { economy: 30, knowledge: 20, happiness: 20 }
            };
        } else if (result === 'good') {
            return {
                title: '👍 Tốt lắm!',
                desc: 'Bạn được nhận vào vị trí Junior với lương 12 triệu!',
                position: 'Junior',
                salary: 12,
                bonusStats: { economy: 20, knowledge: 15, happiness: 15 }
            };
        } else if (result === 'average') {
            return {
                title: '😐 Tạm được',
                desc: 'Bạn được nhận vào vị trí Intern với lương 8 triệu',
                position: 'Intern',
                salary: 8,
                bonusStats: { economy: 10, knowledge: 10, happiness: 5 }
            };
        } else {
            return {
                title: '😢 Không đạt',
                desc: 'Bạn không được nhận... Phải tìm công ty khác',
                position: 'Unemployed',
                salary: 0,
                bonusStats: { economy: 0, knowledge: 0, happiness: -20 }
            };
        }
    };

    const handleComplete = () => {
        const result = getResult();
        const resultMessage = getResultMessage();

        onComplete({
            score,
            result,
            position: resultMessage.position,
            salary: resultMessage.salary,
            bonusStats: resultMessage.bonusStats,
            correctAnswers: answers.filter(a => a.option.points >= 15).length
        });
    };

    // Intro screen
    if (gameState === 'intro') {
        return (
            <div className="minigame-overlay">
                <div className="minigame-container">
                    <div className="minigame-intro">
                        <h2>💼 Phỏng Vấn Xin Việc</h2>
                        <p className="intro-desc">Trả lời câu hỏi phỏng vấn để được nhận vào công ty!</p>

                        <div className="interview-rules">
                            <h3>📋 Quy tắc:</h3>
                            <ul>
                                <li>⏱️ Mỗi câu hỏi có 20 giây</li>
                                <li>💡 Chọn câu trả lời phù hợp nhất</li>
                                <li>⭐ Điểm số quyết định vị trí và lương</li>
                                <li>🎯 Tổng cộng 5 câu hỏi</li>
                            </ul>
                        </div>

                        <div className="interview-tips">
                            <h3>💡 Lưu ý:</h3>
                            <p>Nhà tuyển dụng đánh giá:</p>
                            <ul>
                                <li>✅ Thái độ tích cực, nhiệt huyết</li>
                                <li>✅ Hiểu rõ công ty</li>
                                <li>✅ Tự tin nhưng khiêm tốn</li>
                                <li>❌ Tránh quá tự tin hoặc thiếu chuẩn bị</li>
                            </ul>
                        </div>

                        <button className="start-game-btn" onClick={startGame}>
                            🚀 Bắt Đầu Phỏng Vấn!
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Playing screen
    if (gameState === 'playing') {
        const question = INTERVIEW_QUESTIONS[currentQuestion];

        return (
            <div className="minigame-overlay">
                <div className="minigame-container">
                    <div className="interview-game">
                        <div className="interview-header">
                            <div className="question-progress">
                                Câu {currentQuestion + 1}/{INTERVIEW_QUESTIONS.length}
                            </div>
                            <div className="interview-score">
                                🏆 Điểm: {score}
                            </div>
                            <div className={`interview-timer ${timeLeft <= 5 ? 'urgent' : ''}`}>
                                ⏱️ {timeLeft}s
                            </div>
                        </div>

                        <div className="interview-question-box">
                            <div className="interviewer-avatar">👔</div>
                            <div className="question-text">
                                <strong>Nhà tuyển dụng:</strong>
                                <p>{question.question}</p>
                            </div>
                        </div>

                        {showFeedback ? (
                            <div className={`interview-feedback ${showFeedback.points > 10 ? 'positive' : showFeedback.points > 0 ? 'neutral' : 'negative'}`}>
                                {showFeedback.text}
                            </div>
                        ) : (
                            <div className="interview-options">
                                {question.options.map((option, index) => (
                                    <button
                                        key={index}
                                        className="interview-option-btn"
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

                    {resultMessage.salary > 0 && (
                        <div className="salary-display">
                            Vị trí: <strong>{resultMessage.position}</strong><br />
                            Lương: <strong>{resultMessage.salary} triệu/tháng</strong>
                        </div>
                    )}

                    <div className="result-stats">
                        <div className="stat">
                            <span className="stat-value">{answers.filter(a => a.option.points >= 15).length}</span>
                            <span className="stat-label">✅ Trả lời tốt</span>
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

export default JobInterviewGame;
