import { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import StatsPanel from '../UI/StatsPanel';
import StatChangeNotification from '../UI/StatChangeNotification';
import '../Screens/PrologueScreen.css';

/**
 * Reusable DialogueScreen component for all chapters
 * 
 * Props:
 * - background: background image name (e.g., 'bandoi', 'benhtat')
 * - character: character sprite path
 * - speaker: speaker name
 * - dialogue: dialogue text
 * - choices: array of choice objects { title, desc, stats }
 * - onChoiceMade: callback after stat changes applied
 * - showStats: whether to show stats panel (default: true)
 */
export default function DialogueScreen({
    background = 'bandoi',
    character,
    speaker,
    dialogue,
    choices = [],
    onChoiceMade,
    showStats = true,
    continueButton = null
}) {
    const { updateStats } = useGame();
    const [showStatChange, setShowStatChange] = useState(false);
    const [statChanges, setStatChanges] = useState({});
    const [selectedChoice, setSelectedChoice] = useState(null);

    const handleChoice = (choice, index) => {
        if (choice.stats) {
            setStatChanges(choice.stats);
            setSelectedChoice(index);
            setShowStatChange(true);
        } else {
            // No stat changes, call callback immediately
            if (onChoiceMade) {
                onChoiceMade(choice, index);
            }
        }
    };

    const handleContinueAfterStats = () => {
        updateStats(statChanges);
        setShowStatChange(false);

        if (onChoiceMade) {
            onChoiceMade(choices[selectedChoice], selectedChoice);
        }
    };

    const backgroundStyle = {
        backgroundImage: `linear-gradient(rgba(20, 20, 40, 0.7), rgba(20, 20, 40, 0.7)), url('/src/assets/${background}.png')`
    };

    return (
        <div className="prologue-screen" style={backgroundStyle}>
            {showStats && <StatsPanel />}

            {showStatChange && (
                <StatChangeNotification
                    changes={statChanges}
                    onContinue={handleContinueAfterStats}
                />
            )}

            {character && (
                <div className="character-container">
                    <img
                        src={character}
                        alt={speaker}
                        className="character-sprite"
                    />
                </div>
            )}

            <div className="dialogue-box">
                {speaker && <h2 className="speaker-name">{speaker}</h2>}

                <p className="dialogue-text">{dialogue}</p>

                {choices.length > 0 && (
                    <div className="choices-container">
                        {choices.map((choice, index) => (
                            <button
                                key={index}
                                className="choice-btn"
                                onClick={() => handleChoice(choice, index)}
                            >
                                <span className="choice-title">{choice.title}</span>
                                {choice.desc && (
                                    <span className="choice-desc">{choice.desc}</span>
                                )}
                            </button>
                        ))}
                    </div>
                )}

                {continueButton}
            </div>
        </div>
    );
}
