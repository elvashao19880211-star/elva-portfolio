// 企业合作数据

export interface Service {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
}

export interface CaseStudy {
  id: string;
  title: string;
  category: string;
  client?: string;
  description: string;
  detail: string;
  imageSrc: string;
  year: string;
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  icon: string;
}

export const services: Service[] = [
  {
    id: 'custom-pattern',
    icon: '✍️',
    title: '纹样定制设计',
    subtitle: '专属纹样 · 文化定制',
    description:
      '根据品牌定位与文化需求，从考据研究到最终成稿，提供完整的纹样定制服务。涵盖复原纹样、创新纹样、品牌专属纹样等多种类型。',
    highlights: ['朝代风格定制', '品牌元素融合', '多形态输出（线稿/色稿/矢量）', '文化背景资料附注'],
  },
  {
    id: 'brand-collab',
    icon: '🤝',
    title: '品牌联名合作',
    subtitle: '联名系列 · 文化赋能',
    description:
      '为品牌策划以传统纹样为主题的联名系列。从纹样选择到产品应用方案，帮助品牌建立独特的东方美学辨识度。',
    highlights: ['联名纹样系列开发', '产品应用方案设计', '文化故事包装', '社交媒体传播支持'],
  },
  {
    id: 'pattern-license',
    icon: '📜',
    title: '纹样授权使用',
    subtitle: '正版授权 · 商业使用',
    description:
      '将已完成的纹样作品授权给品牌使用，适用于包装设计、纺织品、文创产品、家居用品等商业场景。授权方式灵活，可按使用范围和期限协商。',
    highlights: ['独家/非独家授权可选', '行业限定保护', '高清矢量文件交付', '授权使用证书'],
  },
  {
    id: 'consulting',
    icon: '💡',
    title: '传统文化美学顾问',
    subtitle: '文化把关 · 美学指导',
    description:
      '为品牌提供传统文化与纹样方面的专业咨询服务，包括产品纹样审核、文化准确性把关、传统美学培训等。帮助品牌避免文化误用，提升作品的专业深度。',
    highlights: ['纹样文化准确性审核', '产品美学风格指导', '设计师内训课程', '展览/活动策划支持'],
  },
];

export const caseStudies: CaseStudy[] = [
  {
    id: 'case-001',
    title: '对鹿联珠团窠定制',
    category: '纹样定制',
    client: '某高端丝绸品牌',
    description: '为品牌定制唐代风格联珠纹，应用于真丝丝巾与家居产品线',
    detail: '以唐代对鹿联珠团窠纹样为基础，根据品牌视觉体系调整配色方案。最终纹样保留了盛唐联珠纹的饱满结构与双鹿对称的吉祥寓意，色彩上以品牌标志色代替原有绯地，形成传统与品牌识别度的统一。',
    imageSrc: '/images/revival/唐-对鹿联珠团窠.png',
    year: '2026',
  },
  {
    id: 'case-002',
    title: '云气纹文创产品线',
    category: '纹样定制',
    description: '基于汉代云气纹开发的文创系列纹样，涵盖笔记本、帆布包、手机壳等品类',
    detail: '从马王堆出土的「乘云绣」中提取云气纹元素，简化线条以适应印刷工艺。在保留汉代云气流动感的同时，降低线条密度，使纹样在小面积产品上依然清晰可辨。',
    imageSrc: '/images/revival/汉-云气安乐锦.png',
    year: '2026',
  },
  {
    id: 'case-003',
    title: '云蝠纹茶具套装联名',
    category: '品牌联名',
    client: '某高端茶具品牌',
    description: '以清代云蝠纹为灵感，联合开发限量茶具系列',
    detail: '云蝠纹的五蝠捧寿构图与茶具的圆形器型高度契合。将蝙蝠与祥云纹样围绕茶壶与茶杯的弧形表面重新排列，每件产品上纹样的位置都经过单独调配。',
    imageSrc: '/images/revival/清-云蝠纹.png',
    year: '2025',
  },
];

export const processSteps: ProcessStep[] = [
  {
    step: 1,
    title: '需求沟通',
    description: '了解品牌需求、应用场景、风格偏好与预算范围。提供参考案例与纹样方向建议。',
    icon: '💬',
  },
  {
    step: 2,
    title: '方案提案',
    description: '基于沟通内容，输出纹样设计方向提案，包含风格参考、元素选择与初步构图。',
    icon: '📋',
  },
  {
    step: 3,
    title: '设计执行',
    description: '确定方案后进行纹样绘制与配色。过程中提供阶段性反馈与确认节点，确保方向准确。',
    icon: '✏️',
  },
  {
    step: 4,
    title: '交付应用',
    description: '交付高清矢量文件与使用指南，提供应用场景效果参考。长期合作的品牌可享受后续修改与维护服务。',
    icon: '🎯',
  },
];
