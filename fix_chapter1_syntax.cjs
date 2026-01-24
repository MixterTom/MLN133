const fs = require('fs');
const path = require('path');

function fixMalformedTypewriter(content) {
    // Pattern to match malformed Typewriter blocks
    // Pattern: <Typewriter text={`text...
    //           more text
    //           </p>
    //           <button className="continue-btn" onClick={() => {
    //               code...
    //           }}>Text</button>
    
    const pattern = /<Typewriter text=\{`([^`]*?)\s*<\/p>\s*<button className="continue-btn" onClick=\{(\(\) => \{[\s\S]*?\})\}>(.*?)<\/button>/g;
    
    let fixCount = 0;
    content = content.replace(pattern, (match, textContent, onClickHandler, buttonText) => {
        // Clean up the text content - remove extra whitespace and normalize newlines
        let cleanedText = textContent
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .join('\\n\\n');
        
        fixCount++;
        return `<Typewriter text={"${cleanedText}"} onComplete={handleTypingComplete} />
                            ) : (
                                <button className="continue-btn fade-in" onClick={${onClickHandler}}>${buttonText}</button>
                            )}`;
    });
    
    console.log(`Fixed ${fixCount} malformed Typewriter blocks with pattern 1`);
    return content;
}

function fixMissingTypingConditional(content) {
    // Another pattern where isTyping conditional is malformed
    // {isTyping ? (
    //     <Typewriter text={`...
    //                      </p>
    //                      <button>
    
    const pattern2 = /\{isTyping \? \(\s*<Typewriter text=\{`([^`]*?)\s*<\/p>\s*<button className="continue-btn" onClick=\{(\(\) => \{[\s\S]*?\})\}>(.*?)<\/button>/g;
    
    let fixCount = 0;
    content = content.replace(pattern2, (match, textContent, onClickHandler, buttonText) => {
        let cleanedText = textContent
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .join('\\n\\n');
        
        fixCount++;
        return `{isTyping ? (
                                <Typewriter text={"${cleanedText}"} onComplete={handleTypingComplete} />
                            ) : (
                                <button className="continue-btn fade-in" onClick={${onClickHandler}}>${buttonText}</button>
                            )}`;
    });
    
    console.log(`Fixed ${fixCount} malformed blocks with pattern 2`);
    return content;
}

function main() {
    const filePath = path.join(__dirname, 'src', 'components', 'Screens', 'Chapter1Screen.jsx');
    
    console.log('Reading file...');
    let content = fs.readFileSync(filePath, 'utf8');
    
    console.log(`Original file size: ${content.length} characters`);
    
    // Count </p> occurrences before fix
    const pTagsBefore = (content.match(/<\/p>/g) || []).length;
    console.log(`</p> tags before: ${pTagsBefore}`);
    
    // Apply fixes
    content = fixMalformedTypewriter(content);
    content = fixMissingTypingConditional(content);
    
    // Count </p> occurrences after fix
    const pTagsAfter = (content.match(/<\/p>/g) || []).length;
    console.log(`</p> tags after: ${pTagsAfter}`);
    
    // Write back
    fs.writeFileSync(filePath, content, 'utf8');
    
    console.log('Fix complete!');
}

main();
