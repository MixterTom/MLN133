const fs = require('fs');
const path = require('path');

function fixAllTypewriterBlocks(content) {
    // Find all malformed Typewriter blocks where the template literal spans multiple lines
    // Pattern: <Typewriter text={`...text with actual newlines...`}

    // Strategy: Find all <Typewriter...> to </> blocks and fix their text props
    const typewriterPattern = /<Typewriter\s+text=\{`([^`]*(?:\\`[^`]*)*)`\}(\s+onComplete=\{handleTypingComplete\}\s*\/>)/gs;

    content = content.replace(typewriterPattern, (match, textContent, closing) => {
        // Replace actual newlines in the text with \n
        let fixedText = textContent
            .replace(/\n\s*\n\s*\n/g, '\\n\\n')  // Triple newlines
            .replace(/\n\s*\n/g, '\\n\\n')        // Double newlines
            .replace(/\n/g, '\\n');                // Single newlines

        // Remove leading/trailing whitespace
        fixedText = fixedText.trim();

        return `<Typewriter text={\`${fixedText}\`}${closing}`;
    });

    return content;
}

function main() {
    const filePath = path.join(__dirname, 'src', 'components', 'Screens', 'Chapter1Screen.jsx');

    // Read the file
    let content = fs.readFileSync(filePath, 'utf8');

    console.log('Fixing all Typewriter blocks...');
    const beforeCount = (content.match(/<Typewriter/g) || []).length;
    console.log(`Found ${beforeCount} Typewriter components`);

    // Fix all blocks
    content = fixAllTypewriterBlocks(content);

    // Write back
    fs.writeFileSync(filePath, content, 'utf8');

    console.log('All Typewriter blocks fixed!');
}

main();
