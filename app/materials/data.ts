// ==================== 素材分类维度 ====================

/** 朝代 */
export const DYNASTIES = [
  '商周', '春秋战国', '秦汉', '魏晋南北朝',
  '隋唐五代', '宋辽金', '元', '明', '清', '近现代',
] as const;

/** 载体 */
export const CARRIERS = [
  '青铜器', '陶瓷', '漆器', '织锦', '刺绣',
  '壁画', '石刻', '金银器', '玉器', '木雕', '建筑', '其他',
] as const;

/** 结构 */
export const STRUCTURES = [
  '自由', '适合', '角隅', '二方', '四方', '组合', '开光',
] as const;

/** 颜色 */
export const COLORS = [
  '青蓝', '赤红', '黄金', '白素', '黑墨', '绿翠', '紫绀', '赭褐', '烟灰', '银素', '多色',
] as const;

/** 元素三级分类 */
export interface ElementNode {
  id: string;
  label: string;
  children?: ElementNode[];
}

export const ELEMENT_TREE: ElementNode[] = [
  {
    id: 'niaoshou', label: '鸟兽鱼虫纹', children: [
      { id: 'huwen', label: '虎纹' },
      { id: 'mawen', label: '马纹' },
      { id: 'tuwen', label: '兔纹' },
      { id: 'niao', label: '鸟纹' },
      { id: 'shizi', label: '狮子纹' },
      { id: 'chan', label: '蝉纹' },
      { id: 'yuwen', label: '鱼纹' },
      { id: 'wawen', label: '蛙纹' },
      { id: 'fuwen', label: '蝠纹' },
      { id: 'yuanyang', label: '鸳鸯纹' },
      { id: 'hudie', label: '蝴蝶纹' },
    ],
  },
  {
    id: 'zhiwu', label: '植物纹', children: [
      { id: 'jiaoye', label: '蕉叶纹' },
      { id: 'xifanlian', label: '西番莲' },
      { id: 'mudan', label: '牡丹纹' },
      { id: 'sijihua', label: '四季花纹' },
      { id: 'chanzhi', label: '缠枝纹' },
      { id: 'juancao', label: '卷草纹' },
      { id: 'hulu', label: '葫芦纹' },
      { id: 'meihua', label: '梅花纹' },
      { id: 'lian', label: '莲纹' },
      { id: 'shiliu', label: '石榴纹' },
      { id: 'haishiliu', label: '海石榴纹' },
    ],
  },
  {
    id: 'jixiang', label: '吉祥纹', children: [
      { id: 'sanduo', label: '三多纹' },
      { id: 'fulushouxi', label: '福禄寿喜纹' },
      { id: 'helutongchun', label: '鹤鹿同春' },
      { id: 'lianshengshengyuan', label: '连升三元' },
      { id: 'jiqingyouyu', label: '吉庆有余' },
      { id: 'wufupengshou', label: '五福捧寿' },
      { id: 'qilinsongzi', label: '麒麟送子' },
      { id: 'sanduojiuru', label: '三多九如' },
      { id: 'huzhenwudu', label: '虎镇五毒' },
      { id: 'liuhetongchun', label: '六和同春' },
      { id: 'niannianyouyu', label: '年年有余' },
      { id: 'longfengchengxiang', label: '龙凤呈祥' },
      { id: 'fengximudan', label: '凤戏牡丹' },
      { id: 'mashangfenghou', label: '马上封侯' },
      { id: 'xishangmeishao', label: '喜上眉梢' },
      { id: 'songheyanian', label: '松鹤延年' },
      { id: 'heqijixiang', label: '和气吉祥' },
      { id: 'shizigunxiuqiu', label: '狮子滚绣球' },
    ],
  },
  {
    id: 'jihe', label: '几何纹', children: [
      { id: 'qiulu', label: '球路锦纹', children: [
        { id: 'q4banhua', label: '四瓣花式簇四球路' },
        { id: 'q4huan', label: '环式簇四球路' },
        { id: 'q6chong', label: '簇六重球纹' },
        { id: 'q6tianhua', label: '簇六填花纹' },
        { id: 'q6chechuan', label: '簇六车钏球路纹' },
        { id: 'q4tiaobai', label: '簇四挑白球路纹' },
        { id: 'q4xie', label: '簇四斜球纹' },
        { id: 'qianqian', label: '连钱纹' },
      ]},
      { id: 'qushui', label: '曲水纹' },
      { id: 'lingwen', label: '菱纹' },
      { id: 'lianzhu', label: '联珠纹' },
      { id: 'guibei', label: '龟背纹' },
      { id: 'sidayun', label: '四达晕' },
      { id: 'liudayun', label: '六达晕' },
      { id: 'badayun', label: '八达晕' },
      { id: 'tianhuajin', label: '天华锦纹' },
    ],
  },
  {
    id: 'wenzi', label: '文字纹', children: [
      { id: 'shouzi', label: '寿字纹' },
      { id: 'fuzi', label: '福字纹' },
      { id: 'wanzi', label: '万字纹' },
      { id: 'xizi', label: '喜字纹' },
    ],
  },
  {
    id: 'ziran', label: '自然纹', children: [
      { id: 'yun', label: '云纹', children: [
        { id: 'yunlei', label: '云雷纹' },
        { id: 'sanjiao', label: '三角云纹' },
        { id: 'yunqi', label: '云气纹' },
        { id: 'juanyun', label: '卷云纹' },
        { id: 'duoyun', label: '朵云纹' },
        { id: 'huoyanyun', label: '火焰云纹' },
        { id: 'siheyun', label: '四合云纹' },
        { id: 'dieyun', label: '叠云纹' },
        { id: 'yulin', label: '鱼鳞云纹' },
        { id: 'tuanyun', label: '团云纹' },
      ]},
      { id: 'shui', label: '水纹', children: [
        { id: 'haishuijiangya', label: '海水江崖纹' },
        { id: 'shuibo', label: '水波纹' },
        { id: 'hailang', label: '海浪水纹' },
      ]},
      { id: 'huo', label: '火纹', children: [
        { id: 'wowen', label: '涡纹' },
        { id: 'beiguang', label: '背光火焰纹' },
        { id: 'shanxing', label: '山形火焰纹' },
        { id: 'huoyanlongzhu', label: '火焰龙珠纹' },
      ]},
    ],
  },
  {
    id: 'shenshou', label: '神兽纹', children: [
      { id: 'chi', label: '螭纹' },
      { id: 'shoumian', label: '兽面纹' },
      { id: 'long', label: '龙纹' },
      { id: 'feng', label: '凤纹' },
      { id: 'qilin', label: '麒麟纹' },
      { id: 'sishen', label: '四神纹' },
      { id: 'mojie', label: '摩羯纹' },
    ],
  },
  {
    id: 'yixiang', label: '意象纹样', children: [
      { id: 'baoxianghua', label: '宝相花' },
      { id: 'tuanhua', label: '团花' },
    ],
  },
  {
    id: 'renwu', label: '人物纹', children: [
      { id: 'hehe', label: '和合二仙' },
      { id: 'magu', label: '麻姑献寿' },
      { id: 'feitian', label: '飞天纹' },
      { id: 'jiuyang', label: '九阳消寒' },
      { id: 'mianyang', label: '绵羊太子' },
      { id: 'liuhai', label: '刘海戏金蟾' },
      { id: 'baizi', label: '百子婴戏' },
    ],
  },
  {
    id: 'qiwu', label: '器物纹', children: [
      { id: 'deng', label: '灯纹' },
      { id: 'bogu', label: '博古纹' },
      { id: 'anbaxian', label: '暗八仙纹' },
      { id: 'zabao', label: '杂宝纹' },
    ],
  },
  {
    id: 'zongjiao', label: '宗教纹样', children: [
      { id: 'fobabao', label: '佛八宝纹' },
      { id: 'anbaxian2', label: '暗八仙纹' },
    ],
  },
  {
    id: 'changjing', label: '场景纹', children: [
      { id: 'chunshui', label: '春水秋山纹' },
      { id: 'shanshui', label: '山水纹' },
      { id: 'manchijiao', label: '满池娇纹' },
    ],
  },
];

// ==================== 素材数据 ====================

export interface MaterialItem {
  id: string;
  title: string;
  dynasty: string;        // 朝代
  carrier: string;        // 载体
  elements: string[];     // 元素 ID（可多个，含二/三级）
  structure: string;      // 结构
  colors: string[];       // 颜色
  description: string;    // 描述
  src: string;            // 图片路径
}

/** 占位素材（待补充真实数据） */
const materials: MaterialItem[] = [
  {
    id: 'mat-01',
    title: '示例纹样 1',
    dynasty: '唐代',
    carrier: '织锦',
    elements: ['mudan', 'juanzhi'],
    structure: '二方',
    colors: ['赤红', '黄金'],
    description: '唐代织锦，牡丹卷草纹，二方连续排布，红金配色华丽大气',
    src: '/image-one.png',
  },
];

export default materials;

// ==================== 工具函数 ====================

/** 展开元素树为扁平 ID→label 映射 */
export function flattenElements(tree: ElementNode[]): Map<string, string> {
  const map = new Map<string, string>();
  function walk(nodes: ElementNode[]) {
    for (const n of nodes) {
      map.set(n.id, n.label);
      if (n.children) walk(n.children);
    }
  }
  walk(tree);
  return map;
}

/** 获取某个元素 ID 对应的所有标签（含祖先层级） */
export function getElementPath(id: string, tree: ElementNode[] = ELEMENT_TREE): string[] {
  function find(nodes: ElementNode[], path: string[]): string[] | null {
    for (const n of nodes) {
      const cur = [...path, n.label];
      if (n.id === id) return cur;
      if (n.children) {
        const r = find(n.children, cur);
        if (r) return r;
      }
    }
    return null;
  }
  return find(tree, []) ?? [id];
}
