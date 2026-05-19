const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'public', 'images', 'revival');
const files = fs.readdirSync(dir).filter(f => /\.(png|jpg|jpeg)$/i.test(f)).sort();

const items = files.map((f, i) => {
  const name = f.replace(/\.(png|jpg|jpeg)$/i, '');
  const parts = name.split('-');
  const dynasty = parts[0];
  return {
    id: i + 1,
    dynasty,
    title: name,
    description: `${name} 纹样复原`,
    tags: [dynasty],
    src: `/images/revival/${f}`
  };
});

const outPath = path.join(dir, '..', 'data.tsx');

const lines = [];
lines.push('// 复原纹样数据 — 自动生成');
lines.push(`// 共 ${items.length} 件作品`);
lines.push('');
lines.push('export const revivalItems = [');
items.forEach((item, i) => {
  const comma = i < items.length - 1 ? ',' : '';
  lines.push('  {');
  lines.push(`    id: ${item.id},`);
  lines.push(`    dynasty: "${item.dynasty}",`);
  lines.push(`    title: "${item.title}",`);
  lines.push(`    description: "${item.description}",`);
  lines.push(`    tags: ${JSON.stringify(item.tags)},`);
  lines.push(`    src: "${item.src}"`);
  lines.push(`  }${comma}`);
});
lines.push('];');
lines.push('');

fs.writeFileSync(outPath, lines.join('\n'), 'utf-8');

console.log(`Generated ${items.length} items → ${outPath}`);
console.log('First 3:');
items.slice(0, 3).forEach(i => console.log(`  ${i.title}`));
console.log('Last 3:');
items.slice(-3).forEach(i => console.log(`  ${i.title}`));
