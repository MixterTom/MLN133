import { useState, useEffect, useRef } from 'react';
import './LatteArtGame.css';

const PATTERNS = [
    {
        name: 'Trái tim',
        emoji: '❤️',
        points: [
            { x: 50, y: 30 },
            { x: 35, y: 20 },
            { x: 25, y: 25 },
            { x: 20, y: 40 },
            { x: 25, y: 55 },
            { x: 35, y: 65 },
            { x: 50, y: 75 },
            { x: 65, y: 65 },
            { x: 75, y: 55 },
            { x: 80, y: 40 },
            { x: 75, y: 25 },
            { x: 65, y: 20 },
            { x: 50, y: 30 }
        ]
    },
    {
        name: 'Ngôi sao',
        emoji: '⭐',
        points: [
            { x: 50, y: 15 },
            { x: 55, y: 40 },
            { x: 80, y: 45 },
            { x: 60, y: 60 },
            { x: 65, y: 85 },
            { x: 50, y: 70 },
            { x: 35, y: 85 },
            { x: 40, y: 60 },
            { x: 20, y: 45 },
            { x: 45, y: 40 },
            { x: 50, y: 15 }
        ]
    },
    {
        name: 'Lá cây',
        emoji: '🍃',
        points: [
            { x: 50, y: 20 },
            { x: 60, y: 30 },
            { x: 70, y: 45 },
            { x: 75, y: 60 },
            { x: 70, y: 75 },
            { x: 50, y: 85 },
            { x: 30, y: 75 },
            { x: 25, y: 60 },
            { x: 30, y: 45 },
            { x: 40, y: 30 },
            { x: 50, y: 20 }
        ]
    }
];

export default function LatteArtGame({ onComplete }) {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawnPoints, setDrawnPoints] = useState([]);
    const [currentPattern, setCurrentPattern] = useState(null);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [gameState, setGameState] = useState('intro'); // intro, playing, result
    const [accuracy, setAccuracy] = useState(0);

    useEffect(() => {
        if (gameState === 'intro') {
            // Random pattern
            const pattern = PATTERNS[Math.floor(Math.random() * PATTERNS.length)];
            setCurrentPattern(pattern);
        }
    }, [gameState]);

    // Timer
    useEffect(() => {
        if (gameState !== 'playing') return;

        if (timeLeft <= 0) {
            finishGame();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(t => t - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [gameState, timeLeft]);

    // Draw pattern on canvas
    useEffect(() => {
        if (!canvasRef.current || !currentPattern) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw coffee cup background
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw milk foam
        ctx.fillStyle = '#F5E6D3';
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width * 0.4, 0, Math.PI * 2);
        ctx.fill();

        if (gameState === 'intro' || gameState === 'result') {
            // Draw pattern guide
            ctx.strokeStyle = 'rgba(139, 69, 19, 0.3)';
            ctx.lineWidth = 3;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            currentPattern.points.forEach((point, i) => {
                const x = (point.x / 100) * canvas.width;
                const y = (point.y / 100) * canvas.height;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Draw user's drawing - convert percentage to pixels
        if (drawnPoints.length > 0) {
            ctx.strokeStyle = '#8B4513';
            ctx.lineWidth = 4;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            drawnPoints.forEach((point, i) => {
                // Convert percentage (0-100) to canvas pixels
                const x = (point.x / 100) * canvas.width;
                const y = (point.y / 100) * canvas.height;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();
        }
    }, [currentPattern, drawnPoints, gameState]);

    const startDrawing = (e) => {
        if (gameState !== 'playing') return;
        setIsDrawing(true);
        const point = getMousePos(e);
        setDrawnPoints([point]);
    };

    const draw = (e) => {
        if (!isDrawing || gameState !== 'playing') return;
        const point = getMousePos(e);
        setDrawnPoints(prev => [...prev, point]);
    };

    const stopDrawing = () => {
        if (!isDrawing) return;
        setIsDrawing(false);
        calculateAccuracy();
    };

    const getMousePos = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        // Calculate position as percentage (0-100) so it scales properly
        const x = ((clientX - rect.left) / rect.width) * 100;
        const y = ((clientY - rect.top) / rect.height) * 100;

        return { x, y };
    };

    const calculateAccuracy = () => {
        if (drawnPoints.length < 5 || !currentPattern) return;

        const patternPoints = currentPattern.points;

        // 1. Calculate coverage - how many pattern points are close to drawn points
        let coveredPatternPoints = 0;
        patternPoints.forEach(pattern => {
            let minDist = Infinity;
            drawnPoints.forEach(drawn => {
                const dist = Math.sqrt(
                    Math.pow(drawn.x - pattern.x, 2) +
                    Math.pow(drawn.y - pattern.y, 2)
                );
                minDist = Math.min(minDist, dist);
            });
            // Pattern point is "covered" if drawn within 8% distance
            if (minDist < 8) {
                coveredPatternPoints++;
            }
        });
        const coverageScore = (coveredPatternPoints / patternPoints.length) * 100;

        // 2. Calculate precision - how close drawn points are to pattern
        let totalDistance = 0;
        let checkedPoints = 0;

        drawnPoints.forEach(drawn => {
            let minDist = Infinity;
            patternPoints.forEach(pattern => {
                const dist = Math.sqrt(
                    Math.pow(drawn.x - pattern.x, 2) +
                    Math.pow(drawn.y - pattern.y, 2)
                );
                minDist = Math.min(minDist, dist);
            });
            totalDistance += minDist;
            checkedPoints++;
        });

        const avgDistance = totalDistance / checkedPoints;
        const maxDistance = 15; // Stricter: 15% instead of 30%
        const precisionScore = Math.max(0, 100 - (avgDistance / maxDistance) * 100);

        // 3. Penalize if too few or too many points
        const idealPointCount = patternPoints.length * 3; // Should draw ~3x pattern points
        const pointRatio = drawnPoints.length / idealPointCount;
        let pointPenalty = 1.0;
        if (pointRatio < 0.5) {
            // Too few points - incomplete drawing
            pointPenalty = 0.6;
        } else if (pointRatio > 2.5) {
            // Too many points - messy drawing
            pointPenalty = 0.7;
        } else if (pointRatio < 0.8 || pointRatio > 1.5) {
            pointPenalty = 0.85;
        }

        // Final score: weighted average with penalty
        // Coverage 40%, Precision 60%
        const finalScore = ((coverageScore * 0.4) + (precisionScore * 0.6)) * pointPenalty;

        setAccuracy(Math.round(finalScore));
        setScore(Math.round(finalScore));
    };

    const startGame = () => {
        setGameState('playing');
        setDrawnPoints([]);
        setScore(0);
        setTimeLeft(30);
        setAccuracy(0);
    };

    const finishGame = () => {
        setGameState('result');
        calculateAccuracy();
    };

    const handleComplete = () => {
        let result = 'poor';
        let cafeType = 'street';
        let bonusStats = {};

        if (score >= 70) {
            result = 'excellent';
            cafeType = 'highlands';
            bonusStats = { economy: 15, social: 10, happiness: 5 };
        } else if (score >= 40) {
            result = 'good';
            cafeType = 'normal';
            bonusStats = { economy: 10, social: 5 };
        } else {
            result = 'poor';
            cafeType = 'street';
            bonusStats = { economy: 5, happiness: -5 };
        }

        onComplete({
            score,
            accuracy,
            result,
            cafeType,
            bonusStats
        });
    };

    const clearDrawing = () => {
        setDrawnPoints([]);
        setScore(0);
        setAccuracy(0);
    };

    // Intro screen
    if (gameState === 'intro') {
        return (
            <div className="minigame-overlay">
                <div className="latte-art-container">
                    <h2>☕ Latte Art Challenge</h2>
                    <p className="intro-text">Chủ quán muốn test kỹ năng của bạn!</p>

                    <div className="pattern-preview">
                        <canvas
                            ref={canvasRef}
                            width={300}
                            height={300}
                            className="art-canvas preview"
                        />
                        <div className="pattern-info">
                            <span className="pattern-emoji">{currentPattern?.emoji}</span>
                            <span className="pattern-name">Vẽ: {currentPattern?.name}</span>
                        </div>
                    </div>

                    <div className="instructions">
                        <p>🎨 Dùng chuột/ngón tay vẽ theo đường nét chấm</p>
                        <p>⏱️ Thời gian: 30 giây</p>
                        <p>🎯 Vẽ càng giống = điểm càng cao!</p>
                    </div>

                    <button className="start-btn" onClick={startGame}>
                        Bắt đầu vẽ! 🎨
                    </button>
                </div>
            </div>
        );
    }

    // Playing screen
    if (gameState === 'playing') {
        return (
            <div className="minigame-overlay">
                <div className="latte-art-container playing">
                    <div className="game-header">
                        <div className="pattern-target">
                            <span className="pattern-emoji">{currentPattern?.emoji}</span>
                            <span>Vẽ: {currentPattern?.name}</span>
                        </div>
                        <div className="timer">⏱️ {timeLeft}s</div>
                    </div>

                    <canvas
                        ref={canvasRef}
                        width={400}
                        height={400}
                        className="art-canvas"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                    />

                    <div className="game-controls">
                        <button className="clear-btn" onClick={clearDrawing}>
                            🗑️ Xóa
                        </button>
                        <button className="done-btn" onClick={finishGame}>
                            ✅ Xong
                        </button>
                    </div>

                    <div className="hint">
                        💡 Vẽ theo đường chấm để được điểm cao!
                    </div>
                </div>
            </div>
        );
    }

    // Result screen
    const getResultMessage = () => {
        if (score >= 70) {
            return {
                title: '🌟 Xuất sắc!',
                desc: 'Kỹ năng latte art tuyệt vời! Bạn được nhận vào Highlands Coffee!',
                cafe: '☕ Highlands Coffee',
                salary: '50.000đ/giờ',
                color: '#2ecc71'
            };
        } else if (score >= 40) {
            return {
                title: '👍 Tốt lắm!',
                desc: 'Kỹ năng ổn! Bạn được nhận vào The Coffee House!',
                cafe: '☕ The Coffee House',
                salary: '35.000đ/giờ',
                color: '#f39c12'
            };
        } else {
            return {
                title: '😅 Cần cố gắng!',
                desc: 'Kỹ năng còn hạn chế. Bạn làm ở quán cafe vỉa hè trước nhé!',
                cafe: '☕ Quán Cafe Vỉa Hè',
                salary: '20.000đ/giờ',
                color: '#e74c3c'
            };
        }
    };

    const result = getResultMessage();

    return (
        <div className="minigame-overlay">
            <div className="latte-art-container result">
                <h2 style={{ color: result.color }}>{result.title}</h2>

                <div className="result-canvas">
                    <canvas
                        ref={canvasRef}
                        width={300}
                        height={300}
                        className="art-canvas"
                    />
                </div>

                <div className="result-stats">
                    <div className="stat-box">
                        <span className="stat-label">Độ chính xác</span>
                        <span className="stat-value">{Math.round(accuracy)}%</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-label">Điểm số</span>
                        <span className="stat-value">{score}/100</span>
                    </div>
                </div>

                <div className="result-message">
                    <p>{result.desc}</p>
                    <div className="cafe-info">
                        <h3>{result.cafe}</h3>
                        <p className="salary">Lương: {result.salary}</p>
                    </div>
                </div>

                <button className="continue-btn" onClick={handleComplete}>
                    Tiếp tục →
                </button>
            </div>
        </div>
    );
}
