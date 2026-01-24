import { useState, useEffect } from 'react';
import './MiniGame.css';

export default function StudyGroupGame({ onComplete }) {
    const [cards, setCards] = useState([]);
    const [flippedIndices, setFlippedIndices] = useState([]);
    const [matchedPairs, setMatchedPairs] = useState([]);
    const [timeLeft, setTimeLeft] = useState(45);
    const [score, setScore] = useState(0);
    const [canFlip, setCanFlip] = useState(true);

    // Programming concepts for memory game
    const concepts = [
        { id: 1, text: 'HTML', emoji: '📄' },
        { id: 2, text: 'CSS', emoji: '🎨' },
        { id: 3, text: 'JS', emoji: '⚡' },
        { id: 4, text: 'React', emoji: '⚛️' },
        { id: 5, text: 'Node', emoji: '🟢' },
        { id: 6, text: 'Git', emoji: '🔀' },
        { id: 7, text: 'API', emoji: '🔌' },
        { id: 8, text: 'DB', emoji: '💾' }
    ];

    // Initialize cards
    useEffect(() => {
        const shuffledCards = [...concepts, ...concepts]
            .sort(() => Math.random() - 0.5)
            .map((concept, index) => ({
                ...concept,
                uniqueId: index
            }));
        setCards(shuffledCards);
    }, []);

    // Timer
    useEffect(() => {
        if (timeLeft <= 0) {
            onComplete(score);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, score, onComplete]);

    // Check if all pairs matched
    useEffect(() => {
        if (matchedPairs.length === concepts.length && matchedPairs.length > 0) {
            // Bonus for completing early
            const bonus = timeLeft * 2;
            onComplete(score + bonus);
        }
    }, [matchedPairs, concepts.length, score, timeLeft, onComplete]);

    const handleCardClick = (index) => {
        if (!canFlip) return;
        if (flippedIndices.includes(index)) return;
        if (matchedPairs.includes(cards[index].id)) return;

        const newFlipped = [...flippedIndices, index];
        setFlippedIndices(newFlipped);

        if (newFlipped.length === 2) {
            setCanFlip(false);
            const [firstIndex, secondIndex] = newFlipped;
            const firstCard = cards[firstIndex];
            const secondCard = cards[secondIndex];

            if (firstCard.id === secondCard.id) {
                // Match!
                setMatchedPairs([...matchedPairs, firstCard.id]);
                setScore(score + 15);
                setFlippedIndices([]);
                setCanFlip(true);
            } else {
                // No match
                setTimeout(() => {
                    setFlippedIndices([]);
                    setCanFlip(true);
                    setScore(Math.max(0, score - 2)); // Small penalty
                }, 800);
            }
        }
    };

    const isFlipped = (index) => {
        return flippedIndices.includes(index) || matchedPairs.includes(cards[index]?.id);
    };

    return (
        <div className="minigame-overlay">
            <div className="minigame-container study-group-game">
                <div className="minigame-header">
                    <h2>🎓 Học Nhóm - Memory Match</h2>
                    <div className="minigame-stats">
                        <span className="timer">⏱️ {timeLeft}s</span>
                        <span className="score">📊 {score} điểm</span>
                        <span className="pairs">✅ {matchedPairs.length}/{concepts.length}</span>
                    </div>
                </div>

                <div className="study-instructions">
                    <p>Ghép các cặp thẻ giống nhau! Học nhóm hiệu quả = ghi nhớ tốt!</p>
                </div>

                <div className="memory-grid">
                    {cards.map((card, index) => (
                        <div
                            key={card.uniqueId}
                            className={`memory-card ${isFlipped(index) ? 'flipped' : ''} ${matchedPairs.includes(card.id) ? 'matched' : ''
                                }`}
                            onClick={() => handleCardClick(index)}
                        >
                            <div className="card-front">?</div>
                            <div className="card-back">
                                <div className="card-emoji">{card.emoji}</div>
                                <div className="card-text">{card.text}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
