const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

let depth = 0;
const lines = content.split('\n');
let appOpen = false;
let appDepth = -1;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Simple heuristic regex for div tags
    const openMatches = (line.match(/<div\b[^>]*>/g) || []).length;
    const closeMatches = (line.match(/<\/div>/g) || []).length;

    // Check if #app opens
    if (line.includes('id="app"')) {
        appOpen = true;
        appDepth = depth;
        console.log(`Line ${i + 1}: #app opened at depth ${depth}`);
    }

    depth += openMatches;
    depth -= closeMatches;

    if (appOpen && depth === appDepth) {
        console.log(`Line ${i + 1}: #app theoretically closed here.`);
        appOpen = false;
    }
}

if (appOpen) {
    console.log(`ERROR: #app never closed! Final depth: ${depth}`);
    // Find where the surplus is
} else {
    console.log(`SUCCESS: #app closed correctly. Final depth: ${depth}`);
}
