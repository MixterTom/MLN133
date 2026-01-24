import { useState, useEffect } from 'react';
import { useGame } from '../../contexts/GameContext';
import './MiniGame.css';

const WEDDING_ITEMS = [
    { id: 'venue_1', name: 'Nhà hàng 3 sao', cost: 30, happiness: 10, social: 10, type: 'venue', icon: '🏨' },
    { id: 'venue_2', name: 'Khách sạn 5 sao', cost: 80, happiness: 30, social: 30, type: 'venue', icon: '🏰' },
    { id: 'venue_3', name: 'Tiệc ngoài trời', cost: 50, happiness: 25, social: 15, type: 'venue', icon: '🌳' },

    { id: 'dress_1', name: 'Váy thuê', cost: 10, happiness: 5, social: 5, type: 'dress', icon: '👗' },
    { id: 'dress_2', name: 'Váy thiết kế', cost: 40, happiness: 25, social: 20, type: 'dress', icon: '👰' },

    { id: 'food_1', name: 'Cỗ bình dân', cost: 20, happiness: 5, social: 5, type: 'food', icon: '🍗' },
    { id: 'food_2', name: 'Hải sản cao cấp', cost: 50, happiness: 20, social: 25, type: 'food', icon: '🦞' },

    { id: 'photo_1', name: 'Chụp Studio', cost: 15, happiness: 10, social: 10, type: 'photo', icon: '📸' },
    { id: 'photo_2', name: 'Chụp ngoại cảnh', cost: 35, happiness: 25, social: 20, type: 'photo', icon: '🌄' },

    { id: 'guest_1', name: 'Mời ít (50 khách)', cost: 10, happiness: 5, social: -10, type: 'guest', icon: '✉️' },
    { id: 'guest_2', name: 'Mời vừa (200 khách)', cost: 30, happiness: 15, social: 15, type: 'guest', icon: '📨' },
    { id: 'guest_3', name: 'Mời cả làng (500)', cost: 60, happiness: 10, social: 40, type: 'guest', icon: '📢' },
];

export default function WeddingPlanGame({ budget = 100, onComplete }) {
    const [currentBudget, setCurrentBudget] = useState(budget);
    const [selectedItems, setSelectedItems] = useState({});
    const [gameStep, setGameStep] = useState('playing'); // playing, result

    const categories = ['venue', 'dress', 'food', 'photo', 'guest'];
    const categoryNames = {
        venue: 'Địa điểm',
        dress: 'Trang phục',
        food: 'Cỗ bàn',
        photo: 'Chụp ảnh',
        guest: 'Khách mời'
    };

    const handleSelectItem = (item) => {
        const currentCategoryItem = selectedItems[item.type];

        // Nếu đã chọn item này rồi thì bỏ chọn (hoàn tiền)
        if (currentCategoryItem && currentCategoryItem.id === item.id) {
            setCurrentBudget(prev => prev + item.cost);
            const newSelected = { ...selectedItems };
            delete newSelected[item.type];
            setSelectedItems(newSelected);
            return;
        }

        // Nếu chọn item mới
        let costDiff = item.cost;
        if (currentCategoryItem) {
            costDiff -= currentCategoryItem.cost; // Trừ đi tiền của item cũ được hoàn lại
        }

        if (currentBudget - costDiff < 0) {
            alert("Không đủ ngân sách!");
            return;
        }

        setCurrentBudget(prev => prev - costDiff);
        setSelectedItems(prev => ({
            ...prev,
            [item.type]: item
        }));
    };

    const calculateTotalStats = () => {
        let totalHappiness = 0;
        let totalSocial = 0;

        Object.values(selectedItems).forEach(item => {
            totalHappiness += item.happiness;
            totalSocial += item.social;
        });

        return { happiness: totalHappiness, social: totalSocial };
    };

    const handleFinish = () => {
        if (Object.keys(selectedItems).length < 5) {
            alert("Bạn hãy chọn đủ các mục cần thiết cho đám cưới nhé!");
            return;
        }
        setGameStep('result');
    };

    const handleClose = () => {
        const stats = calculateTotalStats();
        // Bonus for saving money
        if (currentBudget > 10) {
            stats.economy = 10;
        }
        onComplete({ bonusStats: stats });
    };

    if (gameStep === 'result') {
        const stats = calculateTotalStats();
        return (
            <div className="minigame-overlay">
                <div className="minigame-container">
                    <div className="minigame-header">
                        <h2>🎉 Đám Cưới Hoàn Hảo! 🎉</h2>
                    </div>
                    <div className="game-result">
                        <div className="result-items">
                            {Object.values(selectedItems).map(item => (
                                <span key={item.id} className="result-item-badge">
                                    {item.icon} {item.name}
                                </span>
                            ))}
                        </div>
                        <p className="result-text">Bạn đã tổ chức một đám cưới tuyệt vời!</p>
                        <div className="result-stats-grid">
                            <div className="result-stat">❤️ Hạnh phúc: +{stats.happiness}</div>
                            <div className="result-stat">🤝 Quan hệ: +{stats.social}</div>
                            {currentBudget > 10 && <div className="result-stat">💰 Tiết kiệm: +10</div>}
                        </div>
                        <button className="continue-btn" onClick={handleClose}>Hoàn thành</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="minigame-overlay">
            <div className="minigame-container">
                <div className="minigame-header">
                    <h2>💒 Lập Kế Hoạch Đám Cưới</h2>
                    <div className="minigame-stats">
                        <span style={{ color: currentBudget < 20 ? '#ff4444' : '#ffd700' }}>
                            💰 Ngân sách: {currentBudget} triệu
                        </span>
                    </div>
                </div>

                <div className="game-content">
                    {categories.map(cat => (
                        <div key={cat} className="category-section">
                            <h3 style={{ color: '#fff', fontSize: '18px', margin: '10px 0' }}>{categoryNames[cat]}</h3>
                            <div className="wedding-items-grid">
                                {WEDDING_ITEMS.filter(item => item.type === cat).map(item => (
                                    <div
                                        key={item.id}
                                        className={`wedding-item ${selectedItems[cat]?.id === item.id ? 'selected' : ''} ${selectedItems[cat]?.id !== item.id && currentBudget < item.cost - (selectedItems[cat]?.cost || 0) ? 'disabled' : ''}`}
                                        onClick={() => handleSelectItem(item)}
                                    >
                                        <span className="item-icon">{item.icon}</span>
                                        <div className="item-info">
                                            <div className="item-name">{item.name}</div>
                                            <div className="item-stats">
                                                <span>❤️ +{item.happiness}</span>
                                                <span>🤝 +{item.social}</span>
                                            </div>
                                        </div>
                                        <div className="item-cost">-{item.cost}tr</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="minigame-footer" style={{ marginTop: '20px', textAlign: 'center' }}>
                    <button className="continue-btn" onClick={handleFinish}>Tổ chức Đám Cưới!</button>
                </div>
            </div>
        </div>
    );
}
