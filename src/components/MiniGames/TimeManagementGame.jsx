import { useState, useEffect } from 'react';
import GameModal from '../UI/GameModal';
import './MiniGame.css';

export default function TimeManagementGame({ onComplete }) {
    const [timeSlots, setTimeSlots] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(90);
    const [gameOver, setGameOver] = useState(false);
    const [day, setDay] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const activities = [
        { id: 'study', label: '📚 Học bài', color: '#a29bfe', points: 15, maxPerDay: 4 },
        { id: 'work', label: '💼 Làm thêm', color: '#2ed573', points: 10, maxPerDay: 3 },
        { id: 'rest', label: '😴 Nghỉ ngơi', color: '#1e90ff', points: 5, maxPerDay: 2 },
        { id: 'social', label: '👥 Giao lưu', color: '#ffa502', points: 8, maxPerDay: 2 },
        { id: 'exercise', label: '💪 Tập thể dục', color: '#ff4757', points: 7, maxPerDay: 1 }
    ];

    // Initialize time slots (24 hours, 1 hour per slot)
    useEffect(() => {
        const slots = Array.from({ length: 24 }, (_, i) => ({
            hour: i,
            activity: null,
            locked: i < 6 || i >= 23 // Sleep time locked
        }));
        setTimeSlots(slots);
    }, [day]);

    // Timer
    useEffect(() => {
        if (timeLeft <= 0 && !gameOver) {
            calculateDayScore();
            return;
        }
        if (!gameOver) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft, gameOver]);

    // Check if all slots filled
    useEffect(() => {
        const filledSlots = timeSlots.filter(slot => slot.activity !== null && !slot.locked).length;
        const availableSlots = timeSlots.filter(slot => !slot.locked).length;
        
        if (filledSlots === availableSlots && day <= 3) {
            calculateDayScore();
        }
    }, [timeSlots, day]);

    const calculateDayScore = () => {
        if (gameOver) return;
        
        let dayScore = 0;
        const activityCounts = {};
        
        // Count activities
        timeSlots.forEach(slot => {
            if (slot.activity) {
                activityCounts[slot.activity] = (activityCounts[slot.activity] || 0) + 1;
            }
        });

        // Calculate score based on balance
        activities.forEach(activity => {
            const count = activityCounts[activity.id] || 0;
            if (count > 0 && count <= activity.maxPerDay) {
                dayScore += activity.points * count;
            } else if (count > activity.maxPerDay) {
                // Penalty for overdoing
                dayScore -= (count - activity.maxPerDay) * 10;
            }
        });

        // Bonus for balance
        const hasStudy = activityCounts.study > 0;
        const hasRest = activityCounts.rest > 0;
        const hasWork = activityCounts.work > 0;
        
        if (hasStudy && hasRest && hasWork) {
            dayScore += 30; // Balance bonus
        }

        setScore(score + Math.max(0, dayScore));

        if (day < 3) {
            setTimeout(() => {
                setDay(day + 1);
                setTimeLeft(90);
                const slots = Array.from({ length: 24 }, (_, i) => ({
                    hour: i,
                    activity: null,
                    locked: i < 6 || i >= 23
                }));
                setTimeSlots(slots);
                setSelectedActivity(null);
            }, 2000);
        } else {
            setGameOver(true);
            setTimeout(() => {
                const finalScore = score + Math.max(0, dayScore) + Math.floor(timeLeft / 3);
                onComplete(Math.max(0, finalScore));
            }, 2000);
        }
    };

    const handleSlotClick = (slotIndex) => {
        if (gameOver || !selectedActivity) return;
        if (timeSlots[slotIndex].locked) return;
        if (timeSlots[slotIndex].activity) return; // Already filled

        // Check max per day
        const activityCount = timeSlots.filter(slot => slot.activity === selectedActivity.id).length;
        const activity = activities.find(a => a.id === selectedActivity.id);
        if (activityCount >= activity.maxPerDay) {
            setModalMessage(`Bạn đã dùng hết ${activity.maxPerDay} slot cho ${activity.label} hôm nay!`);
            setShowModal(true);
            return;
        }

        setTimeSlots(prev => prev.map((slot, idx) => 
            idx === slotIndex ? { ...slot, activity: selectedActivity.id } : slot
        ));
    };

    const getSlotLabel = (hour) => {
        if (hour < 6) return '😴';
        if (hour < 12) return '🌅';
        if (hour < 18) return '☀️';
        if (hour < 23) return '🌙';
        return '😴';
    };

    return (
        <div className="minigame-overlay">
            <div className="minigame-container time-management-game">
                <div className="minigame-header">
                    <h2>⏰ Quản Lý Thời Gian</h2>
                    <div className="minigame-stats">
                        <span className="timer">⏱️ {timeLeft}s</span>
                        <span className="score">📊 {score} điểm</span>
                        <span className="day">📅 Ngày {day}/3</span>
                    </div>
                </div>

                <div className="time-instructions">
                    <p>Kéo thả hoạt động vào các khung giờ! Cân bằng học, làm, nghỉ ngơi để đạt điểm cao!</p>
                </div>

                <div className="activity-selector">
                    {activities.map(activity => {
                        const count = timeSlots.filter(slot => slot.activity === activity.id).length;
                        const isSelected = selectedActivity?.id === activity.id;
                        const isMaxed = count >= activity.maxPerDay;
                        
                        return (
                            <button
                                key={activity.id}
                                className={`activity-btn ${isSelected ? 'selected' : ''} ${isMaxed ? 'maxed' : ''}`}
                                style={{ 
                                    backgroundColor: isSelected ? activity.color : '#f1f2f6',
                                    color: isSelected ? 'white' : '#2f3542'
                                }}
                                onClick={() => setSelectedActivity(activity)}
                                disabled={isMaxed}
                            >
                                {activity.label}
                                <span className="activity-count">({count}/{activity.maxPerDay})</span>
                            </button>
                        );
                    })}
                </div>

                <div className="time-schedule">
                    <div className="schedule-header">
                        <span>Giờ</span>
                        <span>Hoạt động</span>
                    </div>
                    <div className="schedule-slots">
                        {timeSlots.map((slot, index) => {
                            const activity = activities.find(a => a.id === slot.activity);
                            return (
                                <div
                                    key={index}
                                    className={`time-slot ${slot.locked ? 'locked' : ''} ${slot.activity ? 'filled' : ''} ${selectedActivity && !slot.locked && !slot.activity ? 'available' : ''}`}
                                    onClick={() => handleSlotClick(index)}
                                    style={{
                                        backgroundColor: activity ? activity.color : slot.locked ? '#dfe4ea' : '#f1f2f6'
                                    }}
                                >
                                    <span className="slot-hour">
                                        {getSlotLabel(slot.hour)} {slot.hour}:00
                                    </span>
                                    {slot.activity && (
                                        <span className="slot-activity">{activity.label}</span>
                                    )}
                                    {!slot.activity && !slot.locked && (
                                        <span className="slot-placeholder">Click để thêm</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {gameOver && (
                    <div className="game-over-message">
                        <h3>Hoàn thành 3 ngày!</h3>
                        <p>Điểm số: {score}</p>
                    </div>
                )}
            </div>
            <GameModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={() => setShowModal(false)}
                title="⚠️ Đã đạt giới hạn"
                message={modalMessage}
                type="alert"
                icon="⚠️"
            />
        </div>
    );
}
