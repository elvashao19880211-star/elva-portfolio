'use client';

import { useState } from 'react';
import Image from 'next/image';
import Breadcrumb from '../../components/Breadcrumb';
import { services, caseStudies, processSteps } from './data';

export default function CooperationPage() {
  const [formName, setFormName] = useState('');
  const [formContact, setFormContact] = useState('');
  const [formType, setFormType] = useState('custom-pattern');
  const [formMsg, setFormMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formContact.trim() || !formMsg.trim()) return;
    setSubmitted(true);
    // 后续可接入 Supabase 或邮件服务存储询盘
    setTimeout(() => {
      setSubmitted(false);
      setFormName('');
      setFormContact('');
      setFormType('custom-pattern');
      setFormMsg('');
    }, 3000);
  };

  return (
    <main className="min-h-screen">
      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-qing/10 via-white to-gold/10 pt-12 sm:pt-16 pb-16 sm:pb-24">
        {/* 装饰背景 */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-qing/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gold/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

        <div className="relative z-10 px-6 max-w-5xl mx-auto">
          <Breadcrumb
            crumbs={[
              { label: '首页', href: '/' },
              { label: '企业合作' },
            ]}
          />
          <div className="mt-8 sm:mt-12 text-center">
            <h1 className="text-[1.6rem] sm:text-5xl font-serif font-semibold text-ink mb-3 sm:mb-4">
              让传统纹样，为品牌说话
            </h1>
            <p className="text-sm sm:body-lg text-gray-500 max-w-2xl mx-auto">
              从考据研究到设计交付，为品牌提供专业的传统纹样定制与合作服务。
              <br className="hidden sm:block" />
              让东方美学成为品牌最具辨识度的文化语言。
            </p>
          </div>
        </div>
      </section>

      {/* ===== 服务项目 ===== */}
      <section className="px-4 sm:px-6 py-16 sm:py-20 max-w-6xl mx-auto">
        <h2 className="heading-2 text-ink text-center mb-3">服务项目</h2>
        <p className="text-gray-500 text-center mb-14 max-w-lg mx-auto">
          根据品牌需求量身定制，灵活选择合作方式
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="group bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl shrink-0">{svc.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-serif font-semibold text-ink mb-0.5">{svc.title}</h3>
                  <p className="text-xs text-gold font-medium uppercase tracking-wider mb-3">
                    {svc.subtitle}
                  </p>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">
                    {svc.description}
                  </p>
                  <ul className="space-y-1.5">
                    {svc.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2 text-xs text-gray-400">
                        <svg className="w-3.5 h-3.5 text-qing shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 合作流程 ===== */}
      <section className="px-4 sm:px-6 py-16 sm:py-20 bg-ink/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-serif font-semibold text-ink text-center mb-4">合作流程</h2>
          <p className="body-md text-center mb-14 max-w-lg mx-auto">
            从沟通到交付，每一步都清晰透明
          </p>

          <div className="relative">
            {/* 时间线背景线 */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-qing via-gold to-qing hidden sm:block" />

            <div className="space-y-10">
              {processSteps.map((step, idx) => (
                <div key={step.step} className="relative pl-0 sm:pl-20">
                  {/* 圆点 */}
                  <div className="hidden sm:flex absolute left-0 top-0 w-16 h-16 rounded-full bg-white shadow-md border border-gray-100 items-center justify-center">
                    <span className="text-2xl">{step.icon}</span>
                  </div>

                  {/* 手机端数字 */}
                  <div className="sm:hidden flex items-center gap-3 mb-2">
                    <span className="w-8 h-8 rounded-full bg-gold text-white flex items-center justify-center text-sm font-medium shrink-0">
                      {step.step}
                    </span>
                    <h3 className="text-lg font-medium text-ink">{step.title}</h3>
                  </div>

                  {/* 桌面端结构 */}
                  <div className="hidden sm:block">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gold text-white text-xs font-medium">
                        {step.step}
                      </span>
                      <h3 className="text-lg font-medium text-ink">{step.title}</h3>
                    </div>
                  </div>

                  <p className="text-gray-500 text-sm leading-relaxed ml-0 sm:ml-0">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== 合作案例 ===== */}
      <section className="px-4 sm:px-6 py-16 sm:py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl font-serif font-semibold text-ink text-center mb-4">合作案例</h2>
        <p className="text-gray-500 text-center mb-14 max-w-lg mx-auto">
          部分过往合作项目展示
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {caseStudies.map((cs) => (
            <div
              key={cs.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="relative w-full aspect-[4/3] overflow-hidden bg-stone-100">
                <Image
                  src={cs.imageSrc}
                  alt={cs.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 text-xs rounded-full bg-white/90 text-ink font-medium shadow">
                  {cs.category}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-base font-medium text-ink mb-1">{cs.title}</h3>
                {cs.client && (
                  <p className="text-xs text-gold mb-2">{cs.client} · {cs.year}</p>
                )}
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                  {cs.description}
                </p>
                <details className="mt-3 group/details">
                  <summary className="text-xs text-gold cursor-pointer hover:text-gold/80 transition-colors">
                    查看更多
                  </summary>
                  <p className="text-gray-500 text-xs leading-relaxed mt-2">
                    {cs.detail}
                  </p>
                </details>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 联系与询盘表单 ===== */}
      <section className="px-4 sm:px-6 py-16 sm:py-20 bg-gradient-to-br from-qing/5 to-gold/5">

        <div className="max-w-2xl mx-auto">
          <h2 className="heading-2 text-ink text-center mb-3">合作咨询</h2>
          <p className="text-gray-500 text-center mb-10 max-w-lg mx-auto">
            留下您的需求，我将尽快与您联系
          </p>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 sm:p-8 shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">您的称呼 *</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="姓名 / 品牌名"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">联系方式 *</label>
                <input
                  type="text"
                  value={formContact}
                  onChange={(e) => setFormContact(e.target.value)}
                  placeholder="手机 / 微信 / 邮箱"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1.5">合作类型</label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all bg-white"
              >
                <option value="custom-pattern">纹样定制设计</option>
                <option value="brand-collab">品牌联名合作</option>
                <option value="pattern-license">纹样授权使用</option>
                <option value="consulting">传统文化美学顾问</option>
                <option value="other">其他合作</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm text-gray-600 mb-1.5">合作需求 *</label>
              <textarea
                value={formMsg}
                onChange={(e) => setFormMsg(e.target.value)}
                placeholder="请简单描述您的需求、应用场景和预算范围……"
                rows={4}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl resize-none focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={!formName.trim() || !formContact.trim() || !formMsg.trim()}
              className="w-full py-3 rounded-xl bg-gold text-white font-medium hover:bg-gold/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitted ? '✅ 已收到！我会尽快联系您' : '提交咨询'}
            </button>

            <p className="text-[10px] text-gray-300 text-center mt-3">
              ⚡ 轻量版 · 咨询暂未接入后端存储（后续可对接邮件或 CRM）
            </p>
          </form>

          {/* 其他联系方式 */}
          <div className="mt-10 text-center">
            <p className="text-sm text-gray-400 mb-4">或通过以下方式直接联系</p>
            <div className="flex justify-center gap-8">
              <div className="text-center">
                <span className="block text-2xl mb-1">📮</span>
                <span className="text-xs text-gray-400">小红书：@Elva纹样设计</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl mb-1">💬</span>
                <span className="text-xs text-gray-400">微信：elva_pattern</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl mb-1">📧</span>
                <span className="text-xs text-gray-400">邮箱：elva@example.com</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="bg-ink text-white text-center py-10 px-6">
        <p className="text-gold font-medium mb-2">传承东方纹样之美</p>
        <p className="text-white/50 text-sm">© {new Date().getFullYear()} Elva Studio · 纹样定制与品牌合作</p>
      </footer>
    </main>
  );
}
