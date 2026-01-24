const fs = require('fs');
const path = require('path');

function cleanTypewriterText(content) {
    // Find all Typewriter text props and clean up excessive whitespace
    const typewriterPattern = /<Typewriter\s+text=\{`([^`]+(?:\\`[^`]+)*)`\}/g;

    content = content.replace(typewriterPattern, (match, textContent) => {
        // Clean up the text:
        // 1. Replace \\n\\n followed by lots of spaces with just \\n\\n
        // 2. Replace \\n followed by lots of spaces with just \\n
        let cleanedText = textContent
            .replace(/\\n\\n\s+/g, '\\n\\n')
            .replace(/\\n\s+/g, '\\n');

        return `<Typewriter text={\`${cleanedText}\`}`;
    });

    return content;
}

function main() {
    const filePath = path.join(__dirname, 'src', 'components', 'Screens', 'Chapter1Screen.jsx');

    // Read the file
    let content = fs.readFileSync(filePath, 'utf8');

    console.log('Cleaning Typewriter text content...');

    // Clean all text
    content = cleanTypewriterText(content);

    // Write back
    fs.writeFileSync(filePath, content, 'utf8');

    console.log('Text content cleaned!');
}

main();
