const fs = require('fs');

// 复原纹样
const revival = fs.readFileSync('app/patterns/revival/data.ts', 'utf8');
const match = revival.match(/\[\s*\{[\s\S]*\}\s*\]/);
const arr = eval('(' + match[0] + ')');

console.log('=== 复原纹样 ===');
arr.forEach((p, i) => console.log(`${i+1}.\t${p.dynasty}\t${p.title}`));

console.log('');

// 创新纹样
const inno = fs.readFileSync('app/patterns/innovation/data.ts', 'utf8');
const match2 = inno.match(/\[\s*\{[\s\S]*\}\s*\]/);
const arr2 = eval('(' + match2[0] + ')');

console.log('=== 创新纹样 ===');
arr2.forEach((p, i) => console.log(`${i+1}.\t${p.category}\t${p.title}`));
