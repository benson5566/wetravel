const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');

// Check all important tags
const tags = ['div', 'span', 'button', 'select', 'transition', 'template', 'main', 'header', 'section', 'nav', 'ul', 'ol', 'li', 'table', 'form'];
const selfClosing = ['img', 'input', 'br', 'hr', 'i', 'meta', 'link'];

// Simple stack-based checker
let stack = [];
let errors = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Skip script content (between <script> and </script>)
    // Simple approach: find all tags on this line
    const tagPattern = /<\/?([a-zA-Z][a-zA-Z0-9-]*)\b[^>]*\/?>/g;
    let match;
    while ((match = tagPattern.exec(line)) !== null) {
        const fullMatch = match[0];
        const tagName = match[1].toLowerCase();

        // Skip self-closing tags
        if (selfClosing.includes(tagName)) continue;
        if (fullMatch.endsWith('/>')) continue;

        // Skip tags inside script blocks (crude check)
        if (tagName === 'script' || tagName === 'style') continue;

        // Only check tags we care about
        if (!tags.includes(tagName)) continue;

        const isClosing = fullMatch.startsWith('</');

        if (isClosing) {
            if (stack.length === 0) {
                errors.push('L' + lineNum + ': Unexpected </' + tagName + '> (stack empty)');
            } else {
                const top = stack[stack.length - 1];
                if (top.tag === tagName) {
                    stack.pop();
                } else {
                    errors.push('L' + lineNum + ': Expected </' + top.tag + '> (from L' + top.line + ') but found </' + tagName + '>');
                }
            }
        } else {
            stack.push({ tag: tagName, line: lineNum });
        }
    }
}

if (stack.length > 0) {
    console.log('Unclosed tags:');
    stack.forEach(s => console.log('  L' + s.line + ': <' + s.tag + '>'));
}

if (errors.length > 0) {
    console.log('Errors:');
    errors.forEach(e => console.log('  ' + e));
}

if (stack.length === 0 && errors.length === 0) {
    console.log('All tracked tags appear balanced!');
}
