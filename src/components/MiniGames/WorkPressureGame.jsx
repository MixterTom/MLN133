import { useState, useEffect } from 'react';
import './MiniGame.css';
import './WorkPressureGame.css';

// Tasks with deadlines
const TASKS = [
    { id: 1, name: 'Báo cáo tháng', deadline: 5, workload: 3, completed: 0 },
    { id: 2, name: 'Dự án A', deadline: 10, workload: 5, completed: 0 },
    { id: 3, name: 'Meeting khách hàng', deadline: 3, workload: 2, completed: 0 },
    { id: 4, name: 'Training nhân viên', deadline: 7, workload: 3, completed: 0 },
    { id: 5, name: 'Đánh giá hiệu suất', deadline: 12, workload: 4, completed: 0 }
];

const TOTAL_DAYS = 12;

const WorkPressureGame = ({ onComplete }) => {
    const [gameState, setGameState] = useState('intro');
    const [currentDay, setCurrentDay] = useState(1);
    const [tasks, setTasks] = useState([...TASKS]);
    const [stress, setStress] = useState(50);
    const [health, setHealth] = useState(100);
    const [social, setSocial] = useState(50);
    const [showDayResult, setShowDayResult] = useState(false);
    const [dayResult, setDayResult] = useState('');

    const startGame = () => {
        setGameState('playing');
        setCurrentDay(1);
        setTasks([...TASKS]);
        setStress(50);
        setHealth(100);
        setSocial(50);
    };

    const handleAction = (action) => {
        let newStress = stress;
        let newHealth = health;
        let newSocial = social;
        let newTasks = [...tasks];
        let result = '';

        if (action === 'work') {
            // Làm việc: Tăng progress, tăng stress
            newStress = Math.min(100, stress + 20);
            newHealth = Math.max(0, health - 5);

            // Chọn task chưa hoàn thành có deadline gần nhất
            const incompleteTasks = newTasks.filter(t => t.completed < t.workload && t.deadline > 0);
            if (incompleteTasks.length > 0) {
                const urgentTask = incompleteTasks.sort((a, b) => a.deadline - b.deadline)[0];
                const taskIndex = newTasks.findIndex(t => t.id === urgentTask.id);
                newTasks[taskIndex].completed += 1;
                result = `Làm việc: ${urgentTask.name} (+1 progress)`;
            } else {
                result = 'Làm việc: Không có task nào!';
            }
        } else if (action === 'rest') {
            // Nghỉ ngơi: Giảm stress, tăng health
            newStress = Math.max(0, stress - 30);
            newHealth = Math.min(100, health + 10);
            result = 'Nghỉ ngơi: Stress giảm, sức khỏe tăng';
        } else if (action === 'socialize') {
            // Giao lưu: Giảm stress ít, tăng social
            newStress = Math.max(0, stress - 10);
            newSocial = Math.min(100, social + 15);
            result = 'Giao lưu: Mối quan hệ tốt hơn';
        }

        // Giảm deadline của tất cả tasks
        newTasks = newTasks.map(task => ({
            ...task,
            deadline: task.deadline > 0 ? task.deadline - 1 : 0
        }));

        setStress(newStress);
        setHealth(newHealth);
        setSocial(newSocial);
        setTasks(newTasks);
        setDayResult(result);
        setShowDayResult(true);

        setTimeout(() => {
            setShowDayResult(false);

            // Check game over conditions
            if (newHealth <= 0) {
                setGameState('result');
                return;
            }

            if (currentDay >= TOTAL_DAYS) {
                setGameState('result');
            } else {
                setCurrentDay(currentDay + 1);
            }
        }, 1500);
    };

    const getResult = () => {
        // Calculate score
        let score = 0;

        // Tasks completed on time
        tasks.forEach(task => {
            if (task.completed >= task.workload) {
                score += 30; // Hoàn thành đúng hạn
            } else if (task.deadline === 0 && task.completed < task.workload) {
                score -= 20; // Trễ deadline
            }
        });

        // Health bonus
        if (health > 70) score += 20;
        else if (health < 30) score -= 20;

        // Stress penalty
        if (stress > 80) score -= 20;
        else if (stress < 30) score += 10;

        // Social bonus
        if (social > 70) score += 15;

        if (score >= 100) return 'excellent';
        if (score >= 60) return 'good';
        if (score >= 30) return 'average';
        return 'poor';
    };

    const getResultMessage = () => {
        const result = getResult();
        const completedTasks = tasks.filter(t => t.completed >= t.workload).length;
        const missedDeadlines = tasks.filter(t => t.deadline === 0 && t.completed < t.workload).length;

        if (result === 'excellent') {
            return {
                title: '🎉 Xuất sắc!',
                desc: 'Bạn quản lý công việc rất tốt! Được thăng chức lên Team Lead!',
                outcome: 'promoted',
                bonusStats: { economy: 30, knowledge: 20, happiness: 10, health: -10 }
            };
        } else if (result === 'good') {
            return {
                title: '👍 Tốt lắm!',
                desc: 'Bạn làm việc hiệu quả! Được tăng lương 20%!',
                outcome: 'raise',
                bonusStats: { economy: 20, knowledge: 15, happiness: 5, health: -5 }
            };
        } else if (result === 'average') {
            return {
                title: '😐 Tạm được',
                desc: 'Bạn hoàn thành công việc cơ bản. Giữ nguyên vị trí.',
                outcome: 'maintain',
                bonusStats: { economy: 10, knowledge: 10, happiness: 0, health: 0 }
            };
        } else {
            return {
                title: '😢 Không đạt',
                desc: 'Bạn không hoàn thành công việc. Bị sa thải!',
                outcome: 'fired',
                bonusStats: { economy: -20, knowledge: 0, happiness: -30, health: -20 }
            };
        }
    };

    const handleComplete = () => {
        const result = getResult();
        const resultMessage = getResultMessage();
        const completedTasks = tasks.filter(t => t.completed >= t.workload).length;

        onComplete({
            result,
            outcome: resultMessage.outcome,
            bonusStats: resultMessage.bonusStats,
            completedTasks,
            finalHealth: health,
            finalStress: stress,
            finalSocial: social
        });
    };

    // Intro screen
    if (gameState === 'intro') {
        return (
            <div className="minigame-overlay">
                <div className="minigame-container">
                    <div className="minigame-intro">
                        <h2>💼 Áp Lực Công Việc</h2>
                        <p className="intro-desc">Quản lý công việc, deadline và sức khỏe trong 12 ngày!</p>

                        <div className="work-rules">
                            <h3>📋 Quy tắc:</h3>
                            <ul>
                                <li>⏱️ Tổng cộng 12 ngày làm việc</li>
                                <li>📝 5 tasks cần hoàn thành với deadline khác nhau</li>
                                <li>💪 Mỗi ngày chọn 1 hành động</li>
                                <li>⚠️ Quản lý Stress, Health, Social</li>
                            </ul>
                        </div>

                        <div className="work-actions-info">
                            <h3>🎯 Hành động:</h3>
                            <div className="action-info">
                                <div className="action-card">
                                    <span className="action-icon">💻</span>
                                    <strong>Làm việc</strong>
                                    <p>+Progress, +Stress, -Health</p>
                                </div>
                                <div className="action-card">
                                    <span className="action-icon">😴</span>
                                    <strong>Nghỉ ngơi</strong>
                                    <p>-Stress, +Health</p>
                                </div>
                                <div className="action-card">
                                    <span className="action-icon">🤝</span>
                                    <strong>Giao lưu</strong>
                                    <p>-Stress, +Social</p>
                                </div>
                            </div>
                        </div>

                        <button className="start-game-btn" onClick={startGame}>
                            🚀 Bắt Đầu Làm Việc!
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Playing screen
    if (gameState === 'playing') {
        return (
            <div className="minigame-overlay">
                <div className="minigame-container">
                    <div className="work-game">
                        <div className="work-header">
                            <div className="day-counter">
                                📅 Ngày {currentDay}/{TOTAL_DAYS}
                            </div>
                            <div className="stats-bars">
                                <div className="stat-bar">
                                    <span>😰 Stress: {stress}%</span>
                                    <div className="bar">
                                        <div className="bar-fill stress" style={{ width: `${stress}%` }}></div>
                                    </div>
                                </div>
                                <div className="stat-bar">
                                    <span>❤️ Health: {health}%</span>
                                    <div className="bar">
                                        <div className="bar-fill health" style={{ width: `${health}%` }}></div>
                                    </div>
                                </div>
                                <div className="stat-bar">
                                    <span>🤝 Social: {social}%</span>
                                    <div className="bar">
                                        <div className="bar-fill social" style={{ width: `${social}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="tasks-list">
                            <h3>📝 Công việc:</h3>
                            {tasks.map(task => (
                                <div key={task.id} className={`task-item ${task.completed >= task.workload ? 'completed' : task.deadline === 0 ? 'overdue' : task.deadline <= 2 ? 'urgent' : ''}`}>
                                    <div className="task-info">
                                        <strong>{task.name}</strong>
                                        <span className="task-progress">
                                            {task.completed}/{task.workload}
                                            {task.completed >= task.workload && ' ✅'}
                                        </span>
                                    </div>
                                    <div className="task-deadline">
                                        {task.deadline > 0 ? `⏰ ${task.deadline} ngày` : '❌ Trễ hạn'}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {showDayResult ? (
                            <div className="day-result">
                                {dayResult}
                            </div>
                        ) : (
                            <div className="work-actions">
                                <h3>Hôm nay bạn sẽ làm gì?</h3>
                                <div className="action-buttons">
                                    <button className="action-btn work" onClick={() => handleAction('work')}>
                                        <span className="action-icon">💻</span>
                                        <strong>Làm việc</strong>
                                        <small>Hoàn thành task</small>
                                    </button>
                                    <button className="action-btn rest" onClick={() => handleAction('rest')}>
                                        <span className="action-icon">😴</span>
                                        <strong>Nghỉ ngơi</strong>
                                        <small>Giảm stress</small>
                                    </button>
                                    <button className="action-btn socialize" onClick={() => handleAction('socialize')}>
                                        <span className="action-icon">🤝</span>
                                        <strong>Giao lưu</strong>
                                        <small>Tăng mối quan hệ</small>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Result screen
    const result = getResult();
    const resultMessage = getResultMessage();
    const completedTasks = tasks.filter(t => t.completed >= t.workload).length;
    const missedDeadlines = tasks.filter(t => t.deadline === 0 && t.completed < t.workload).length;

    return (
        <div className="minigame-overlay">
            <div className="minigame-container">
                <div className="minigame-result">
                    <h2>{resultMessage.title}</h2>

                    <p className="result-desc">{resultMessage.desc}</p>

                    <div className="result-stats">
                        <div className="stat">
                            <span className="stat-value">{completedTasks}</span>
                            <span className="stat-label">✅ Tasks hoàn thành</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value">{missedDeadlines}</span>
                            <span className="stat-label">❌ Trễ deadline</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value">{health}%</span>
                            <span className="stat-label">❤️ Sức khỏe</span>
                        </div>
                    </div>

                    <div className={`result-badge ${result}`}>
                        {result === 'excellent' && '⭐⭐⭐'}
                        {result === 'good' && '⭐⭐'}
                        {result === 'average' && '⭐'}
                        {result === 'poor' && '💔'}
                    </div>

                    <button className="continue-btn" onClick={handleComplete}>
                        Tiếp tục →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WorkPressureGame;
