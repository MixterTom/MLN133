const fs = require('fs');
const path = require('path');

function replaceBackticksWithQuotes(content) {
    // Replace all Typewriter text={`...`} with text={"..."}
    // This avoids issues with special backtick characters

    const typewriterPattern = /<Typewriter\s+text=\{`([^`]+(?:\\`[^`]+)*)`\}/g;

    content = content.replace(typewriterPattern, (match, textContent) => {
        // Escape any double quotes in the text
        let escapedText = textContent.replace(/"/g, '\\"');

        return `<Typewriter text={"${escapedText}"}`;
    });

    return content;
}

function main() {
    const filePath = path.join(__dirname, 'src', 'components', 'Screens', 'Chapter1Screen.jsx');

    // Read the file
    let content = fs.readFileSync(filePath, 'utf8');

    console.log('Replacing backticks with quotes in all Typewriter components...');
    const beforeCount = (content.match(/text=\{`/g) || []).length;
    console.log(`Found ${beforeCount} Typewriter components with backticks`);

    // Replace all
    content = replaceBackticksWithQuotes(content);

    const afterCount = (content.match(/text=\{`/g) || []).length;
    console.log(`Remaining after replacement: ${afterCount}`);

    // Write back
    fs.writeFileSync(filePath, content, 'utf8');

    console.log('Replacement complete!');
}

main();
