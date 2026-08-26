export const dynamic = 'force-dynamic';

import CarouselBanner from '../components/CarouselBanner';
import Footer from '../components/Footer';
import Fireworks from '../components/Fireworks';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <div className="relative">
        <CarouselBanner />
        <Fireworks />
      </div>

      {/* ====== 品牌主张 ====== */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6 text-center overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-qing/5 rounded-full blur-3xl pointer-events-none translate-x-1/3 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/5 rounded-full blur-3xl pointer-events-none -translate-x-1/3 translate-y-1/2" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-xs tracking-[0.25em] text-gold/60 uppercase mb-4">HETU PATTERN</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-semibold text-ink leading-snug mb-5">
            河图纹画
          </h2>
          <p className="text-sm sm:text-base text-gray-500 leading-relaxed max-w-xl mx-auto mb-8">
            考据为骨，创新为魂。以出土文物与博物馆藏品为原点严谨复原，同时融合现代审美进行再创作，让传统纹样在当代设计中焕发生命力。
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-400">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-qing/5 border border-qing/10">
              出土文物 · 博物馆藏品考据
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/5 border border-gold/10">
              核心著作《中国历代经典纹样》
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ink/5 border border-ink/10">
              学术级复原标准
            </span>
          </div>
        </div>
      </section>

      {/* ====== 核心入口 ====== */}
      <section className="px-4 sm:px-6 pb-16 sm:pb-28 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              title: '纹样作品库',
              subtitle: '单件授权 · 自选许可',
              desc: '严谨复原文物纹样，同时持续创作符合现代审美的创新设计',
              href: '/patterns',
              washColor: 'rgba(123, 196, 208, 0.05)',
              iconColor: '#7BC4D0',
              dotColor: 'rgba(123, 196, 208, 0.3)',
            },
            {
              title: '灵感素材',
              subtitle: '会员订阅 · 无限下载',
              desc: '历代纹样元素检索，年度会员持续上新',
              href: '/materials',
              washColor: 'rgba(195, 163, 112, 0.05)',
              iconColor: '#C3A370',
              dotColor: 'rgba(195, 163, 112, 0.3)',
            },
            {
              title: '签约创作',
              subtitle: '入驻平台 · 共享收益',
              desc: '成为签约设计师，按标准提交作品，获取持续分成',
              href: '/join',
              washColor: 'rgba(251, 243, 219, 0.4)',
              iconColor: '#A16207',
              dotColor: 'rgba(251, 191, 36, 0.3)',
            },
          ].map((card) => (
            <a
              key={card.title}
              href={card.href}
              className="group relative overflow-hidden rounded-2xl p-6 sm:p-8 border transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              style={{ backgroundColor: '#FDFBF7', borderColor: '#f3f4f6' }}
            >
              {/* 中式水墨晕染 */}
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full -translate-y-1/3 translate-x-1/4 opacity-70" style={{ backgroundColor: card.washColor }} />
              {/* 内边框装饰线 */}
              <div className="absolute top-4 left-4 right-4 h-px" style={{ background: 'linear-gradient(to right, transparent, currentColor, transparent)', opacity: 0.06 }} />
              <div className="relative z-10">
                {/* 中式点缀 — ◇ — */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-5 h-px" style={{ backgroundColor: card.dotColor }} />
                  <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: card.dotColor }} />
                  <div className="flex-1 h-px" style={{ backgroundColor: card.dotColor }} />
                </div>
                <p className="text-xs font-semibold tracking-wider mb-2 opacity-80" style={{ color: card.iconColor }}>{card.subtitle}</p>
                <h3 className="text-xl font-serif font-semibold text-ink mb-2">{card.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{card.desc}</p>
                <span className="inline-block mt-5 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: card.iconColor }}>
                  进入 →
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* AI 纹样生成 — 首页入口 */}
      <section className="relative px-4 sm:px-6 py-16 sm:py-24 text-center overflow-hidden">
        {/* 装饰 */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-qing/5 to-white pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-qing text-white text-sm font-bold mb-6 shadow-lg shadow-qing/25 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            AI 智能生成 · 即将上线
          </div>

          <h2 className="heading-1 text-ink leading-tight mb-6">
            用 AI 生成专属纹样
          </h2>
          <p className="body-lg text-gray-500 mb-3">
            选择朝代风格、配色方案、纹样元素，输入你的想法
            <br />
            AI 为你创作独一无二的东方纹样
          </p>
          <p className="text-xs text-gray-300 mb-2">
            支持联珠、团窠、缠枝等传统结构 · 还原历代配色风格
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
