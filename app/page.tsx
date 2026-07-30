export const dynamic = 'force-dynamic';

import CarouselBanner from '../components/CarouselBanner';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <CarouselBanner />

      {/* ====== 品牌主张 ====== */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6 text-center overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-qing/5 rounded-full blur-3xl pointer-events-none translate-x-1/3 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/5 rounded-full blur-3xl pointer-events-none -translate-x-1/3 translate-y-1/2" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-xs tracking-[0.25em] text-gold/60 uppercase mb-4">HETU PATTERN</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-semibold text-ink leading-snug mb-5">
            河图纹样
          </h2>
          <p className="text-sm sm:text-base text-gray-500 leading-relaxed max-w-xl mx-auto mb-8">
            专注中国历代经典纹样的研究与创作，以文物考据为基础，建立学术级纹样复原标准，为设计师与品牌方提供可溯源的传统视觉资产。
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-gray-400">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-qing/5 border border-qing/10">
              出土文物 · 博物馆藏品考据
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/5 border border-gold/10">
              核心著作《中国历代经典纹样》
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 border border-gray-100">
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
              title: '纹样选购',
              subtitle: '独立授权 · 按张购买',
              desc: '复原纹样与创新设计，个人学习、商业许可、企业授权',
              href: '/patterns',
              accent: 'from-qing/20 to-transparent',
              iconColor: 'text-qing',
              borderColor: 'border-qing/20',
            },
            {
              title: '灵感素材',
              subtitle: '会员订阅 · 无限下载',
              desc: '历代纹样元素检索，年度会员持续上新',
              href: '/materials',
              accent: 'from-gold/20 to-transparent',
              iconColor: 'text-gold',
              borderColor: 'border-gold/20',
            },
            {
              title: '签约创作',
              subtitle: '入驻平台 · 共享收益',
              desc: '成为签约设计师，按标准提交作品，获取持续分成',
              href: '/join',
              accent: 'from-amber-100/40 to-transparent',
              iconColor: 'text-amber-600',
              borderColor: 'border-amber-200',
            },
          ].map((card) => (
            <a
              key={card.title}
              href={card.href}
              className="group relative overflow-hidden bg-white rounded-2xl p-6 sm:p-8 border border-gray-100
                         transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-transparent"
            >
              <div className={`absolute top-0 right-0 w-40 h-40 rounded-full bg-gradient-to-br ${card.accent} -translate-y-1/3 translate-x-1/3 transition-transform duration-500 group-hover:scale-150`} />
              <div className="relative z-10">
                <p className={`text-xs font-semibold tracking-wide mb-3 ${card.iconColor}`}>{card.subtitle}</p>
                <h3 className="text-xl font-serif font-semibold text-ink mb-2">{card.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{card.desc}</p>
                <span className={`inline-block mt-5 text-xs font-medium ${card.iconColor} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  进入 →
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ====== 信任与标准 ====== */}
      <section className="px-4 sm:px-6 py-16 sm:py-20 bg-qing/[0.03]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                num: '一',
                title: '学术考据',
                desc: '以出土文物与博物馆藏品为第一手资料，逐一比对、测绘、复原',
              },
              {
                num: '二',
                title: '学术沉淀',
                desc: '以《中国历代经典纹样》为学术基石，十年研究积累，建立纹样复原与创作规范',
              },
              {
                num: '三',
                title: '入驻标准',
                desc: '签约设计师须提交作品集，经学术审核通过方可上架',
              },
            ].map((item) => (
              <div key={item.title} className="text-center py-3">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-white border border-gold/20 flex items-center justify-center">
                  <span className="text-lg font-serif font-semibold text-gold">{item.num}</span>
                </div>
                <h4 className="text-sm font-semibold text-ink mb-1.5">{item.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed max-w-[200px] mx-auto">{item.desc}</p>
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
