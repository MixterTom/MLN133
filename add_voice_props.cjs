const fs = require('fs');
const path = require('path');

function addCharacterToTypewriter(content) {
    // Pattern: Find Typewriter inside dialogue-box with speaker-name
    // We need to add character prop based on the speaker

    let modifiedContent = content;
    let changeCount = 0;

    // Pattern 1: <h2 className="speaker-name">CharacterName</h2> followed by <Typewriter text=...
    // Add character prop to Typewriter

    // Find all speaker-name followed by Typewriter
    const regex = /<h2 className="speaker-name">([^<]+)<\/h2>\s*<div className="dialogue-content">\s*\{isTyping \? \(\s*<Typewriter text=\{([^}]+)\} onComplete=\{handleTypingComplete\} \/>/g;

    modifiedContent = modifiedContent.replace(regex, (match, speakerName, textVar) => {
        changeCount++;
        // Clean speaker name (remove emojis and special chars for prop)
        let cleanName = speakerName.trim();

        // Map special names
        if (cleanName.includes('???') || cleanName.includes('Bà Tiên')) {
            cleanName = 'Bà Tiên Duyên';
        } else if (cleanName === 'Narrator') {
            cleanName = 'Narrator';
        } else if (cleanName.includes('{state.player.name}')) {
            cleanName = 'player';
        }

        return `<h2 className="speaker-name">${speakerName}</h2>
                        <div className="dialogue-content">
                            {isTyping ? (
                                <Typewriter text={${textVar}} character="${cleanName}" onComplete={handleTypingComplete} />`;
    });

    console.log(`Modified ${changeCount} Typewriter components`);
    return modifiedContent;
}

function main() {
    const filePath = path.join(__dirname, 'src', 'components', 'Screens', 'Chapter1Screen.jsx');

    console.log('Reading file...');
    let content = fs.readFileSync(filePath, 'utf8');
    console.log(`Original size: ${content.length}`);

    content = addCharacterToTypewriter(content);

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Done!');
}

main();
