const fs = require('fs');
const filePath = 'c:\\Users\\user\\Desktop\\旅遊APP\\index.html';

try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    let stack = [];
    let errors = [];

    // Simple parser to track div balance
    // This is naive and won't catch everything, but good for structural check
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const lineNum = i + 1;

        // Count occurrences of <div and </div in the line
        // NOTE: This is very basic regex, assumes standard formatting we saw in view_file
        const opens = (line.match(/<div\b/g) || []).length;
        const closes = (line.match(/<\/div>/g) || []).length;

        for (let j = 0; j < opens; j++) stack.push(lineNum);
        for (let k = 0; k < closes; k++) {
            if (stack.length === 0) {
                errors.push(`Line ${lineNum}: Unexpected </div>`);
            } else {
                stack.pop();
            }
        }
    }

    if (stack.length > 0) {
        console.log("Unclosed <div> tags found at lines (approx):", stack);
        console.log("Total unclosed:", stack.length);
    } else {
        console.log("<div> tags appear balanced.");
    }

    if (errors.length > 0) {
        console.log("Errors:", errors);
    }

    // Specific check for logic
    // Check line 355 and 356
    console.log("\nChecking specific lines:");
    console.log(`L355: ${lines[354]}`);
    console.log(`L356: ${lines[355]}`);
    console.log(`L717: ${lines[716]}`);
    console.log(`L718: ${lines[717]}`);
    console.log(`L720: ${lines[719]}`);

} catch (err) {
    console.error(err);
}
