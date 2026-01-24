import { useState } from 'react';
import './MiniGame.css';

const SCENARIOS = [
    {
        id: 1,
        text: "Con không chịu ăn rau 🥦",
        choices: [
            { text: "Ép con ăn bằng được", stats: { health: 10, happiness: -10, bonding: -5 }, cost: 0 },
            { text: "Dỗ dành, xay nhỏ rau", stats: { health: 5, happiness: 5, bonding: 5 }, cost: 0 },
            { text: "Kệ con, không ăn thì thôi", stats: { health: -5, happiness: 10, bonding: 0 }, cost: 0 }
        ]
    },
    {
        id: 2,
        text: "Con muốn mua đồ chơi đắt tiền 🤖",
        choices: [
            { text: "Mua ngay cho con", stats: { health: 0, happiness: 15, bonding: 5 }, cost: 20 },
            { text: "Giải thích nhà không có tiền", stats: { education: 10, happiness: -5, bonding: 5 }, cost: 0 },
            { text: "Mắng con đua đòi", stats: { education: 0, happiness: -15, bonding: -10 }, cost: 0 }
        ]
    },
    {
        id: 3,
        text: "Con bị điểm kém 📝",
        choices: [
            { text: "Thuê gia sư xịn", stats: { education: 15, happiness: -5, bonding: 0 }, cost: 30 },
            { text: "Cùng con học bài", stats: { education: 10, happiness: 5, bonding: 15 }, cost: 0 },
            { text: "Phạt con", stats: { education: 5, happiness: -15, bonding: -10 }, cost: 0 }
        ]
    },
    {
        id: 4,
        text: "Con đánh bạn ở lớp 👊",
        choices: [
            { text: "Bênh con chằm chặp", stats: { education: -10, happiness: 10, bonding: 5 }, cost: 0 },
            { text: "Bắt con xin lỗi bạn", stats: { education: 15, happiness: -5, bonding: 5 }, cost: 0 },
            { text: "Đánh đòn con", stats: { education: 5, happiness: -20, bonding: -15 }, cost: 0 }
        ]
    },
    {
        id: 5,
        text: "Con muốn đi chơi công viên 🎡",
        choices: [
            { text: "Bố/Mẹ bận lắm (Làm việc)", stats: { education: 0, happiness: -10, bonding: -10 }, cost: -10 }, // Kiếm thêm tiền
            { text: "Đi luôn!", stats: { education: 5, happiness: 15, bonding: 15 }, cost: 10 },
            { text: "Hứa hôm khác", stats: { education: 0, happiness: -5, bonding: -5 }, cost: 0 }
        ]
    }
];

export default function ParentingGame({ onComplete, childAge = 5 }) {
    const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
    const [childStats, setChildStats] = useState({
        health: 50,
        education: 50,
        happiness: 50,
        bonding: 50
    });
    const [showResult, setShowResult] = useState(false);

    const handleChoice = (choice) => {
        setChildStats(prev => ({
            health: Math.min(100, Math.max(0, prev.health + (choice.stats.health || 0))),
            education: Math.min(100, Math.max(0, prev.education + (choice.stats.education || 0))),
            happiness: Math.min(100, Math.max(0, prev.happiness + (choice.stats.happiness || 0))),
            bonding: Math.min(100, Math.max(0, prev.bonding + (choice.stats.bonding || 0)))
        }));

        if (currentScenarioIndex < SCENARIOS.length - 1) {
            setTimeout(() => setCurrentScenarioIndex(prev => prev + 1), 300);
        } else {
            setTimeout(() => setShowResult(true), 500);
        }
    };

    const handleFinish = () => {
        // Calculate bonus for player
        const bonus = {
            happiness: Math.round((childStats.happiness + childStats.bonding) / 10),
            knowledge: Math.round(childStats.education / 10)
        };
        onComplete({ bonusStats: bonus });
    };

    if (showResult) {
        return (
            <div className="minigame-overlay">
                <div className="minigame-container">
                    <div className="minigame-header">
                        <h2>Kết Quả Nuôi Dạy Con</h2>
                    </div>
                    <div className="game-result" style={{ position: 'static', transform: 'none', background: 'transparent', boxShadow: 'none', border: 'none' }}>
                        <p className="result-text">Bạn đã cố gắng hết sức để nuôi dạy con!</p>

                        <div className="child-stats-summary" style={{ margin: '20px 0' }}>
                            <div className="stat-row">💪 Sức khỏe: {childStats.health}</div>
                            <div className="stat-row">📚 Học vấn: {childStats.education}</div>
                            <div className="stat-row">😄 Hạnh phúc: {childStats.happiness}</div>
                            <div className="stat-row">❤️ Gắn kết: {childStats.bonding}</div>
                        </div>

                        <button className="continue-btn" onClick={handleFinish}>Tiếp tục hành trình</button>
                    </div>
                </div>
            </div>
        );
    }

    const scenario = SCENARIOS[currentScenarioIndex];

    return (
        <div className="minigame-overlay">
            <div className="minigame-container">
                <div className="minigame-header">
                    <h2>👨‍👩‍👧 Thử Thách Làm Cha Mẹ</h2>
                    <div className="scenario-progress">
                        {SCENARIOS.map((s, i) => (
                            <div key={s.id} className={`progress-dot ${i < currentScenarioIndex ? 'completed' : (i === currentScenarioIndex ? 'current' : '')}`}></div>
                        ))}
                    </div>
                </div>

                <div className="child-stats-bar" style={{ marginBottom: '20px' }}>
                    <div className="mini-stat" title="Sức khỏe"><span style={{ fontSize: '20px' }}>💪</span><div className="mini-bar"><div className="mini-bar-fill health" style={{ width: `${childStats.health}%` }}></div></div></div>
                    <div className="mini-stat" title="Học vấn"><span style={{ fontSize: '20px' }}>📚</span><div className="mini-bar"><div className="mini-bar-fill education" style={{ width: `${childStats.education}%` }}></div></div></div>
                    <div className="mini-stat" title="Hạnh phúc"><span style={{ fontSize: '20px' }}>😄</span><div className="mini-bar"><div className="mini-bar-fill happiness" style={{ width: `${childStats.happiness}%` }}></div></div></div>
                    <div className="mini-stat" title="Gắn kết"><span style={{ fontSize: '20px' }}>❤️</span><div className="mini-bar"><div className="mini-bar-fill bonding" style={{ width: `${childStats.bonding}%` }}></div></div></div>
                </div>

                <div className="game-content fade-in" key={scenario.id}>
                    <div className="scenario-card">
                        <div className="scenario-text">{scenario.text}</div>
                        <div className="scenario-choices">
                            {scenario.choices.map((choice, idx) => (
                                <button key={idx} className="choice-button" onClick={() => handleChoice(choice)}>
                                    <span style={{ fontWeight: 'bold' }}>{choice.text}</span>
                                    {choice.cost !== 0 && (
                                        <span className="choice-cost" style={{ color: choice.cost > 0 ? '#ff4444' : '#4caf50' }}>
                                            {choice.cost > 0 ? `-${choice.cost}đ` : `+${Math.abs(choice.cost)}đ`}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
