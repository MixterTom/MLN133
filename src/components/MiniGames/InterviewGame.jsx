import { useState, useEffect } from 'react';
import './MiniGame.css';

export default function InterviewGame({ onComplete }) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(5);
    const [answered, setAnswered] = useState(false);

    const questions = [
        {
            question: "Tại sao bạn muốn làm việc ở đây?",
            answers: [
                { text: "Vì công ty nổi tiếng", score: 10 },
                { text: "Vì mình cần tiền", score: 5 },
                { text: "Vì mình muốn học hỏi và phát triển", score: 20 },
                { text: "Vì gần nhà", score: 5 }
            ]
        },
        {
            question: "Điểm mạnh của bạn là gì?",
            answers: [
                { text: "Mình chăm chỉ và có trách nhiệm", score: 20 },
                { text: "Mình đẹp trai/xinh gái", score: 5 },
                { text: "Mình học giỏi", score: 15 },
                { text: "Không biết", score: 0 }
            ]
        },
        {
            question: "Bạn có thể làm việc cuối tuần không?",
            answers: [
                { text: "Được ạ, không vấn đề gì!", score: 20 },
                { text: "Tùy lúc...", score: 10 },
                { text: "Không được", score: 0 },
                { text: "Nếu tăng lương thì được", score: 15 }
            ]
        }
    ];

    useEffect(() => {
        if (timeLeft > 0 && !answered) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && !answered) {
            handleAnswer(0); // Auto select first answer if time runs out
        }
    }, [timeLeft, answered]);

    const handleAnswer = (index) => {
        if (answered) return;

        setAnswered(true);
        const newScore = score + questions[currentQuestion].answers[index].score;
        setScore(newScore);

        setTimeout(() => {
            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
                setAnswered(false);
                setTimeLeft(5);
            } else {
                onComplete(newScore);
            }
        }, 1500);
    };

    if (currentQuestion >= questions.length) {
        return (
            <div className="minigame-overlay">
                <div className="minigame-container">
                    <h2>💼 Kết quả phỏng vấn</h2>
                    <div className="interview-result">
                        <p className="result-score">Điểm: {score}/60</p>
                        <p className="result-text">
                            {score >= 50 ? '🎉 Bạn đã được nhận!' : score >= 30 ? '😊 Chúng tôi sẽ liên lạc lại!' : '😅 Rất tiếc...'}
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
                    <h2>💼 Phỏng vấn xin việc</h2>
                    <div className="minigame-stats">
                        <span>Câu {currentQuestion + 1}/{questions.length}</span>
                        <span className="timer-urgent">⏱️ {timeLeft}s</span>
                    </div>
                </div>

                <div className="interview-question">
                    <div className="interviewer">👔 Nhà tuyển dụng:</div>
                    <p>{questions[currentQuestion].question}</p>
                </div>

                <div className="interview-answers">
                    {questions[currentQuestion].answers.map((answer, index) => (
                        <button
                            key={index}
                            className="interview-answer"
                            onClick={() => handleAnswer(index)}
                            disabled={answered}
                        >
                            {answer.text}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
