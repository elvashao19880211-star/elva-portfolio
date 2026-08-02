// 回滚重做 — 只填事实字段，不写假大空文案
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'app', 'patterns', 'revival', 'data.ts');
let src = fs.readFileSync(file, 'utf8');

// ---- 事实数据 ----
// 纹样类型 → 结构
const PATTERN_STRUCTURE = {
  '宝相花': '团窠对称',
  '牡丹': '折枝/团花', '牡丹莲': '团窠对称',
  '莲花': '团窠', '莲纹': '团窠',
  '飞天': '人物动态',
  '凤': '祥禽造型', '凤凰': '祥禽造型',
  '龙': '神兽造型',
  '麒麟': '瑞兽造型',
  '狮': '瑞兽造型', '狮子': '瑞兽造型',
  '鱼': '动物造型',
  '联珠': '联珠圈框',
  '云气': '曲线流动',
  '卷草': '卷草蜿蜒',
  '缠枝': '缠枝连续',
  '忍冬': '忍冬藤蔓',
  '石榴': '植物造型',
  '葡萄': '藤蔓缠绕',
  '龟背': '六边网格',
  '柿蒂': '四瓣对称',
  '方胜': '菱形套叠',
  '如意': '如意云头',
  '团花': '圆形团花',
  '折枝': '独立折枝',
  '藻井': '层层套叠',
  '几何': '几何框架',
  '菱格': '菱形网格',
  '花鸟': '花鸟写实',
  '对鹿': '对兽对称',
  '对兽': '对兽对称',
  '狩': '叙事场景',
  '舞': '人物动态',
  '鹿': '动物造型',
  '鸟': '禽鸟造型',
  '兔': '动物造型',
  '马': '动物造型',
  '羊': '动物造型',
  '蛇': '动物造型',
  '人': '人物造型',
  '俑': '人物造型',
  '兽': '瑞兽造型',
  '虎': '走兽造型',
  '猴': '动物造型',
  '蛙': '动物造型',
  '龟': '神兽造型',
  '鹤': '禽鸟造型',
  '鸳鸯': '禽鸟造型',
  '蝶': '昆虫造型', '蝴蝶': '昆虫造型',
  '花叶': '植物造型',
  '葵': '植物造型',
  '菊': '植物造型',
  '梅': '植物造型',
  '兰': '植物造型',
  '竹': '植物造型',
  '松': '植物造型',
  '桃': '植物造型',
  '灵芝': '植物造型',
  '树': '植物造型',
  '菱': '几何框架',
  '云': '云气流动',
  '水': '水纹层叠',
  '边饰': '条带重复',
  '团窠': '圆形框架',
  '团': '圆形团花',
  '珠': '联珠圈框',
  '锦': '连续纹样',
  '山': '自然景物',
  '石': '自然景物',
  '日': '天体纹样',
  '月': '天体纹样',
  '星': '天体纹样',
};

// 提取元素
function extractElements(title) {
  const el = [];
  const map = [
    '宝相花','牡丹','莲花','飞天','凤凰','麒麟','狮子','鸳鸯','蝴蝶',
    '联珠','云气','卷草','缠枝','忍冬','石榴','葡萄','龟背','柿蒂',
    '方胜','如意','团花','折枝','藻井','菱格','花鸟','对鹿','对兽',
    '灵芝','葫芦','鹤纹','龙纹','凤纹','狮纹','鱼纹','鸟纹','兔纹',
    '马纹','羊纹','蛇纹','虎纹','猴纹','蛙纹','龟纹','鹿纹','蝶纹',
    '菊纹','梅纹','兰纹','竹纹','松纹','桃纹','树纹','葵纹','花叶',
    '山纹','石纹','水纹','云纹','星纹','日纹','月纹','舞纹',
  ];
  map.forEach(k => {
    if (title.includes(k) && !el.includes(k)) el.push(k);
  });
  if (el.length === 0) el.push('传统纹样');
  return el;
}

function guessStructure(title) {
  for (const [k, v] of Object.entries(PATTERN_STRUCTURE)) {
    if (title.includes(k)) return v;
  }
  return '';
}

// ---- 解析 ----
const dataMatch = src.match(/export const revivalPatterns: RevivalPattern\[\] = (\[[\s\S]*?\]);/);
if (!dataMatch) { console.error('not found'); process.exit(1); }

let dataArray = eval(dataMatch[1]);

dataArray.forEach(p => {
  const title = p.title || '';
  // 只填事实字段
  p.elements = extractElements(title);
  const st = guessStructure(title);
  if (st) {
    // 给每个 pattern 加 structure 字段（如果类型定义没有的话也能用）
    p.structure = st;
  }
  // 清空 AI 生成的文案
  p.culture = '';
  p.description = '';
  p.detail = '';
});

console.log(`处理完成: ${dataArray.length} 件`);

// 写回
const newArray = JSON.stringify(dataArray, null, 2);
const newFile = src.replace(dataMatch[1], newArray);
fs.writeFileSync(file, newFile, 'utf8');
console.log('写入完成');
