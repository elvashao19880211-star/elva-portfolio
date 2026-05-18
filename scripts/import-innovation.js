/**
 * 创新纹样批量导入脚本
 *
 * 用法：
 *   1. 将图片放入 public/images/innovation/ 目录
 *   2. 按格式命名：分类-作品名称.png（例如 抽象-山水构成.png）
 *   3. 在项目根目录运行：node scripts/import-innovation.js
 *   4. 自动生成 app/patterns/innovation/data.ts
 */

const fs = require('fs');
const path = require('path');

const IMG_DIR = path.join(__dirname, '..', 'public', 'images', 'innovation');
const OUTPUT = path.join(__dirname, '..', 'app', 'patterns', 'innovation', 'data.ts');

const EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];

if (!fs.existsSync(IMG_DIR)) {
  console.error('❌ 未找到图片目录：public/images/innovation/');
  process.exit(1);
}

const files = fs.readdirSync(IMG_DIR).filter((f) =>
  EXTENSIONS.includes(path.extname(f).toLowerCase())
);

if (files.length === 0) {
  console.error('❌ 目录中没有图片文件');
  process.exit(1);
}

function parseFilename(filename) {
  const name = path.basename(filename, path.extname(filename));
  const parts = name.split('-');
  const category = parts[0] || '其他';
  const title = parts.slice(1).join('-') || name;
  return { category, title };
}

const patterns = files.map((file, i) => {
  const { category, title } = parseFilename(file);
  return {
    id: `innov-${String(i + 1).padStart(3, '0')}`,
    title,
    category,
    description: `${category}类${title}创新设计`,
    src: `/images/innovation/${file}`,
  };
});

function generateTS(patterns) {
  const lines = [
    '// 自动生成基础条目，手动补充设计信息',
    '// 运行 node scripts/import-innovation.js 更新',
    '',
    'export interface InnovationPattern {',
    '  id: string;',
    '  title: string;',
    '  category: string;       // 分类',
    '  inspiration?: string;   // 灵感来源',
    '  elements?: string[];    // 构成元素',
    '  description: string;',
    '  detail?: string;        // 设计说明',
    '  src: string;',
    '}',
    '',
    'const innovationPatterns: InnovationPattern[] = [',
  ];

  patterns.forEach((p, i) => {
    const comma = i < patterns.length - 1 ? ',' : '';
    lines.push(`  {`);
    lines.push(`    id: '${p.id}',`);
    lines.push(`    title: '${p.title}',`);
    lines.push(`    category: '${p.category}',`);
    lines.push(`    // inspiration: '',  // ← 手动填写`);
    lines.push(`    // elements: [],     // ← 手动填写`);
    lines.push(`    description: '${p.description}',`);
    lines.push(`    // detail: '',       // ← 手动填写`);
    lines.push(`    src: '${p.src}',`);
    lines.push(`  }${comma}`);
  });

  lines.push('];');
  lines.push('');
  lines.push('export default innovationPatterns;');
  return lines.join('\n');
}

const content = generateTS(patterns);
fs.writeFileSync(OUTPUT, content, 'utf-8');

console.log(`\n✅ 导入完成！`);
console.log(`   共导入 ${patterns.length} 幅创新纹样作品`);
console.log(`   已生成：app/patterns/innovation/data.ts`);
console.log(`\n📝 接下来在 data.ts 中补充以下信息：`);
console.log(`   - inspiration: 灵感来源`);
console.log(`   - elements: 构成元素列表`);
console.log(`   - detail: 设计说明`);
