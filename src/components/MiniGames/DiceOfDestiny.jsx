import { useState, useEffect } from 'react';
import './DiceOfDestiny.css';

const DICE_SYMBOLS = {
    love: { icon: '❤️', name: 'Tình yêu', value: 20, color: '#ff4757' },
    money: { icon: '💰', name: 'Tiền bạc', value: 18, color: '#ffd700' },
    family: { icon: '🏠', name: 'Gia đình', value: 20, color: '#ff6348' },
    knowledge: { icon: '📚', name: 'Học vấn', value: 15, color: '#5f27cd' },
    freedom: { icon: '🎭', name: 'Tự do', value: 12, color: '#00d2d3' },
    luck: { icon: '⚡', name: 'May mắn', value: 15, color: '#ffa502' }
};

const SYMBOL_KEYS = Object.keys(DICE_SYMBOLS);

export default function DiceOfDestiny({ origin, onComplete }) {
    const [rollCount, setRollCount] = useState(0);
    const [dice, setDice] = useState([null, null, null]);
    const [lockedDice, setLockedDice] = useState([false, false, false]);
    const [isRolling, setIsRolling] = useState(false);
    const [totalScore, setTotalScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [rollHistory, setRollHistory] = useState([]);

    const rollDice = () => {
        if (rollCount >= 5 || isRolling) return;

        setIsRolling(true);

        // Animate dice rolling
        const rollInterval = setInterval(() => {
            setDice(prev => prev.map((die, idx) =>
                lockedDice[idx] ? die : SYMBOL_KEYS[Math.floor(Math.random() * SYMBOL_KEYS.length)]
            ));
        }, 100);

        // Stop after 1 second
        setTimeout(() => {
            clearInterval(rollInterval);
            const newDice = dice.map((die, idx) =>
                lockedDice[idx] ? die : SYMBOL_KEYS[Math.floor(Math.random() * SYMBOL_KEYS.length)]
            );
            setDice(newDice);
            setIsRolling(false);
            setRollCount(rollCount + 1);
            setRollHistory([...rollHistory, newDice]);
        }, 1000);
    };

    const toggleLock = (index) => {
        if (isRolling || rollCount === 0) return;
        const newLocked = [...lockedDice];
        newLocked[index] = !newLocked[index];
        setLockedDice(newLocked);
    };

    const calculateScore = () => {
        let score = 0;
        const symbolCounts = {};

        // Count symbols
        dice.forEach(symbol => {
            symbolCounts[symbol] = (symbolCounts[symbol] || 0) + 1;
        });

        // Calculate base score
        dice.forEach(symbol => {
            score += DICE_SYMBOLS[symbol].value;
        });

        // Bonus for matching symbols
        Object.entries(symbolCounts).forEach(([symbol, count]) => {
            if (count === 2) score += 10; // Pair bonus
            if (count === 3) score += 30; // Triple bonus
        });

        // Normalize to 0-100
        score = Math.min(100, Math.round((score / 90) * 100));

        return score;
    };

    const finishGame = () => {
        const finalScore = calculateScore();
        setTotalScore(finalScore);
        setShowResult(true);

        setTimeout(() => {
            // Determine detailed origin based on score
            let detailedOrigin = origin;
            let bonusStats = {};

            if (origin === 'rich') {
                if (finalScore >= 80) {
                    detailedOrigin = 'rich_happy';
                    bonusStats = { economy: 150, happiness: 60, social: 50, health: 70, knowledge: 60 };
                } else if (finalScore >= 50) {
                    detailedOrigin = 'rich_lonely';
                    bonusStats = { economy: 150, happiness: 40, social: 30, health: 70, knowledge: 60 };
                } else {
                    detailedOrigin = 'rich_controlled';
                    bonusStats = { economy: 100, happiness: 30, social: 25, health: 60, knowledge: 55 };
                }
            } else if (origin === 'normal') {
                if (finalScore >= 80) {
                    detailedOrigin = 'normal_happy';
                    bonusStats = { economy: 50, happiness: 70, social: 60, health: 80, knowledge: 55 };
                } else if (finalScore >= 50) {
                    detailedOrigin = 'normal_stressed';
                    bonusStats = { economy: 50, happiness: 50, social: 45, health: 70, knowledge: 50 };
                } else {
                    detailedOrigin = 'normal_broken';
                    bonusStats = { economy: 30, happiness: 35, social: 30, health: 65, knowledge: 45 };
                }
            } else if (origin === 'poor') {
                if (finalScore >= 80) {
                    detailedOrigin = 'poor_loving';
                    bonusStats = { economy: 20, happiness: 60, social: 50, health: 70, knowledge: 50 };
                } else if (finalScore >= 50) {
                    detailedOrigin = 'poor_struggling';
                    bonusStats = { economy: 20, happiness: 45, social: 40, health: 65, knowledge: 45 };
                } else {
                    detailedOrigin = 'poor_broken';
                    bonusStats = { economy: 15, happiness: 30, social: 30, health: 60, knowledge: 40 };
                }
            }

            onComplete({
                score: finalScore,
                detailedOrigin,
                bonusStats,
                diceResult: dice
            });
        }, 3000);
    };

    const getResultMessage = () => {
        if (totalScore >= 80) {
            return {
                title: '🌟 Số phận tốt lành!',
                desc: 'Bạn có một gia đình hạnh phúc, đầy tình yêu thương và sự hỗ trợ.',
                color: '#2ecc71'
            };
        } else if (totalScore >= 50) {
            return {
                title: '⚖️ Số phận bình thường',
                desc: 'Gia đình bạn có cả niềm vui và khó khăn, như bao gia đình khác.',
                color: '#f39c12'
            };
        } else {
            return {
                title: '⚠️ Số phận thử thách',
                desc: 'Bạn sẽ phải đối mặt với nhiều khó khăn, nhưng điều đó sẽ rèn luyện bạn mạnh mẽ hơn.',
                color: '#e74c3c'
            };
        }
    };

    if (showResult) {
        const result = getResultMessage();
        return (
            <div className="dice-game-container">
                <div className="dice-result-screen">
                    <h2 style={{ color: result.color }}>{result.title}</h2>
                    <div className="final-dice-display">
                        {dice.map((symbol, idx) => (
                            <div key={idx} className="final-dice" style={{ borderColor: DICE_SYMBOLS[symbol].color }}>
                                <span className="dice-icon-large">{DICE_SYMBOLS[symbol].icon}</span>
                                <span className="dice-name">{DICE_SYMBOLS[symbol].name}</span>
                            </div>
                        ))}
                    </div>
                    <div className="score-display">
                        <div className="score-bar">
                            <div className="score-fill" style={{ width: `${totalScore}%`, backgroundColor: result.color }}></div>
                        </div>
                        <p className="score-text">Điểm số: {totalScore}/100</p>
                    </div>
                    <p className="result-description">{result.desc}</p>
                    <div className="loading-dots">
                        <span>.</span><span>.</span><span>.</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="dice-game-container">
            <div className="dice-game-header">
                <h2>🎲 Xúc Xắc Định Mệnh</h2>
                <p>Gieo xúc xắc để khám phá số phận gia đình bạn</p>
                <div className="roll-counter">
                    Lượt gieo: {rollCount}/5
                </div>
            </div>

            <div className="dice-display">
                {dice.map((symbol, idx) => (
                    <div
                        key={idx}
                        className={`dice ${isRolling ? 'rolling' : ''} ${lockedDice[idx] ? 'locked' : ''}`}
                        onClick={() => toggleLock(idx)}
                        style={{
                            borderColor: symbol ? DICE_SYMBOLS[symbol].color : '#ddd',
                            cursor: rollCount > 0 && !isRolling ? 'pointer' : 'default'
                        }}
                    >
                        {symbol ? (
                            <>
                                <span className="dice-icon">{DICE_SYMBOLS[symbol].icon}</span>
                                <span className="dice-label">{DICE_SYMBOLS[symbol].name}</span>
                            </>
                        ) : (
                            <span className="dice-placeholder">?</span>
                        )}
                        {lockedDice[idx] && <div className="lock-indicator">🔒</div>}
                    </div>
                ))}
            </div>

            <div className="dice-instructions">
                {rollCount === 0 && <p>Nhấn "Gieo xúc xắc" để bắt đầu!</p>}
                {rollCount > 0 && rollCount < 5 && !lockedDice.every(Boolean) && <p>Click vào xúc xắc để giữ lại, sau đó gieo lại!</p>}
                {rollCount > 0 && lockedDice.every(Boolean) && <p>Bạn đã chốt cả 3 xúc xắc. Hãy xác nhận kết quả!</p>}
                {rollCount === 5 && <p>Bạn đã hết lượt gieo. Nhấn "Xem kết quả"!</p>}
            </div>

            <div className="dice-controls">
                {rollCount < 5 && !lockedDice.every(Boolean) ? (
                    <button
                        className="roll-button"
                        onClick={rollDice}
                        disabled={isRolling}
                    >
                        {isRolling ? '🎲 Đang gieo...' : '🎲 Gieo xúc xắc'}
                    </button>
                ) : (
                    <button className="finish-button" onClick={finishGame}>
                        ✨ {rollCount < 5 ? 'Chốt kết quả ngay' : 'Xem kết quả'}
                    </button>
                )}
            </div>

            <div className="dice-legend">
                <h3>Ý nghĩa biểu tượng:</h3>
                <div className="legend-grid">
                    {Object.entries(DICE_SYMBOLS).map(([key, data]) => (
                        <div key={key} className="legend-item">
                            <span className="legend-icon">{data.icon}</span>
                            <span className="legend-name">{data.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
