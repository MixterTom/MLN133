const fs = require('fs');
const path = require('path');

function fixTypewriterIndentation(content) {
    // Fix indentation in Typewriter components
    // Pattern: {isTyping ? (\n spaces <Typewriter
    // Replace with consistent indentation

    // Fix cases where the Typewriter is not properly indented
    content = content.replace(
        /\{isTyping \? \(\s*<Typewriter text=\{`([^`]*(?:\\`[^`]*)*)`\} onComplete=\{handleTypingComplete\} \/>\s*\) : \(/g,
        (match, text) => {
            return `{isTyping ? (
                                <Typewriter text={\`${text}\`} onComplete={handleTypingComplete} />
                            ) : (`;
        }
    );

    return content;
}

function main() {
    const filePath = path.join(__dirname, 'src', 'components', 'Screens', 'Chapter1Screen.jsx');

    // Read the file
    let content = fs.readFileSync(filePath, 'utf8');

    console.log('Fixing indentation...');

    // Fix indentation
    content = fixTypewriterIndentation(content);

    // Write back
    fs.writeFileSync(filePath, content, 'utf8');

    console.log('Indentation fixed!');
}

main();
