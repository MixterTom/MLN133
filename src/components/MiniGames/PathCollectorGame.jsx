import { useState, useEffect, useCallback, useRef } from 'react';
import './PathCollectorGame.css';

// Config for each path type
const PATH_CONFIGS = {
    university: {
        title: '🎓 Đường đến Đại Học',
        description: 'Hứng sách vở để vào đại học chất lượng!',
        goodItems: [
            { emoji: '📚', name: 'Sách', points: 15 },
            { emoji: '📖', name: 'Giáo trình', points: 10 },
            { emoji: '🎓', name: 'Bằng cấp', points: 25 },
            { emoji: '📝', name: 'Bài tập', points: 10 },
            { emoji: '💡', name: 'Kiến thức', points: 20 },
        ],
        badItems: [
            { emoji: '🎮', name: 'Game', points: -15 },
            { emoji: '📱', name: 'Điện thoại', points: -10 },
            { emoji: '😴', name: 'Ngủ quên', points: -20 },
            { emoji: '🎉', name: 'Party', points: -15 },
        ],
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        thresholds: { excellent: 150, good: 100, average: 50 },
        resultMessages: {
            excellent: { title: '🎉 Xuất sắc!', desc: 'Bạn đỗ vào Đại học TOP đầu!' },
            good: { title: '👍 Tốt lắm!', desc: 'Bạn vào được Đại học tốt!' },
            average: { title: '😐 Tạm được', desc: 'Bạn vào Đại học bình thường' },
            poor: { title: '😢 Tiếc quá', desc: 'Bạn chỉ vào được Đại học tư thục' },
        }
    },
    work: {
        title: '💼 Đường đến Công việc',
        description: 'Thu thập kỹ năng để có công việc tốt!',
        goodItems: [
            { emoji: '💼', name: 'Kinh nghiệm', points: 15 },
            { emoji: '🔧', name: 'Kỹ năng', points: 10 },
            { emoji: '💰', name: 'Lương', points: 20 },
            { emoji: '🤝', name: 'Quan hệ', points: 15 },
            { emoji: '📈', name: 'Thăng tiến', points: 25 },
        ],
        badItems: [
            { emoji: '😴', name: 'Lười biếng', points: -15 },
            { emoji: '🎮', name: 'Giải trí', points: -10 },
            { emoji: '😤', name: 'Stress', points: -20 },
            { emoji: '💸', name: 'Tiêu xài', points: -15 },
        ],
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        thresholds: { excellent: 150, good: 100, average: 50 },
        resultMessages: {
            excellent: { title: '🎉 Xuất sắc!', desc: 'Bạn được nhận vào công ty lớn!' },
            good: { title: '👍 Tốt lắm!', desc: 'Bạn có công việc ổn định!' },
            average: { title: '😐 Tạm được', desc: 'Bạn làm việc bình thường' },
            poor: { title: '😢 Khó khăn', desc: 'Bạn phải làm công việc tay chân' },
        }
    },
    study_abroad: {
        title: '✈️ Đường đến Du Học',
        description: 'Chuẩn bị hành trang cho chuyến du học!',
        goodItems: [
            { emoji: '✈️', name: 'Visa', points: 20 },
            { emoji: '📚', name: 'IELTS', points: 15 },
            { emoji: '🎓', name: 'Học bổng', points: 25 },
            { emoji: '🌍', name: 'Văn hóa', points: 15 },
            { emoji: '💪', name: 'Quyết tâm', points: 10 },
        ],
        badItems: [
            { emoji: '🏠', name: 'Nhớ nhà', points: -15 },
            { emoji: '😰', name: 'Lo lắng', points: -10 },
            { emoji: '💸', name: 'Hết tiền', points: -20 },
            { emoji: '😢', name: 'Cô đơn', points: -15 },
        ],
        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        thresholds: { excellent: 160, good: 110, average: 60 },
        resultMessages: {
            excellent: { title: '🎉 Xuất sắc!', desc: 'Bạn nhận học bổng toàn phần!' },
            good: { title: '👍 Tốt lắm!', desc: 'Bạn du học thành công!' },
            average: { title: '😐 Tạm được', desc: 'Bạn du học nhưng khó khăn' },
            poor: { title: '😢 Thất bại', desc: 'Visa bị từ chối...' },
        }
    }
};

const PathCollectorGame = ({ pathType = 'university', onComplete }) => {
    const config = PATH_CONFIGS[pathType] || PATH_CONFIGS.university;

    const [gameState, setGameState] = useState('intro'); // intro, playing, result
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [playerX, setPlayerX] = useState(50); // percentage
    const [items, setItems] = useState([]);
    const [collectedItems, setCollectedItems] = useState([]);
    const [combo, setCombo] = useState(0);
    const [showEffect, setShowEffect] = useState(null);

    const gameAreaRef = useRef(null);
    const itemIdCounter = useRef(0);

    // Spawn items
    useEffect(() => {
        if (gameState !== 'playing') return;

        const spawnInterval = setInterval(() => {
            const isGood = Math.random() > 0.35; // 65% good items
            const itemList = isGood ? config.goodItems : config.badItems;
            const item = itemList[Math.floor(Math.random() * itemList.length)];

            const newItem = {
                id: itemIdCounter.current++,
                ...item,
                x: Math.random() * 80 + 10, // 10-90% position
                y: -10,
                isGood,
                speed: 2 + Math.random() * 2, // Random speed
            };

            setItems(prev => [...prev, newItem]);
        }, 800);

        return () => clearInterval(spawnInterval);
    }, [gameState, config]);

    // Move items down
    useEffect(() => {
        if (gameState !== 'playing') return;

        const moveInterval = setInterval(() => {
            setItems(prev => {
                return prev
                    .map(item => ({ ...item, y: item.y + item.speed }))
                    .filter(item => item.y < 110); // Remove items that fall off screen
            });
        }, 50);

        return () => clearInterval(moveInterval);
    }, [gameState]);

    // Check collisions
    useEffect(() => {
        if (gameState !== 'playing') return;

        const checkCollision = () => {
            setItems(prev => {
                const remaining = [];
                let scoreChange = 0;
                let newCollected = [];
                let hitGood = false;
                let hitBad = false;

                prev.forEach(item => {
                    // Check if item is at player level (y: 75-90%) and within player range
                    const playerLeft = playerX - 12;
                    const playerRight = playerX + 12;

                    if (item.y >= 75 && item.y <= 95 && item.x >= playerLeft && item.x <= playerRight) {
                        // Collision!
                        scoreChange += item.points;
                        newCollected.push(item);

                        if (item.isGood) hitGood = true;
                        else hitBad = true;
                    } else {
                        remaining.push(item);
                    }
                });

                if (scoreChange !== 0) {
                    setScore(s => Math.max(0, s + scoreChange));
                    setCollectedItems(c => [...c, ...newCollected]);

                    if (hitGood) {
                        setCombo(c => c + 1);
                        setShowEffect({ type: 'good', text: `+${scoreChange}${combo > 2 ? ` x${combo}` : ''}` });
                    } else if (hitBad) {
                        setCombo(0);
                        setShowEffect({ type: 'bad', text: `${scoreChange}` });
                    }

                    setTimeout(() => setShowEffect(null), 500);
                }

                return remaining;
            });
        };

        const collisionInterval = setInterval(checkCollision, 50);
        return () => clearInterval(collisionInterval);
    }, [gameState, playerX, combo]);

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

    // Keyboard controls
    useEffect(() => {
        if (gameState !== 'playing') return;

        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                setPlayerX(x => Math.max(10, x - 5));
            } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                setPlayerX(x => Math.min(90, x + 5));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameState]);

    // Mouse/Touch controls
    const handleMouseMove = useCallback((e) => {
        if (gameState !== 'playing' || !gameAreaRef.current) return;

        const rect = gameAreaRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        setPlayerX(Math.max(10, Math.min(90, x)));
    }, [gameState]);

    const handleTouchMove = useCallback((e) => {
        if (gameState !== 'playing' || !gameAreaRef.current) return;

        const rect = gameAreaRef.current.getBoundingClientRect();
        const touch = e.touches[0];
        const x = ((touch.clientX - rect.left) / rect.width) * 100;
        setPlayerX(Math.max(10, Math.min(90, x)));
    }, [gameState]);

    const startGame = () => {
        setGameState('playing');
        setScore(0);
        setTimeLeft(30);
        setItems([]);
        setCollectedItems([]);
        setCombo(0);
        setPlayerX(50);
    };

    const getResult = () => {
        const { thresholds } = config;
        if (score >= thresholds.excellent) return 'excellent';
        if (score >= thresholds.good) return 'good';
        if (score >= thresholds.average) return 'average';
        return 'poor';
    };

    const handleComplete = () => {
        const result = getResult();
        onComplete({
            score,
            result,
            pathType,
            collectedItems: collectedItems.length
        });
    };

    // Intro screen
    if (gameState === 'intro') {
        return (
            <div className="minigame-overlay">
                <div className="path-collector-container" style={{ background: config.background }}>
                    <div className="path-intro">
                        <h2>{config.title}</h2>
                        <p className="intro-desc">{config.description}</p>

                        <div className="intro-items">
                            <div className="intro-section good">
                                <h3>✅ Hứng những thứ này:</h3>
                                <div className="item-list">
                                    {config.goodItems.map((item, i) => (
                                        <span key={i} className="item-preview">
                                            {item.emoji} {item.name} (+{item.points})
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="intro-section bad">
                                <h3>❌ Tránh những thứ này:</h3>
                                <div className="item-list">
                                    {config.badItems.map((item, i) => (
                                        <span key={i} className="item-preview">
                                            {item.emoji} {item.name} ({item.points})
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="controls-info">
                            <p>🎮 <strong>Điều khiển:</strong> Di chuyển chuột / Phím ← → / Touch</p>
                            <p>⏱️ <strong>Thời gian:</strong> 30 giây</p>
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
        return (
            <div className="minigame-overlay">
                <div className="path-collector-container playing" style={{ background: config.background }}>
                    <div className="game-header">
                        <div className="score">🏆 Điểm: {score}</div>
                        <div className="title">{config.title}</div>
                        <div className={`timer ${timeLeft <= 10 ? 'urgent' : ''}`}>⏱️ {timeLeft}s</div>
                    </div>

                    {combo > 2 && (
                        <div className="combo-display">🔥 Combo x{combo}!</div>
                    )}

                    <div
                        ref={gameAreaRef}
                        className="game-area"
                        onMouseMove={handleMouseMove}
                        onTouchMove={handleTouchMove}
                    >
                        {/* Falling items */}
                        {items.map(item => (
                            <div
                                key={item.id}
                                className={`falling-item ${item.isGood ? 'good' : 'bad'}`}
                                style={{
                                    left: `${item.x}%`,
                                    top: `${item.y}%`,
                                }}
                            >
                                {item.emoji}
                            </div>
                        ))}

                        {/* Player */}
                        <div
                            className="player-character"
                            style={{ left: `${playerX}%` }}
                        >
                            <div className="player-basket">🧺</div>
                            <div className="player-body">🧑‍🎓</div>
                        </div>

                        {/* Score effect */}
                        {showEffect && (
                            <div className={`score-effect ${showEffect.type}`}>
                                {showEffect.text}
                            </div>
                        )}
                    </div>

                    <div className="game-footer">
                        <div className="collected-preview">
                            {collectedItems.slice(-5).map((item, i) => (
                                <span key={i} className={item.isGood ? 'good' : 'bad'}>
                                    {item.emoji}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Result screen
    const result = getResult();
    const resultMessage = config.resultMessages[result];

    return (
        <div className="minigame-overlay">
            <div className="path-collector-container result" style={{ background: config.background }}>
                <div className="result-screen">
                    <h2>{resultMessage.title}</h2>

                    <div className="final-score">
                        <span className="score-number">{score}</span>
                        <span className="score-label">điểm</span>
                    </div>

                    <p className="result-desc">{resultMessage.desc}</p>

                    <div className="result-stats">
                        <div className="stat">
                            <span className="stat-value">{collectedItems.filter(i => i.isGood).length}</span>
                            <span className="stat-label">✅ Item tốt</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value">{collectedItems.filter(i => !i.isGood).length}</span>
                            <span className="stat-label">❌ Item xấu</span>
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

export default PathCollectorGame;
