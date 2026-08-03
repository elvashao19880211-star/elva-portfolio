import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.resolve('public/images/materials');
const DATA_TS = path.resolve('app/materials/data.ts');
const SIMPLE_ELEMENTS = {
  '飞天纹': ['feitian'],
  '宝相花': ['baoxianghua'], '宝相花纹': ['baoxianghua'],
  '牡丹纹': ['mudan'],
  '对鸟团窠': ['duiniao', 'tuanke'],
  '团花纹': ['tuanhua'], '团花': ['tuanhua'],
  '小宝相纹': ['baoxianghua'],
  '方形小宝相': ['baoxianghua'],
  '联珠对马纹': ['lianzhuduima'],
  '六出团花纹': ['tuanhua'],
  '团窠鹿纹': ['luwen', 'tuanke'],
  '摩羯纹': ['mojiewen'],
  '狮子纹': ['shiziwen'],
  '鸳鸯团窠纹': ['yuanyang', 'tuanke'],
  '石榴纹': ['shiliuwen'],
  '麒麟': ['qilin'], '麒麟纹': ['qilin'],
  '三角云纹': ['yunwen'],
  '卷云纹': ['yunwen'],
  '团云': ['yunwen'],
  '火焰云纹': ['huowen', 'yunwen'],
  '变型云雷纹': ['yunwen'],
  '变形四合云纹': ['sihuayunwen'],
  '团云纹': ['yunwen'],
  '杂宝团纹': ['jixiang'],
  '杂宝团花纹': ['tuanhua', 'jixiang'],
  '如意四合云纹': ['ruyi', 'yunwen'],
  '四合如意云纹': ['sihuayunwen', 'ruyi', 'yunwen'],
  '云气纹': ['yunwen'],
  '变形如意云纹': ['ruyi', 'yunwen'],
  '鱼鳞云纹': ['yunwen'],
  '勾莲纹': ['lianwen'],
  '蝠纹': ['fuwen'],
  '变型卷云纹': ['yunwen'],
  '三多佛手柑纹': ['jixiang'],
  '三多石榴纹': ['shiliuwen'],
  '福寿纹': ['jixiang'],
  '三多纹': ['jixiang'],
  '八角宫灯纹': ['gongdeng'],
  '如意云纹': ['ruyi', 'yunwen'],
  '宫灯纹': ['gongdeng'],
  '正龙纹': ['longwen'],
  '卷草纹': ['juanchaowen'],
  '叠云纹': ['yunwen'],
  '圈圈团云纹': ['yunwen'],
  '吉庆万福纹': ['jixiang', 'fuwen'],
  '团花八吉祥纹': ['tuanhua', 'jixiang'],
  '海东青捕大雁纹': ['niaowen'],
  '方形花卉纹样': ['huahui'],
  '牡丹莲纹': ['mudan', 'lianwen'],
};

function parseFilename(filename) {
  const name = filename.replace(/\.png$/i, '');
  const cleaned = name.replace(/\s*[-]?\s*\(\d+\)$/, '');
  const parts = cleaned.split('-');
  
  if (parts.length < 5) {
    console.warn(`  ⚠️ 跳过: ${filename}`);
    return null;
  }

  const dynasty = parts[0];
  const carrier = parts[1];
  const structure = parts.slice(-2, -1)[0].replace(/均衡/g, '');
  const color = parts.slice(-1)[0];
  const title = parts.slice(2, -2).join('');

  const elements = [];
  for (const [kw, ids] of Object.entries(SIMPLE_ELEMENTS)) {
    if (title.includes(kw)) {
      elements.push(...ids);
    }
  }
  if (elements.length === 0) elements.push('qita');

  return {
    id: '',
    title,
    dynasty,
    carrier,
    elements: [...new Set(elements)],
    structure,
    colors: [color],
    description: `${dynasty}${carrier}，${title}，${structure}排布，${color}配色`,
    src: `/images/materials/${filename}`,
  };
}

const files = fs.readdirSync(PUBLIC_DIR)
  .filter(f => /\.png$/i.test(f) && !f.includes('thumb'));

const items = files.sort().map(f => parseFilename(f)).filter(Boolean);

items.forEach((item, i) => item.id = `mat-m${String(i).padStart(3, '0')}`);

// Build data array lines
const dataLines = ['const materials: MaterialItem[] = ['];
for (const item of items) {
  dataLines.push(`  {`);
  dataLines.push(`    id: '${item.id}',`);
  dataLines.push(`    title: '${item.title}',`);
  dataLines.push(`    dynasty: '${item.dynasty}',`);
  dataLines.push(`    carrier: '${item.carrier}',`);
  dataLines.push(`    elements: ${JSON.stringify(item.elements)},`);
  dataLines.push(`    structure: '${item.structure}',`);
  dataLines.push(`    colors: ${JSON.stringify(item.colors)},`);
  dataLines.push(`    description: '${item.description}',`);
  dataLines.push(`    src: '${item.src}',`);
  dataLines.push(`  },`);
}
dataLines.push('];');
const newData = dataLines.join('\n');

// Read original file, find and replace the materials array
let original = fs.readFileSync(DATA_TS, 'utf-8');
const startMarker = 'const materials: MaterialItem[] = [';
const endMarker = /^];/m;
const start = original.indexOf(startMarker);
const afterStart = original.indexOf('\n]', start);
if (start < 0 || afterStart < 0) { console.error('找不到 materials 数组'); process.exit(1); }
const end = afterStart + 2;

const before = original.slice(0, start);
const after = original.slice(end);

fs.writeFileSync(DATA_TS, before + newData + after);

console.log(`✅ 写入 data.ts: ${items.length} 条素材数据`);
