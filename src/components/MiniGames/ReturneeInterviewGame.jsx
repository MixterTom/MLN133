import { useState, useEffect } from 'react';
import './MiniGame.css';
import './ReturneeInterviewGame.css';

// Interview questions based on study abroad quality
const INTERVIEW_SCENARIOS = {
    excellent: {
        title: '🏢 Phỏng Vấn Công Ty Đa Quốc Gia',
        description: 'Bạn đang phỏng vấn vào vị trí Manager tại công ty lớn',
        questions: [
            {
                question: 'Anh/Chị có kinh nghiệm làm việc trong môi trường đa văn hóa không?',
                options: [
                    { text: 'Có, tôi đã làm việc với nhiều quốc tịch khác nhau khi du học', points: 20, feedback: '✅ Tuyệt vời! Đây là điểm mạnh của bạn!' },
                    { text: 'Tôi chưa có kinh nghiệm làm việc nhưng đã học tập trong môi trường quốc tế', points: 15, feedback: '👍 Tốt, nhưng cần thêm kinh nghiệm thực tế' },
                    { text: 'Tôi sẽ học hỏi nhanh thôi', points: 5, feedback: '⚠️ Câu trả lời chưa thuyết phục' },
                    { text: 'Tôi nghĩ văn hóa không quan trọng lắm', points: -10, feedback: '❌ Câu trả lời không phù hợp!' }
                ]
            },
            {
                question: 'Điểm mạnh lớn nhất của anh/chị khi so với ứng viên khác là gì?',
                options: [
                    { text: 'Tôi có bằng cấp quốc tế từ trường top và tư duy toàn cầu', points: 20, feedback: '✅ Chính xác! Đây là lợi thế của bạn!' },
                    { text: 'Tôi trẻ và nhiệt huyết', points: 10, feedback: '👍 Tốt nhưng chưa nổi bật' },
                    { text: 'Tôi sẽ làm việc chăm chỉ', points: 5, feedback: '⚠️ Quá chung chung' },
                    { text: 'Tôi có thể làm việc overtime', points: 0, feedback: '❌ Không phải điểm mạnh thực sự' }
                ]
            },
            {
                question: 'Anh/Chị mong muốn mức lương khởi điểm là bao nhiêu?',
                options: [
                    { text: '25-30 triệu, phù hợp với bằng cấp quốc tế và vị trí Manager', points: 20, feedback: '✅ Tự tin và hợp lý!' },
                    { text: '20-25 triệu, tôi có thể thương lượng', points: 15, feedback: '👍 Linh hoạt, tốt!' },
                    { text: '15-20 triệu, tôi cần kinh nghiệm', points: 5, feedback: '⚠️ Bạn đang định giá thấp bản thân' },
                    { text: 'Tùy công ty quyết định', points: 0, feedback: '❌ Thiếu tự tin!' }
                ]
            },
            {
                question: 'Tại sao anh/chị lại về Việt Nam thay vì ở lại nước ngoài?',
                options: [
                    { text: 'Tôi muốn đóng góp cho sự phát triển của Việt Nam với kiến thức đã học', points: 20, feedback: '✅ Câu trả lời xuất sắc!' },
                    { text: 'Gia đình tôi ở Việt Nam', points: 10, feedback: '👍 Hợp lý nhưng chưa thuyết phục' },
                    { text: 'Tôi không xin được việc ở nước ngoài', points: -5, feedback: '❌ Không nên thành thật quá!' },
                    { text: 'Chi phí sống ở nước ngoài cao', points: 5, feedback: '⚠️ Lý do chưa mạnh' }
                ]
            },
            {
                question: 'Anh/Chị có thể bắt đầu làm việc khi nào?',
                options: [
                    { text: 'Ngay sau khi nhận offer, tôi đã sẵn sàng', points: 20, feedback: '✅ Tuyệt vời! Thái độ tích cực!' },
                    { text: 'Sau 2 tuần, tôi cần chuẩn bị', points: 15, feedback: '👍 Hợp lý' },
                    { text: 'Sau 1 tháng, tôi cần nghỉ ngơi', points: 5, feedback: '⚠️ Hơi lâu' },
                    { text: 'Tôi cần suy nghĩ thêm', points: 0, feedback: '❌ Thiếu quyết đoán' }
                ]
            }
        ],
        thresholds: { excellent: 85, good: 65, average: 40 }
    },
    good: {
        title: '🏢 Phỏng Vấn Công Ty Trong Nước',
        description: 'Bạn đang phỏng vấn vào vị trí nhân viên tại công ty Việt Nam',
        questions: [
            {
                question: 'Anh/Chị có kinh nghiệm làm việc tại Việt Nam không?',
                options: [
                    { text: 'Chưa có, nhưng tôi đã học cách làm việc chuyên nghiệp ở nước ngoài', points: 15, feedback: '👍 Tốt, nhưng cần thích nghi' },
                    { text: 'Chưa, nhưng tôi sẽ học nhanh', points: 10, feedback: '⚠️ Chưa thuyết phục lắm' },
                    { text: 'Tôi có thể áp dụng kinh nghiệm quốc tế vào đây', points: 5, feedback: '⚠️ Văn hóa làm việc khác nhau' },
                    { text: 'Không, tôi mới về', points: 0, feedback: '❌ Quá thẳng thắn' }
                ]
            },
            {
                question: 'Tại sao chúng tôi nên chọn anh/chị thay vì ứng viên học trong nước?',
                options: [
                    { text: 'Tôi có góc nhìn quốc tế và tiếng Anh tốt, có thể làm việc với đối tác nước ngoài', points: 20, feedback: '✅ Câu trả lời hay!' },
                    { text: 'Tôi có bằng cấp quốc tế', points: 10, feedback: '👍 Tốt nhưng chưa đủ' },
                    { text: 'Tôi học giỏi hơn', points: 5, feedback: '⚠️ Nghe kiêu ngạo' },
                    { text: 'Tôi đã hy sinh 4 năm du học', points: -5, feedback: '❌ Không liên quan!' }
                ]
            },
            {
                question: 'Anh/Chị hiểu về văn hóa làm việc tại Việt Nam không?',
                options: [
                    { text: 'Tôi đang tìm hiểu và sẵn sàng thích nghi', points: 20, feedback: '✅ Thái độ tốt!' },
                    { text: 'Tôi là người Việt nên tôi hiểu', points: 10, feedback: '👍 Nhưng 4 năm xa quê có thể thay đổi nhiều' },
                    { text: 'Tôi nghĩ nó giống ở nước ngoài', points: 0, feedback: '❌ Sai lầm lớn!' },
                    { text: 'Tôi sẽ áp dụng cách làm việc quốc tế', points: -10, feedback: '❌ Không phù hợp!' }
                ]
            },
            {
                question: 'Mức lương anh/chị mong muốn?',
                options: [
                    { text: '12-15 triệu, phù hợp với vị trí entry level', points: 20, feedback: '✅ Thực tế và hợp lý!' },
                    { text: '15-20 triệu, tôi có bằng quốc tế', points: 10, feedback: '👍 Hơi cao nhưng có thể thương lượng' },
                    { text: '20-25 triệu, tôi đã du học', points: -5, feedback: '❌ Quá cao cho vị trí này!' },
                    { text: 'Tùy công ty', points: 5, feedback: '⚠️ Thiếu tự tin' }
                ]
            },
            {
                question: 'Anh/Chị có sẵn sàng làm việc ngoài giờ không?',
                options: [
                    { text: 'Có, khi công việc cần thiết', points: 20, feedback: '✅ Linh hoạt!' },
                    { text: 'Có, nhưng tôi cần work-life balance', points: 10, feedback: '👍 Hợp lý nhưng hơi khó tính' },
                    { text: 'Không, ở nước ngoài không làm overtime', points: -10, feedback: '❌ Không phù hợp văn hóa VN!' },
                    { text: 'Tôi sẽ làm mọi lúc', points: 5, feedback: '⚠️ Quá khiêm tốn' }
                ]
            }
        ],
        thresholds: { excellent: 80, good: 60, average: 35 }
    },
    average: {
        title: '🏢 Phỏng Vấn Công Ty Nhỏ',
        description: 'Bạn đang phỏng vấn vào vị trí thử việc tại công ty nhỏ',
        questions: [
            {
                question: 'Trường anh/chị học... chúng tôi chưa nghe nhiều. Anh/chị có thể giải thích?',
                options: [
                    { text: 'Đó là trường tốt ở khu vực, tôi đã học được nhiều kỹ năng thực tế', points: 15, feedback: '👍 Tự tin nhưng khiêm tốn!' },
                    { text: 'Trường không nổi nhưng tôi học chăm chỉ', points: 10, feedback: '⚠️ Hơi tiêu cực' },
                    { text: 'Đó là trường top ở nước ngoài!', points: -5, feedback: '❌ Không trung thực!' },
                    { text: 'Tôi không biết nữa...', points: 0, feedback: '❌ Thiếu tự tin!' }
                ]
            },
            {
                question: 'Tại sao anh/chị không xin việc ở công ty lớn?',
                options: [
                    { text: 'Tôi muốn học hỏi từ công ty nhỏ, có cơ hội thực hành nhiều hơn', points: 20, feedback: '✅ Thái độ tích cực!' },
                    { text: 'Tôi đã xin nhưng không được', points: 5, feedback: '⚠️ Quá thành thật' },
                    { text: 'Công ty lớn yêu cầu cao quá', points: 0, feedback: '❌ Tiêu cực!' },
                    { text: 'Tôi cần kinh nghiệm trước', points: 15, feedback: '👍 Hợp lý' }
                ]
            },
            {
                question: 'Anh/Chị có thể làm nhiều việc cùng lúc không? Công ty nhỏ cần người đa năng.',
                options: [
                    { text: 'Có, tôi sẵn sàng học hỏi và làm nhiều việc', points: 20, feedback: '✅ Đúng thái độ!' },
                    { text: 'Tôi sẽ cố gắng', points: 10, feedback: '👍 Tốt nhưng chưa tự tin' },
                    { text: 'Tôi chỉ muốn làm đúng chuyên môn', points: -5, feedback: '❌ Không phù hợp!' },
                    { text: 'Tùy công việc', points: 5, feedback: '⚠️ Mơ hồ' }
                ]
            },
            {
                question: 'Mức lương anh/chị mong muốn? Công ty chúng tôi không trả cao lắm.',
                options: [
                    { text: '8-10 triệu, tôi cần kinh nghiệm hơn là lương cao', points: 20, feedback: '✅ Thực tế!' },
                    { text: '10-12 triệu, tôi có bằng quốc tế', points: 10, feedback: '👍 Hợp lý' },
                    { text: '15 triệu, tôi đã du học mà', points: -10, feedback: '❌ Quá cao!' },
                    { text: 'Bao nhiêu cũng được', points: 5, feedback: '⚠️ Quá khiêm tốn' }
                ]
            },
            {
                question: 'Anh/Chị có thể bắt đầu ngay không? Chúng tôi cần người gấp.',
                options: [
                    { text: 'Có, tôi có thể bắt đầu ngay tuần sau', points: 20, feedback: '✅ Tuyệt vời!' },
                    { text: 'Có, nhưng tôi cần 2 tuần chuẩn bị', points: 10, feedback: '👍 Được' },
                    { text: 'Tôi cần nghỉ ngơi sau du học', points: -5, feedback: '❌ Không phù hợp!' },
                    { text: 'Tôi đang xin công ty khác', points: -10, feedback: '❌ Không nên nói!' }
                ]
            }
        ],
        thresholds: { excellent: 75, good: 55, average: 30 }
    }
};

const ReturneeInterviewGame = ({ studyAbroadQuality = 'good', onComplete }) => {
    const config = INTERVIEW_SCENARIOS[studyAbroadQuality] || INTERVIEW_SCENARIOS.good;

    const [gameState, setGameState] = useState('intro'); // intro, playing, result
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [showFeedback, setShowFeedback] = useState(null);
    const [timeLeft, setTimeLeft] = useState(15);

    // Shuffle options for each question
    const [shuffledQuestions] = useState(() => {
        return config.questions.map(q => ({
            ...q,
            options: [...q.options].sort(() => Math.random() - 0.5)
        }));
    });

    // Timer for each question
    useEffect(() => {
        if (gameState !== 'playing' || showFeedback) return;

        const timer = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    // Time's up, auto select worst answer
                    handleAnswer(shuffledQuestions[currentQuestion].options[shuffledQuestions[currentQuestion].options.length - 1], true);
                    return 15;
                }
                return t - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [gameState, currentQuestion, showFeedback, shuffledQuestions]);

    const startGame = () => {
        setGameState('playing');
        setCurrentQuestion(0);
        setScore(0);
        setAnswers([]);
        setTimeLeft(15);
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
            if (currentQuestion < shuffledQuestions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
                setTimeLeft(15);
            } else {
                setGameState('result');
            }
        }, 2000);
    };

    const getResult = () => {
        const { thresholds } = config;
        if (score >= thresholds.excellent) return 'excellent';
        if (score >= thresholds.good) return 'good';
        if (score >= thresholds.average) return 'average';
        return 'poor';
    };

    const getResultMessage = () => {
        const result = getResult();

        if (studyAbroadQuality === 'excellent') {
            if (result === 'excellent') return { title: '🎉 Xuất sắc!', desc: 'Bạn được nhận vào vị trí Manager với lương 30 triệu!', salary: 30 };
            if (result === 'good') return { title: '👍 Tốt!', desc: 'Bạn được nhận với lương 25 triệu!', salary: 25 };
            if (result === 'average') return { title: '😐 Tạm được', desc: 'Bạn được nhận nhưng lương chỉ 20 triệu', salary: 20 };
            return { title: '😢 Tiếc quá', desc: 'Bạn không được nhận... Phải tìm công ty khác', salary: 0 };
        } else if (studyAbroadQuality === 'good') {
            if (result === 'excellent') return { title: '🎉 Tuyệt vời!', desc: 'Bạn được nhận với lương 15 triệu!', salary: 15 };
            if (result === 'good') return { title: '👍 Được!', desc: 'Bạn được nhận với lương 12 triệu', salary: 12 };
            if (result === 'average') return { title: '😐 Ổn', desc: 'Bạn được thử việc với lương 10 triệu', salary: 10 };
            return { title: '😢 Không đạt', desc: 'Bạn không được nhận...', salary: 0 };
        } else {
            if (result === 'excellent') return { title: '🎉 May mắn!', desc: 'Bạn được nhận với lương 10 triệu!', salary: 10 };
            if (result === 'good') return { title: '👍 Được rồi', desc: 'Bạn được thử việc với lương 8 triệu', salary: 8 };
            if (result === 'average') return { title: '😐 Tạm', desc: 'Bạn được nhận nhưng lương rất thấp: 7 triệu', salary: 7 };
            return { title: '😢 Thất bại', desc: 'Bạn không được nhận... Phải tìm việc khác', salary: 0 };
        }
    };

    const handleComplete = () => {
        const result = getResult();
        const resultMessage = getResultMessage();

        onComplete({
            score,
            result,
            salary: resultMessage.salary,
            studyAbroadQuality,
            answers: answers.length
        });
    };

    // Intro screen
    if (gameState === 'intro') {
        return (
            <div className="minigame-overlay">
                <div className="minigame-container">
                    <div className="minigame-intro">
                        <h2>{config.title}</h2>
                        <p className="intro-desc">{config.description}</p>

                        <div className="interview-rules">
                            <h3>📋 Quy tắc:</h3>
                            <ul>
                                <li>⏱️ Mỗi câu hỏi có 15 giây để trả lời</li>
                                <li>💡 Chọn câu trả lời phù hợp nhất</li>
                                <li>⭐ Điểm số quyết định bạn có được nhận việc không</li>
                                <li>🎯 Tổng cộng {config.questions.length} câu hỏi</li>
                            </ul>
                        </div>

                        <button className="start-game-btn" onClick={startGame}>
                            🚀 Bắt Đầu Phỏng Vấn
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Playing screen
    if (gameState === 'playing') {
        const question = shuffledQuestions[currentQuestion];

        return (
            <div className="minigame-overlay">
                <div className="minigame-container">
                    <div className="interview-game">
                        <div className="interview-header">
                            <div className="question-progress">
                                Câu {currentQuestion + 1}/{shuffledQuestions.length}
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
                            💰 Lương: <strong>{resultMessage.salary} triệu/tháng</strong>
                        </div>
                    )}

                    <div className="result-stats">
                        <div className="stat">
                            <span className="stat-value">{answers.filter(a => !a.isTimeout).length}</span>
                            <span className="stat-label">✅ Trả lời đúng giờ</span>
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

export default ReturneeInterviewGame;
