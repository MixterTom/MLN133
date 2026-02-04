import { useState, useEffect } from 'react';
import GameModal from '../UI/GameModal';
import './MiniGame.css';

export default function SocialNetworkGame({ onComplete }) {
    const [people, setPeople] = useState([]);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [gameOver, setGameOver] = useState(false);
    const [interactions, setInteractions] = useState(0);
    const [maxInteractions] = useState(8);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const personTypes = [
        { id: 'classmate', label: '👨‍🎓 Bạn cùng lớp', points: 10, color: '#a29bfe' },
        { id: 'teacher', label: '👨‍🏫 Thầy cô', points: 15, color: '#2ed573' },
        { id: 'senior', label: '👨‍💼 Anh chị khóa trên', points: 12, color: '#ffa502' },
        { id: 'club', label: '🎭 Câu lạc bộ', points: 8, color: '#ff4757' },
        { id: 'roommate', label: '🏠 Bạn cùng phòng', points: 10, color: '#1e90ff' }
    ];

    const interactionTypes = [
        { id: 'help', label: '🤝 Giúp đỡ', points: 15, requires: ['classmate', 'roommate'] },
        { id: 'ask', label: '❓ Hỏi bài', points: 12, requires: ['teacher', 'senior'] },
        { id: 'chat', label: '💬 Trò chuyện', points: 8, requires: ['classmate', 'roommate', 'club'] },
        { id: 'join', label: '🎉 Tham gia', points: 10, requires: ['club', 'senior'] },
        { id: 'study', label: '📚 Học nhóm', points: 20, requires: ['classmate', 'senior'] }
    ];

    // Initialize people
    useEffect(() => {
        const initialPeople = personTypes.map((type, index) => ({
            id: `person_${index}`,
            type: type.id,
            label: type.label,
            color: type.color,
            points: type.points,
            interacted: false,
            position: { x: 20 + (index * 15), y: 30 + (index % 2) * 40 }
        }));
        setPeople(initialPeople);
    }, []);

    // Timer
    useEffect(() => {
        if (timeLeft <= 0 && !gameOver) {
            calculateFinalScore();
            return;
        }
        if (!gameOver) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft, gameOver]);

    // Check if max interactions reached
    useEffect(() => {
        if (interactions >= maxInteractions && !gameOver) {
            calculateFinalScore();
        }
    }, [interactions, maxInteractions, gameOver]);

    const calculateFinalScore = () => {
        if (gameOver) return;
        setGameOver(true);
        
        let finalScore = score;
        const interactedCount = people.filter(p => p.interacted).length;
        
        // Bonus for diversity (interacting with different types)
        const uniqueTypes = new Set(people.filter(p => p.interacted).map(p => p.type));
        finalScore += uniqueTypes.size * 10;
        
        // Bonus for time remaining
        finalScore += Math.floor(timeLeft / 2);
        
        setTimeout(() => {
            onComplete(Math.max(0, finalScore));
        }, 2000);
    };

    const handlePersonClick = (person) => {
        if (gameOver || person.interacted) return;
        if (interactions >= maxInteractions) return;
        
        setSelectedPerson(person);
    };

    const handleInteraction = (interactionType) => {
        if (!selectedPerson || selectedPerson.interacted) return;
        if (interactions >= maxInteractions) return;
        
        // Check if interaction is valid for this person type
        if (!interactionType.requires.includes(selectedPerson.type)) {
            setModalMessage(`Không thể ${interactionType.label.toLowerCase()} với ${selectedPerson.label}!`);
            setShowModal(true);
            return;
        }

        // Apply interaction
        const points = selectedPerson.points + interactionType.points;
        setScore(score + points);
        setInteractions(interactions + 1);
        
        setPeople(prev => prev.map(p => 
            p.id === selectedPerson.id 
                ? { ...p, interacted: true, interactionType: interactionType.label }
                : p
        ));
        
        setSelectedPerson(null);
    };

    return (
        <div className="minigame-overlay">
            <div className="minigame-container social-network-game">
                <div className="minigame-header">
                    <h2>👥 Xây Dựng Mối Quan Hệ</h2>
                    <div className="minigame-stats">
                        <span className="timer">⏱️ {timeLeft}s</span>
                        <span className="score">📊 {score} điểm</span>
                        <span className="interactions">🤝 {interactions}/{maxInteractions}</span>
                    </div>
                </div>

                <div className="social-instructions">
                    <p>Click vào người để tương tác! Chọn hành động phù hợp để tăng điểm!</p>
                </div>

                <div className="social-network">
                    <div className="network-canvas">
                        {people.map((person, index) => {
                            const isValid = !person.interacted && interactions < maxInteractions;
                            return (
                                <div
                                    key={person.id}
                                    className={`network-node ${person.interacted ? 'interacted' : ''} ${isValid ? 'available' : ''} ${selectedPerson?.id === person.id ? 'selected' : ''}`}
                                    style={{
                                        left: `${person.position.x}%`,
                                        top: `${person.position.y}%`,
                                        backgroundColor: person.interacted ? '#95a5a6' : person.color,
                                        borderColor: selectedPerson?.id === person.id ? '#2f3542' : 'transparent'
                                    }}
                                    onClick={() => handlePersonClick(person)}
                                >
                                    <div className="node-icon">{person.label}</div>
                                    {person.interacted && (
                                        <div className="node-status">✓ {person.interactionType}</div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {selectedPerson && !selectedPerson.interacted && (
                    <div className="interaction-panel">
                        <h3>Tương tác với: {selectedPerson.label}</h3>
                        <div className="interaction-options">
                            {interactionTypes.map(interaction => {
                                const isValid = interaction.requires.includes(selectedPerson.type);
                                return (
                                    <button
                                        key={interaction.id}
                                        className={`interaction-btn ${isValid ? 'valid' : 'invalid'}`}
                                        onClick={() => handleInteraction(interaction)}
                                        disabled={!isValid || interactions >= maxInteractions}
                                    >
                                        {interaction.label}
                                        <span className="interaction-points">+{interaction.points}</span>
                                    </button>
                                );
                            })}
                        </div>
                        <button 
                            className="cancel-btn"
                            onClick={() => setSelectedPerson(null)}
                        >
                            Hủy
                        </button>
                    </div>
                )}

                {gameOver && (
                    <div className="game-over-message">
                        <h3>Hoàn thành!</h3>
                        <p>Điểm số: {score}</p>
                        <p>Đã tương tác: {people.filter(p => p.interacted).length}/{people.length}</p>
                    </div>
                )}
            </div>
            <GameModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={() => setShowModal(false)}
                title="⚠️ Không thể thực hiện"
                message={modalMessage}
                type="alert"
                icon="⚠️"
            />
        </div>
    );
}
