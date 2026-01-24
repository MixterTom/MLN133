import { createContext, useContext, useReducer } from 'react';
import { clampStat } from '../utils/gameHelpers';

const GameContext = createContext();

const initialState = {
    screen: 'start',
    player: {
        name: '',
        gender: '',
        origin: '', // 'rich', 'normal', 'poor'
        stats: {
            health: 0,
            happiness: 0,
            economy: 0,
            social: 0,
            knowledge: 0
        }
    },
    progress: {
        chapter: 0,
        scene: 0
    },
    choices: [],
    flags: {}
};

// Load saved game from localStorage
const loadSavedGame = () => {
    try {
        const savedGame = localStorage.getItem('tebao_xahoi_save');
        if (savedGame) {
            return JSON.parse(savedGame);
        }
    } catch (error) {
        console.error('Error loading saved game:', error);
    }
    return initialState;
};

// Save game to localStorage
const saveGame = (state) => {
    try {
        localStorage.setItem('tebao_xahoi_save', JSON.stringify(state));
        localStorage.setItem('tebao_xahoi_last_save', new Date().toISOString());
    } catch (error) {
        console.error('Error saving game:', error);
    }
};

function gameReducer(state, action) {
    let newState = state;

    switch (action.type) {
        case 'SET_SCREEN':
            newState = { ...state, screen: action.payload };
            break;

        case 'SET_PLAYER_DATA':
            newState = {
                ...state,
                player: { ...state.player, ...action.payload }
            };
            break;

        case 'UPDATE_STATS':
            const newStats = { ...state.player.stats };
            Object.entries(action.payload).forEach(([key, value]) => {
                if (newStats.hasOwnProperty(key)) {
                    newStats[key] = clampStat(newStats[key] + value);
                }
            });

            // Check for game over - if any stat reaches 0
            const isGameOver = Object.values(newStats).some(stat => stat <= 0);

            newState = {
                ...state,
                screen: isGameOver ? 'gameover' : state.screen,
                player: {
                    ...state.player,
                    stats: newStats
                }
            };
            break;

        case 'ADD_CHOICE':
            newState = {
                ...state,
                choices: [...state.choices, action.payload]
            };
            break;

        case 'SET_FLAG':
            newState = {
                ...state,
                flags: { ...state.flags, [action.payload.key]: action.payload.value }
            };
            break;

        case 'LOAD_GAME':
            newState = action.payload;
            break;

        case 'RESET_GAME':
            localStorage.removeItem('tebao_xahoi_save');
            localStorage.removeItem('tebao_xahoi_last_save');
            newState = { ...initialState }; // Create new object to avoid mutation
            break;

        default:
            return state;
    }

    // Auto-save after every action (except LOAD_GAME and RESET_GAME)
    if (action.type !== 'LOAD_GAME' && action.type !== 'RESET_GAME') {
        saveGame(newState);
    }

    return newState;
}

export function GameProvider({ children }) {
    // Don't auto-load on init, always start at 'start' screen
    const [state, dispatch] = useReducer(gameReducer, initialState);

    const value = {
        state,
        dispatch,
        setScreen: (screen) => dispatch({ type: 'SET_SCREEN', payload: screen }),
        updateStats: (stats) => dispatch({ type: 'UPDATE_STATS', payload: stats }),
        addChoice: (choice) => dispatch({ type: 'ADD_CHOICE', payload: choice }),
        setFlag: (key, value) => dispatch({ type: 'SET_FLAG', payload: { key, value } }),
        loadGame: () => {
            const savedGame = loadSavedGame();
            if (savedGame) {
                dispatch({ type: 'LOAD_GAME', payload: savedGame });
            }
        },
        resetGame: () => dispatch({ type: 'RESET_GAME' }),
        hasSavedGame: () => {
            return localStorage.getItem('tebao_xahoi_save') !== null;
        },
        getSaveDate: () => {
            const lastSave = localStorage.getItem('tebao_xahoi_last_save');
            if (lastSave) {
                return new Date(lastSave);
            }
            return null;
        }
    };

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within GameProvider');
    }
    return context;
}
