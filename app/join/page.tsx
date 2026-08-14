'use client';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Breadcrumb from '../../components/Breadcrumb';

const STEPS = [
  {
    step: '01',
    title: '提交作品集',
    desc: '发送个人作品集至官方邮箱，包含至少 5 件纹样相关作品，注明创作思路、参考来源及个人简介。',
    accent: 'bg-qing/5 border-qing/10',
    numClass: 'text-qing/10',
    iconColor: 'text-qing',
  },
  {
    step: '02',
    title: '学术审核',
    desc: '团队将依据学术复原标准与创作规范进行审核，评估作品的考据严谨度与艺术水准。',
    accent: 'bg-gold/5 border-gold/10',
    numClass: 'text-gold/10',
    iconColor: 'text-gold',
  },
  {
    step: '03',
    title: '签约入驻',
    desc: '审核通过后签订合作协议，明确授权方式、收益分成与交付标准，正式成为签约设计师。',
    accent: 'bg-amber-50 border-amber-100',
    numClass: 'text-amber-200',
    iconColor: 'text-amber-700',
  },
  {
    step: '04',
    title: '持续收益',
    desc: '作品上架后按平台统一标准获得分成，河图负责推广、授权管理与客户服务。',
    accent: 'bg-stone-50 border-stone-100',
    numClass: 'text-stone-200',
    iconColor: 'text-stone-600',
  },
];

const BENEFITS = [
  { label: '平台推广', desc: '首页推荐 · 社交媒体曝光', icon: '◇' },
  { label: '收益分成', desc: '按约获得作品授权收入', icon: '○' },
  { label: '学术支持', desc: '考据资料 · 复原标准共享', icon: '□' },
];

export default function JoinPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* 面包屑 + 标题 */}
      <section className="px-4 sm:px-6 py-8 sm:py-10">
        <div className="max-w-5xl mx-auto">
          <Breadcrumb crumbs={[
            { label: '首页', href: '/' },
            { label: '签约创作' },
          ]} />
        </div>
      </section>

      {/* ====== 头部区 ====== */}
      <section className="relative px-4 sm:px-6 pb-16 sm:pb-20 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-qing/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto">
          {/* 中式装饰线 */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-px bg-qing/30" />
            <div className="w-2 h-2 rotate-45 bg-qing/30" />
            <div className="w-8 h-px bg-qing/30" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-ink mb-4 tracking-wide">
            签约创作
          </h1>
          <p className="text-sm sm:text-base text-gray-500 leading-relaxed max-w-lg mx-auto">
            河图是一个专注中国纹样的创作工作室。<br />
            我们严谨考据，也拥抱当代审美。<br />
            欢迎有同样追求的设计师加入，一起做点好作品。
          </p>
        </div>
      </section>

      {/* ====== 流程 ====== */}
      <section className="px-4 sm:px-6 pb-16 sm:pb-24 max-w-4xl mx-auto">
        {/* 竖线联接（桌面端） */}
        <div className="hidden sm:block relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent -translate-x-1/2" />

          {STEPS.map((item, i) => {
            const isLeft = i % 2 === 0;
            return (
              <div key={item.step} className={`relative flex items-center mb-12 last:mb-0 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* 中线圆点 */}
                <div className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white border-2 border-gold/30 z-10" />
                {/* 卡片 */}
                <div className={`w-[calc(50%-2rem)] ${isLeft ? 'pr-0' : 'pl-0'}`}>
                  <div className={`relative rounded-2xl p-6 sm:p-7 border ${item.accent} hover:shadow-md transition-shadow`}>
                    <span className={`absolute top-3 right-4 text-5xl sm:text-6xl font-serif font-bold ${item.numClass} pointer-events-none`}>
                      {item.step}
                    </span>
                    <div className="relative z-10">
                      <h3 className="text-lg font-serif font-semibold text-ink mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
                {/* 对面占位 */}
                <div className="w-[calc(50%-2rem)]" />
              </div>
            );
          })}
        </div>

        {/* 移动端竖排 */}
        <div className="sm:hidden space-y-6">
          {STEPS.map((item) => (
            <div key={item.step} className={`relative rounded-2xl p-6 border ${item.accent}`}>
              <span className={`absolute top-3 right-4 text-5xl font-serif font-bold ${item.numClass} pointer-events-none`}>
                {item.step}
              </span>
              <div className="relative z-10">
                <h3 className="text-lg font-serif font-semibold text-ink mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ====== 设计师权益 ====== */}
      <section className="px-4 sm:px-6 pb-16 sm:pb-20">
        <div className="max-w-3xl mx-auto text-center">
          {/* 装饰线 */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-6 h-px bg-gold/40" />
            <div className="w-1.5 h-1.5 rotate-45 bg-gold/40" />
            <div className="w-6 h-px bg-gold/40" />
            <span className="text-xs text-gold/60 tracking-widest mx-1">权益</span>
            <div className="w-6 h-px bg-gold/40" />
            <div className="w-1.5 h-1.5 rotate-45 bg-gold/40" />
            <div className="w-6 h-px bg-gold/40" />
          </div>
          <h3 className="text-lg sm:text-xl font-serif font-semibold text-ink mb-8">签约设计师权益</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {BENEFITS.map((item) => (
              <div key={item.label} className="group relative rounded-2xl p-6 border shadow-sm hover:shadow-md transition-all duration-300" style={{ backgroundColor: '#f0f6f6', borderColor: '#dce8e8' }}>
                <span className="block text-2xl text-gold/20 mb-3 group-hover:text-gold/40 transition-colors">{item.icon}</span>
                <p className="text-sm font-semibold text-ink mb-1.5">{item.label}</p>
                <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== 申请入口 ====== */}
      <section className="px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="relative max-w-lg mx-auto">
          {/* 装饰边框 */}
          <div className="absolute inset-0 rounded-3xl border border-gold/10 pointer-events-none" />
          <div className="absolute top-2 left-2 right-2 bottom-2 rounded-[1.125rem] border border-qing/10 pointer-events-none" />

          <div className="relative text-center p-8 sm:p-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-qing/20" />
              <div className="w-3 h-3 rounded-full bg-gold/20" />
              <div className="w-3 h-3 rounded-full bg-qing/20" />
            </div>
            <h3 className="text-lg font-serif font-semibold text-ink mb-2">申请入驻</h3>
            <p className="text-sm text-gray-500 mb-7">将作品集发送至以下邮箱，5 个工作日内回复</p>

            {/* 邮箱卡片 */}
            <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-[#FDFBF7] border border-gray-100 hover:border-gold/30 transition-colors">
              <svg className="w-4 h-4 text-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-sm text-ink font-medium tracking-wide">studio@hetu-pattern.com</span>
            </div>

            <p className="text-[11px] text-gray-400 mt-5">邮件请注明「签约申请」及您的姓名或工作室名称</p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
