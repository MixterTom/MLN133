import { useState, useEffect } from 'react';
import './MiniGame.css';

export default function PresentationGame({ onComplete }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [confidence, setConfidence] = useState(50); // 0-100
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(120); // 2 phút
    const [isPresenting, setIsPresenting] = useState(false);
    const [showQuestion, setShowQuestion] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [gameOver, setGameOver] = useState(false);

    const slides = [
        { id: 1, title: 'Giới thiệu', content: 'Chào mừng mọi người đến với bài thuyết trình...', points: 10 },
        { id: 2, title: 'Vấn đề', content: 'Vấn đề chúng ta đang gặp phải là...', points: 15 },
        { id: 3, title: 'Giải pháp', content: 'Giải pháp đề xuất của nhóm là...', points: 20 },
        { id: 4, title: 'Kết quả', content: 'Kết quả thử nghiệm cho thấy...', points: 15 },
        { id: 5, title: 'Kết luận', content: 'Tóm lại, chúng ta đã đạt được...', points: 20 }
    ];

    const questions = [
        {
            question: 'Bạn có thể giải thích rõ hơn về phần này không?',
            options: [
                { text: 'Giải thích chi tiết, tự tin', confidence: +15, points: 20 },
                { text: 'Trả lời ngắn gọn, hơi lo lắng', confidence: -5, points: 10 },
                { text: 'Xin lỗi, tôi không chắc', confidence: -20, points: 5 }
            ]
        },
        {
            question: 'Bạn có dữ liệu nào chứng minh không?',
            options: [
                { text: 'Có, đây là số liệu cụ thể', confidence: +20, points: 25 },
                { text: 'Chúng tôi sẽ cung cấp sau', confidence: -10, points: 8 },
                { text: 'Không có dữ liệu', confidence: -25, points: 0 }
            ]
        },
        {
            question: 'Phương pháp này có hạn chế gì không?',
            options: [
                { text: 'Có, nhưng chúng tôi đã xử lý', confidence: +10, points: 18 },
                { text: 'Không có hạn chế', confidence: -15, points: 5 },
                { text: 'Tôi không biết', confidence: -30, points: 0 }
            ]
        }
    ];

    // Timer
    useEffect(() => {
        if (timeLeft > 0 && !gameOver && isPresenting) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
                // Confidence giảm dần theo thời gian
                if (timeLeft % 10 === 0) {
                    setConfidence(prev => Math.max(0, prev - 2));
                }
            }, 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && !gameOver) {
            finishPresentation();
        }
    }, [timeLeft, gameOver, isPresenting]);

    // Random questions during presentation
    useEffect(() => {
        if (isPresenting && !showQuestion && currentSlide > 0 && currentSlide < slides.length - 1) {
            const questionChance = Math.random();
            if (questionChance > 0.7 && timeLeft > 30) { // 30% chance, not in last 30s
                const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
                setCurrentQuestion(randomQuestion);
                setShowQuestion(true);
                setIsPresenting(false);
            }
        }
    }, [currentSlide, isPresenting, showQuestion, timeLeft]);

    const startPresentation = () => {
        setIsPresenting(true);
    };

    const nextSlide = () => {
        if (currentSlide < slides.length - 1) {
            // Bonus points for confidence
            const slideScore = slides[currentSlide].points + Math.floor(confidence / 10);
            setScore(score + slideScore);
            setConfidence(prev => Math.min(100, prev + 5)); // Confidence tăng khi trình bày tốt
            setCurrentSlide(currentSlide + 1);
        } else {
            finishPresentation();
        }
    };

    const handleQuestionAnswer = (option) => {
        setConfidence(prev => Math.max(0, Math.min(100, prev + option.confidence)));
        setScore(score + option.points);
        setShowQuestion(false);
        setCurrentQuestion(null);
        setIsPresenting(true);
    };

    const finishPresentation = () => {
        setGameOver(true);
        setIsPresenting(false);
        
        // Final score calculation
        let finalScore = score;
        
        // Bonus for completing all slides
        if (currentSlide === slides.length - 1) {
            finalScore += 30;
        }
        
        // Bonus for high confidence
        if (confidence >= 70) {
            finalScore += 20;
        } else if (confidence >= 50) {
            finalScore += 10;
        }
        
        // Bonus for time remaining
        finalScore += Math.floor(timeLeft / 5);
        
        setTimeout(() => {
            onComplete(Math.max(0, finalScore));
        }, 2000);
    };

    const getConfidenceColor = () => {
        if (confidence >= 70) return '#2ecc71';
        if (confidence >= 40) return '#f39c12';
        return '#e74c3c';
    };

    const getConfidenceLabel = () => {
        if (confidence >= 70) return 'Tự tin';
        if (confidence >= 40) return 'Bình thường';
        return 'Lo lắng';
    };

    if (gameOver) {
        return (
            <div className="minigame-overlay">
                <div className="minigame-container presentation-game">
                    <div className="presentation-result">
                        <h2>🎉 Hoàn thành thuyết trình!</h2>
                        <div className="final-score-display">
                            <div className="score-circle">
                                <span className="score-number">{score}</span>
                                <span className="score-label">điểm</span>
                            </div>
                        </div>
                        <div className="result-stats">
                            <div className="result-stat">
                                <span>📊 Slides trình bày:</span>
                                <span>{currentSlide + 1}/{slides.length}</span>
                            </div>
                            <div className="result-stat">
                                <span>💪 Độ tự tin:</span>
                                <span>{confidence}%</span>
                            </div>
                            <div className="result-stat">
                                <span>⏱️ Thời gian còn lại:</span>
                                <span>{timeLeft}s</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!isPresenting) {
        return (
            <div className="minigame-overlay">
                <div className="minigame-container presentation-game">
                    <div className="minigame-header">
                        <h2>🎤 Thuyết Trình Nhóm</h2>
                        <div className="presentation-intro">
                            <p>Bạn và nhóm sẽ thuyết trình về dự án của mình!</p>
                            <p>Hãy tự tin, rõ ràng và trả lời câu hỏi tốt!</p>
                        </div>
                        <button className="start-presentation-btn" onClick={startPresentation}>
                            🎬 Bắt đầu thuyết trình
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (showQuestion && currentQuestion) {
        return (
            <div className="minigame-overlay">
                <div className="minigame-container presentation-game">
                    <div className="question-panel">
                        <div className="question-header">
                            <span className="question-icon">❓</span>
                            <h3>Câu hỏi từ giảng viên</h3>
                        </div>
                        <div className="question-text">
                            <p>{currentQuestion.question}</p>
                        </div>
                        <div className="question-options">
                            {currentQuestion.options.map((option, idx) => (
                                <button
                                    key={idx}
                                    className="question-option-btn"
                                    onClick={() => handleQuestionAnswer(option)}
                                >
                                    {option.text}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="minigame-overlay">
            <div className="minigame-container presentation-game">
                <div className="minigame-header">
                    <h2>🎤 Thuyết Trình Nhóm</h2>
                    <div className="minigame-stats">
                        <span className="timer">⏱️ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                        <span className="score">📊 {score} điểm</span>
                        <span className="slide-counter">📄 Slide {currentSlide + 1}/{slides.length}</span>
                    </div>
                </div>

                <div className="confidence-meter">
                    <div className="confidence-label">
                        <span>💪 Độ tự tin:</span>
                        <span style={{ color: getConfidenceColor() }}>{getConfidenceLabel()} ({confidence}%)</span>
                    </div>
                    <div className="confidence-bar">
                        <div
                            className="confidence-fill"
                            style={{
                                width: `${confidence}%`,
                                backgroundColor: getConfidenceColor()
                            }}
                        />
                    </div>
                </div>

                <div className="presentation-slide">
                    <div className="slide-header">
                        <h3>{slides[currentSlide].title}</h3>
                        <span className="slide-number">{slides[currentSlide].id}/{slides.length}</span>
                    </div>
                    <div className="slide-content">
                        <p>{slides[currentSlide].content}</p>
                        <div className="slide-points">
                            Điểm cơ bản: {slides[currentSlide].points} + Bonus tự tin: +{Math.floor(confidence / 10)}
                        </div>
                    </div>
                </div>

                <div className="presentation-controls">
                    <button
                        className="next-slide-btn"
                        onClick={nextSlide}
                        disabled={!isPresenting}
                    >
                        {currentSlide < slides.length - 1 ? '➡️ Slide tiếp theo' : '✅ Kết thúc thuyết trình'}
                    </button>
                </div>

                <div className="presentation-tips">
                    <p>💡 Mẹo: Giữ độ tự tin cao để có điểm bonus! Trả lời câu hỏi tốt sẽ tăng điểm!</p>
                </div>
            </div>
        </div>
    );
}
