// Helper function to clamp stats between 0 and 100
export function clampStat(value) {
    return Math.max(0, Math.min(100, value));
}

// Helper function to apply stat changes
export function applyStatChanges(currentStats, changes) {
    const newStats = { ...currentStats };

    Object.entries(changes).forEach(([key, value]) => {
        if (newStats.hasOwnProperty(key)) {
            newStats[key] = clampStat(newStats[key] + value);
        }
    });

    return newStats;
}

// Helper function to get character sprite path
export function getCharacterSprite(character, emotion) {
    return `/src/assets/characters/${character}_${emotion}.png`;
}

// Helper function to get background image path
export function getBackground(name) {
    return `/src/assets/${name}.png`;
}

// Helper to format stat changes for display
export function formatStatChange(value) {
    if (value > 0) return `+${value}`;
    return value.toString();
}
