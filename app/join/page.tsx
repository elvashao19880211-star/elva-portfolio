'use client';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Breadcrumb from '../../components/Breadcrumb';

export default function JoinPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="px-4 sm:px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <Breadcrumb crumbs={[
            { label: '首页', href: '/' },
            { label: '签约创作' },
          ]} />
        </div>
      </section>

      {/* 标题区 */}
      <section className="px-4 sm:px-6 pb-10 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-ink mb-3">签约创作</h1>
          <p className="text-sm text-gray-400">成为河图签约设计师，按统一标准提交作品，共享平台收益</p>
        </div>
      </section>

      {/* 流程说明 */}
      <section className="px-4 sm:px-6 pb-20 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-14">
          {[
            {
              step: '01',
              title: '提交作品集',
              desc: '发送个人作品集至官方邮箱，包含至少 5 件纹样相关作品，注明创作思路、参考来源及个人简介。',
            },
            {
              step: '02',
              title: '学术审核',
              desc: '团队将依据学术复原标准与创作规范进行审核，评估作品的考据严谨度与艺术水准。',
            },
            {
              step: '03',
              title: '签约入驻',
              desc: '审核通过后签订合作协议，明确授权方式、收益分成与交付标准，正式成为签约设计师。',
            },
            {
              step: '04',
              title: '持续收益',
              desc: '作品上架后按平台统一标准获得分成，河图负责推广、授权管理与客户服务。',
            },
          ].map((item) => (
            <div key={item.step} className="relative bg-white rounded-xl p-6 border border-gray-100">
              <span className="text-3xl font-serif font-bold text-gray-100 absolute top-4 right-5">{item.step}</span>
              <h3 className="text-base font-semibold text-ink mb-2 relative z-10">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed relative z-10">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* 签约优势 */}
        <div className="max-w-2xl mx-auto mb-14">
          <h3 className="text-lg font-serif font-semibold text-ink text-center mb-6">签约设计师权益</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: '平台推广', desc: '作品获河图首页推荐与社交媒体曝光' },
              { label: '收益分成', desc: '按约获得作品授权收入分成' },
              { label: '学术支持', desc: '共享考据资料与复原标准文档' },
            ].map((item) => (
              <div key={item.label} className="text-center p-4 rounded-xl bg-qing/5">
                <p className="text-sm font-semibold text-ink mb-1">{item.label}</p>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 联系入口 */}
        <div className="max-w-md mx-auto text-center bg-[#FDFBF7] rounded-2xl p-8 border border-gray-100">
          <h3 className="text-base font-semibold text-ink mb-3">申请入驻</h3>
          <p className="text-sm text-gray-500 mb-5">请将作品集发送至以下邮箱，我们将于 5 个工作日内回复</p>
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-gray-200">
            <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-sm text-ink font-medium">join@hetu-pattern.com</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-4">邮件请注明「签约申请」及您的姓名或工作室名称</p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
