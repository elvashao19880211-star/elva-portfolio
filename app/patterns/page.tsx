import Link from 'next/link';
import Breadcrumb from '../../components/Breadcrumb';

export default function PatternsPage() {
  return (
    <main className="min-h-screen px-4 sm:px-6 py-16 sm:py-20">
      <Breadcrumb crumbs={[
        { label: '首页', href: '/' },
        { label: '纹样库' },
      ]} />

      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-serif font-semibold text-ink mb-4">纹样库</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          选择你感兴趣的纹样方向，探索传统与创新的东方之美
        </p>
        <div className="mt-4 mx-auto w-16 h-0.5 rounded-full bg-gradient-to-r from-qing to-gold" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* 复原纹样 */}
        <Link href="/patterns/revival" className="group block">
          <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-qing/20 to-ink/10 border border-gray-200 hover:border-qing/40 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-qing/30 via-transparent to-ink/20 
                            group-hover:from-qing/40 group-hover:via-qing/10 transition-all duration-500" />
            {/* 装饰圆 */}
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-qing/10 group-hover:bg-qing/20 transition-all duration-500" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-gold/10" />

            <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 text-center">
              <span className="text-6xl mb-6 block">🏮</span>
              <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-ink group-hover:text-gold transition-colors duration-300">
                复原纹样
              </h2>
              <p className="text-gray-500 mt-3 max-w-xs text-sm">
                基于历代传统图样复原的设计作品
                <br />
                <span className="text-xs text-gray-400">重现古典纹样之美</span>
              </p>
              <span className="mt-6 inline-flex items-center gap-1.5 px-6 py-2 rounded-full border border-gold text-gold text-sm
                             group-hover:bg-gold group-hover:text-white transition-all duration-300">
                浏览作品
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </div>
          </div>
        </Link>

        {/* 创新纹样 */}
        <Link href="/patterns/innovation" className="group block">
          <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-gold/20 to-qing/10 border border-gray-200 hover:border-gold/40 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-gold/30 via-transparent to-qing/20
                            group-hover:from-gold/40 group-hover:via-gold/10 transition-all duration-500" />
            {/* 装饰圆 */}
            <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-gold/10 group-hover:bg-gold/20 transition-all duration-500" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-qing/10" />

            <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 text-center">
              <span className="text-6xl mb-6 block">✨</span>
              <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-ink group-hover:text-gold transition-colors duration-300">
                创新纹样
              </h2>
              <p className="text-gray-500 mt-3 max-w-xs text-sm">
                以传统元素为灵感
                <br />
                <span className="text-xs text-gray-400">融入现代审美的创新设计</span>
              </p>
              <span className="mt-6 inline-flex items-center gap-1.5 px-6 py-2 rounded-full border border-gold text-gold text-sm
                             group-hover:bg-gold group-hover:text-white transition-all duration-300">
                浏览作品
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </div>
          </div>
        </Link>
      </div>
    </main>
  );
}
