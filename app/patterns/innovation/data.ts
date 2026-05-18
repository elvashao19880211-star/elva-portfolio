// 自动生成 + 手动补充设计信息
// 运行 node scripts/import-innovation.js 更新

export interface InnovationPattern {
  id: string;
  title: string;
  category: string;       // 分类
  inspiration?: string;   // 灵感来源
  elements?: string[];    // 构成元素
  description: string;
  detail?: string;        // 设计说明
  src: string;
}

const innovationPatterns: InnovationPattern[] = [
  {
    id: 'innov-001',
    title: '四叶纹',
    category: '几何',
    inspiration: '唐代团窠四叶结构',
    elements: ['四叶对称', '几何骨骼', '负形留白'],
    description: '几何类四叶纹创新设计',
    detail: '以唐代团窠四叶结构为原型，将花瓣形态几何化处理。四片叶子呈十字对称展开，外轮廓以简洁线条勾勒，中心留白形成视觉焦点。整体兼具古典韵律与现代极简。',
    src: '/images/innovation/几何-四叶纹.png',
  },
  {
    id: 'innov-002',
    title: '天华锦',
    category: '几何',
    inspiration: '宋代八达晕锦纹',
    elements: ['多层几何嵌套', '对称构图', '锦地纹'],
    description: '几何类天华锦创新设计',
    detail: '借鉴宋代八达晕锦的结构逻辑，以中心几何图形为核，向外多层嵌套扩展。通过不同几何形状的叠加与色彩渐变，创造出具有空间纵深感的现代织锦效果。',
    src: '/images/innovation/几何-天华锦.png',
  },
  {
    id: 'innov-003',
    title: '方形小宝相纹',
    category: '几何',
    inspiration: '唐代宝相花的几何转译',
    elements: ['方形框架', '花瓣几何化', '中心对称'],
    description: '几何类方形小宝相纹创新设计',
    detail: '将传统宝相花的圆形团窠结构转化为方形框架。花瓣以几何块面重新演绎，保留宝相层层绽放的节奏感，同时融入现代图形的秩序与精确性。',
    src: '/images/innovation/几何-方形小宝相纹.png',
  },
  {
    id: 'innov-004',
    title: '球路吉鱼纹',
    category: '几何',
    inspiration: '宋代球路纹与汉代双鱼纹',
    elements: ['球路圈纹', '双鱼纹', '几何交织'],
    description: '几何类球路吉鱼纹创新设计',
    detail: '融合宋代球路纹的圆形连续结构与汉代双鱼纹的吉祥寓意。球路圆环相互交织形成连绵骨骼，双鱼纹嵌入圆形单元之中，既有秩序感又暗含流动的生机。',
    src: '/images/innovation/几何-球路吉鱼纹.png',
  },
  {
    id: 'innov-005',
    title: '金钱纹',
    category: '几何',
    inspiration: '清代方孔钱纹与现代货币符号',
    elements: ['方孔圆钱', '连续重复', '正负形'],
    description: '几何类金钱纹创新设计',
    detail: '以传统方孔钱纹为母题，通过现代构成手法进行转译。方圆的对比关系被强化，正负形交替排列形成节奏感。在保留「招财」寓意的同时，呈现出当代图形的锐利感。',
    src: '/images/innovation/几何-金钱纹.png',
  },
  {
    id: 'innov-006',
    title: '葫芦金钱纹',
    category: '吉祥',
    inspiration: '清代吉祥纹样中的葫芦与金钱组合',
    elements: ['葫芦轮廓', '金钱纹填充', '吉祥寓意'],
    description: '吉祥类葫芦金钱纹创新设计',
    detail: '以葫芦外形为底，内部填充金钱纹，两者皆为传统吉祥符号。葫芦谐音「福禄」，金钱寓意财富，组合后在保留民俗文化内核的同时，以现代平面构成手法赋予新的视觉语言。',
    src: '/images/innovation/吉祥-葫芦金钱纹.png',
  },
  {
    id: 'innov-007',
    title: '如意龟背填花',
    category: '复合',
    inspiration: '汉代龟背纹与清代如意纹',
    elements: ['龟背六角骨架', '如意头', '花卉填充'],
    description: '复合类如意龟背填花创新设计',
    detail: '将汉代龟背纹的六角几何骨架与清代如意纹的曲线柔美相结合。龟背网格提供理性的结构支撑，每个单元内填入如意与花卉元素，理性与感性的碰撞创造出独特的装饰语言。',
    src: '/images/innovation/复合-如意龟背填花.png',
  },
  {
    id: 'innov-008',
    title: '如意小马哒哒纹',
    category: '鸟兽',
    inspiration: '唐代马球纹与民间吉祥马纹',
    elements: ['奔马剪影', '如意流云', '动感线条'],
    description: '鸟兽类如意小马哒哒纹创新设计',
    detail: '以唐代马纹的矫健姿态为灵感，将奔马形象以简约剪影风格呈现。马身融入如意云纹的流线元素，奔跑的动势通过水平的线条节奏来强化。整体活泼灵动，不失东方韵味。',
    src: '/images/innovation/鸟兽-如意小马哒哒纹.png',
  },
  {
    id: 'innov-009',
    title: '狮子云纹',
    category: '鸟兽',
    inspiration: '唐代狮子纹与敦煌祥云',
    elements: ['雄狮轮廓', '卷云纹', '力量感线条'],
    description: '鸟兽类狮子云纹创新设计',
    detail: '融合唐代狮子纹的威猛与敦煌祥云的飘逸。狮子形象以块面概括，鬃毛化作翻卷的云纹。整体在刚与柔之间寻找平衡，既有守护的力度，又不失东方的含蓄美感。',
    src: '/images/innovation/鸟兽-狮子云纹.png',
  },
];

export default innovationPatterns;
