const fs = require('fs');
const c = fs.readFileSync('app/patterns/revival/data.ts','utf8');

// Find the array assignment and try to parse it
const match = c.match(/revivalPatterns:\s*RevivalPattern\[\]\s*=\s*(\[[\s\S]*$)/);
if (match) {
  try {
    // Need to add export const to eval it
    const code = 'var RevivalPattern=class{}; const revivalPatterns=' + match[1];
    eval(code);
    console.log('OK -', revivalPatterns.length, 'patterns');
  } catch(e) {
    console.error('Parse error:', e.message);
  }
}
