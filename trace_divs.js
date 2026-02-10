const fs = require('fs');
const lines = fs.readFileSync('index.html', 'utf8').split('\n');
let depth = 0;
for (let i = 350; i < 730; i++) {
    const line = lines[i] || '';
    const opens = (line.match(/<div\b/g) || []).length;
    const closes = (line.match(/<\/div>/g) || []).length;
    depth += opens - closes;
    if (opens || closes) {
        console.log('L' + (i + 1) + ': depth=' + depth + ' (+' + opens + '/-' + closes + ') ' + line.trim().substring(0, 90));
    }
}
