import { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import './StatsPanel.css';

export default function StatsPanel() {
    const { state } = useGame();
    const stats = state.player.stats;
    const [isCollapsed, setIsCollapsed] = useState(false);

    const statConfig = [
        { key: 'health', label: 'Sức khỏe', color: '#ff4757', icon: '❤️' },
        { key: 'happiness', label: 'Hạnh phúc', color: '#ffa502', icon: '😊' },
        { key: 'economy', label: 'Kinh tế', color: '#2ed573', icon: '💰' },
        { key: 'social', label: 'Xã hội', color: '#1e90ff', icon: '👥' },
        { key: 'knowledge', label: 'Tri thức', color: '#a29bfe', icon: '📚' }
    ];

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className={`stats-panel ${isCollapsed ? 'collapsed' : ''}`}>
            {!isCollapsed && (
                <div className="stats-content">
                    {statConfig.map(({ key, label, color, icon }) => (
                        <div key={key} className="stat-item">
                            <div className="stat-header">
                                <span className="stat-icon">{icon}</span>
                                <span className="stat-label">{label}</span>
                                <span className="stat-value">{stats[key]}</span>
                            </div>
                            <div className="stat-bar-container">
                                <div
                                    className="stat-bar-fill"
                                    style={{
                                        width: `${stats[key]}%`,
                                        backgroundColor: color
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <button className="stats-toggle-btn" onClick={toggleCollapse} title={isCollapsed ? 'Mở rộng' : 'Thu gọn'}>
                {isCollapsed ? '▼' : '▲'}
            </button>
        </div>
    );
}
