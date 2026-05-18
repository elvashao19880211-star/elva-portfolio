'use client';

import { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import SectionTitle from '../../components/SectionTitle';
import {
  DYNASTY_OPTIONS,
  STRUCTURE_OPTIONS,
  MAIN_MOTIF_OPTIONS,
  SECONDARY_MOTIF_OPTIONS,
  BORDER_OPTIONS,
  COLOR_OPTIONS,
  GENERATION_PLANS,
  DEFAULT_CREDITS,
} from './data';

export default function AIGenPage() {
  const [credits, setCredits] = useState(DEFAULT_CREDITS);
  const [selectedDynasty, setSelectedDynasty] = useState<string | null>(null);
  const [selectedStructure, setSelectedStructure] = useState<string | null>(null);
  const [selectedMain, setSelectedMain] = useState<string | null>(null);
  const [selectedSecondary, setSelectedSecondary] = useState<string | null>(null);
  const [selectedBorder, setSelectedBorder] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [showPurchase, setShowPurchase] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  const isReady = selectedDynasty && selectedMain && selectedColor;

  const handleGenerate = async () => {
    if (credits < 1) { setShowPurchase(true); return; }
    if (!isReady) return;

    setIsGenerating(true);
    setResult(null);
    setCredits((c) => c - 1);

    // 模拟生成
    await new Promise((r) => setTimeout(r, 2500));
    setResult('/images/placeholder.png');
    setIsGenerating(false);
  };

  useEffect(() => {
    if (purchaseSuccess) {
      const timer = setTimeout(() => setPurchaseSuccess(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [purchaseSuccess]);

  const handleBuyPlan = (planId: string) => {
    setSelectedPlan(planId);
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = () => {
    const plan = GENERATION_PLANS.find((p) => p.id === selectedPlan);
    if (plan) setCredits((c) => c + plan.credits);
    setShowPaymentModal(false);
    setShowPurchase(false);
    setPurchaseSuccess(true);
  };

  // 通用的选择区块组件
  function OptionGroup({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6">
        <h3 className="heading-4 mb-3">{title}</h3>
        {children}
      </div>
    );
  }

  return (
    <main className="min-h-screen px-4 sm:px-6 py-12">
      <Breadcrumb crumbs={[{ label: '首页', href: '/' }, { label: 'AI 纹样生成' }]} />
      <SectionTitle
        title="AI 纹样生成"
        subtitle="配置纹样的每一个细节 —— 从朝代风格到配色方案，由你掌控"
      />

      {/* 余额条 */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-qing/15 flex items-center justify-center">
            <svg className="w-5 h-5 text-qing" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-400">可用次数</p>
            <p className="text-base font-serif font-semibold text-ink">{credits} <span className="text-xs font-normal text-gray-400 font-sans">次</span></p>
          </div>
        </div>
        <button onClick={() => setShowPurchase(true)} className="btn-gold text-xs sm:text-sm">
          购买次数
        </button>
      </div>

      {/* 左：配置 · 右：结果 */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 左：配置区 */}
        <div className="lg:col-span-2 space-y-4">

          {/* ⑦ 自由描述 → 提到最前面，变最显眼 */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-5 h-5 rounded-md bg-qing text-white flex items-center justify-center text-xs font-bold">✏</span>
              <h3 className="heading-4 text-ink">纹样描述</h3>
              <span className="text-[10px] text-gray-300 font-sans font-normal">（核心 · 越详细越精准）</span>
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`描述你想要的纹样，越详细越好。\n\n示例：「唐代联珠纹框架，双鹿对称而立，周围卷草与云气环绕。绯红底色配金色线条，边框为联珠纹。整体饱满华丽，适合圆形装饰。」`}
              className="w-full h-32 px-4 py-3 rounded-xl border border-gray-200 focus:border-qing focus:ring-1 focus:ring-qing/30 outline-none resize-none text-sm text-gray-600 leading-relaxed transition-all"
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-gray-400">{prompt.length} / 500</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">消耗 1 次</span>
                <button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  className="btn-ink text-xs sm:text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                        <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                      </svg>
                      生成中...
                    </span>
                  ) : (
                    '生成纹样'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* 辅助参数折叠区 */}
          <details className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6 group" open>
            <summary className="cursor-pointer text-sm text-gray-400 hover:text-ink transition-colors select-none flex items-center gap-2">
              <svg className="w-4 h-4 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              高级参数（选填 · 帮助 AI 更精准）
            </summary>
            <div className="mt-5 space-y-4">

              {/* ① 朝代 */}
              <OptionGroup title="朝代风格">
                <div className="flex flex-wrap gap-2">
                  {DYNASTY_OPTIONS.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setSelectedDynasty(d.id === selectedDynasty ? null : d.id)}
                      className={`px-4 py-2 rounded-full text-xs sm:text-sm transition-all duration-200 ${
                        selectedDynasty === d.id
                          ? 'bg-ink text-white shadow-sm'
                          : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-100'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </OptionGroup>

              {/* ② 结构 */}
              <OptionGroup title="纹样结构">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {STRUCTURE_OPTIONS.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedStructure(s.id === selectedStructure ? null : s.id)}
                      className={`text-left p-3 rounded-xl border transition-all duration-200 ${
                        selectedStructure === s.id
                          ? 'border-qing bg-qing/5 shadow-sm'
                          : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                      }`}
                    >
                      <p className="text-sm font-medium text-ink">{s.label}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{s.desc}</p>
                    </button>
                  ))}
                </div>
              </OptionGroup>

              {/* ③ 主纹 */}
              <OptionGroup title="主纹（核心主体）">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {MAIN_MOTIF_OPTIONS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMain(m.id === selectedMain ? null : m.id)}
                      className={`text-left p-3 rounded-xl border transition-all duration-200 ${
                        selectedMain === m.id
                          ? 'border-ink bg-ink/5 shadow-sm'
                          : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                      }`}
                    >
                      <p className="text-sm font-medium text-ink">{m.label}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{m.desc}</p>
                    </button>
                  ))}
                </div>
              </OptionGroup>

              {/* ④ 辅纹 */}
              <OptionGroup title="辅纹（辅助装饰）">
                <div className="flex flex-wrap gap-2">
                  {SECONDARY_MOTIF_OPTIONS.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSecondary(s.id === selectedSecondary ? null : s.id)}
                      className={`text-left px-4 py-2 rounded-full border transition-all duration-200 text-xs sm:text-sm ${
                        selectedSecondary === s.id
                          ? 'border-gold bg-gold/10 text-ink font-medium'
                          : 'border-gray-100 bg-gray-50 text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </OptionGroup>

              {/* ⑤ 边框 */}
              <OptionGroup title="边框">
                <div className="flex flex-wrap gap-2">
                  {BORDER_OPTIONS.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setSelectedBorder(b.id === selectedBorder ? null : b.id)}
                      className={`text-left px-4 py-2 rounded-full border transition-all duration-200 text-xs sm:text-sm ${
                        selectedBorder === b.id
                          ? 'border-qing bg-qing/10 text-ink font-medium'
                          : 'border-gray-100 bg-gray-50 text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </OptionGroup>

              {/* ⑥ 配色 */}
              <OptionGroup title="配色方案">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedColor(c.id === selectedColor ? null : c.id)}
                      className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                        selectedColor === c.id
                          ? 'border-qing bg-qing/5 shadow-sm'
                          : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        {c.colors.map((hex, i) => (
                          <span key={i} className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: hex }} />
                        ))}
                      </div>
                      <p className="text-sm font-medium text-ink">{c.label}</p>
                      <p className="text-[10px] text-gray-400">{c.desc}</p>
                    </button>
                  ))}
                </div>
              </OptionGroup>

            </div>
          </details>

        </div>

        {/* 右：结果 */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 min-h-[300px] lg:min-h-[500px] flex flex-col items-center justify-center lg:sticky lg:top-24">
          {isGenerating ? (
            <div className="text-center">
              <svg className="animate-spin w-12 h-12 text-qing mx-auto mb-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" className="opacity-25" />
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
              <p className="body-md">AI 正在创作...</p>
              <p className="body-sm text-gray-300 mt-1">约 10-20 秒</p>
            </div>
          ) : result ? (
            <div className="text-center w-full">
              <div className="aspect-square bg-stone-50 rounded-xl mb-4 flex items-center justify-center">
                <p className="text-gray-400 text-sm">（纹样生成结果）</p>
              </div>
              <div className="flex gap-2 justify-center">
                <button className="btn-outline text-xs py-1.5 px-4">下载高清</button>
                <button className="btn-gold text-xs py-1.5 px-4" onClick={() => setResult(null)}>重新生成</button>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-300">
              <svg className="w-20 h-20 mx-auto mb-4 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
                <line x1="12" y1="2" x2="12" y2="6" />
                <line x1="12" y1="18" x2="12" y2="22" />
                <line x1="2" y1="12" x2="6" y2="12" />
                <line x1="18" y1="12" x2="22" y2="12" />
              </svg>
              <p className="body-sm">填写纹样描述</p>
              <p className="body-sm">点击生成</p>
              <p className="text-[10px] text-gray-200 mt-2">也可展开高级参数辅助设定</p>
            </div>
          )}
        </div>
      </div>

      {/* ===== 购买弹窗 ===== */}
      {showPurchase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowPurchase(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-3 text-ink">购买生成次数</h2>
              <button onClick={() => setShowPurchase(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {GENERATION_PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    selectedPlan === plan.id ? 'border-qing bg-qing/5' : 'border-gray-100 hover:border-gray-200'
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.badge && (
                    <span className="absolute -top-2.5 right-4 px-3 py-0.5 text-xs rounded-full bg-gold text-white font-medium">
                      {plan.badge}
                    </span>
                  )}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-serif font-semibold text-ink">{plan.name}</h3>
                      <p className="text-sm text-gray-400">{plan.credits} 次生成</p>
                    </div>
                    <p className="text-xl font-serif font-bold text-gold">¥{plan.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleBuyPlan(selectedPlan!)}
              disabled={!selectedPlan}
              className="btn-ink w-full mt-6 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              立即购买
            </button>
          </div>
        </div>
      )}

      {/* ===== 支付确认 ===== */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowPaymentModal(false)}>
          <div className="bg-white rounded-2xl max-w-sm w-full p-8 shadow-2xl text-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-16 h-16 rounded-full bg-qing/10 flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-qing" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="heading-3 text-ink mb-2">确认支付</h3>
            {(() => {
              const plan = GENERATION_PLANS.find((p) => p.id === selectedPlan);
              return plan ? (
                <>
                  <p className="body-md mb-6">{plan.name} · {plan.credits} 次生成 · <span className="text-gold font-semibold">¥{plan.price}</span></p>
                  <div className="flex gap-3">
                    <button onClick={() => setShowPaymentModal(false)} className="btn-outline flex-1 text-sm">取消</button>
                    <button onClick={handleConfirmPayment} className="btn-ink flex-1 text-sm">确认支付</button>
                  </div>
                  <p className="text-[10px] text-gray-300 mt-4">（当前为演示模式，实际支付接口待接入）</p>
                </>
              ) : null;
            })()}
          </div>
        </div>
      )}

      {/* ===== Toast ===== */}
      {purchaseSuccess && (
        <div className="fixed top-24 right-6 z-50 bg-white rounded-xl shadow-lg border border-green-100 p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-ink">购买成功！</p>
            <p className="text-xs text-gray-400">次数已到账，开始创作吧 ✨</p>
          </div>
        </div>
      )}
    </main>
  );
}
