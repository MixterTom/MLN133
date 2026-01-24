import { useState, useEffect, useRef } from 'react';
import './CafeQTE.css';

export default function CafeQTE({ onComplete }) {
    const [orders, setOrders] = useState([]);
    const [score, setScore] = useState(0);
    const [missed, setMissed] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [gameOver, setGameOver] = useState(false);
    const [difficulty, setDifficulty] = useState(1);

    const drinks = [
        { name: '☕ Cà phê', key: 'Q' },
        { name: '🧋 Trà sữa', key: 'W' },
        { name: '🥤 Trà đào', key: 'E' },
        { name: '🍵 Cappuccino', key: 'R' }
    ];

    // Increase difficulty every 10 seconds
    useEffect(() => {
        if (timeLeft === 20) setDifficulty(2);
        if (timeLeft === 10) setDifficulty(3);
    }, [timeLeft]);

    // Spawn orders based on difficulty
    useEffect(() => {
        if (gameOver || timeLeft === 0) return;

        const spawnInterval = Math.max(1200, 2500 - (difficulty * 400)); // Chậm hơn

        const orderInterval = setInterval(() => {
            const randomDrink = drinks[Math.floor(Math.random() * drinks.length)];
            const newOrder = {
                id: Date.now() + Math.random(),
                drink: randomDrink.name,
                key: randomDrink.key,
                position: 0,
                lane: Math.floor(Math.random() * 4)
            };
            setOrders(prev => [...prev, newOrder]);
        }, spawnInterval);

        // Spawn first order immediately
        if (orders.length === 0) {
            const randomDrink = drinks[Math.floor(Math.random() * drinks.length)];
            const firstOrder = {
                id: Date.now(),
                drink: randomDrink.name,
                key: randomDrink.key,
                position: 0,
                lane: Math.floor(Math.random() * 4)
            };
            setOrders([firstOrder]);
        }

        return () => clearInterval(orderInterval);
    }, [gameOver, timeLeft, difficulty]);

    // Timer countdown
    useEffect(() => {
        if (timeLeft > 0 && !gameOver) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0) {
            setGameOver(true);
        }
    }, [timeLeft, gameOver]);

    // Move orders down
    useEffect(() => {
        if (gameOver) return;

        const moveInterval = setInterval(() => {
            setOrders(prev => {
                const updated = prev.map(order => ({
                    ...order,
                    position: order.position + (1.5 + difficulty * 0.3) // Chậm hơn
                }));

                const stillActive = [];
                updated.forEach(order => {
                    if (order.position >= 92) {
                        setMissed(m => m + 1);
                        // Không trừ điểm khi miss, chỉ đếm số lần miss
                    } else {
                        stillActive.push(order);
                    }
                });

                return stillActive;
            });
        }, 50);

        return () => clearInterval(moveInterval);
    }, [gameOver, difficulty]);

    // Keyboard handler
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (gameOver) return;

            const key = e.key.toUpperCase();

            // Tìm món đồ gần đường đỏ nhất (70-95%)
            const matchedOrder = orders.find(order =>
                order.key === key && order.position >= 70 && order.position <= 95
            );

            if (matchedOrder) {
                // Đúng: +10 điểm
                setScore(prev => prev + 10);

                // XÓA món đồ khi bấm đúng
                setOrders(prev => prev.filter(order => order.id !== matchedOrder.id));
            } else {
                // Bấm sai hoặc bấm trước: -2 điểm
                const wrongKeyPressed = orders.some(order => order.key === key);
                if (wrongKeyPressed) {
                    setScore(prev => Math.max(0, prev - 2));
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [orders, gameOver]);

    useEffect(() => {
        if (gameOver) {
            setTimeout(() => {
                onComplete(score);
            }, 2000);
        }
    }, [gameOver, score, onComplete]);

    return (
        <div className="cafe-qte-overlay">
            <div className="cafe-qte">
                <div className="qte-header">
                    <h2>🏪 Giờ cao điểm!</h2>
                    <div className="qte-stats">
                        <span className="qte-score">Điểm: {score}</span>
                        <span className="qte-timer">⏱️ {timeLeft}s</span>
                        <span className="qte-missed">❌ Sai: {missed}</span>
                        <span className="qte-difficulty">Độ khó: {difficulty}</span>
                    </div>
                </div>

                <div className="qte-instructions">
                    Nhấn phím tương ứng khi món đồ chạm vào đường đỏ!
                </div>

                <div className="qte-game-area">
                    <div className="qte-lanes">
                        {[0, 1, 2, 3].map(lane => (
                            <div key={lane} className="qte-lane">
                                <div className="lane-key">{drinks[lane].key}</div>
                            </div>
                        ))}
                    </div>

                    <div className="qte-hit-line"></div>

                    {orders.map(order => (
                        <div
                            key={order.id}
                            className="qte-falling-order"
                            style={{
                                top: `${order.position}%`,
                                left: `${order.lane * 25 + 12.5}%`
                            }}
                        >
                            <div className="falling-drink">{order.drink}</div>
                            <div className="falling-key">{order.key}</div>
                        </div>
                    ))}
                </div>

                {gameOver && (
                    <div className="qte-result">
                        <h3>{score >= 100 ? '🎉 Xuất sắc!' : score >= 50 ? '😊 Tốt lắm!' : '😅 Cần cố gắng hơn!'}</h3>
                        <p>Điểm: {score}</p>
                        <p>Sai: {missed} lần</p>
                    </div>
                )}
            </div>
        </div>
    );
}
