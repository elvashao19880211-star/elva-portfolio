const fs = require('fs');
const c = fs.readFileSync('.next/dev/static/chunks/_06te.hc._.js', 'utf8');
const matches = c.match(/"id":"revival-\d+"/g);
console.log('IDs found:', matches ? matches.length : 0);
if (matches) {
  const firstFew = matches.slice(0, 5);
  console.log('First IDs:', firstFew);
  // Find the title right after each ID
  const titles = [];
  const titleRegex = /"title":"([^"]+)"/g;
  let m;
  while ((m = titleRegex.exec(c)) !== null) titles.push(m[1]);
  console.log('First 10 titles:');
  titles.slice(0, 10).forEach((t, i) => console.log(`  ${i + 1}. ${t}`));
}
