// 会员方案数据

export const MEMBER_PLANS = [
  {
    id: 'free',
    name: '免费会员',
    price: '免费',
    period: '',
    badge: null,
    features: [
      '注册即享',
      '浏览所有纹样作品',
      '预览纹样（带水印）',
      '无下载权限',
    ],
    limit: null,
    cta: '免费注册',
    highlight: false,
  },
  {
    id: 'revival',
    name: '复原库',
    price: 79,
    period: '/年',
    badge: '入门',
    features: [
      '10 次下载 / 月',
      '高清无水印',
      '全部复原纹样开放',
      '设计手记查阅',
    ],
    limit: '10次/月',
    cta: '开通复原库',
    highlight: false,
  },
  {
    id: 'material',
    name: '素材库',
    price: 109,
    period: '/年',
    badge: '专业',
    features: [
      '15 次下载 / 月',
      '高清无水印',
      '全部纹样素材开放',
      '设计方法论专栏',
    ],
    limit: '15次/月',
    cta: '开通素材库',
    highlight: false,
  },
  {
    id: 'full',
    name: '全套会员',
    price: 169,
    period: '/年',
    badge: '推荐',
    features: [
      '25 次下载 / 月',
      '高清无水印',
      '复原 + 素材 全库开放',
      '设计手记 + 方法论',
      '专属社群入口',
    ],
    limit: '25次/月',
    cta: '开通全套',
    highlight: true,
  },
];

// 企业合作（不跟会员混）
export const ENTERPRISE_SERVICE = {
  title: '企业合作',
  description: '品牌纹样定制、商业授权、月包服务',
  cta: '联系工作室',
  contact: 'elva@hetu-pattern.com',
};

// 单图购买价格
export const SINGLE_PURCHASE = {
  standard: { price: 9.9, label: '高清版', desc: '1920px · 无水印 · 个人使用' },
  hd: { price: 29.9, label: '高清+矢量', desc: '3840px + AI/EPS · 含商业授权' },
  commercial: { price: 99, label: '商用完整版', desc: '完整源文件 · 含商业授权 · 可二次开发' },
};

// 下载包
export const DOWNLOAD_PACKS = [
  { id: 'pack-50', credits: 50, price: 49, unit: '¥49 / 50张' },
  { id: 'pack-100', credits: 100, price: 79, unit: '¥79 / 100张', badge: '最值' },
  { id: 'pack-500', credits: 500, price: 299, unit: '¥299 / 500张', badge: '企业' },
];
