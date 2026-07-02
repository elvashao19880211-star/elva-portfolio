/**
 * 素材批量导入脚本
 *
 * 用法：
 *   1. 把图片放到 素材待导入/ 文件夹
 *   2. 文件名格式：朝代-载体-元素-结构-颜色.png
 *      例：唐代-织锦-牡丹纹-二方连续-红.png
 *   3. 运行：node scripts/import-materials.js
 *   4. 自动复制到 public/images/materials/ 并更新 data.ts
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..', '素材待导入');
const IMG_DIR = path.join(__dirname, '..', 'public', 'images', 'materials');
const DATA_FILE = path.join(__dirname, '..', 'app', 'materials', 'data.ts');

// 确保目标目录存在
if (!fs.existsSync(IMG_DIR)) fs.mkdirSync(IMG_DIR, { recursive: true });

const files = fs.readdirSync(SRC_DIR).filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f));

if (files.length === 0) {
  console.log('❌ 素材待导入 文件夹里没有图片，请先放图进去。');
  process.exit(0);
}

const newItems = [];

for (const file of files) {
  const nameNoExt = path.parse(file).name; // "唐代-织锦-牡丹纹-二方连续-红"
  const parts = nameNoExt.split('-');

  if (parts.length < 5) {
    console.warn(`⚠ 跳过（格式不对，需要至少5段）：${file}  →  格式：朝代-载体-元素-结构-颜色.png`);
    continue;
  }

  const dynasty = parts[0];
  const carrier = parts[1];
  const elementName = parts[2];
  const structure = parts[3];
  const color = parts[4];

  // 元素名 → ID 映射（支持模糊匹配，取包含关系的第一个）
  const { ELEMENT_TREE } = require(path.join(__dirname, '..', 'app', 'materials', 'data.ts'));

  function findElementId(tree, label) {
    for (const node of tree) {
      if (node.label === label) return node.id;
      if (node.children) {
        for (const child of node.children) {
          if (child.label === label) return child.id;
          if (child.children) {
            for (const grand of child.children) {
              if (grand.label === label) return grand.id;
            }
          }
        }
      }
    }
    return null;
  }

  const elementId = findElementId(ELEMENT_TREE, elementName);

  // 复制图片
  const destName = file.replace(/\s+/g, '-').toLowerCase();
  fs.copyFileSync(path.join(SRC_DIR, file), path.join(IMG_DIR, destName));

  const id = 'mat-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 5);

  newItems.push({
    id,
    title: elementName,
    dynasty,
    carrier,
    elements: elementId ? [elementId] : [elementName],
    structure,
    colors: color.split('，').map(c => c.trim()), // 支持"红，金"多颜色
    description: `${dynasty}${carrier}，${elementName}，${structure}排布，${color}配色`,
    src: `/images/materials/${destName}`,
  });

  console.log(`✅ ${file}  →  ${destName}  (元素ID: ${elementId ?? '⚠ 未匹配，用了原名称'})`);
}

// 读取现有 data.ts，替换 materials 数组
let content = fs.readFileSync(DATA_FILE, 'utf-8');

// 找到 const materials 数组并替换
const startMarker = 'const materials: MaterialItem[] = [';
const endMarker = '];';

const start = content.indexOf(startMarker);
const end = content.indexOf(endMarker, content.indexOf('export default materials;') + 1);

if (start === -1 || end === -1) {
  console.log('❌ 找不到 materials 数组，请检查 data.ts');
  process.exit(1);
}

const itemsJson = newItems.map(item =>
  `  {\n    id: '${item.id}',\n    title: '${item.title}',\n    dynasty: '${item.dynasty}',\n    carrier: '${item.carrier}',\n    elements: ${JSON.stringify(item.elements)},\n    structure: '${item.structure}',\n    colors: ${JSON.stringify(item.colors)},\n    description: '${item.description}',\n    src: '${item.src}',\n  }`
).join(',\n');

const newArray = `const materials: MaterialItem[] = [\n${itemsJson},\n];`;
content = content.slice(0, start) + newArray + content.slice(end + 2);

fs.writeFileSync(DATA_FILE, content, 'utf-8');

console.log(`\n🎉 导入完成！共 ${newItems.length} 个素材。`);
console.log(`   data.ts 已更新 → ${DATA_FILE}`);
console.log(`   图片已复制 → ${IMG_DIR}`);
