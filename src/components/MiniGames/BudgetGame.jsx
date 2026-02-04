import { useState, useEffect } from 'react';
import './MiniGame.css';

export default function BudgetGame({ onComplete }) {
    const [budget, setBudget] = useState(1000); // 1000k/tháng
    const [allocations, setAllocations] = useState({
        food: 0,
        study: 0,
        entertainment: 0,
        savings: 0
    });
    const [timeLeft, setTimeLeft] = useState(60);
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(1);
    const [gameOver, setGameOver] = useState(false);

    const categories = [
        { key: 'food', label: '🍔 Ăn uống', min: 200, ideal: 400, max: 600 },
        { key: 'study', label: '📚 Học tập', min: 100, ideal: 300, max: 500 },
        { key: 'entertainment', label: '🎮 Giải trí', min: 50, ideal: 150, max: 300 },
        { key: 'savings', label: '💰 Tiết kiệm', min: 0, ideal: 200, max: 500 }
    ];

    // Timer
    useEffect(() => {
        if (timeLeft <= 0) {
            calculateFinalScore();
            return;
        }
        if (!gameOver) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft, gameOver]);

    // Check if budget is fully allocated
    useEffect(() => {
        const total = Object.values(allocations).reduce((sum, val) => sum + val, 0);
        if (total === budget && round <= 3) {
            // Round complete
            const roundScore = calculateRoundScore();
            setScore(score + roundScore);
            
            if (round < 3) {
                setTimeout(() => {
                    setRound(round + 1);
                    setBudget(1000 + (round * 200)); // Tăng budget mỗi round
                    setAllocations({ food: 0, study: 0, entertainment: 0, savings: 0 });
                }, 1500);
            } else {
                calculateFinalScore();
            }
        }
    }, [allocations, budget, round]);

    const calculateRoundScore = () => {
        let roundScore = 0;
        categories.forEach(cat => {
            const allocated = allocations[cat.key];
            if (allocated >= cat.min && allocated <= cat.max) {
                // Trong phạm vi cho phép
                const distance = Math.abs(allocated - cat.ideal);
                const maxDistance = cat.max - cat.min;
                const percentage = 1 - (distance / maxDistance);
                roundScore += Math.round(percentage * 50);
            } else {
                // Ngoài phạm vi - trừ điểm
                roundScore -= 20;
            }
        });
        return Math.max(0, roundScore);
    };

    const calculateFinalScore = () => {
        if (gameOver) return;
        setGameOver(true);
        
        let finalScore = score;
        // Bonus cho thời gian còn lại
        finalScore += Math.floor(timeLeft / 2);
        
        // Bonus cho tiết kiệm
        if (allocations.savings >= 150) {
            finalScore += 30;
        }
        
        setTimeout(() => {
            onComplete(Math.max(0, finalScore));
        }, 2000);
    };

    const handleAllocate = (category, amount) => {
        if (gameOver) return;
        
        const currentTotal = Object.values(allocations).reduce((sum, val) => sum + val, 0);
        const newAmount = allocations[category] + amount;
        const newTotal = currentTotal - allocations[category] + newAmount;
        
        if (newAmount >= 0 && newTotal <= budget) {
            setAllocations(prev => ({
                ...prev,
                [category]: newAmount
            }));
        }
    };

    const totalAllocated = Object.values(allocations).reduce((sum, val) => sum + val, 0);
    const remaining = budget - totalAllocated;

    return (
        <div className="minigame-overlay">
            <div className="minigame-container budget-game">
                <div className="minigame-header">
                    <h2>💰 Quản Lý Ngân Sách Sinh Viên</h2>
                    <div className="minigame-stats">
                        <span className="timer">⏱️ {timeLeft}s</span>
                        <span className="score">📊 {score} điểm</span>
                        <span className="round">📅 Tháng {round}/3</span>
                    </div>
                </div>

                <div className="budget-info">
                    <div className="budget-total">
                        <span>Ngân sách: <strong>{budget}k</strong></span>
                        <span className={remaining >= 0 ? 'remaining' : 'over-budget'}>
                            Còn lại: <strong>{remaining}k</strong>
                        </span>
                    </div>
                </div>

                <div className="budget-instructions">
                    <p>Phân bổ ngân sách khôn ngoan! Mỗi tháng có mức lý tưởng khác nhau.</p>
                </div>

                <div className="budget-categories">
                    {categories.map(cat => {
                        const allocated = allocations[cat.key];
                        const isIdeal = Math.abs(allocated - cat.ideal) <= 50;
                        const isInRange = allocated >= cat.min && allocated <= cat.max;
                        
                        return (
                            <div key={cat.key} className={`budget-category ${isIdeal ? 'ideal' : isInRange ? 'good' : allocated > cat.max ? 'over' : 'under'}`}>
                                <div className="category-header">
                                    <span className="category-label">{cat.label}</span>
                                    <span className="category-amount">{allocated}k</span>
                                </div>
                                <div className="category-range">
                                    <span>Lý tưởng: {cat.ideal}k</span>
                                    <span>({cat.min}k - {cat.max}k)</span>
                                </div>
                                <div className="category-controls">
                                    <button onClick={() => handleAllocate(cat.key, -50)} disabled={allocated <= 0}>-50</button>
                                    <button onClick={() => handleAllocate(cat.key, -10)} disabled={allocated <= 0}>-10</button>
                                    <div className="amount-display">{allocated}k</div>
                                    <button onClick={() => handleAllocate(cat.key, 10)} disabled={remaining < 10}>+10</button>
                                    <button onClick={() => handleAllocate(cat.key, 50)} disabled={remaining < 50}>+50</button>
                                </div>
                                <div className="category-bar">
                                    <div 
                                        className="category-fill"
                                        style={{ 
                                            width: `${(allocated / cat.max) * 100}%`,
                                            backgroundColor: isIdeal ? '#2ed573' : isInRange ? '#ffa502' : '#ff4757'
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {gameOver && (
                    <div className="game-over-message">
                        <h3>Hoàn thành!</h3>
                        <p>Điểm số: {score}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
