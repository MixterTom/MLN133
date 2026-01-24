import { useState, useEffect } from 'react';
import './MiniGame.css';

export default function WorkBalanceGame({ onComplete }) {
    const [timeLeft, setTimeLeft] = useState(30); // 30 seconds simulation
    const [stats, setStats] = useState({
        work: 50,
        family: 50,
        health: 50,
        stress: 0
    });
    const [events, setEvents] = useState([]);
    const [activeAction, setActiveAction] = useState(null);
    const [gameOver, setGameOver] = useState(false);

    // Actions
    const actions = [
        { id: 'work', name: 'Làm việc', icon: '💼', color: '#4488ff', effect: { work: 2, stress: 2, family: -1, health: -1 } },
        { id: 'family', name: 'Gia đình', icon: '👨‍👩‍👧', color: '#e91e63', effect: { family: 3, stress: -1, work: -1, health: 0 } },
        { id: 'rest', name: 'Nghỉ ngơi', icon: '☕', color: '#4caf50', effect: { health: 3, stress: -2, work: -1, family: 0 } },
        { id: 'social', name: 'Bạn bè', icon: '🍻', color: '#9c27b0', effect: { stress: -3, social: 2, health: -2, work: -1 } }
    ];

    useEffect(() => {
        if (gameOver) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 0) {
                    setGameOver(true);
                    return 0;
                }
                return prev - 1;
            });

            // Random events
            if (Math.random() < 0.1) {
                const newEvent = generateEvent();
                setEvents(prev => [...prev, newEvent]);
                setTimeout(() => {
                    setEvents(prev => prev.filter(e => e.id !== newEvent.id));
                }, 3000);
            }

            // Apply active action
            if (activeAction) {
                setStats(prev => ({
                    work: Math.min(100, Math.max(0, prev.work + activeAction.effect.work)),
                    family: Math.min(100, Math.max(0, prev.family + activeAction.effect.family)),
                    health: Math.min(100, Math.max(0, prev.health + activeAction.effect.health)),
                    stress: Math.min(100, Math.max(0, prev.stress + activeAction.effect.stress + (prev.stress > 80 ? 1 : 0)))
                }));
            } else {
                // Passive decay
                setStats(prev => ({
                    work: Math.max(0, prev.work - 0.2),
                    family: Math.max(0, prev.family - 0.2),
                    health: Math.max(0, prev.health - 0.1),
                    stress: Math.max(0, prev.stress - 0.1)
                }));
            }

        }, 500); // Fast simulation

        return () => clearInterval(timer);
    }, [gameOver, activeAction]);

    const generateEvent = () => {
        const types = [
            { text: "Sếp gọi cháy máy! 📞", effect: { stress: 10, work: -5 } },
            { text: "Con ốm! 🌡️", effect: { stress: 10, family: -10 } },
            { text: "Hỏng xe! 🚗", effect: { stress: 5, economy: -5 } }
        ];
        const type = types[Math.floor(Math.random() * types.length)];
        return { id: Date.now(), ...type };
    };

    const handleFinish = () => {
        // Calculate bonus
        const bonus = {
            economy: Math.round(stats.work / 2),
            happiness: Math.round((stats.family + stats.health - stats.stress) / 5)
        };
        onComplete({ bonusStats: bonus });
    };

    if (gameOver) {
        return (
            <div className="minigame-overlay">
                <div className="minigame-container">
                    <div className="minigame-header">
                        <h2>Kết Thúc Một Ngày</h2>
                    </div>
                    <div className="game-result" style={{ position: 'static', transform: 'none', background: 'transparent', boxShadow: 'none', border: 'none' }}>
                        <p className="result-text">
                            {stats.stress > 80 ? "Bạn quá stress! Cần nghỉ ngơi ngay!" : "Bạn đã cân bằng khá tốt!"}
                        </p>

                        <div className="simulation-stats">
                            <div className="sim-stat">💼 Công việc: {Math.round(stats.work)}</div>
                            <div className="sim-stat">👨‍👩‍👧 Gia đình: {Math.round(stats.family)}</div>
                            <div className="sim-stat">💪 Sức khỏe: {Math.round(stats.health)}</div>
                            <div className="sim-stat">🤯 Stress: {Math.round(stats.stress)}</div>
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
                    <h2>⚖️ Cân Bằng Cuộc Sống</h2>
                    <div className="simulation-clock">00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</div>
                </div>

                <div className="minigame-gameplay simulation">
                    <div className="active-action-display">
                        <span className="activity-icon-large">{activeAction ? activeAction.icon : '💤'}</span>
                        <div>{activeAction ? `Đang ${activeAction.name}...` : 'Đang rảnh rỗi...'}</div>
                    </div>

                    <div className="simulation-stats">
                        <div className="sim-stat" title="Công việc">
                            <span>💼</span>
                            <div className="sim-bar"><div className="sim-bar-fill work" style={{ width: `${stats.work}%` }}></div></div>
                        </div>
                        <div className="sim-stat" title="Gia đình">
                            <span>👨‍👩‍👧</span>
                            <div className="sim-bar"><div className="sim-bar-fill family" style={{ width: `${stats.family}%` }}></div></div>
                        </div>
                        <div className="sim-stat" title="Sức khỏe">
                            <span>💪</span>
                            <div className="sim-bar"><div className="sim-bar-fill health" style={{ width: `${stats.health}%` }}></div></div>
                        </div>
                        <div className="sim-stat" title="Stress">
                            <span>🤯</span>
                            <div className="sim-bar"><div className={`sim-bar-fill stress ${stats.stress > 80 ? 'danger' : ''}`} style={{ width: `${stats.stress}%` }}></div></div>
                        </div>
                    </div>

                    <div className="events-container" style={{ minHeight: '60px' }}>
                        {events.map(e => (
                            <div key={e.id} className="event-notification">⚠️ {e.text}</div>
                        ))}
                    </div>

                    <div className="activities-palette">
                        {actions.map(action => (
                            <button
                                key={action.id}
                                className={`choice-btn ${activeAction?.id === action.id ? 'active' : ''}`}
                                style={{ background: activeAction?.id === action.id ? action.color : 'rgba(255,255,255,0.1)', borderColor: action.color }}
                                onClick={() => setActiveAction(action)}
                            >
                                <span style={{ fontSize: '24px', display: 'block' }}>{action.icon}</span>
                                {action.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
