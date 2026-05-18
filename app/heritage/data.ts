// 纹样复原记录数据
// 每个条目记录一次完整的纹样复原过程
//
// 如何添加视频:
//   1. 自托管视频: 将 mp4 文件放入 public/videos/ 目录，在对应条目的 videoSrc 字段填入路径
//      例: videoSrc: '/videos/对鹿联珠团窠-过程.mp4'
//   2. 外部平台(如B站): 在 videoUrl 字段填入嵌入链接
//      例: videoUrl: 'https://player.bilibili.com/player.html?bvid=BV1xx411c7mD'

export interface ProcessStep {
  name: string;
  desc: string;
  imageSrc: string;
}

export interface Reference {
  name: string;
  desc: string;
  imageSrc: string;
}

export interface HeritageItem {
  id: string;
  title: string;
  dynasty: string;
  category: string;
  coverSrc: string;
  videoUrl?: string;         // B站/油管嵌入链接
  videoSrc?: string;         // 自托管视频文件路径（放 public/videos/ 下）
  videoTitle?: string;       // 视频标题
  description: string;
  processSteps: ProcessStep[];
  references: Reference[];
  finalImage: string;
  culturalBackground: string;
  designNotes: string;
  duration?: string;         // 视频时长
  date: string;              // 发布日期
}

const heritageData: HeritageItem[] = [
  {
    id: 'heritage-001',
    title: '对鹿联珠团窠复原全记录',
    dynasty: '唐',
    category: '瑞兽纹',
    coverSrc: '/images/revival/唐-对鹿联珠团窠.png',
    videoUrl: '',
    videoTitle: '',
    description: '从唐代丝织品实物出发，完整复原对鹿联珠团窠纹样的全过程',
    processSteps: [
      {
        name: '考据研究',
        desc: '查阅唐代丝织品出土报告与馆藏图录，重点比对新疆吐鲁番阿斯塔那墓地、青海都兰热水墓群出土的联珠纹织锦实物。确认对鹿纹在盛唐时期的形态特征——双鹿对称而立，姿态灵动，外环由联珠组成闭合圆框，具有典型的萨珊式装饰风格。',
        imageSrc: '/images/revival/唐-对鹿联珠团窠.png',
      },
      {
        name: '文物对照',
        desc: '以收藏于中国丝绸博物馆的「联珠对鹿纹锦」为主要参照，同时比对日本正仓院所藏同类唐代织锦残片。观察到不同出土实物中对鹿姿态的细微差异：有的昂首挺立，有的回眸顾盼。综合多件实物确定了最具代表性的动态。',
        imageSrc: '/images/revival/唐-对鹿联珠团窠.png',
      },
      {
        name: '线稿绘制',
        desc: '在AI中建立精准对称的几何骨骼。先绘制联珠圈的标准圆形排列，再将双鹿置于圈内对称位置。联珠的大小、间距严格按照唐代实物比例复原，每颗联珠的直径与间距比为约1:1.5。',
        imageSrc: '/images/revival/唐-对鹿联珠团窠.png',
      },
      {
        name: '色彩校对',
        desc: '参考唐代织锦常用的经纬配色体系。主色调选用唐代典型的「绯地」—以朱砂调制的沉稳红色，联珠以米白呈现。鹿身设赭黄，鹿角以石绿点缀。整体色彩既保留唐代织锦的华丽感，又通过降低饱和度使其更适应现代应用。',
        imageSrc: '/images/revival/唐-对鹿联珠团窠.png',
      },
    ],
    references: [
      {
        name: '联珠对鹿纹锦（中国丝绸博物馆藏）',
        desc: '唐代织锦残片，对鹿形态完整，联珠圈清晰可见，是本次复原最主要的依据',
        imageSrc: '/images/revival/唐-对鹿联珠团窠.png',
      },
      {
        name: '对鹿纹锦残片（日本正仓院藏）',
        desc: '唐代传入日本的联珠对鹿织锦，鹿的形态略有不同，为姿态选择提供了比对参考',
        imageSrc: '/images/revival/唐-对鹿联珠团窠.png',
      },
    ],
    finalImage: '/images/revival/唐-对鹿联珠团窠.png',
    culturalBackground: '联珠纹是唐代最具代表性的外来融合纹样之一，源自波斯萨珊王朝，经丝绸之路传入中原。对鹿纹样象征吉祥与尊贵，常出现在丝织品与金银器上。唐代在继承西域联珠纹基础上，将其与中原审美结合，形成了独特的「唐式联珠」风格——联珠圈更加饱满圆润，内部动物题材也更倾向于祥瑞寓意。',
    designNotes: '本次复原的难点在于联珠的排列密度与对鹿的姿态平衡。唐代织锦因经纬密度限制，联珠的排列并非完全均匀，复原时需在保留手工感与现代精度之间找到平衡。对鹿的颈部弧度经过多次调整，最终选择了介于昂首与垂首之间的自然姿态，既有威仪又不失生动。',
    duration: '',
    date: '2026-04',
  },
  {
    id: 'heritage-002',
    title: '云气安乐锦复原全记录',
    dynasty: '汉',
    category: '云气纹',
    coverSrc: '/images/revival/汉-云气安乐锦.png',
    videoUrl: '',
    videoTitle: '',
    description: '基于汉代织锦实物，复原云气翻涌间穿插瑞兽吉语的磅礴气象',
    processSteps: [
      {
        name: '考据研究',
        desc: '云气纹是汉代最具代表性的装饰语言，源于楚文化对「气」的哲学理解。重点研究湖南长沙马王堆汉墓、湖北江陵马山一号墓出土的织锦与刺绣实物。确认西汉云气纹的特征——线条奔放有力，云气自上而下翻卷流动，间以瑞兽珍禽与吉语文字。',
        imageSrc: '/images/revival/汉-云气安乐锦.png',
      },
      {
        name: '文物对照',
        desc: '以马王堆出土的「乘云绣」「长寿绣」为主要参照，同时比对新疆尼雅遗址出土的「五星出东方利中国」锦护膊。观察到汉代云气纹的线条走向有明确的规律：以"S"形弧线为主干，分层缠绕，形成连绵不断的流动感。',
        imageSrc: '/images/revival/汉-云气安乐锦.png',
      },
      {
        name: '线稿绘制',
        desc: '先建立"S"形主干骨架，再沿着主干生长出分支云气。云头以卷涡收束，云脚逐渐消散。瑞兽「安乐」二字穿插于云气间隙，与翻卷的云纹形成疏密对比。绘制过程中反复调整骨架走向，确保整体气韵流畅而不杂乱。',
        imageSrc: '/images/revival/汉-云气安乐锦.png',
      },
      {
        name: '色彩校对',
        desc: '汉代织锦多用绛紫、深褐、土黄、灰绿等天然染料色调。主色选取汉锦常见的绛紫色为底，云气以藏青勾勒轮廓，内部填充石绿与土黄。文字「安乐」以朱红色突出。最终整体色调沉稳厚重，还原了汉锦的雄浑质感。',
        imageSrc: '/images/revival/汉-云气安乐锦.png',
      },
    ],
    references: [
      {
        name: '乘云绣残片（马王堆一号墓出土）',
        desc: '西汉刺绣实物，云气纹形态完整，色彩保存较好，是云气线条复原的重要参考',
        imageSrc: '/images/revival/汉-云气安乐锦.png',
      },
      {
        name: '"五星出东方利中国"锦护膊（新疆尼雅出土）',
        desc: '汉晋时期织锦，文字与纹样结合的手法与本次复原的「安乐」锦同属一类工艺传统',
        imageSrc: '/images/revival/汉-云气安乐锦.png',
      },
    ],
    finalImage: '/images/revival/汉-云气安乐锦.png',
    culturalBackground: '云气纹起源于先秦时期的楚文化，盛行于两汉。汉代人认为「气」是天地万物的本源，云气纹因此不仅是装饰，更承载了汉代人对长生与祥瑞的哲学追求。在汉锦上，云气翻涌不息，间以瑞兽、吉语，寄托了对生命延续与祥瑞降临的美好愿望。',
    designNotes: '云气纹的复原最核心的是把握「气韵」——线条的走势、粗细变化、疏密关系都必须连贯统一。汉代云气讲究「势」，一种由下至上的升腾感。为了达到这种效果，我在骨架设计时刻意让"S"形主干呈现逐渐升高的趋势，配合云头的卷涡方向，形成了从底部向上涌动的视觉效果。',
    duration: '',
    date: '2026-03',
  },
  {
    id: 'heritage-003',
    title: '云蝠纹复原全记录',
    dynasty: '清',
    category: '吉祥纹',
    coverSrc: '/images/revival/清-云蝠纹.png',
    videoUrl: '',
    videoTitle: '',
    description: '从清代粉彩瓷器出发，还原蝠谐音「福」中蕴含的吉祥密码',
    processSteps: [
      {
        name: '考据研究',
        desc: '蝠谐音「福」，云蝠纹是清代极受欢迎的吉祥纹样。广泛研究清代瓷器、织绣、建筑彩画中的云蝠题材，重点分析了康熙、雍正、乾隆三朝云蝠纹的风格演变——康熙朝蝙蝠姿态朴拙，雍正朝趋于秀雅，乾隆朝则更加繁复华丽。本次复原以乾隆朝粉彩风格为准。',
        imageSrc: '/images/revival/清-云蝠纹.png',
      },
      {
        name: '文物对照',
        desc: '以故宫博物院藏乾隆款「粉彩云蝠纹瓶」为主要参照，同时比对南京博物院藏同类器物的蝙蝠造型。发现不同器物上蝙蝠的翅膀形态有两类：一类是展开的「全翅」，强调飞翔动态；另一类是收拢的「半翅」，更注重装饰美感。本次复原选取前者以增强画面生命力。',
        imageSrc: '/images/revival/清-云蝠纹.png',
      },
      {
        name: '线稿绘制',
        desc: '先定位蝙蝠在画面中的位置与朝向：五只蝙蝠象征「五福」，围绕画面中心成弧形分布。每只蝙蝠的姿态略有不同——有的展翅高飞，有的俯冲而下，有的回首顾盼。云纹以如意形勾勒，穿插在蝙蝠之间形成流动的空间分割。整体构图追求疏密有致。',
        imageSrc: '/images/revival/清-云蝠纹.png',
      },
      {
        name: '色彩校对',
        desc: '清代粉彩以柔和淡雅著称。蝙蝠用胭脂红渲染，从翅膀根部到尖端形成渐变，富有立体感。云纹以天青色为主，部分施以淡金勾边，呼应清代彩瓷「金彩」工艺。底色留白，保持粉彩「柔和光润」的特质。绢本质感与现代印刷品的效果差异在调色时做了针对性处理。',
        imageSrc: '/images/revival/清-云蝠纹.png',
      },
    ],
    references: [
      {
        name: '粉彩云蝠纹瓶（故宫博物院藏）',
        desc: '乾隆时期粉彩代表作，云蝠纹的经典形态，是本次复原的核心参考器物',
        imageSrc: '/images/revival/清-云蝠纹.png',
      },
      {
        name: '云蝠纹刺绣挂屏（沈阳故宫藏）',
        desc: '清代织绣中的云蝠表现，蝙蝠与云纹的搭配方式和瓷器略有不同，提供了另一维度的参考',
        imageSrc: '/images/revival/清-云蝠纹.png',
      },
    ],
    finalImage: '/images/revival/清-云蝠纹.png',
    culturalBackground: '蝙蝠在中国传统纹样中有特殊地位——因其「蝠」字与「福」同音，成为最受喜爱的吉祥符号之一。云蝠纹以蝙蝠与流云相结合，寓意「福从天降」「洪福齐天」。清代是云蝠纹的鼎盛时期，从皇家御用器物到民间日用器皿，几乎无处不在。清代工匠将蝙蝠形象不断细化、美化，最终发展出近百种不同姿态的程式化蝙蝠纹样。',
    designNotes: '云蝠纹看似简单，实则极考验线条的流畅度。蝙蝠的翅膀既要表现出飞行的张力，又不能过于写实而显得凶猛——要在「写意」与「装饰性」之间找到平衡。云纹的走向则决定了整张画面的气流方向，每一朵如意云的弯曲角度都影响着整体构图的节奏感。经过多次草图调整，最终形成的云气走向呈螺旋上升状，引导视线自然流转。',
    duration: '',
    date: '2026-02',
  },
];

export const DYNASTIES = ['汉', '唐', '宋', '元', '明', '清'];

export default heritageData;
