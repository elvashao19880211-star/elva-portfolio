// AI 纹样生成器 — 细分参数数据

export const DYNASTY_OPTIONS = [
  { id: 'shang', label: '商周', en: 'Shang & Zhou' },
  { id: 'han', label: '汉代', en: 'Han' },
  { id: 'wei-jin', label: '魏晋南北朝', en: 'Wei-Jin' },
  { id: 'tang', label: '唐代', en: 'Tang' },
  { id: 'song', label: '宋代', en: 'Song' },
  { id: 'yuan', label: '元代', en: 'Yuan' },
  { id: 'ming', label: '明代', en: 'Ming' },
  { id: 'qing', label: '清代', en: 'Qing' },
];

// 结构 — 纹样的整体构图方式
export const STRUCTURE_OPTIONS = [
  { id: 'tuan-ke', label: '团窠式', desc: '圆形或椭圆框架，中心主纹，适合单独装饰' },
  { id: 'lian-zhu', label: '联珠式', desc: '圆环联珠围成框架，对称饱满，唐代典型' },
  { id: 'chan-zhi', label: '缠枝式', desc: '藤蔓枝叶蜿蜒连绵，适合连续装饰' },
  { id: 'san-dian', label: '散点式', desc: '元素均匀散布，疏密有致，自由灵活' },
  { id: 'dui-cheng', label: '对称式', desc: '左右/上下镜像对称，庄重均衡' },
  { id: 'kai-guang', label: '开光式', desc: '主体纹样嵌入框格，层次分明' },
  { id: 'dai-zhuang', label: '带状式', desc: '横向连续排列，适合边饰和条带' },
];

// 主纹 — 纹样的核心主体
export const MAIN_MOTIF_OPTIONS = [
  { id: 'long', label: '龙纹', desc: '五爪龙、行龙、团龙、云龙' },
  { id: 'feng', label: '凤纹', desc: '凤凰、鸾鸟、孔雀，百鸟之王' },
  { id: 'qilin', label: '麒麟', desc: '瑞兽，仁兽，常与云气搭配' },
  { id: 'deer', label: '鹿纹', desc: '灵鹿、对鹿，象征禄与长寿' },
  { id: 'lion', label: '狮纹', desc: '瑞狮、绣球狮，唐代常见' },
  { id: 'crane', label: '仙鹤', desc: '丹顶鹤，象征长寿与高洁' },
  { id: 'baoxiang', label: '宝相花', desc: '融合多种花卉的理想化团花' },
  { id: 'peony', label: '牡丹', desc: '国色天香，象征富贵' },
  { id: 'lotus', label: '莲花', desc: '出淤泥不染，佛教常用' },
  { id: 'chrysanthemum', label: '菊花', desc: '隐逸高洁，宋代常见' },
];

// 辅纹 — 辅助装饰元素
export const SECONDARY_MOTIF_OPTIONS = [
  { id: 'yun', label: '云纹', desc: '流云、卷云、朵云，填充与过渡' },
  { id: 'cao', label: '花草', desc: '卷草、忍冬、蔓草，柔美流动' },
  { id: 'jihe', label: '几何', desc: '回纹、方胜、菱形纹，规律排列' },
  { id: 'lianzhu', label: '联珠', desc: '小圆珠串连，分隔或围框' },
  { id: 'ruyi', label: '如意', desc: '如意云头，吉祥纹样' },
  { id: 'baoxiang-small', label: '小宝相', desc: '简化宝相花，点缀填充用' },
];

// 边框 — 外框类型
export const BORDER_OPTIONS = [
  { id: 'none', label: '无边框', desc: '自由外轮廓' },
  { id: 'lianzhu-border', label: '联珠边框', desc: '圆珠围成外框' },
  { id: 'huiwen-border', label: '回纹边框', desc: '回字纹连绵成框' },
  { id: 'cao-border', label: '卷草边框', desc: '花草缠绕成框' },
  { id: 'jihe-border', label: '几何边框', desc: '几何纹成框' },
];

// 配色方案
export const COLOR_OPTIONS = [
  { id: 'hong-jin', label: '绯红主调', desc: '朱红/金色/白，盛唐典型配色', colors: ['#C33C3C', '#C3A370', '#F5F0E8'] },
  { id: 'qing-lv', label: '青绿主调', desc: '青绿/蓝/白，宋代典雅配色', colors: ['#56C1CE', '#4A9E8E', '#E8F0EE'] },
  { id: 'dian-lan', label: '靛蓝主调', desc: '靛蓝/月白/金，明清常见', colors: ['#3A506B', '#7BC4D0', '#C3A370'] },
  { id: 'jin-mo', label: '金墨主调', desc: '黑底金纹/金底黑纹，庄重高贵', colors: ['#1A1A2E', '#C3A370', '#F5F3EE'] },
  { id: 'wucai', label: '多彩绚丽', desc: '多色搭配，热烈绚烂，敦煌风格', colors: ['#C33C3C', '#56C1CE', '#C3A370', '#3A506B'] },
  { id: 'fen-di', label: '粉地柔和', desc: '粉色系/浅色底，清代柔和风格', colors: ['#F5D5D5', '#C3A370', '#3A506B66'] },
];

// 套餐
export const GENERATION_PLANS = [
  { id: 'basic', name: '基础包', credits: 10, price: 29.9, unit: '¥29.9 / 10次' },
  { id: 'pro', name: '进阶包', credits: 30, price: 69.9, unit: '¥69.9 / 30次', badge: '最热' },
  { id: 'unlimited', name: '畅享包', credits: 100, price: 189, unit: '¥189 / 100次', badge: '最值' },
];

export const DEFAULT_CREDITS = 5; // 新用户赠送
