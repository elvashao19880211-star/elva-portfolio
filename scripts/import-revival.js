/**
 * 复原纹样批量导入脚本
 *
 * 用法：
 *   1. 将图片放入 public/images/revival/ 目录
 *   2. 按格式命名：朝代-作品名称.png（例如 宋-如意云纹.png）
 *   3. 在项目根目录运行：node scripts/import-revival.js
 *   4. 自动生成 app/patterns/revival/data.ts
 */

const fs = require('fs');
const path = require('path');

const IMG_DIR = path.join(__dirname, '..', 'public', 'images', 'revival');
const OUTPUT = path.join(__dirname, '..', 'app', 'patterns', 'revival', 'data.ts');

// 支持的文件扩展名
const EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];

// 如果目录不存在，给出提示
if (!fs.existsSync(IMG_DIR)) {
  console.error('❌ 未找到图片目录：public/images/revival/');
  console.log('   请先创建该目录并放入图片文件。');
  process.exit(1);
}

// 读取所有图片文件
const files = fs.readdirSync(IMG_DIR).filter((f) =>
  EXTENSIONS.includes(path.extname(f).toLowerCase())
);

if (files.length === 0) {
  console.error('❌ public/images/revival/ 中没有找到图片文件');
  console.log('   支持的格式：' + EXTENSIONS.join(', '));
  process.exit(1);
}

// 文件名解析：朝代-作品名称.扩展名
function parseFilename(filename) {
  const name = path.basename(filename, path.extname(filename));
  const parts = name.split('-');
  const dynasty = parts[0] || '未知';
  const title = parts.slice(1).join('-') || name;
  return { dynasty, title };
}

// 生成每条数据
const patterns = files.map((file, i) => {
  const { dynasty, title } = parseFilename(file);
  return {
    id: `revival-${String(i + 1).padStart(3, '0')}`,
    title,
    dynasty,
    description: `${dynasty}${title}纹样复原`,
    src: `/images/revival/${file}`,
  };
});

// 生成 TypeScript 文件内容
function generateTS(patterns) {
  const lines = [
    '// 自动生成基础条目，手动补充文化信息',
    '// 运行 node scripts/import-revival.js 更新',
    '',
    'export interface RevivalPattern {',
    '  id: string;',
    '  title: string;',
    '  dynasty: string;',
    '  era?: string;           // 具体时期',
    '  culture?: string;       // 文化背景',
    '  elements?: string[];    // 构成元素',
    '  description: string;',
    '  detail?: string;        // 设计说明',
    '  src: string;',
    '}',
    '',
    'const revivalPatterns: RevivalPattern[] = [',
  ];

  patterns.forEach((p, i) => {
    const comma = i < patterns.length - 1 ? ',' : '';
    lines.push(`  {`);
    lines.push(`    id: '${p.id}',`);
    lines.push(`    title: '${p.title}',`);
    lines.push(`    dynasty: '${p.dynasty}',`);
    lines.push(`    // era: '',          // ← 手动填写`);
    lines.push(`    // culture: '',      // ← 手动填写`);
    lines.push(`    // elements: [],     // ← 手动填写`);
    lines.push(`    description: '${p.description}',`);
    lines.push(`    // detail: '',       // ← 手动填写`);
    lines.push(`    src: '${p.src}',`);
    lines.push(`  }${comma}`);
  });

  lines.push('];');
  lines.push('');
  lines.push('export default revivalPatterns;');
  return lines.join('\n');
}

// 写入文件
const content = generateTS(patterns);
fs.writeFileSync(OUTPUT, content, 'utf-8');

console.log(`\n✅ 导入完成！`);
console.log(`   共导入 ${patterns.length} 幅复原纹样作品`);
console.log(`   已生成：app/patterns/revival/data.ts`);
console.log(`\n📝 接下来在 data.ts 中补充以下信息：`);
console.log(`   - culture: 文化背景说明`);
console.log(`   - elements: 构成元素列表`);
console.log(`   - detail: 设计复原说明`);
