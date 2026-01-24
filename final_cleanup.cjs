const fs = require('fs');
const path = require('path');

function removeOrphanedDialogueTextTags(content) {
    // Remove orphaned <p className="dialogue-text"> tags that are followed by
    // text and then `} onComplete={handleTypingComplete} />

    const pattern = /<p className="dialogue-text">\s*([\s\S]*?)`}\s*onComplete=\{handleTypingComplete\}\s*\/>/g;

    content = content.replace(pattern, (match, textContent) => {
        // Just keep the already-transformed part without the orphaned opening tag
        let cleanedText = textContent.trim();
        cleanedText = cleanedText.replace(/`/g, '\\`');
        cleanedText = cleanedText.replace(/\${/g, '\\${');

        return `{isTyping ? (
                                <Typewriter text={\`${cleanedText}\`} onComplete={handleTypingComplete} />`;
    });

    return content;
}

function main() {
    const filePath = path.join(__dirname, 'src', 'components', 'Screens', 'Chapter1Screen.jsx');

    // Read the file
    let content = fs.readFileSync(filePath, 'utf8');

    console.log(`Original dialogue-text count: ${(content.match(/dialogue-text/g) || []).length}`);

    // Remove orphaned tags
    content = removeOrphanedDialogueTextTags(content);

    console.log(`After cleanup dialogue-text count: ${(content.match(/dialogue-text/g) || []).length}`);

    // Write back
    fs.writeFileSync(filePath, content, 'utf8');

    console.log('Final cleanup complete!');
}

main();
