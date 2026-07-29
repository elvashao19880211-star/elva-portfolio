'use client';

import { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import SectionTitle from '../../components/SectionTitle';
import { MEMBER_PLANS, PATTERN_PRICING, ENTERPRISE_SERVICE } from './data';

export default function MemberPage() {
  const [user, setUser] = useState<{ nickname: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPay, setShowPay] = useState(false);
  const [payInfo, setPayInfo] = useState<{ title: string; price: string }>({ title: '', price: '' });

  useEffect(() => {
    fetch('/api/auth/session')
      .then(r => r.json())
      .then(d => {
        if (d.user) setUser(d.user);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleUpgrade = (planId: string) => {
    const plan = MEMBER_PLANS.find(p => p.id === planId);
    if (!plan) return;
    setPayInfo({ title: `${plan.name} · ¥${plan.price}${plan.period}`, price: `¥${plan.price}${plan.period}` });
    setShowPay(true);
  };

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <Breadcrumb crumbs={[{ label: '首页', href: '/' }, { label: '会员中心' }]} />
      </div>
      <SectionTitle title="会员中心" subtitle="素材库会员 · 年付制 · 全年持续上新" />

      {/* 当前状态 */}
      <div className="max-w-4xl mx-auto mb-8 bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center">
            <svg className="w-5 h-5 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-400">当前身份</p>
            {loading ? (
              <p className="text-sm text-gray-300">加载中...</p>
            ) : user ? (
              <p className="text-sm font-medium text-ink">{user.nickname}</p>
            ) : (
              <p className="text-sm text-gray-400">未登录 · 请先注册</p>
            )}
          </div>
        </div>
        {!user && (
          <a href="/login" className="text-xs text-gold hover:underline">注册/登录 →</a>
        )}
      </div>

      {/* 会员方案 */}
      <div className="max-w-4xl mx-auto mb-16">
        <h3 className="text-lg font-serif font-semibold text-ink mb-1 text-center">素材库会员</h3>
        <p className="text-xs text-gray-400 text-center mb-6">唯一订阅制产品 · 纹样作品为单件购买</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-xl mx-auto">
          {MEMBER_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl border-2 p-7 ${
                plan.highlight
                  ? 'border-gold shadow-lg shadow-gold/10'
                  : 'border-gray-100 shadow-sm'
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-2.5 right-4 px-3 py-0.5 text-xs rounded-full text-white bg-gold font-medium">
                  {plan.badge}
                </span>
              )}
              <h4 className="text-base font-serif font-semibold text-ink mb-3">{plan.name}</h4>
              <div className="mb-5">
                <span className="text-3xl font-serif font-bold text-ink">¥{plan.price}</span>
                <span className="text-sm text-gray-400 ml-1">{plan.period}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                    <svg className="w-3.5 h-3.5 text-gold mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleUpgrade(plan.id)}
                className="w-full py-3 rounded-xl text-sm font-semibold transition-all bg-qing text-white hover:bg-qing/90 shadow-md shadow-qing/20 hover:shadow-lg hover:shadow-qing/25 active:scale-[0.98] flex items-center justify-center gap-1.5"
              >
                {plan.cta}
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 纹样作品定价参考 */}
      <div className="max-w-4xl mx-auto mb-16">
        <h3 className="text-lg font-serif font-semibold text-ink mb-1 text-center">纹样作品定价</h3>
        <p className="text-xs text-gray-400 text-center mb-6">非订阅制 · 单件购买 · 在产品页直接下单</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h4 className="text-sm font-serif font-semibold text-ink mb-4">复原纹样</h4>
            <div className="space-y-2 text-xs text-gray-500">
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span>个人学习（带水印）</span>
                <span className="font-medium text-gold">¥{PATTERN_PRICING.revival.personal.price}/幅</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span>标准商业许可（高清）</span>
                <span className="font-medium text-gold">¥{PATTERN_PRICING.revival.commercial.price}/幅</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h4 className="text-sm font-serif font-semibold text-ink mb-4">创新纹样</h4>
            <div className="space-y-2 text-xs text-gray-500">
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span>个人学习（带水印）</span>
                <span className="font-medium text-gold">¥{PATTERN_PRICING.innovation.personal.price}/幅</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span>标准商业许可（高清）</span>
                <span className="font-medium text-gold">¥{PATTERN_PRICING.innovation.commercial.price}/幅</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span>源文件企业授权</span>
                <span className="font-medium text-gold">¥{PATTERN_PRICING.innovation.source.price.toLocaleString()}/幅</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 企业合作 */}
      <div className="max-w-2xl mx-auto mb-16">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <h3 className="text-lg font-serif font-semibold text-ink mb-2">{ENTERPRISE_SERVICE.title}</h3>
          <p className="text-sm text-gray-500 mb-5">{ENTERPRISE_SERVICE.description}</p>
          <p className="text-xs text-gray-400 mb-4">联系邮箱：{ENTERPRISE_SERVICE.contact}</p>
          <a href={`mailto:${ENTERPRISE_SERVICE.contact}`} className="inline-block px-6 py-2.5 bg-gold text-white rounded-xl text-sm font-medium hover:bg-amber-600 transition-colors">
            {ENTERPRISE_SERVICE.cta}
          </a>
        </div>
      </div>

      {/* 支付弹窗 */}
      {showPay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowPay(false)}>
          <div className="bg-white rounded-2xl max-w-sm w-full p-8 shadow-2xl text-center" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-serif font-semibold text-ink mb-1">支付宝扫码支付</h3>
            <p className="text-sm text-gray-500 mb-3">{payInfo.title}</p>
            {/* 金额醒目提示 */}
            <div className="bg-qing/5 border border-qing/20 rounded-xl px-4 py-3 mb-5">
              <p className="text-xs text-qing/70 mb-1">请输入以下金额</p>
              <p className="text-2xl font-bold text-qing tracking-wide">{payInfo.price}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <img src="/qrcode.png" alt="支付宝付款码" className="w-48 h-48 mx-auto" />
            </div>
            <p className="text-xs text-gray-400 mb-3">使用支付宝扫一扫，输入上方金额完成支付</p>
            <p className="text-[10px] text-gray-300 mb-2">支付后请联系客服开通/发送文件</p>
            <div className="mb-5 pt-3 border-t border-gray-100">
              <p className="text-[10px] text-gray-500 leading-relaxed">
                会员有效期365天 · 到期需续费<br />
                到期后已使用的素材可继续使用
              </p>
            </div>
            <button onClick={() => setShowPay(false)} className="btn-outline w-full text-sm">关闭</button>
          </div>
        </div>
      )}
    </main>
  );
}
