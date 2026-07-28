// 批量填充复原纹样数据 — 根据标题智能生成文化背景
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'app', 'patterns', 'revival', 'data.ts');
let src = fs.readFileSync(file, 'utf8');

// ---- 知识库 ----
const DYNASTY_CONTEXT = {
  '商': '商代是中国青铜文明的鼎盛时期，纹样以饕餮纹、夔龙纹等青铜纹饰为主，造型凝重古朴，体现了早期祭祀文化的庄严与神秘感。',
  '周': '周代继承了商代的青铜传统，但在纹样上更趋简约端庄。礼制文化的高度发展使纹样的秩序感和象征性进一步增强。',
  '战': '战国时期诸侯纷争，工艺美术呈现出地域多样性和技艺创新。织绣、漆器、金银错等工艺发展迅速，纹样风格从古朴走向灵动。',
  '汉': '汉代是中国大一统帝国形成后的第一个文化高峰。丝绸之路的开通带来了西域的新鲜元素，云气纹、动物纹广泛流行，纹样充满动感和生命力。',
  '三国': '三国时期虽战乱频繁，但蜀锦工艺在这一时期达到高峰，为后世丝织纹样奠定了基础。',
  '魏晋': '魏晋南北朝是民族大融合的时代。佛教艺术的传入深刻影响了中国纹样，忍冬纹、莲花纹开始大量出现，纹样风格从中原的端庄转向融合与开放。',
  '唐': '唐代是纹样艺术的黄金时代。丝绸之路贸易繁荣，大量吸收波斯、中亚的装饰元素，加以本土化创造。宝相花、联珠纹、卷草纹、飞天等成为标志性纹样，风格丰满华丽、气度恢弘。',
  '唐初': '初唐纹样承袭隋代传统，并在吸收西域元素的过程中逐步形成自己的风格，线条从简练走向丰满。',
  '盛唐': '盛唐纹样达到中国古代装饰艺术的巅峰，造型饱满、色彩明艳、气度非凡，充分展现了盛世的自信与开放。',
  '中唐': '中唐纹样在盛唐的华丽基础上转向内敛精致，细节的处理更加细腻考究。',
  '晚唐': '晚唐纹样日渐精致繁复，在规范化中透露出一种即将演变的过渡气息。',
  '宋': '宋代理学兴起，文人审美主导了装饰艺术。纹样从唐代的华丽奔放转向内敛含蓄，写生花鸟成为主流，整体风格典雅秀美、意境深远。',
  '元': '元代是蒙古统治时期，中外文化交流频繁。纹样融合了北方游牧民族的审美和中亚伊斯兰几何风格，出现了大量繁复的缠枝纹。',
  '明': '明代纹样风格从元代的繁复转向清丽雅致。吉祥寓意图案大量流行，纹样造型规整、构图饱满，"图必有意、意必吉祥"。',
  '清': '清代纹样达到了中国装饰艺术中最为繁缛精致的程度。满工装饰、多层套叠成为主流，吉祥寓意更加丰富，工艺水平臻于极致。',
};

// 纹样类型 → 结构描述
const PATTERN_STRUCTURE = {
  '宝相花': '团窠对称结构，多层花瓣辐射状排列',
  '牡丹': '折枝或团花结构，花瓣层次丰富',
  '莲': '中心对称的团窠结构，或多瓣散点排列',
  '飞天': '动态飘逸的人物造型，飘带环绕构成画面节奏',
  '凤': '展翅或回首的祥禽造型，尾羽飘逸形成流动感',
  '龙': '蜿蜒盘旋的神兽造型，须发鳞甲细节丰富',
  '麒麟': '复合神兽造型，集多种动物特征为一体',
  '狮': '威严稳重的瑞兽造型，常配以绣球',
  '鱼': '游动姿态的动物造型，鳞片纹路细腻',
  '联珠': '圆形联珠圈构成外框，内部填充主题纹样',
  '云气': '流动的曲线结构，以S形或C形为基本单元',
  '卷草': '波浪状延伸的植物茎蔓，叶片沿曲线展开',
  '缠枝': 'S形连续缠绕的植物蔓藤结构',
  '几何': '对称的几何框架，以菱形、方形或六边形为基本单元',
  '云': '婉转流动的曲线组合，以如意云头为核心',
  '水': '层叠的波浪线结构，常与云纹组合',
  '边饰': '条带状的重复单元排列',
  '团窠': '圆形框架内填充主题纹样，外围常联珠圈',
  '藻井': '层层套叠的方形框架，向心汇聚的纵深结构',
  '忍冬': '波浪状延伸的藤蔓结构，侧枝三出或五出',
  '石榴': '多籽植物造型，内部填充密集纹样',
  '葡萄': '藤蔓缠绕的果实簇结构',
  '龟背': '六边形网状框架，内部填充适合纹样',
  '柿蒂': '四瓣对称的植物造型，花萼向四角延伸',
  '方胜': '两个菱形套叠的几何造型',
  '如意': '如意云头造型为核心的结构',
  '团花': '圆形或近圆形的完整花朵结构',
  '折枝': '截取一枝花叶的独立构图',
  '花鸟': '花卉与鸟禽组合的写实构图',
  '菱格': '菱形网格框架，格内填充适合纹样',
};

// 元素提取
function extractElements(title) {
  const elements = [];
  const patterns = [
    ['宝相花', '宝相花'],
    ['牡丹', '牡丹纹'],
    ['莲花', '莲花纹'], ['莲纹', '莲花纹'],
    ['飞天', '飞天纹'],
    ['凤', '凤纹'], ['凤凰', '凤纹'],
    ['龙', '龙纹'],
    ['麒麟', '麒麟纹'],
    ['狮子', '狮纹'], ['狮', '狮纹'],
    ['鱼', '鱼纹'],
    ['联珠', '联珠纹'],
    ['云气', '云气纹'], ['云纹', '云纹'],
    ['卷草', '卷草纹'],
    ['缠枝', '缠枝纹'],
    ['忍冬', '忍冬纹'],
    ['石榴', '石榴纹'],
    ['葡萄', '葡萄纹'],
    ['龟背', '龟背纹'],
    ['柿蒂', '柿蒂纹'],
    ['方胜', '方胜纹'],
    ['如意', '如意纹'],
    ['团花', '团花纹'],
    ['折枝', '折枝花'],
    ['藻井', '藻井纹'],
    ['几何', '几何纹'],
    ['菱格', '菱格纹'],
    ['花鸟', '花鸟纹'],
    ['水', '水纹'],
    ['如意', '如意纹'],
    ['对鹿', '鹿纹'],
    ['对兽', '兽纹'],
    ['狩', '狩猎纹'],
    ['俑', '人物纹'],
    ['鸟', '鸟纹'],
    ['兔', '兔纹'],
    ['鹿', '鹿纹'],
    ['马', '马纹'],
    ['羊', '羊纹'],
    ['舞', '舞蹈纹'],
    ['佛', '佛教纹'],
    ['菩萨', '菩萨纹'],
    ['供养', '供养人纹'],
    ['侍女', '仕女纹'],
    ['童子', '婴戏纹'],
    ['婴', '婴戏纹'],
    ['花叶', '花叶纹'],
    ['葵', '葵花纹'],
    ['菊', '菊花纹'],
    ['梅', '梅花纹'],
    ['兰', '兰花纹'],
    ['竹', '竹纹'],
    ['松', '松纹'],
    ['桃', '桃纹'],
    ['葫芦', '葫芦纹'],
    ['灵芝', '灵芝纹'],
    ['蝴蝶', '蝶纹'],
    ['蝶', '蝶纹'],
    ['鹤', '鹤纹'],
    ['鸳鸯', '鸳鸯纹'],
  ];
  patterns.forEach(([k, v]) => {
    if (title.includes(k) && !elements.includes(v)) elements.push(v);
  });
  if (elements.length === 0) elements.push('传统纹样');
  return elements;
}

function guessStructure(title) {
  for (const [k, v] of Object.entries(PATTERN_STRUCTURE)) {
    if (title.includes(k)) return v;
  }
  return '传统对称构图';
}

function guessColors(dynasty) {
  if (dynasty.includes('唐') || dynasty.includes('盛唐') || dynasty.includes('初唐')) 
    return ['朱砂红', '石绿', '群青', '赭褐', '藤黄'];
  if (dynasty.includes('宋'))
    return ['靛青', '月白', '天青', '浅绛', '茶褐'];
  if (dynasty.includes('明'))
    return ['朱红', '石膏', '石绿', '深蓝', '金黄'];
  if (dynasty.includes('清'))
    return ['朱红', '石青', '明黄', '松花绿', '桃红'];
  if (dynasty.includes('汉'))
    return ['绛紫', '藏青', '朱砂', '土黄', '石绿'];
  return ['赭石', '青灰', '土黄', '深褐', '朱砂'];
}

function guessDynastyContext(dynasty) {
  for (const [k, v] of Object.entries(DYNASTY_CONTEXT)) {
    if (dynasty.includes(k) || dynasty.startsWith(k)) return v;
  }
  return '这件纹样承载着所属时代的审美追求和工艺智慧，是中华传统装饰艺术的珍贵遗产。';
}

function guessDescription(title, dynasty, elements) {
  const el = elements.join('、');
  return `${dynasty}时期的${el}作品。构图严谨、线条流畅，充分体现了该时期纹样装饰语言的特色与魅力。`;
}

function guessDetail(title, dynasty, structure) {
  return `这件${dynasty}${title}采用${structure}，整体布局均衡有序，细节处理精到。纹样中的线条疏密有致，造型生动自然，是研究${dynasty}装饰艺术的重要参考实例。`;
}

// ---- 解析并替换 ----
// 直接用 JSON 方式处理
const dataMatch = src.match(/export const revivalPatterns: RevivalPattern\[\] = (\[[\s\S]*?\]);/);
if (!dataMatch) { console.error('未找到 data 数组'); process.exit(1); }

let dataArray;
try {
  dataArray = eval(dataMatch[1]);
} catch(e) {
  console.error('解析失败:', e.message);
  process.exit(1);
}

let updated = 0;
dataArray.forEach(p => {
  const title = p.title || '';
  const dynasty = p.dynasty || '';
  
  // 只在空的字段上填充
  if (!p.elements || p.elements.length === 0) {
    p.elements = extractElements(title);
    updated++;
  }
  if (!p.culture || p.culture === '') {
    p.culture = guessDynastyContext(dynasty);
    updated++;
  }
  if (!p.description || p.description === '') {
    p.description = guessDescription(title, dynasty, p.elements);
    updated++;
  }
  if (!p.detail || p.detail === '') {
    p.detail = guessDetail(title, dynasty, guessStructure(title));
    updated++;
  }
});

console.log(`更新了 ${updated} 个字段 (共 ${dataArray.length} 件)`);

// 写回
const newArray = JSON.stringify(dataArray, null, 2);
const newFile = src.replace(dataMatch[1], newArray);
fs.writeFileSync(file, newFile, 'utf8');
console.log('写入完成');
