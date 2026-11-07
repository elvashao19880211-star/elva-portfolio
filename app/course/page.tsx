import Breadcrumb from '../../components/Breadcrumb';
import Footer from '../../components/Footer';

export const metadata = {
  title: '从考据到商业：纹样设计系统课',
  description:
    '中国传统纹样设计系统课：从历代纹样考据到商业设计落地。6大模块，小班直播，主讲带课+助教答疑+作业批改。首期早鸟价 1999 元，限 6-8 人。',
};

const MODULES = [
  { n: '一', title: '历史纹样风格溯源', desc: '历代纹样的时代特征与源流脉络' },
  { n: '二', title: '色彩通识与中国传统色', desc: '传统色体系、配色逻辑与用色方法' },
  { n: '三', title: '传统纹样结构构成', desc: '结构法则、骨架拆解与重组方法' },
  { n: '四', title: '纹样演变图解与元素运用', desc: '演变规律的图解与元素提取运用' },
  { n: '五', title: '中国传统纹样设计原则', desc: '传统造物中的核心设计准则' },
  { n: '六', title: '中国传统纹样商业设计', desc: '从客户需求到方案输出的完整流程' },
];

const SERVICES = [
  { title: '小班授课', desc: '班级规模严格控制，每位学员均可获得充分指导' },
  { title: '主讲全程带课', desc: '主讲老师全程直播授课，可实时提问与互动' },
  { title: '助教随堂答疑', desc: '配备助教跟班，课后问题可获得及时响应' },
  { title: '作业逐次批改', desc: '每次作业均提供针对性点评与修改建议' },
];

const FAQ = [
  {
    q: '课程需要什么基础？',
    a: '需具备 PS、AI 或 Procreate 的基础操作能力。本课程不设传统纹样基础门槛，纹样体系自零建立；软件操作能力为必要前提，课程不承担软件基础教学。',
  },
  {
    q: '错过直播怎么办？',
    a: '每节课均提供回放，保留至课程结束后 3 个月。建议尽量参与直播，以便现场提问与互动。',
  },
  {
    q: '课程能退款吗？',
    a: '开课前可全额退款；开课后前 2 节课内提出，按剩余课时比例退款；第 3 节课起不再受理退款。',
  },
  {
    q: '学完能接商单吗？',
    a: '课程不对接单结果作出承诺。第六模块以完整商单流程为线索，涵盖客户需求分析、纹样考据、元素提取、结构设计与方案输出，所培养的是承接商业项目所需的基础能力；能否转化为实际项目，取决于个人积累与市场条件。',
  },
];

export default function CoursePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* ===== 面包屑 ===== */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
        <Breadcrumb crumbs={[{ label: '首页', href: '/' }, { label: '课程' }]} />
      </div>

      {/* ===== 首屏 ===== */}
      <section className="relative px-4 sm:px-6 pt-10 pb-16 sm:pt-14 sm:pb-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-qing/5 rounded-full blur-3xl pointer-events-none translate-x-1/3 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/5 rounded-full blur-3xl pointer-events-none -translate-x-1/3 translate-y-1/2" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-gold/10 border border-gold/25 text-gold text-xs font-medium tracking-wider mb-6">
            首期早鸟班 · 限 6-8 人
          </span>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-semibold text-ink leading-tight mb-4">
            从考据到商业
            <br className="sm:hidden" />
            <span className="text-qing">：纹样设计系统课</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-500 leading-relaxed max-w-2xl mx-auto mb-8">
            六大模块，从历代考据到商单落地，系统建立完整的纹样设计体系。
          </p>

          <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-8 px-6 py-5 rounded-2xl bg-gold/5 border border-gold/20">
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">首期早鸟价</p>
              <p className="text-3xl sm:text-4xl font-serif font-semibold text-gold">
                ¥1,999
              </p>
              <p className="text-xs text-gray-400 mt-1 line-through">正价 ¥2,999</p>
            </div>
            <div className="hidden sm:block w-px h-14 bg-gold/20" />
            <a
              href="#enroll"
              className="px-8 py-3.5 rounded-full text-white text-sm font-medium shadow-lg shadow-qing/25 hover:shadow-xl transition-all hover:-translate-y-0.5"
              style={{ backgroundColor: '#3F9EAC' }}
            >
              报名咨询 →
            </a>
          </div>
        </div>
      </section>

      {/* ===== 适合人群 ===== */}
      <section className="px-4 sm:px-6 py-14 sm:py-20 bg-[#FAF8F3]">
        <div className="max-w-3xl mx-auto">
          <h2 className="heading-2 text-ink text-center mb-10">招生对象</h2>

          <div className="text-center space-y-4">
            <p className="font-serif text-lg sm:text-2xl text-ink leading-relaxed">
              有中式设计或传统纹样设计需求的视觉从业者
            </p>
            <p className="font-serif text-lg sm:text-2xl text-ink leading-relaxed">
              对传统文化与纹样感兴趣的爱好者
            </p>
          </div>

          <div className="mt-14 pt-8 border-t border-ink/8 text-center">
            <p className="text-xs tracking-[0.2em] text-gray-400 mb-2.5">报名基础条件</p>
            <p className="text-sm text-gray-600 leading-relaxed">
              掌握 <strong className="text-ink font-medium">PS、AI 或 Procreate</strong> 的基础应用
            </p>
            <p className="text-xs text-gray-400 mt-2">
              课程不涉及软件基础操作的教学
            </p>
          </div>
        </div>
      </section>

      {/* ===== 教学方式与上课安排 ===== */}
      <section className="px-4 sm:px-6 py-14 sm:py-20 bg-ink text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-center mb-3">
            教学方式与上课安排
          </h2>
          <p className="text-sm text-white/60 text-center mb-10 max-w-xl mx-auto">
            小班直播授课，配备助教答疑与作业批改
          </p>

          {/* 上课信息 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-10">
            {[
              { k: '开班时间', v: '11月25日' },
              { k: '授课频率', v: '每周 3 次' },
              { k: '单次时长', v: '1 小时' },
              { k: '授课平台', v: '腾讯会议' },
              { k: '预计周期', v: '4-5 周' },
              { k: '班级规模', v: '6-8 人' },
            ].map((item, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-white/5 border border-white/10 text-center"
              >
                <p className="text-xs text-white/50 mb-1.5">{item.k}</p>
                <p className="text-sm font-medium text-white">{item.v}</p>
              </div>
            ))}
          </div>

          {/* 教学服务 */}
          <div className="pt-8 border-t border-white/10">
            <p className="text-xs tracking-widest text-gold/80 text-center mb-6">教学保障</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SERVICES.map((s, i) => (
                <div key={i} className="p-5 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-sm font-medium text-gold mb-1.5">{s.title}</h3>
                  <p className="text-xs text-white/60 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-white/40 text-center mt-8 leading-relaxed">
            课程以六大模块为主线，具体进度根据学员吸收情况微调。<br />
            每节课均有回放，保留至课程结束后 3 个月。
          </p>
        </div>
      </section>

      {/* ===== 六大模块 ===== */}
      <section className="px-4 sm:px-6 py-14 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="heading-2 text-ink text-center mb-3">六大模块</h2>
          <p className="text-sm text-gray-500 text-center mb-6 max-w-xl mx-auto">
            从历代考据到商单落地
          </p>

          <div className="flex items-center justify-center gap-3 text-xs tracking-widest text-gray-400 mb-12">
            <span>考据</span>
            <span className="w-16 h-px bg-gradient-to-r from-qing/50 via-gray-200 to-gold/50" />
            <span>落地</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MODULES.map((m, i) => (
              <div
                key={m.n}
                className="group relative overflow-hidden rounded-2xl bg-[#FAF8F3] border border-transparent p-6 transition-all duration-300 hover:bg-white hover:border-qing/25 hover:shadow-xl hover:shadow-qing/5 hover:-translate-y-0.5"
              >
                <span
                  aria-hidden
                  className="absolute -right-1 -top-4 font-serif text-7xl leading-none text-qing/8 transition-colors duration-300 group-hover:text-qing/15 select-none"
                >
                  {m.n}
                </span>

                <p className="text-xs tracking-[0.2em] text-qing/70 mb-4">
                  模块 {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="relative font-serif text-base font-semibold text-ink mb-2 leading-snug">
                  {m.title}
                </h3>
                <p className="relative text-sm text-gray-500 leading-relaxed">{m.desc}</p>

                <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-qing/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 讲师 ===== */}
      <section className="px-4 sm:px-6 py-14 sm:py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="heading-2 text-ink text-center mb-10">授课老师</h2>

          <div className="p-6 sm:p-8 rounded-2xl bg-[#FDFBF7] border border-[#f0e9db]">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-qing/10 flex items-center justify-center shrink-0">
                <span className="text-qing text-lg font-serif">邵</span>
              </div>
              <div>
                <h3 className="text-lg font-serif font-semibold text-ink">邵爱涵</h3>
                <p className="text-xs text-gray-400 mt-0.5">河图纹画主理人 · 传统纹样研究者</p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600 leading-relaxed">
              <p>
                《中国历代经典纹样》作者（江苏人民出版社，2025）。
              </p>
              <p>
                曾与北京联合大学合作，参与北京市通州区博物馆藏唐俑服饰、北京八角村辽金墓壁画的复原工作。
              </p>
              <p>
                曾任国内头部互联网大厂国际设计师部管理，资深时尚买手。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 报名 ===== */}
      <section id="enroll" className="px-4 sm:px-6 py-14 sm:py-20 bg-qing text-white scroll-mt-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-serif font-semibold mb-3">
            报名咨询
          </h2>
          <p className="text-sm text-white/70 mb-8">
            添加微信，获取完整课程大纲与报名方式
          </p>

          <div className="inline-flex flex-col sm:flex-row items-center gap-6 p-7 rounded-2xl bg-white/10 border border-white/20">
            <img
              src="/images/wechat-qr.webp"
              alt="微信二维码 ElvaHTWH"
              className="w-36 h-36 rounded-lg bg-white p-2"
            />
            <div className="text-left">
              <p className="text-sm text-white/80 mb-2">扫码添加微信咨询报名</p>
              <p className="text-lg font-medium mb-3">微信号：ElvaHTWH</p>
              <p className="text-xs text-white/60 leading-relaxed">
                添加时请注明「纹样课」<br />
                将发送完整课程大纲与报名方式
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="px-4 sm:px-6 py-14 sm:py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="heading-2 text-ink text-center mb-10">常见问题</h2>

          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <details
                key={i}
                className="group rounded-xl border border-gray-100 bg-white overflow-hidden"
              >
                <summary className="flex items-center justify-between gap-3 p-5 cursor-pointer list-none">
                  <span className="text-sm font-medium text-ink">{item.q}</span>
                  <svg
                    className="w-4 h-4 text-gray-300 shrink-0 group-open:rotate-180 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-5 -mt-1">
                  <p className="text-sm text-gray-500 leading-relaxed">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
