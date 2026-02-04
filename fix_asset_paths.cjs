const fs = require('fs');
const path = require('path');

// Recursively find all JS, JSX files
function findFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // Skip node_modules and dist
            if (file !== 'node_modules' && file !== 'dist' && file !== '.git') {
                findFiles(filePath, fileList);
            }
        } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
            fileList.push(filePath);
        }
    });

    return fileList;
}

// Replace /src/assets with /assets
function fixAssetPaths() {
    const files = findFiles('./src');
    let totalChanges = 0;

    files.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        const originalContent = content;

        // Replace all occurrences of /src/assets with /assets
        content = content.replace(/(['"`])\/src\/assets\//g, '$1/assets/');

        if (content !== originalContent) {
            fs.writeFileSync(file, content, 'utf8');
            console.log(`✓ Fixed: ${file}`);
            totalChanges++;
        }
    });

    console.log(`\n✓ Total files fixed: ${totalChanges}`);
}

fixAssetPaths();
