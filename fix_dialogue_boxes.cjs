const fs = require('fs');
const path = require('path');

function cleanupMalformedBlocks(content) {
    // Fix malformed blocks where <p className="dialogue-text"> is orphaned
    // Pattern: <p className="dialogue-text">\n    text...`} onComplete={handleTypingComplete} />

    const pattern = /<p className="dialogue-text">\s*([\s\S]*?)`}\s*onComplete=\{handleTypingComplete\}\s*\/>/g;

    content = content.replace(pattern, (match, textContent) => {
        // Extract just the text content and clean it up
        let cleanedText = textContent.trim();

        // Escape backticks and template literals
        cleanedText = cleanedText.replace(/`/g, '\\`');
        cleanedText = cleanedText.replace(/\${/g, '\\${');

        // Return properly formatted Typewriter component
        return `{isTyping ? (
                                <Typewriter text={\`${cleanedText}\`} onComplete={handleTypingComplete} />`;
    });

    return content;
}

function transformRemainingDialogueBoxes(content) {
    // Handle remaining untransformed dialogue boxes with different indentation patterns

    // Pattern 1: Standard dialogue-text with continue button
    const pattern1 = /<p className="dialogue-text">\s*([\s\S]*?)\s*<\/p>\s*<button className="continue-btn"(.*?)>(.*?)<\/button>/g;

    content = content.replace(pattern1, (match, textContent, buttonAttrs, buttonText) => {
        let cleanedText = textContent.trim();
        cleanedText = cleanedText.replace(/<br\s*\/>\s*<br\s*\/>/g, '\n\n');
        cleanedText = cleanedText.replace(/<br\s*\/>/g, '\n');
        cleanedText = cleanedText.replace(/`/g, '\\`');
        cleanedText = cleanedText.replace(/\${/g, '\\${');

        return `{isTyping ? (
                                <Typewriter text={\`${cleanedText}\`} onComplete={handleTypingComplete} />
                            ) : (
                                <button className="continue-btn fade-in"${buttonAttrs}>${buttonText}</button>
                            )}`;
    });

    // Pattern 2: dialogue-text with choice buttons
    const pattern2 = /<p className="dialogue-text">\s*([\s\S]*?)\s*<\/p>\s*((?:<button className="choice-btn"[\s\S]*?<\/button>\s*)+)/g;

    content = content.replace(pattern2, (match, textContent, buttonsBlock) => {
        let cleanedText = textContent.trim();
        cleanedText = cleanedText.replace(/<br\s*\/>\s*<br\s*\/>/g, '\n\n');
        cleanedText = cleanedText.replace(/<br\s*\/>/g, '\n');
        cleanedText = cleanedText.replace(/`/g, '\\`');
        cleanedText = cleanedText.replace(/\${/g, '\\${');

        const buttonsWithFade = buttonsBlock.replace(
            /<button className="choice-btn"/g,
            '<button className="choice-btn fade-in"'
        );

        return `{isTyping ? (
                                <Typewriter text={\`${cleanedText}\`} onComplete={handleTypingComplete} />
                            ) : (
                                <>
                                    ${buttonsWithFade.trim()}
                                </>
                            )}`;
    });

    return content;
}

function main() {
    const filePath = path.join(__dirname, 'src', 'components', 'Screens', 'Chapter1Screen.jsx');

    // Read the file
    let content = fs.readFileSync(filePath, 'utf8');

    console.log(`Original file size: ${content.length} characters`);
    const originalCount = (content.match(/dialogue-text/g) || []).length;
    console.log(`Original dialogue-text count: ${originalCount}`);

    // First clean up malformed blocks
    content = cleanupMalformedBlocks(content);

    // Then transform any remaining standard patterns
    content = transformRemainingDialogueBoxes(content);

    const newCount = (content.match(/dialogue-text/g) || []).length;
    console.log(`After transformation dialogue-text count: ${newCount}`);

    // Write back
    fs.writeFileSync(filePath, content, 'utf8');

    console.log('Transformation complete!');
    console.log(`Transformed ${originalCount - newCount} dialogue boxes`);
}

main();
