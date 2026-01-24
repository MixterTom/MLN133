import { useState, useEffect } from 'react';
import './MiniGame.css';

export default function DateGame({ onComplete }) {
    const [hearts, setHearts] = useState([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(20);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        // Spawn hearts
        const heartInterval = setInterval(() => {
            if (!gameOver && timeLeft > 0) {
                const newHeart = {
                    id: Date.now(),
                    x: Math.random() * 80 + 10, // 10-90%
                    type: Math.random() > 0.2 ? 'good' : 'bad' // 80% good, 20% bad
                };
                setHearts(prev => [...prev, newHeart]);
            }
        }, 1000);

        return () => clearInterval(heartInterval);
    }, [gameOver, timeLeft]);

    useEffect(() => {
        // Timer
        if (timeLeft > 0 && !gameOver) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0) {
            setGameOver(true);
            setTimeout(() => onComplete(score), 2000);
        }
    }, [timeLeft, gameOver, score, onComplete]);

    useEffect(() => {
        // Remove hearts that fall off screen
        const cleanupInterval = setInterval(() => {
            setHearts(prev => prev.filter(heart => {
                const element = document.getElementById(`heart-${heart.id}`);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    return rect.top < window.innerHeight;
                }
                return true;
            }));
        }, 100);

        return () => clearInterval(cleanupInterval);
    }, []);

    const handleHeartClick = (heart) => {
        if (heart.type === 'good') {
            setScore(score + 10);
        } else {
            setScore(Math.max(0, score - 15));
        }
        setHearts(prev => prev.filter(h => h.id !== heart.id));
    };

    return (
        <div className="minigame-overlay">
            <div className="minigame-container date-game">
                <div className="minigame-header">
                    <h2>💕 Hẹn hò</h2>
                    <div className="minigame-stats">
                        <span>Điểm: {score}</span>
                        <span>⏱️ {timeLeft}s</span>
                    </div>
                </div>

                <div className="date-instructions">
                    Click vào trái tim đỏ! Tránh trái tim đen!
                </div>

                <div className="date-game-area">
                    {hearts.map(heart => (
                        <div
                            key={heart.id}
                            id={`heart-${heart.id}`}
                            className={`falling-heart ${heart.type}`}
                            style={{ left: `${heart.x}%` }}
                            onClick={() => handleHeartClick(heart)}
                        >
                            {heart.type === 'good' ? '❤️' : '🖤'}
                        </div>
                    ))}
                </div>

                {gameOver && (
                    <div className="game-result">
                        <h3>{score >= 80 ? '💕 Hẹn hò thành công!' : score >= 50 ? '😊 Khá tốt!' : '😅 Hơi vụng về!'}</h3>
                        <p>Điểm: {score}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
