import { useState, useEffect } from 'react';
import './MiniGame.css';
import './LanguageLearningGame.css';

// Vocabulary pairs for matching
const VOCABULARY_SETS = [
    // Set 1: Basic Academic
    [
        { english: 'Assignment', vietnamese: 'Bài tập', category: 'academic' },
        { english: 'Deadline', vietnamese: 'Hạn chót', category: 'academic' },
        { english: 'Professor', vietnamese: 'Giáo sư', category: 'academic' },
        { english: 'Lecture', vietnamese: 'Bài giảng', category: 'academic' },
        { english: 'Semester', vietnamese: 'Học kỳ', category: 'academic' },
        { english: 'Scholarship', vietnamese: 'Học bổng', category: 'academic' }
    ],
    // Set 2: Daily Life
    [
        { english: 'Grocery', vietnamese: 'Tạp hóa', category: 'daily' },
        { english: 'Laundry', vietnamese: 'Giặt ủi', category: 'daily' },
        { english: 'Roommate', vietnamese: 'Bạn cùng phòng', category: 'daily' },
        { english: 'Rent', vietnamese: 'Tiền thuê', category: 'daily' },
        { english: 'Utilities', vietnamese: 'Tiện ích', category: 'daily' },
        { english: 'Neighborhood', vietnamese: 'Khu phố', category: 'daily' }
    ],
    // Set 3: Social
    [
        { english: 'Hang out', vietnamese: 'Đi chơi', category: 'social' },
        { english: 'Catch up', vietnamese: 'Trò chuyện', category: 'social' },
        { english: 'Party', vietnamese: 'Tiệc tùng', category: 'social' },
        { english: 'Friend', vietnamese: 'Bạn bè', category: 'social' },
        { english: 'Introduce', vietnamese: 'Giới thiệu', category: 'social' },
        { english: 'Invite', vietnamese: 'Mời', category: 'social' }
    ]
];

const LanguageLearningGame = ({ onComplete }) => {
    const [gameState, setGameState] = useState('intro');
    const [timeLeft, setTimeLeft] = useState(60);
    const [score, setScore] = useState(0);
    const [currentSet, setCurrentSet] = useState(0);
    const [cards, setCards] = useState([]);
    const [selectedCards, setSelectedCards] = useState([]);
    const [matchedPairs, setMatchedPairs] = useState([]);
    const [wrongAttempts, setWrongAttempts] = useState(0);

    // Initialize cards when game starts
    useEffect(() => {
        if (gameState === 'playing') {
            initializeCards();
        }
    }, [gameState, currentSet]);

    const initializeCards = () => {
        const vocabSet = VOCABULARY_SETS[currentSet];
        const englishCards = vocabSet.map((vocab, index) => ({
            id: `en-${index}`,
            text: vocab.english,
            type: 'english',
            pairId: index,
            matched: false
        }));
        const vietnameseCards = vocabSet.map((vocab, index) => ({
            id: `vi-${index}`,
            text: vocab.vietnamese,
            type: 'vietnamese',
            pairId: index,
            matched: false
        }));

        // Shuffle cards
        const allCards = [...englishCards, ...vietnameseCards].sort(() => Math.random() - 0.5);
        setCards(allCards);
        setSelectedCards([]);
        setMatchedPairs([]);
    };

    // Timer
    useEffect(() => {
        if (gameState !== 'playing') return;

        const timer = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    setGameState('result');
                    return 0;
                }
                return t - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [gameState]);

    // Check for match when 2 cards are selected
    useEffect(() => {
        if (selectedCards.length === 2) {
            const [card1, card2] = selectedCards;

            if (card1.pairId === card2.pairId && card1.type !== card2.type) {
                // Match!
                setScore(s => s + 10);
                setMatchedPairs([...matchedPairs, card1.pairId]);

                // Update cards to show matched
                setCards(cards.map(card =>
                    card.pairId === card1.pairId ? { ...card, matched: true } : card
                ));

                setTimeout(() => {
                    setSelectedCards([]);

                    // Check if all pairs matched in this set
                    if (matchedPairs.length + 1 === VOCABULARY_SETS[currentSet].length) {
                        if (currentSet < VOCABULARY_SETS.length - 1) {
                            // Move to next set
                            setCurrentSet(currentSet + 1);
                            setScore(s => s + 20); // Bonus for completing set
                        } else {
                            // All sets completed
                            setGameState('result');
                        }
                    }
                }, 500);
            } else {
                // No match
                setWrongAttempts(w => w + 1);
                setTimeout(() => {
                    setSelectedCards([]);
                }, 800);
            }
        }
    }, [selectedCards]);

    const startGame = () => {
        setGameState('playing');
        setTimeLeft(60);
        setScore(0);
        setCurrentSet(0);
        setWrongAttempts(0);
    };

    const handleCardClick = (card) => {
        if (card.matched || selectedCards.length >= 2 || selectedCards.find(c => c.id === card.id)) {
            return;
        }
        setSelectedCards([...selectedCards, card]);
    };

    const getResult = () => {
        const totalPossible = VOCABULARY_SETS.reduce((sum, set) => sum + set.length, 0) * 10 + VOCABULARY_SETS.length * 20;
        const percentage = (score / totalPossible) * 100;

        if (percentage >= 80) return 'excellent';
        if (percentage >= 60) return 'good';
        if (percentage >= 40) return 'average';
        return 'poor';
    };

    const getResultMessage = () => {
        const result = getResult();

        if (result === 'excellent') {
            return {
                title: '🎉 Xuất Sắc!',
                desc: 'Tiếng Anh của bạn tiến bộ rất nhanh! Bạn có khả năng học ngôn ngữ tuyệt vời!',
                bonusStats: { knowledge: 20, social: 10, happiness: 10 }
            };
        } else if (result === 'good') {
            return {
                title: '👍 Tốt Lắm!',
                desc: 'Bạn đã học được nhiều từ vựng mới! Tiếng Anh của bạn đang tiến bộ!',
                bonusStats: { knowledge: 15, social: 5, happiness: 5 }
            };
        } else if (result === 'average') {
            return {
                title: '😐 Tạm Được',
                desc: 'Bạn cần luyện tập thêm. Từ vựng vẫn còn hạn chế.',
                bonusStats: { knowledge: 10, social: 0, happiness: 0 }
            };
        } else {
            return {
                title: '😢 Cần Cố Gắng',
                desc: 'Tiếng Anh của bạn vẫn còn yếu. Bạn cần học chăm chỉ hơn!',
                bonusStats: { knowledge: 5, social: -5, happiness: -5 }
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
            matchedPairs: matchedPairs.length,
            wrongAttempts,
            setsCompleted: currentSet + (matchedPairs.length === VOCABULARY_SETS[currentSet].length ? 1 : 0)
        });
    };

    // Intro screen
    if (gameState === 'intro') {
        return (
            <div className="minigame-overlay">
                <div className="minigame-container">
                    <div className="minigame-intro">
                        <h2>📚 Học Tiếng Anh</h2>
                        <p className="intro-desc">Ghép từ tiếng Anh với nghĩa tiếng Việt!</p>

                        <div className="language-rules">
                            <h3>📋 Quy tắc:</h3>
                            <ul>
                                <li>⏱️ Thời gian: 60 giây</li>
                                <li>🎯 Ghép từ tiếng Anh với nghĩa tiếng Việt</li>
                                <li>⭐ Mỗi cặp đúng: +10 điểm</li>
                                <li>🎁 Hoàn thành 1 set: +20 điểm bonus</li>
                                <li>📚 Có 3 sets từ vựng khác nhau</li>
                            </ul>
                        </div>

                        <div className="language-categories">
                            <h3>📖 Chủ đề:</h3>
                            <div className="category-list">
                                <span className="category-badge">🎓 Academic</span>
                                <span className="category-badge">🏠 Daily Life</span>
                                <span className="category-badge">👥 Social</span>
                            </div>
                        </div>

                        <button className="start-game-btn" onClick={startGame}>
                            🚀 Bắt Đầu Học!
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Playing screen
    if (gameState === 'playing') {
        return (
            <div className="minigame-overlay">
                <div className="minigame-container">
                    <div className="language-game">
                        <div className="language-header">
                            <div className="set-progress">
                                Set {currentSet + 1}/{VOCABULARY_SETS.length}
                            </div>
                            <div className="language-score">
                                🏆 {score} điểm
                            </div>
                            <div className={`language-timer ${timeLeft <= 10 ? 'urgent' : ''}`}>
                                ⏱️ {timeLeft}s
                            </div>
                        </div>

                        <div className="match-progress">
                            Đã ghép: {matchedPairs.length}/{VOCABULARY_SETS[currentSet].length}
                        </div>

                        <div className="cards-grid">
                            {cards.map(card => (
                                <button
                                    key={card.id}
                                    className={`vocab-card ${card.type} ${card.matched ? 'matched' : ''
                                        } ${selectedCards.find(c => c.id === card.id) ? 'selected' : ''
                                        }`}
                                    onClick={() => handleCardClick(card)}
                                    disabled={card.matched}
                                >
                                    <span className="card-text">{card.text}</span>
                                    {card.matched && <span className="check-mark">✓</span>}
                                </button>
                            ))}
                        </div>

                        {selectedCards.length === 2 && selectedCards[0].pairId !== selectedCards[1].pairId && (
                            <div className="wrong-feedback">
                                ❌ Không đúng! Thử lại!
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
                            <span className="stat-value">{matchedPairs.length}</span>
                            <span className="stat-label">✅ Cặp đúng</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value">{wrongAttempts}</span>
                            <span className="stat-label">❌ Sai</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value">{currentSet + (matchedPairs.length === VOCABULARY_SETS[currentSet].length ? 1 : 0)}</span>
                            <span className="stat-label">📚 Sets hoàn thành</span>
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

export default LanguageLearningGame;
