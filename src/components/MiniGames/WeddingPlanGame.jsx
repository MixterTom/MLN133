import { useState } from 'react';
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

export default function WeddingPlanGame({ budget = 150, onComplete }) {
    const [currentBudget, setCurrentBudget] = useState(budget);
    const [selectedItems, setSelectedItems] = useState({});
    const [gameStep, setGameStep] = useState('playing');

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

        if (currentCategoryItem && currentCategoryItem.id === item.id) {
            setCurrentBudget(prev => prev + item.cost);
            const newSelected = { ...selectedItems };
            delete newSelected[item.type];
            setSelectedItems(newSelected);
            return;
        }

        let costDiff = item.cost;
        if (currentCategoryItem) {
            costDiff -= currentCategoryItem.cost;
        }

        setCurrentBudget(prev => prev - costDiff);
        setSelectedItems(prev => ({
            ...prev,
            [item.type]: item
        }));
    };

    const handleFinish = () => {
        if (Object.keys(selectedItems).length < 5) {
            alert("Bạn hãy chọn đủ các mục cần thiết cho đám cưới nhé!");
            return;
        }
        setGameStep('result');
    };

    const handleClose = () => {
        const moneyLeft = currentBudget;
        const moneySpent = budget - currentBudget;

        const stats = {
            happiness: 0,
            economy: 0,
            social: 0
        };

        if (moneyLeft < 0) {
            const debt = Math.abs(moneyLeft);
            stats.happiness = 0;
            stats.economy = -debt;
            stats.social = 30;
        } else if (moneySpent >= 130 && moneySpent <= 150) {
            stats.happiness = 30;
            stats.economy = moneyLeft;
            stats.social = 20;
        } else if (moneySpent >= 100 && moneySpent < 130) {
            stats.happiness = 20;
            stats.economy = moneyLeft;
            stats.social = 5;
        } else {
            stats.happiness = 10;
            stats.economy = moneyLeft;
            stats.social = -20;
        }

        onComplete({ bonusStats: stats });
    };

    if (gameStep === 'result') {
        const moneyLeft = currentBudget;
        const moneySpent = budget - currentBudget;

        let resultTitle = '';
        let resultMessage = '';
        let resultColor = '';
        let advantages = [];
        let disadvantages = [];

        if (moneyLeft < 0) {
            const debt = Math.abs(moneyLeft);
            resultTitle = '😰 Vượt Ngân Sách!';
            resultMessage = `Bạn đã chi ${moneySpent}tr, vượt quá ${debt}tr!`;
            resultColor = '#ff4444';
            advantages = ['✅ Đám cưới hoành tráng, mọi người khen ngợi'];
            disadvantages = [
                `❌ Nợ ${debt}tr, áp lực tài chính rất lớn`,
                '❌ Stress, lo lắng về tương lai'
            ];
        } else if (moneySpent >= 130 && moneySpent <= 150) {
            resultTitle = '🎉 Hoàn Hảo!';
            resultMessage = `Bạn đã chi ${moneySpent}tr, còn dư ${moneyLeft}tr!`;
            resultColor = '#4CAF50';
            advantages = [
                '✅ Đám cưới đẹp, mọi người hài lòng',
                '✅ Tiết kiệm được tiền cho tương lai',
                '✅ Mọi người khen khôn ngoan'
            ];
            disadvantages = ['⚠️ Không có gì đặc biệt nổi bật'];
        } else if (moneySpent >= 100 && moneySpent < 130) {
            resultTitle = '💰 Tiết Kiệm';
            resultMessage = `Bạn đã chi ${moneySpent}tr, còn dư ${moneyLeft}tr.`;
            resultColor = '#2196F3';
            advantages = [
                '✅ Tiết kiệm nhiều tiền cho tương lai',
                '✅ Đám cưới ấm cúng, vui vẻ'
            ];
            disadvantages = ['⚠️ Đám cưới bình thường, không ấn tượng'];
        } else {
            resultTitle = '😕 Quá Tiết Kiệm';
            resultMessage = `Bạn chỉ chi ${moneySpent}tr, còn dư ${moneyLeft}tr.`;
            resultColor = '#ff9800';
            advantages = ['✅ Tiết kiệm RẤT nhiều tiền'];
            disadvantages = [
                '❌ Đám cưới quá đơn giản, hơi tiếc',
                '❌ Bị bàn tán là "keo kiệt"'
            ];
        }

        return (
            <div className="minigame-overlay">
                <div className="minigame-container">
                    <div className="minigame-header">
                        <h2 style={{ color: resultColor }}>{resultTitle}</h2>
                    </div>
                    <div className="game-result">
                        <div className="result-items">
                            {Object.values(selectedItems).map(item => (
                                <span key={item.id} className="result-item-badge">
                                    {item.icon} {item.name}
                                </span>
                            ))}
                        </div>
                        <p className="result-text" style={{
                            fontSize: '18px',
                            marginBottom: '15px',
                            color: '#ffffff',
                            textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                            fontWeight: '500'
                        }}>
                            {resultMessage}
                        </p>

                        <div style={{
                            textAlign: 'left',
                            margin: '15px 0',
                            padding: '20px',
                            background: 'rgba(0,0,0,0.4)',
                            borderRadius: '12px',
                            border: '2px solid rgba(255,255,255,0.2)'
                        }}>
                            <div style={{ marginBottom: '15px' }}>
                                <strong style={{
                                    color: '#66ff66',
                                    fontSize: '18px',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                                    display: 'block',
                                    marginBottom: '8px'
                                }}>Ưu điểm:</strong>
                                {advantages.map((adv, i) => (
                                    <div key={i} style={{
                                        marginLeft: '10px',
                                        fontSize: '16px',
                                        marginTop: '6px',
                                        color: '#e0e0e0',
                                        textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                                        lineHeight: '1.6'
                                    }}>{adv}</div>
                                ))}
                            </div>
                            <div>
                                <strong style={{
                                    color: '#ff6666',
                                    fontSize: '18px',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                                    display: 'block',
                                    marginBottom: '8px'
                                }}>Nhược điểm:</strong>
                                {disadvantages.map((dis, i) => (
                                    <div key={i} style={{
                                        marginLeft: '10px',
                                        fontSize: '16px',
                                        marginTop: '6px',
                                        color: '#e0e0e0',
                                        textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                                        lineHeight: '1.6'
                                    }}>{dis}</div>
                                ))}
                            </div>
                        </div>

                        <div className="result-stats-grid">
                            <div className="result-stat">💰 Chi: {moneySpent}tr / {budget}tr</div>
                            <div className="result-stat" style={{ color: moneyLeft < 0 ? '#ff4444' : '#4CAF50' }}>
                                {moneyLeft < 0 ? '💸 Nợ' : '💵 Dư'}: {Math.abs(moneyLeft)}tr
                            </div>
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
                        <span style={{
                            color: currentBudget < 0 ? '#ff4444' : currentBudget < 30 ? '#ff9800' : '#4CAF50',
                            fontWeight: 'bold',
                            fontSize: '18px'
                        }}>
                            💰 Ngân sách: {currentBudget} triệu {currentBudget < 0 ? '(NỢ!)' : ''}
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
                                        className={`wedding-item ${selectedItems[cat]?.id === item.id ? 'selected' : ''}`}
                                        onClick={() => handleSelectItem(item)}
                                    >
                                        <span className="item-icon">{item.icon}</span>
                                        <div className="item-info">
                                            <div className="item-name">{item.name}</div>
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
