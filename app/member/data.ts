// 会员中心数据
// 现在只有素材库是订阅制会员，纹样作品是单件购买

export const MEMBER_PLANS = [
  {
    id: 'personal',
    name: '个人/学习会员',
    price: 159,
    period: '/年',
    badge: null,
    features: [
      '素材库全部内容（全年持续上新）',
      '仅限个人非商业用途',
      '学习、临摹、个人手工（非卖品）',
      '365天有效，到期需续费',
    ],
    cta: '开通个人会员',
    highlight: false,
  },
  {
    id: 'commercial',
    name: '商用会员',
    price: 899,
    period: '/年',
    badge: '推荐',
    features: [
      '素材库全部内容（全年持续上新）',
      '标准商业许可',
      '不限量用于客户项目、产品设计',
      '自媒体配图等商业用途',
      '365天有效，到期需续费',
    ],
    cta: '开通商用会员',
    highlight: true,
  },
];

// 纹样作品单价（非会员，按件购买）
export const PATTERN_PRICING = {
  revival: {
    personal: { price: 9.9, label: '个人学习' },
    commercial: { price: 399, label: '标准商业' },
  },
  innovation: {
    personal: { price: 29.9, label: '个人学习' },
    commercial: { price: 499, label: '标准商业' },
    source: { price: 3999, label: '源文件企业授权' },
  },
};

// 企业合作
export const ENTERPRISE_SERVICE = {
  title: '企业合作',
  description: '品牌纹样定制 · 批量授权 · 长期合作方案',
  cta: '联系工作室',
  contact: 'elva@hetu-pattern.com',
};
