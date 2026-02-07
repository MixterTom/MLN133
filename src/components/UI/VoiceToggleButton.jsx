import { useGame } from '../../contexts/GameContext';
import './VoiceToggleButton.css';

export default function VoiceToggleButton() {
    const { state, setVoiceEnabled } = useGame();
    const { voiceEnabled } = state;

    const toggleVoice = () => {
        setVoiceEnabled(!voiceEnabled);
    };

    return (
        <button
            className={`voice-toggle-btn ${voiceEnabled ? 'enabled' : 'disabled'}`}
            onClick={toggleVoice}
            title={voiceEnabled ? 'Tắt thuyết minh' : 'Bật thuyết minh'}
        >
            {voiceEnabled ? '🔊' : '🔇'}
        </button>
    );
}
