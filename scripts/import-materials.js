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
const sharp = require('sharp');

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
  const nameNoExt = path.parse(file).name.replace(/\(\d+\)$/g, ''); // 去掉末尾 (2) 等重复编号
  const parts = nameNoExt.split('-');

  if (parts.length < 5) {
    console.warn(`⚠ 跳过（格式不对，需要至少5段）：${file}  →  格式：朝代-载体-元素-结构-颜色.png`);
    continue;
  }

  let dynasty = parts[0];
  let carrier = parts[1];
  const elementName = parts[2];
  const structure = parts[3];
  const color = parts[4];

  // 朝代映射
  if (dynasty === '明清') dynasty = '明';

  // 载体映射
  const carrierMap = {
    '水陆画': '其他',
    '家具装饰': '木器',
    '竹盒装饰': '木器',
  };
  carrier = carrierMap[carrier] || carrier;

  // 元素名称标准化（去变体前缀、补全/去除纹后缀）
  const cleanElement = elementName
    // 去前缀
    .replace(/^变[型形]/, '')   // 变型云雷纹 → 云雷纹
    .replace(/^变形/, '')       // 变形四合云纹 → 四合云纹
    .replace(/^圈圈/, '')       // 圈圈团云纹 → 团云纹
    .replace(/^朵[型形]/, '')   // 朵型宝相花 → 宝相花
    // 完整匹配（放到方形 小 前缀剥离之前）
    .replace(/^方形花卉纹样$/, '方形花卉纹样') // 保持原名，匹配植物纹下的方形花卉纹样节点
    .replace(/^方形小宝相$/, '宝相花')
    .replace(/^方形小宝相纹$/, '宝相花')
    .replace(/^方形/, '')       // 其他方形xx → xx
    .replace(/^小/, '')         // 小宝相纹 → 宝相纹
    // 去纹后缀（不含纹）
    .replace(/^团花纹$/, '团花')
    .replace(/^宝相花纹$/, '宝相花')
    .replace(/^小宝相纹$/, '宝相花')
    .replace(/^小宝相$/, '宝相花')
    .replace(/^宝相$/, '宝相花')
    .replace(/^宝相纹$/, '宝相花')
    // 补纹后缀（树里有纹）
    .replace(/^团云$/, '团云纹')
    .replace(/^如意云纹$/, '如意纹')
    .replace(/^四合如意云$/, '如意四合云纹')
    .replace(/^四合如意云纹$/, '如意四合云纹')
    // 杂宝
    .replace(/^杂宝团纹$/, '杂宝纹')
    .replace(/^杂宝团花$/, '杂宝纹')
    .replace(/^杂宝团花纹$/, '杂宝纹')
    // 宫灯
    .replace(/^八角宫灯纹$/, '灯纹')
    .replace(/^宫灯纹$/, '灯纹')
    // 团窠
    .replace(/^对鸟团窠$/, '对鸟团窠纹')
    // 团花
    .replace(/^六出团花纹$/, '团花')
    // 三多子类
    .replace(/^三多佛手柑纹$/, '三多纹')
    .replace(/^三多石榴纹$/, '三多纹');

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

  const elementId = findElementId(ELEMENT_TREE, cleanElement);

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

// 找到 const materials 数组开始位置
const startMarker = 'const materials: MaterialItem[] = [';
const start = content.indexOf(startMarker);
if (start === -1) {
  console.log('❌ 找不到 materials 数组，请检查 data.ts');
  process.exit(1);
}

// 从 start 之后找第一个 ]; （数组结束）
const end = content.indexOf('\n];', start + startMarker.length);
if (end === -1) {
  console.log('❌ 找不到 materials 数组结束标记，请检查 data.ts');
  process.exit(1);
}

const itemsJson = newItems.map(item =>
  `  {\n    id: '${item.id}',\n    title: '${item.title}',\n    dynasty: '${item.dynasty}',\n    carrier: '${item.carrier}',\n    elements: ${JSON.stringify(item.elements)},\n    structure: '${item.structure}',\n    colors: ${JSON.stringify(item.colors)},\n    description: '${item.description}',\n    src: '${item.src}',\n  }`
).join(',\n');

const newArray = `const materials: MaterialItem[] = [\n${itemsJson},\n];`;
content = content.slice(0, start) + newArray + content.slice(end + 3); // end+3 跳过 \n];

fs.writeFileSync(DATA_FILE, content, 'utf-8');

console.log(`\n🎉 导入完成！共 ${newItems.length} 个素材。`);
console.log(`   data.ts 已更新 → ${DATA_FILE}`);
console.log(`   图片已复制 → ${IMG_DIR}`);

// 自动打标
addWatermarks();

async function addWatermarks() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="260" height="100">
    <text x="130" y="42" text-anchor="middle" font-size="28" fill="rgba(255,255,255,0.15)" font-family="sans-serif">河图</text>
    <text x="130" y="68" text-anchor="middle" font-size="16" fill="rgba(255,255,255,0.10)" font-family="sans-serif" font-style="italic">hetu-pattern.com</text>
  </svg>`;
  const buf = Buffer.from(svg);
  const files = fs.readdirSync(IMG_DIR).filter((f) => /\.(png|jpg|jpeg)$/i.test(f));
  for (const file of files) {
    try {
      const p = path.join(IMG_DIR, file);
      await sharp(p).composite([{ input: buf, top: 0, left: 0, tile: true, blend: 'over' }]).png().toFile(p + '.tmp');
      fs.renameSync(p + '.tmp', p);
    } catch (e) { console.error('打标失败 ' + file + ':', e.message); }
  }
  console.log('✅ 打标完成！' + files.length + ' 张已处理。');
}
