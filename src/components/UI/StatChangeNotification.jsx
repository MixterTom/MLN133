import './StatChangeNotification.css';

export default function StatChangeNotification({ changes, onContinue }) {
    const statConfig = {
        health: { label: 'Sức khỏe', icon: '❤️' },
        happiness: { label: 'Hạnh phúc', icon: '😊' },
        economy: { label: 'Kinh tế', icon: '💰' },
        social: { label: 'Xã hội', icon: '👥' },
        knowledge: { label: 'Tri thức', icon: '📚' }
    };

    return (
        <div className="stat-change-notification">
            <h3 className="stat-change-title">Thay đổi chỉ số</h3>

            <div className="stat-changes-list">
                {Object.entries(changes).map(([key, value]) => {
                    if (value === 0) return null;
                    const config = statConfig[key];

                    return (
                        <div key={key} className="stat-change-item">
                            <span className="stat-change-icon">{config.icon}</span>
                            <span className="stat-change-label">{config.label}</span>
                            <span className={`stat-change-value ${value > 0 ? 'positive' : 'negative'}`}>
                                {value > 0 ? '+' : ''}{value}
                            </span>
                        </div>
                    );
                })}
            </div>

            <button className="stat-change-continue" onClick={onContinue}>
                Tiếp tục
            </button>
        </div>
    );
}
