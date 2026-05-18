'use client';

import { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import SectionTitle from '../../components/SectionTitle';
import { MEMBER_PLANS, DOWNLOAD_PACKS } from './data';

export default function MemberPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>('free');
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [showPay, setShowPay] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);

  const handleUpgrade = (planId: string) => {
    if (planId === 'free') return;
    setSelectedPlan(planId);
    if (planId === 'enterprise') {
      alert('企业用户请联系客服：微信 elva_pattern （演示模式）');
      return;
    }
    setShowPay(true);
  };

  const handlePay = () => {
    setShowPay(false);
    setPaySuccess(true);
    setTimeout(() => setPaySuccess(false), 2000);
  };

  return (
    <main className="min-h-screen px-6 py-12">
      <Breadcrumb crumbs={[{ label: '首页', href: '/' }, { label: '会员中心' }]} />
      <SectionTitle
        title="会员中心"
        subtitle="选择适合你的方案 · 免费浏览 · 付费下载高清无版权"
      />

      {/* 当前状态 */}
      <div className="max-w-5xl mx-auto mb-8 flex items-center justify-between bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center">
            <svg className="w-5 h-5 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-400">当前身份</p>
            <p className="text-base font-serif font-semibold text-ink">
              免费会员 <span className="text-xs font-normal text-gray-400 font-sans">· 今日剩余下载：3 次</span>
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">已使用</p>
          <p className="text-sm font-medium text-ink">0 / 3 次</p>
        </div>
      </div>

      {/* 会员方案 */}
      <div className="max-w-5xl mx-auto mb-16">
        <h3 className="heading-4 text-ink mb-6 text-center">选择会员方案</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MEMBER_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl border-2 p-6 transition-all duration-200 ${
                plan.highlight
                  ? 'border-qing shadow-lg scale-[1.02]'
                  : 'border-gray-100 hover:border-gray-200 shadow-sm'
              }`}
            >
              {plan.badge && (
                <span className={`absolute -top-2.5 right-4 px-3 py-0.5 text-xs rounded-full text-white font-medium ${
                  plan.highlight ? 'bg-gold' : 'bg-ink/60'
                }`}>
                  {plan.badge}
                </span>
              )}

              <h4 className="text-base font-serif font-semibold text-ink mb-1">{plan.name}</h4>
              <div className="mb-4">
                {plan.price === '免费' ? (
                  <span className="text-2xl font-serif font-bold text-gray-400">免费</span>
                ) : (
                  <>
                    <span className="text-3xl font-serif font-bold text-ink">¥{plan.price}</span>
                    <span className="text-xs text-gray-400 ml-1">{plan.period}</span>
                  </>
                )}
              </div>

              <ul className="space-y-2 mb-6">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                    <svg className="w-3.5 h-3.5 text-qing mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={plan.id === 'free'}
                className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all ${
                  plan.highlight
                    ? 'bg-ink text-white hover:bg-ink/90 shadow-sm'
                    : 'bg-gray-50 text-ink border border-gray-200 hover:bg-gray-100'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 下载包 */}
      <div className="max-w-5xl mx-auto mb-16">
        <h3 className="heading-4 text-ink mb-6 text-center">下载包（非会员专用）</h3>
        <p className="body-sm text-gray-400 text-center mb-8 -mt-4">
          不开会员也能买 · 永久有效 · 不限时用完
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {DOWNLOAD_PACKS.map((pack) => (
            <div
              key={pack.id}
              className={`relative bg-white rounded-2xl border-2 p-5 text-center cursor-pointer transition-all ${
                selectedPack === pack.id
                  ? 'border-qing bg-qing/5 shadow-sm'
                  : 'border-gray-100 hover:border-gray-200'
              }`}
              onClick={() => setSelectedPack(pack.id)}
            >
              {pack.badge && (
                <span className={`absolute -top-2.5 right-4 px-3 py-0.5 text-xs rounded-full text-white font-medium ${
                  pack.badge === '最值' ? 'bg-gold' : 'bg-ink/60'
                }`}>
                  {pack.badge}
                </span>
              )}
              <p className="text-2xl font-serif font-bold text-ink mb-1">{pack.credits}</p>
              <p className="text-xs text-gray-400 mb-3">次下载</p>
              <p className="text-lg font-serif font-bold text-gold">¥{pack.price}</p>
              <p className="text-[10px] text-gray-300 mt-1">{pack.unit}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <button
            onClick={() => { if (selectedPack) setShowPay(true); }}
            disabled={!selectedPack}
            className="btn-gold text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            立即购买下载包
          </button>
        </div>
      </div>

      {/* 支付弹窗 */}
      {showPay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowPay(false)}>
          <div className="bg-white rounded-2xl max-w-sm w-full p-8 shadow-2xl text-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-16 h-16 rounded-full bg-qing/10 flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-qing" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="heading-3 text-ink mb-2">确认支付</h3>
            <p className="body-md mb-6">
              {selectedPlan && selectedPlan !== 'free'
                ? `${MEMBER_PLANS.find(p => p.id === selectedPlan)?.name} · ¥${MEMBER_PLANS.find(p => p.id === selectedPlan)?.price}/月`
                : selectedPack
                  ? `${DOWNLOAD_PACKS.find(p => p.id === selectedPack)?.credits} 次下载包 · ¥${DOWNLOAD_PACKS.find(p => p.id === selectedPack)?.price}`
                  : ''}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowPay(false)} className="btn-outline flex-1 text-sm">取消</button>
              <button onClick={handlePay} className="btn-ink flex-1 text-sm">确认支付</button>
            </div>
            <p className="text-[10px] text-gray-300 mt-4">（演示模式 · 支付接口待接入）</p>
          </div>
        </div>
      )}

      {/* Toast */}
      {paySuccess && (
        <div className="fixed top-24 right-6 z-50 bg-white rounded-xl shadow-lg border border-green-100 p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-ink">支付成功！</p>
            <p className="text-xs text-gray-400">权益已开通，开始浏览吧</p>
          </div>
        </div>
      )}
    </main>
  );
}
