import { useState, useEffect } from 'react';
import './MiniGame.css';

export default function ExamGame({ onComplete }) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [answered, setAnswered] = useState(false);

    const questions = [
        {
            question: "Công thức tính diện tích hình tròn?",
            answers: ["πr²", "2πr", "πd", "r²"],
            correct: 0
        },
        {
            question: "Thủ đô của Việt Nam?",
            answers: ["Hà Nội", "TP.HCM", "Đà Nẵng", "Huế"],
            correct: 0
        },
        {
            question: "1 + 1 = ?",
            answers: ["1", "2", "3", "4"],
            correct: 1
        },
        {
            question: "Ngôn ngữ lập trình phổ biến?",
            answers: ["Python", "Tiếng Việt", "Tiếng Anh", "Toán học"],
            correct: 0
        },
        {
            question: "HTML là viết tắt của?",
            answers: ["HyperText Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language"],
            correct: 0
        }
    ];

    useEffect(() => {
        if (timeLeft > 0 && currentQuestion < questions.length) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 || currentQuestion >= questions.length) {
            setTimeout(() => onComplete(score), 1500);
        }
    }, [timeLeft, currentQuestion, score, onComplete]);

    const handleAnswer = (index) => {
        if (answered) return;

        setAnswered(true);
        if (index === questions[currentQuestion].correct) {
            setScore(score + 20);
        }

        setTimeout(() => {
            setCurrentQuestion(currentQuestion + 1);
            setAnswered(false);
        }, 1000);
    };

    if (currentQuestion >= questions.length || timeLeft === 0) {
        return (
            <div className="minigame-overlay">
                <div className="minigame-container">
                    <h2>📝 Kết quả thi</h2>
                    <div className="exam-result">
                        <p className="result-score">Điểm: {score}/100</p>
                        <p className="result-text">
                            {score >= 80 ? '🎉 Xuất sắc!' : score >= 60 ? '😊 Khá tốt!' : '😅 Cần cố gắng hơn!'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="minigame-overlay">
            <div className="minigame-container">
                <div className="minigame-header">
                    <h2>📝 Thi đại học</h2>
                    <div className="minigame-stats">
                        <span>Câu {currentQuestion + 1}/{questions.length}</span>
                        <span>⏱️ {timeLeft}s</span>
                        <span>Điểm: {score}</span>
                    </div>
                </div>

                <div className="exam-question">
                    <p>{questions[currentQuestion].question}</p>
                </div>

                <div className="exam-answers">
                    {questions[currentQuestion].answers.map((answer, index) => (
                        <button
                            key={index}
                            className={`exam-answer ${answered && index === questions[currentQuestion].correct ? 'correct' : ''} ${answered && index !== questions[currentQuestion].correct ? 'wrong' : ''}`}
                            onClick={() => handleAnswer(index)}
                            disabled={answered}
                        >
                            {String.fromCharCode(65 + index)}. {answer}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
