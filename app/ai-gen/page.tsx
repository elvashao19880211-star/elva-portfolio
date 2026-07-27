import Breadcrumb from '../../components/Breadcrumb';

export default function AIGenPage() {
  return (
    <main className="min-h-screen bg-[#F5F3EE]">
      <Breadcrumb items={[{ label: '首页', href: '/' }, { label: 'AI 纹样' }]} />

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-qing/10 text-qing text-sm mb-6">
          <span className="w-2 h-2 rounded-full bg-qing animate-pulse" />
          即将上线
        </div>
        <h1 className="text-4xl md:text-5xl font-serif text-ink mb-6">
          AI 纹样生成器
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
          正在基于河图纹样库训练专属模型，让每个人都能通过选择朝代、结构、主题，
          一键生成独一无二的传统纹样。
        </p>
      </section>

      {/* Preview — what's coming */}
      <section className="max-w-5xl mx-auto px-6 pb-8">
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { icon: '🏯', title: '朝代风格', desc: '从魏晋到明清，选你喜欢的时代风格' },
            { icon: '🔷', title: '结构骨架', desc: '四方连续、适合、团窠……自由搭配' },
            { icon: '🌸', title: '主题元素', desc: '莲纹、龙纹、卷草……无限组合' },
            { icon: '🎨', title: '配色方案', desc: '青蓝、赭褐、樱粉，一键切换色调' },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white/60 backdrop-blur rounded-2xl p-6 border border-gray-100"
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="text-lg font-medium text-ink mb-1">{item.title}</h3>
              <p className="text-sm text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stay tuned */}
      <section className="max-w-5xl mx-auto px-6 pb-32 text-center">
        <div className="inline-block bg-white/60 backdrop-blur rounded-2xl border border-gray-100 px-8 py-6">
          <p className="text-gray-400 text-sm">
            期待与你一起探索 AI 与传统纹样的碰撞 🤍
          </p>
          <p className="text-gray-300 text-xs mt-2">
            河图 · hetu-pattern.com
          </p>
        </div>
      </section>
    </main>
  );
}
