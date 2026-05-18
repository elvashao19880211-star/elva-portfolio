import CarouselBanner from '../components/CarouselBanner';
import Footer from '../components/Footer';

const PATTERN_ICON = (
  <svg className="w-8 h-8 text-gold" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
    <circle cx="16" cy="16" r="12" />
    <circle cx="16" cy="16" r="7" />
    <circle cx="16" cy="16" r="2.5" fill="currentColor" stroke="none" />
    <line x1="16" y1="4" x2="16" y2="10" />
    <line x1="16" y1="22" x2="16" y2="28" />
    <line x1="4" y1="16" x2="10" y2="16" />
    <line x1="22" y1="16" x2="28" y2="16" />
    <line x1="7.5" y1="7.5" x2="11.5" y2="11.5" />
    <line x1="20.5" y1="20.5" x2="24.5" y2="24.5" />
    <line x1="24.5" y1="7.5" x2="20.5" y2="11.5" />
    <line x1="11.5" y1="20.5" x2="7.5" y2="24.5" />
  </svg>
);

const MATERIAL_ICON = (
  <svg className="w-8 h-8 text-gold" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
    <rect x="7" y="4" width="18" height="24" rx="1" />
    <line x1="11" y1="10" x2="21" y2="10" />
    <line x1="11" y1="14" x2="21" y2="14" />
    <line x1="11" y1="18" x2="17" y2="18" />
    <path d="M4 8v20a2 2 0 0 0 2 2h20" strokeLinecap="round" />
  </svg>
);

const REVIVAL_ICON = (
  <svg className="w-8 h-8 text-qing" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
    <path d="M24 4H8a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
    <path d="M16 24v-8" />
    <circle cx="16" cy="12" r="1.5" fill="currentColor" stroke="none" />
    <path d="M12 6h8" strokeLinecap="round" />
  </svg>
);

const COMMUNITY_ICON = (
  <svg className="w-8 h-8 text-gold" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
    <path d="M6 20a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-4l-4 4-4-4H6z" />
    <circle cx="10" cy="14" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="16" cy="14" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="22" cy="14" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

const CARDS = [
  {
    title: '纹样库',
    desc: '复原 · 创新 · 定制',
    href: '/patterns',
    icon: PATTERN_ICON,
    bg: 'from-qing/20 to-transparent',
  },
  {
    title: '纹样素材',
    desc: '元素 · 边饰 · 分类检索',
    href: '/materials',
    icon: MATERIAL_ICON,
    bg: 'from-gold/20 to-transparent',
  },
  {
    title: '复原记录',
    desc: '考据 · 绘制 · 还原',
    href: '/heritage',
    icon: REVIVAL_ICON,
    bg: 'from-qing/15 to-transparent',
  },
  {
    title: '交流与合作',
    desc: '讨论 · 咨询 · 定制',
    href: '/community',
    icon: COMMUNITY_ICON,
    bg: 'from-gold/15 to-transparent',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <CarouselBanner />

      {/* 品牌简介区 */}
      <section className="relative overflow-hidden py-16 sm:py-24 px-4 sm:px-6 text-center">
        {/* 装饰 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-qing/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-qing/10 text-qing text-xs font-medium mb-5 sm:mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-qing animate-pulse" />
            河图 · 华夏纹样传承
          </div>
          <h2 className="text-[1.6rem] sm:heading-1 text-ink leading-tight mb-5 sm:mb-6">
            以现代中式美学，
            <br />
            传承与重生<span className="text-gold">东方纹样</span>
          </h2>
          <p className="text-sm sm:body-lg text-gray-500 max-w-2xl mx-auto">
            汇聚复原纹样、创新设计与灵感素材，连接设计师与品牌方，
            <br className="hidden sm:block" />
            让传统之美在当代焕发新意。
          </p>
        </div>
      </section>

      {/* 引导卡片 */}
      <section className="px-4 sm:px-6 pb-16 sm:pb-24 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CARDS.map((card) => (
            <a
              key={card.title}
              href={card.href}
              className="group relative overflow-hidden bg-white rounded-2xl p-5 sm:p-7 border border-gray-100
                         transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              {/* 装饰色块 */}
              <div
                className={`absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br ${card.bg} -translate-y-1/2 translate-x-1/2 transition-transform duration-500 group-hover:scale-125`}
              />
              <div className="relative z-10">
                <span className="block mb-4">{card.icon}</span>
                <h3 className="text-lg font-serif font-semibold text-ink mb-1.5 group-hover:text-gold transition-colors">
                  {card.title}
                </h3>
                <p className="text-gray-400 text-sm">{card.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 特色简介 */}
      <section className="relative px-4 sm:px-6 py-16 sm:py-20 bg-qing/5">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                num: '10+',
                label: '复原纹样',
                desc: '基于出土文物的精确复原',
              },
              {
                num: '9+',
                label: '创新设计',
                desc: '传统元素的现代转译',
              },
              {
                num: '14',
                label: '素材分类',
                desc: '覆盖历代纹样元素库',
              },
            ].map((stat) => (
              <div key={stat.label} className="text-center py-3 sm:py-0">
                <div className="text-3xl sm:text-5xl font-serif font-bold text-gold mb-1">
                  {stat.num}
                </div>
                <div className="text-sm font-medium text-ink mb-1">{stat.label}</div>
                <div className="text-xs text-gray-400">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI 纹样生成 — 首页入口 */}
      <section className="relative px-4 sm:px-6 py-16 sm:py-24 text-center overflow-hidden">
        {/* 装饰 */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-qing/5 to-white pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ink/10 text-ink text-xs font-medium mb-6">
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="8" cy="8" r="6" />
              <circle cx="8" cy="8" r="3" />
              <circle cx="8" cy="8" r="1" fill="currentColor" stroke="none" />
            </svg>
            AI 智能生成
          </div>

          <h2 className="heading-1 text-ink leading-tight mb-6">
            用 AI 生成专属纹样
          </h2>
          <p className="body-lg text-gray-500 mb-3">
            选择朝代风格、配色方案、纹样元素，输入你的想法
            <br />
            AI 为你创作独一无二的东方纹样
          </p>
          <p className="text-xs text-gray-300 mb-8">
            支持联珠、团窠、缠枝等传统结构 · 还原历代配色风格
          </p>

          <a
            href="/ai-gen"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-ink text-white font-serif
                       text-base transition-all duration-300 hover:bg-ink/90 hover:-translate-y-0.5 hover:shadow-lg"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M10 3v14M3 10h14" strokeLinecap="round" />
            </svg>
            开始创作
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 3l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
