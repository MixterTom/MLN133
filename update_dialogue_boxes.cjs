const fs = require('fs');
const path = require('path');

function transformDialogueBox(content) {
    // Pattern to match dialogue-text blocks with continue button
    const pattern = /<p className="dialogue-text">\s*([\s\S]*?)\s*<\/p>\s*<button className="continue-btn"(.*?)>(.*?)<\/button>/g;

    content = content.replace(pattern, (match, textContent, buttonAttrs, buttonText) => {
        // Clean up the text content - remove <br /> tags and convert to newlines
        let cleanedText = textContent.trim();
        cleanedText = cleanedText.replace(/<br\s*\/>\s*<br\s*\/>/g, '\n\n');
        cleanedText = cleanedText.replace(/<br\s*\/>/g, '\n');

        // Escape backticks in the text
        cleanedText = cleanedText.replace(/`/g, '\\`');
        cleanedText = cleanedText.replace(/\${/g, '\\${');

        // Create the transformed block
        const transformed = `{isTyping ? (
                                <Typewriter text={\`${cleanedText}\`} onComplete={handleTypingComplete} />
                            ) : (
                                <button className="continue-btn fade-in"${buttonAttrs}>${buttonText}</button>
                            )}`;

        return transformed;
    });

    return content;
}

function transformDialogueBoxWithChoices(content) {
    // Pattern for dialogue boxes with choice buttons
    const pattern = /<p className="dialogue-text">\s*([\s\S]*?)\s*<\/p>\s*((?:<button className="choice-btn"[\s\S]*?<\/button>\s*)+)/g;

    content = content.replace(pattern, (match, textContent, buttonsBlock) => {
        // Clean up the text content
        let cleanedText = textContent.trim();
        cleanedText = cleanedText.replace(/<br\s*\/>\s*<br\s*\/>/g, '\n\n');
        cleanedText = cleanedText.replace(/<br\s*\/>/g, '\n');

        // Escape backticks
        cleanedText = cleanedText.replace(/`/g, '\\`');
        cleanedText = cleanedText.replace(/\${/g, '\\${');

        // Add fade-in class to all choice buttons
        const buttonsWithFade = buttonsBlock.replace(
            /<button className="choice-btn"/g,
            '<button className="choice-btn fade-in"'
        );

        // Create the transformed block
        const transformed = `{isTyping ? (
                                <Typewriter text={\`${cleanedText}\`} onComplete={handleTypingComplete} />
                            ) : (
                                <>
                                    ${buttonsWithFade.trim()}
                                </>
                            )}`;

        return transformed;
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

    // Apply transformations
    content = transformDialogueBox(content);
    content = transformDialogueBoxWithChoices(content);

    const newCount = (content.match(/dialogue-text/g) || []).length;
    console.log(`After transformation dialogue-text count: ${newCount}`);

    // Write back
    fs.writeFileSync(filePath, content, 'utf8');

    console.log('Transformation complete!');
}

main();
