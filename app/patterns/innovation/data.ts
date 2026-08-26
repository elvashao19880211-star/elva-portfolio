// 自动生成 + 手动补充设计信息
// 运行 node scripts/import-innovation.js 更新

export interface InnovationPattern {
  id: string;
  title: string;
  category: string;       // 分类
  inspiration?: string;   // 灵感来源
  elements?: string[];    // 构成元素
  structure?: string;     // 结构：自由/适合/二方连续/四方连续/角隅/组合/开光
  structureL1?: string;
  structureL2?: string;
  colors?: string[];      // 颜色
  description: string;
  detail?: string;        // 设计说明
  author?: string;        // 署名作者
  derivative?: boolean;   // 二创标注
  src: string;
  isNew?: boolean;
}

const innovationPatterns: InnovationPattern[] = [
  {
    id: 'innov-001',
    title: '四叶纹',
    category: '几何纹',
    structure: '四方连续/错位散点',
    colors: ['绿翠'],
    inspiration: '唐代团窠四叶结构',
    elements: ['四叶点心纹样'],
    description: '四叶纹创新设计',
    detail: '以唐代团窠四叶结构为原型，将花瓣形态几何化处理。四片叶子呈十字对称展开，外轮廓以简洁线条勾勒，中心留白形成视觉焦点。整体兼具古典韵律与现代极简。',
    author: '河图纹画',
    src: '/images/innovation/四叶纹.webp',
    derivative: true,
    structureL1: '四方连续',
    structureL2: '散点式',
  },
  {
    id: 'innov-002',
    title: '天华锦',
    category: '几何纹',
    structure: '四方连续/几何连缀',
    colors: ['樱粉'],
    inspiration: '宋代八达晕锦纹',
    elements: ['牡丹纹', '天华锦骨架'],
    description: '天华锦创新设计',
    detail: '借鉴宋代八达晕锦的结构逻辑，以中心几何图形为核，向外多层嵌套扩展。通过不同几何形状的叠加与色彩渐变，创造出具有空间纵深感的现代织锦效果。',
    author: '河图纹画',
    src: '/images/innovation/天华锦纹.webp',
    derivative: true,
  
    structureL1: '四方连续',
    structureL2: '连缀式',
},
  {
    id: 'innov-003',
    title: '方形小宝相纹',
    category: '几何纹',
    structure: '四方连续/规则散点',
    colors: ['赭褐'],
    inspiration: '唐代宝相花的几何转译',
    elements: ['方形小宝相'],
    description: '方形小宝相纹创新设计',
    detail: '将传统宝相花的圆形团窠结构转化为方形框架。花瓣以几何块面重新演绎，保留宝相层层绽放的节奏感，同时融入现代图形的秩序与精确性。',
    author: '河图纹画',
    src: '/images/innovation/方形小宝相纹.webp',
    derivative: true,
  
    structureL1: '四方连续',
    structureL2: '散点式',
},
  {
    id: 'innov-004',
    title: '球路吉鱼纹',
    category: '几何纹',
    structure: '四方连续/几何连缀、重叠式',
    colors: ['黄金'],
    inspiration: '宋代球路纹与汉代双鱼纹',
    elements: ['球路纹', '太极鱼纹', '吉字纹'],
    description: '球路吉鱼纹创新设计',
    detail: '融合宋代球路纹的圆形连续结构与汉代双鱼纹的吉祥寓意。球路圆环相互交织形成连绵骨骼，双鱼纹嵌入圆形单元之中，既有秩序感又暗含流动的生机。',
    author: '河图纹画',
    src: '/images/innovation/球路吉鱼纹.webp',
    derivative: true,
  
    structureL1: '四方连续',
    structureL2: '重叠式',
},
  {
    id: 'innov-005',
    title: '金钱纹',
    category: '几何纹',
    structure: '四方连续/规则散点',
    colors: ['赭褐'],
    inspiration: '清代方孔钱纹与现代货币符号',
    elements: ['金钱纹', '几何菱形纹'],
    description: '金钱纹创新设计',
    detail: '以传统方孔钱纹为母题，通过现代构成手法进行转译。方圆的对比关系被强化，正负形交替排列形成节奏感。在保留「招财」寓意的同时，呈现出当代图形的锐利感。',
    author: '河图纹画',
    src: '/images/innovation/金钱纹.webp',
  
    structureL1: '四方连续',
    structureL2: '散点式',
},
  {
    id: 'innov-006',
    title: '葫芦金钱纹',
    category: '意象纹样',
    structure: '四方连续/规则散点',
    colors: ['绿翠'],
    inspiration: '清代吉祥纹样中的葫芦与金钱组合',
    elements: ['葫芦纹', '金钱纹'],
    description: '葫芦金钱纹创新设计',
    detail: '以葫芦外形为底，内部填充金钱纹，两者皆为传统吉祥符号。葫芦谐音「福禄」，金钱寓意财富，组合后在保留民俗文化内核的同时，以现代平面构成手法赋予新的视觉语言。',
    author: '河图纹画',
    src: '/images/innovation/葫芦金钱纹.webp',
    derivative: true,
  
    structureL1: '四方连续',
    structureL2: '散点式',
},
  {
    id: 'innov-007',
    title: '如意龟背填花',
    category: '综合元素',
    structure: '四方连续/重叠式',
    colors: ['多色'],
    inspiration: '汉代龟背纹与清代如意纹',
    elements: ['花卉纹', '龙纹', '寿字纹', '蜜蜂纹', '六角如意龟背'],
    description: '如意龟背填花创新设计',
    detail: '将汉代龟背纹的六角几何骨架与清代如意纹的曲线柔美相结合。龟背网格提供理性的结构支撑，每个单元内填入如意与花卉元素，理性与感性的碰撞创造出独特的装饰语言。',
    author: '河图纹画',
    src: '/images/innovation/如意龟背填花.webp',
  
    structureL1: '四方连续',
    structureL2: '重叠式',
},
  {
    id: 'innov-008',
    title: '如意小马哒哒纹',
    category: '鸟兽鱼虫',
    structure: '四方连续/重叠式',
    colors: ['樱粉'],
    inspiration: '唐代马球纹与民间吉祥马纹',
    elements: ['福字纹', '马纹', '卷草纹'],
    description: '如意小马哒哒纹创新设计',
    detail: '以唐代马纹的矫健姿态为灵感，将奔马形象以简约剪影风格呈现。马身融入如意云纹的流线元素，奔跑的动势通过水平的线条节奏来强化。整体活泼灵动，不失东方韵味。',
    author: '河图纹画',
    src: '/images/innovation/如意小马哒哒纹.webp',
    derivative: true,
  
    structureL1: '四方连续',
    structureL2: '重叠式',
},
  {
    id: 'innov-009',
    title: '狮子云纹',
    category: '鸟兽鱼虫',
    structure: '四方连续/规则散点',
    colors: ['樱粉'],
    inspiration: '唐代狮子纹与敦煌祥云',
    elements: ['狮子纹', '如意云纹'],
    description: '狮子云纹创新设计',
    detail: '融合唐代狮子纹的威猛与敦煌祥云的飘逸。狮子形象以块面概括，鬃毛化作翻卷的云纹。整体在刚与柔之间寻找平衡，既有守护的力度，又不失东方的含蓄美感。',
    author: '河图纹画',
    src: '/images/innovation/狮子云纹.webp',
    derivative: true,
  
    structureL1: '四方连续',
    structureL2: '散点式',
},
  {
    id: 'innov-010',
    title: '绿麒麟踏海望月',
    category: '神兽纹',
    structure: '单独/自由式',
    colors: ['绿翠'],
    inspiration: '麒麟踏海传统意象',
    elements: ['麒麟纹', '海水纹', '云纹'],
    description: '绿麒麟踏海望月创新设计',
    author: '河图纹画',
    src: '/images/innovation/绿麒麟踏海望月.webp',
  
    structureL1: '单独纹样',
    structureL2: '自由纹样',
},
];

// 分类取自素材库元素一级分类
export const CATEGORIES = [
  '自然纹', '鸟兽鱼虫', '植物纹', '意象纹样', '几何纹',
  '神兽纹', '综合元素', '人物纹', '器物纹', '宗教纹', '边饰纹', '文字纹', '其他',
] as const;

// 结构与颜色（与素材库一致）
export const STRUCTURES = ['单独纹样', '二方连续', '四方连续'] as const;
export const STRUCTURE_L2: Record<string, readonly string[]> = {
  '单独纹样': ['自由纹样', '适合纹样', '角隅纹样'] as const,
  '二方连续': ['散点式', '直立式', '波线式', '折线式', '综合式'] as const,
  '四方连续': ['散点式', '连缀式', '重叠式'] as const,
};
export const COLORS = ['青蓝', '赤红', '黄金', '白素', '黑墨', '绿翠', '紫绀', '赭褐', '烟灰', '银素', '樱粉', '多色'] as const;

export default innovationPatterns;
