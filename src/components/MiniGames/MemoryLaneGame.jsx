import { useState, useEffect } from 'react';
import './MiniGame.css';

const MEMORIES = [
    { id: 'start', icon: '👶', text: 'Sinh ra trong gia đình...', pairId: 1 },
    { id: 'start_match', icon: '👶', text: 'Gia đình yêu thương', pairId: 1 },

    { id: 'school', icon: '🏫', text: 'Ngày đầu đến trường', pairId: 2 },
    { id: 'school_match', icon: '🏫', text: 'Bạn bè mới', pairId: 2 },

    { id: 'love', icon: '❤️', text: 'Mối tình đầu', pairId: 3 },
    { id: 'love_match', icon: '❤️', text: 'Rung động đầu đời', pairId: 3 },

    { id: 'wedding', icon: '💍', text: 'Ngày cưới', pairId: 4 },
    { id: 'wedding_match', icon: '💍', text: 'Hạnh phúc trăm năm', pairId: 4 },

    { id: 'child', icon: '🍼', text: 'Con chào đời', pairId: 5 },
    { id: 'child_match', icon: '🍼', text: 'Thiên thần nhỏ', pairId: 5 },

    { id: 'work', icon: '💼', text: 'Thăng chức', pairId: 6 },
    { id: 'work_match', icon: '💼', text: 'Nỗ lực được đền đáp', pairId: 6 },
];

export default function MemoryLaneGame({ onComplete }) {
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const [gameStep, setGameStep] = useState('playing'); // playing, finished

    useEffect(() => {
        // Shuffle cards
        const shuffled = [...MEMORIES].sort(() => Math.random() - 0.5);
        setCards(shuffled);
    }, []);

    const handleCardClick = (index) => {
        if (disabled || flipped.includes(index) || matched.includes(cards[index].pairId)) return;

        const newFlipped = [...flipped, index];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            setDisabled(true);
            const card1 = cards[newFlipped[0]];
            const card2 = cards[newFlipped[1]];

            if (card1.pairId === card2.pairId) {
                setMatched(prev => [...prev, card1.pairId]);
                setFlipped([]);
                setDisabled(false);
            } else {
                setTimeout(() => {
                    setFlipped([]);
                    setDisabled(false);
                }, 1000);
            }
        }
    };

    useEffect(() => {
        if (matched.length === MEMORIES.length / 2 && matched.length > 0) {
            setTimeout(() => setGameStep('finished'), 1000);
        }
    }, [matched]);

    const handleFinish = () => {
        onComplete({ bonusStats: { happiness: 20, knowledge: 20 } });
    };

    if (gameStep === 'finished') {
        return (
            <div className="minigame-overlay">
                <div className="minigame-container">
                    <div className="minigame-header">
                        <h2>Hồi Ức Trọn Vẹn</h2>
                    </div>
                    <div className="game-result" style={{ position: 'static', transform: 'none', background: 'transparent', boxShadow: 'none', border: 'none' }}>
                        <p className="result-text">Bạn đã nhớ lại tất cả những khoảnh khắc đẹp nhất của cuộc đời!</p>
                        <div className="result-stats-grid">
                            <div className="result-stat">🧠 Trí nhớ: Tốt</div>
                            <div className="result-stat">❤️ Hạnh phúc: +20</div>
                        </div>
                        <button className="continue-btn" onClick={handleFinish}>Tiếp tục</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="minigame-overlay">
            <div className="minigame-container">
                <div className="minigame-header">
                    <h2>🕰️ Dòng Chảy Ký Ức</h2>
                    <p>Tìm các cặp ký ức tương ứng</p>
                </div>

                <div className="game-content">
                    <div className="wedding-items-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                        {cards.map((card, index) => {
                            const isFlipped = flipped.includes(index) || matched.includes(card.pairId);
                            return (
                                <div
                                    key={index}
                                    className={`memory-card ${isFlipped ? 'selected' : ''} ${matched.includes(card.pairId) ? 'matched' : ''}`}
                                    onClick={() => handleCardClick(index)}
                                    style={{
                                        background: isFlipped ? 'rgba(255,193,7,0.2)' : 'rgba(255,255,255,0.1)',
                                        borderColor: isFlipped ? '#ffc107' : 'rgba(255,255,255,0.2)'
                                    }}
                                >
                                    {isFlipped ? (
                                        <>
                                            <span className="memory-icon">{card.icon}</span>
                                            <span style={{ fontSize: '12px', marginTop: '5px' }}>{card.text}</span>
                                        </>
                                    ) : (
                                        <span style={{ fontSize: '24px' }}>❓</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
