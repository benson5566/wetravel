const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
const content = fs.readFileSync(filePath, 'utf-8');

const lines = content.split('\n');
const stack = [];
const selfClosingTags = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

console.log('Validating HTML structure...');

let inScript = false;
let inStyle = false;

for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line) continue;

    // Simple regex-based parser (not perfect, but good for structural debugging)
    const tagRegex = /<\/?([a-z0-9-]+)([^>]*)>/gi;
    let match;

    while ((match = tagRegex.exec(line)) !== null) {
        const fullTag = match[0];
        const tagName = match[1].toLowerCase();
        const isClosing = fullTag.startsWith('</');
        const attributes = match[2];

        // Handle Script/Style content skipping
        if (tagName === 'script' && !isClosing && !fullTag.includes('/>')) { // Start script
            inScript = true;
        }
        if (tagName === 'script' && isClosing) {
            inScript = false;
        }
        if (tagName === 'style' && !isClosing) {
            inStyle = true;
        }
        if (tagName === 'style' && isClosing) {
            inStyle = false;
        }

        // Skip validation inside script/style bodies (except their closing tags)
        if ((inScript && tagName !== 'script') || (inStyle && tagName !== 'style')) {
            continue;
        }

        // Comment skipping (very basic)
        if (fullTag.startsWith('<!--') || fullTag.endsWith('-->')) continue;

        if (selfClosingTags.includes(tagName)) continue;
        if (fullTag.includes('/>')) continue; // Self-closing like <div />

        if (!isClosing) {
            stack.push({ tag: tagName, line: i + 1 });
        } else {
            if (stack.length === 0) {
                console.error(`Error: Unexpected closing tag </${tagName}> at line ${i + 1}`);
            } else {
                const last = stack[stack.length - 1];
                if (last.tag === tagName) {
                    stack.pop();
                } else {
                    console.error(`Error: Mismatched closing tag </${tagName}> at line ${i + 1}. Expected </${last.tag}> (opened at line ${last.line})`);
                    // Don't pop to report cascading errors, or maybe break

                    // Specific check for the user's issue:
                    if (last.tag === 'div' && tagName !== 'div') {
                        console.error(`CRITICAL: Possible unclosed <div> started at line ${last.line}`);
                    }
                }
            }
        }
    }
}

if (stack.length > 0) {
    console.log('Unclosed tags remaining on stack:');
    stack.forEach(item => {
        console.log(`- <${item.tag}> opened at line ${item.line}`);
    });
} else {
    console.log('HTML structure seems valid.');
}
