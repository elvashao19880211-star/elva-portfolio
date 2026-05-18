// 会员方案数据

export const MEMBER_PLANS = [
  {
    id: 'free',
    name: '免费会员',
    price: '免费',
    badge: null,
    features: [
      '注册即享',
      '浏览纹样库全部内容',
      '预览纹样（带水印）',
      '每日 3 次免费下载',
    ],
    limit: null,
    cta: '当前方案',
    highlight: false,
  },
  {
    id: 'basic',
    name: '基础会员',
    price: 29,
    period: '/月',
    badge: '入门',
    features: [
      '50 次下载 / 月',
      '高清无水印',
      '单图购买享 9 折',
      '企业交流区权限',
    ],
    limit: '50次/月',
    cta: '开通基础',
    highlight: false,
  },
  {
    id: 'pro',
    name: '高级会员',
    price: 69,
    period: '/月',
    badge: '最热',
    features: [
      '200 次下载 / 月',
      '高清无水印',
      '单图购买享 8 折',
      '企业交流区权限',
      '专属 VIP 标识',
    ],
    limit: '200次/月',
    cta: '开通高级',
    highlight: true,
  },
  {
    id: 'enterprise',
    name: '企业用户',
    price: 299,
    period: '/月',
    badge: '企业',
    features: [
      '1000 次下载 / 月',
      '高清无水印 + 矢量图',
      '单图购买享 6 折',
      '商业授权使用',
      '优先客服支持',
      '定制纹样需求通道',
    ],
    limit: '1000次/月',
    cta: '联系开通',
    highlight: false,
  },
];

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
