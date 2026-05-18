export const MATERIAL_CATEGORIES = [
  { id: 'yunwen', label: '云纹', icon: '☁️' },
  { id: 'shuiwen', label: '水纹', icon: '🌊' },
  { id: 'huacao', label: '花草纹', icon: '🌺' },
  { id: 'lianwen', label: '莲纹', icon: '🪷' },
  { id: 'longwen', label: '龙纹', icon: '🐉' },
  { id: 'fengwen', label: '凤纹', icon: '🦚' },
  { id: 'shouwen', label: '兽纹', icon: '🐯' },
  { id: 'renwu', label: '人物纹', icon: '🧑' },
  { id: 'jihe', label: '几何纹', icon: '🔷' },
  { id: 'bianshi', label: '边饰纹', icon: '〰️' },
  { id: 'jiaoyu', label: '角隅纹', icon: '◢' },
  { id: 'tuanke', label: '团窠纹', icon: '⭕' },
  { id: 'wenzi', label: '文字纹', icon: '文' },
  { id: 'zonghe', label: '综合素材', icon: '📦' },
];

export interface MaterialItem {
  id: string;
  title: string;
  category: string;
  tags: string[];
  dynasty?: string;
  description: string;
  src: string;
}

const materials: MaterialItem[] = [
  // ────────────── 云纹 ──────────────
  {
    id: 'mat-yun-001',
    title: '如意云头',
    category: 'yunwen',
    tags: ['如意', '云头', '唐代'],
    dynasty: '唐',
    description: '唐代如意云纹的典型云头造型，饱满圆润',
    src: '/image-one.png',
  },
  {
    id: 'mat-yun-002',
    title: '流云尾',
    category: 'yunwen',
    tags: ['流云', '飘逸', '宋代'],
    dynasty: '宋',
    description: '宋代流云纹的尾端处理，线条舒展流畅',
    src: '/image-two.png',
  },
  {
    id: 'mat-yun-003',
    title: '卷云组合',
    category: 'yunwen',
    tags: ['卷云', '连续', '汉代'],
    dynasty: '汉',
    description: '汉代云气纹的卷曲组合单元',
    src: '/image-three.png',
  },
  // ────────────── 水纹 ──────────────
  {
    id: 'mat-shui-001',
    title: '波浪纹单元',
    category: 'shuiwen',
    tags: ['波浪', '连续', '宋代'],
    dynasty: '宋',
    description: '宋代瓷器上的波浪纹基本单元',
    src: '/image-one.png',
  },
  {
    id: 'mat-shui-002',
    title: '海水江崖',
    category: 'shuiwen',
    tags: ['海水', '江崖', '清代'],
    dynasty: '清',
    description: '清代海水江崖纹的水波纹样',
    src: '/image-two.png',
  },
  // ────────────── 花草纹 ──────────────
  {
    id: 'mat-hua-001',
    title: '缠枝花茎',
    category: 'huacao',
    tags: ['缠枝', '花茎', '唐代'],
    dynasty: '唐',
    description: '唐代缠枝纹的花茎与叶片单元',
    src: '/image-three.png',
  },
  {
    id: 'mat-hua-002',
    title: '折枝花卉',
    category: 'huacao',
    tags: ['折枝', '花卉', '宋代'],
    dynasty: '宋',
    description: '宋代折枝花卉纹的独立花枝',
    src: '/image-one.png',
  },
  {
    id: 'mat-hua-003',
    title: '宝相花瓣',
    category: 'huacao',
    tags: ['宝相花', '花瓣', '唐代'],
    dynasty: '唐',
    description: '唐代宝相花纹的单片花瓣元素',
    src: '/image-two.png',
  },
  // ────────────── 莲纹 ──────────────
  {
    id: 'mat-lian-001',
    title: '仰莲瓣',
    category: 'lianwen',
    tags: ['莲瓣', '仰莲', '北魏'],
    dynasty: '北魏',
    description: '北魏石窟中的仰莲瓣造型',
    src: '/image-three.png',
  },
  {
    id: 'mat-lian-002',
    title: '覆莲纹',
    category: 'lianwen',
    tags: ['莲瓣', '覆莲', '唐代'],
    dynasty: '唐',
    description: '唐代覆莲纹的层叠造型',
    src: '/image-one.png',
  },
  // ────────────── 龙纹 ──────────────
  {
    id: 'mat-long-001',
    title: '龙首侧面',
    category: 'longwen',
    tags: ['龙首', '侧面', '清代'],
    dynasty: '清',
    description: '清代龙纹的侧面头部造型',
    src: '/image-two.png',
  },
  {
    id: 'mat-long-002',
    title: '龙身卷曲',
    category: 'longwen',
    tags: ['龙身', '卷曲', '明代'],
    dynasty: '明',
    description: '明代龙纹的身躯卷曲线条',
    src: '/image-three.png',
  },
  // ────────────── 几何纹 ──────────────
  {
    id: 'mat-jihe-001',
    title: '回纹单元',
    category: 'jihe',
    tags: ['回纹', '连续', '商周'],
    dynasty: '商',
    description: '商周青铜器上的回纹基本单元',
    src: '/image-one.png',
  },
  {
    id: 'mat-jihe-002',
    title: '方胜纹',
    category: 'jihe',
    tags: ['方胜', '菱形', '清代'],
    dynasty: '清',
    description: '清代方胜纹的几何构成',
    src: '/image-two.png',
  },
  {
    id: 'mat-jihe-003',
    title: '龟背六角',
    category: 'jihe',
    tags: ['龟背', '六角', '汉代'],
    dynasty: '汉',
    description: '汉代龟背纹的六角骨架单元',
    src: '/image-three.png',
  },
  // ────────────── 边饰纹 ──────────────
  {
    id: 'mat-bian-001',
    title: '联珠纹边',
    category: 'bianshi',
    tags: ['联珠', '边框', '唐代'],
    dynasty: '唐',
    description: '唐代联珠纹装饰边框',
    src: '/image-one.png',
  },
  {
    id: 'mat-bian-002',
    title: '卷草纹边',
    category: 'bianshi',
    tags: ['卷草', '边框', '唐代'],
    dynasty: '唐',
    description: '唐代卷草纹连续边框',
    src: '/image-two.png',
  },
  // ────────────── 文字纹 ──────────────
  {
    id: 'mat-wen-001',
    title: '寿字纹',
    category: 'wenzi',
    tags: ['寿', '祝寿', '清代'],
    dynasty: '清',
    description: '清代圆形寿字纹装饰',
    src: '/image-three.png',
  },
  {
    id: 'mat-wen-002',
    title: '万字纹',
    category: 'wenzi',
    tags: ['卍', '吉祥', '唐代'],
    dynasty: '唐',
    description: '唐代万字纹的连续排列',
    src: '/image-one.png',
  },
];

export default materials;
