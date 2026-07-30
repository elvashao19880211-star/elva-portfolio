'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Lightbox from './Lightbox';
import FavoriteButton from './FavoriteButton';
import { addPurchase } from '@/lib/userData';

interface BasePattern {
  id: string;
  title: string;
  type?: 'revival' | 'innovation';
  dynasty?: string;
  era?: string;
  culture?: string;
  elements?: string[];
  structure?: string;
  colors?: string[];
  description: string;
  detail?: string;
  src: string;
  category?: string;
  inspiration?: string;
}

interface PatternDetailProps {
  pattern: BasePattern;
  onClose: () => void;
}

type PurchaseTier = 'personal' | 'commercial' | 'source';

const TIER_CONFIG: Record<PurchaseTier, {
  label: string;
  desc: string;
  getPrice: (isRev: boolean) => string;
  showTier: (isRev: boolean) => boolean;
}> = {
  personal: {
    label: '个人学习 / 临摹',
    desc: '带水印 · 非商业用途',
    getPrice: (r) => r ? '9.9' : '29.9',
    showTier: () => true,
  },
  commercial: {
    label: '标准商业许可',
    desc: '高清无水印 · 不限印刷量 · 非独家',
    getPrice: (r) => r ? '399' : '499',
    showTier: () => true,
  },
  source: {
    label: '源文件企业授权',
    desc: 'PSD源文件 · 修改权 · 永久 · 客服联系发送',
    getPrice: () => '3,999',
    showTier: () => true,
  },
};

export default function PatternDetail({ pattern, onClose }: PatternDetailProps) {
  const [showBuy, setShowBuy] = useState(false);
  const [showPay, setShowPay] = useState(false);
  const [selectedTier, setSelectedTier] = useState<PurchaseTier>('commercial');
  const [showLightbox, setShowLightbox] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [showAuthDoc, setShowAuthDoc] = useState(false);
  const [authData, setAuthData] = useState({ name: '', company: '', purpose: '' });
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [buyerEmail, setBuyerEmail] = useState('');
  const isRevival = pattern.type === 'revival' || !!pattern.dynasty;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleSelectTier = (tier: PurchaseTier) => {
    setSelectedTier(tier);
    setShowBuy(false);
    setShowPay(true);
    setOrderSubmitted(false);
  };

  const handleSubmitOrder = () => {
    if (!buyerEmail.trim()) return;
    const cfg = TIER_CONFIG[selectedTier];
    const price = cfg.getPrice(isRevival);
    addPurchase({
      id: pattern.id,
      title: pattern.title,
      src: pattern.src,
      type: isRevival ? 'revival' : 'innovation',
      tier: selectedTier,
      price: `¥${price}`,
      purchasedAt: Date.now(),
      email: buyerEmail.trim(),
    });
    setOrderSubmitted(true);
  };

  const handleDownload = (clean: boolean = false) => {
    let url = pattern.src;
    if (clean) {
      // 商业/会员下载 → 使用无水印版本
      url = pattern.src.replace('/revival/', '/revival-clean/').replace('/innovation/', '/innovation-clean/');
    }
    const link = document.createElement('a');
    link.href = url;
    link.download = `${pattern.title || '纹样'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getPriceText = (tier: PurchaseTier) => TIER_CONFIG[tier].getPrice(isRevival);
  const getLabelText = (tier: PurchaseTier) => {
    const cfg = TIER_CONFIG[tier];
    const price = cfg.getPrice(isRevival);
    return `${cfg.label} · ¥${price}/幅`;
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <div
          className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col md:flex-row shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 关闭 */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* 左侧：大图 */}
          <div
            className="relative w-full md:w-1/2 min-h-[280px] md:min-h-[460px] bg-stone-50 cursor-zoom-in group"
            onClick={() => setShowLightbox(true)}
          >
            <Image
              src={pattern.src}
              alt={pattern.title}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* 右侧：信息 */}
          <div className="w-full md:w-1/2 p-5 sm:p-7 flex flex-col gap-4 sm:gap-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {pattern.dynasty && (
                  <span className="inline-block px-2.5 py-0.5 text-xs rounded-full bg-gold/20 text-gold font-medium">
                    {pattern.dynasty}{pattern.era ? ` · ${pattern.era}` : ''}
                  </span>
                )}
                {pattern.category && (
                  <span className="inline-block px-2.5 py-0.5 text-xs rounded-full bg-qing/20 text-ink/70">
                    {pattern.category}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-serif font-semibold text-ink">{pattern.title}</h2>
            </div>

            {pattern.structure && (
              <div>
                <h3 className="text-xs font-medium text-gold uppercase tracking-wider mb-1.5">纹样结构</h3>
                <p className="text-gray-700 text-sm">{pattern.structure}</p>
              </div>
            )}

            {pattern.inspiration && (
              <div>
                <h3 className="text-xs font-medium text-gold uppercase tracking-wider mb-1.5">灵感来源</h3>
                <p className="text-gray-700 text-sm">{pattern.inspiration}</p>
              </div>
            )}

            {pattern.culture && (
              <div>
                <h3 className="text-xs font-medium text-gold uppercase tracking-wider mb-1.5">文化背景</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{pattern.culture}</p>
              </div>
            )}

            {pattern.elements && pattern.elements.length > 0 && (
              <div>
                <h3 className="text-xs font-medium text-gold uppercase tracking-wider mb-1.5">构成元素</h3>
                <div className="flex flex-wrap gap-1.5">
                  {pattern.elements.map((el) => (
                    <span key={el} className="inline-block px-2.5 py-1 text-xs rounded-full bg-qing/15 text-ink/70">{el}</span>
                  ))}
                </div>
              </div>
            )}

            {pattern.colors && pattern.colors.length > 0 && (
              <div>
                <h3 className="text-xs font-medium text-gold uppercase tracking-wider mb-1.5">配色</h3>
                <div className="flex flex-wrap gap-1.5">
                  {pattern.colors.map((c) => (
                    <span key={c} className="inline-block px-2.5 py-1 text-xs rounded-full bg-gold/10 text-ink/60">{c}</span>
                  ))}
                </div>
              </div>
            )}

            {pattern.detail && (
              <div>
                <h3 className="text-xs font-medium text-gold uppercase tracking-wider mb-1.5">设计说明</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{pattern.detail}</p>
              </div>
            )}

            {/* 购买流程说明 */}
            <details className="group mt-4">
              <summary className="flex items-center gap-1.5 text-[10px] text-gray-400 cursor-pointer hover:text-gold transition-colors list-none">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>购买流程说明</span>
                <svg className="w-3 h-3 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="mt-2.5 space-y-2.5 text-[11px] leading-relaxed text-ink/70">
                <p><span className="inline-block w-4 h-4 rounded-full bg-gray-100 text-[10px] font-semibold text-gray-500 text-center leading-4 mr-2">1</span>点击「购买授权」，选择许可类型及相应价格</p>
                <p><span className="inline-block w-4 h-4 rounded-full bg-gray-100 text-[10px] font-semibold text-gray-500 text-center leading-4 mr-2">2</span>支付宝扫码支付，备注纹样名称</p>
                <p><span className="inline-block w-4 h-4 rounded-full bg-gray-100 text-[10px] font-semibold text-gray-500 text-center leading-4 mr-2">3</span>支付完成后点击「我已支付」，订单存入个人中心</p>
                <div className="mt-2 pl-6 space-y-1.5">
                  <p className="text-[10px] text-gray-400 mb-1">按许可类型下载：</p>
                  <p className="text-[10px]"><span className="font-medium text-ink/70">个人学习</span> — 直接下载带水印图片</p>
                  <p className="text-[10px]"><span className="font-medium text-ink/70">商业许可</span> — 下载高清无水印原图，并可填写信息生成授权书</p>
                  <p className="text-[10px]"><span className="font-medium text-ink/70">企业授权</span> — 提交订单后由客服联系发送PSD源文件及授权协议</p>
                </div>
              </div>
            </details>

            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={() => setShowBuy(true)}
                className="btn-gold flex-1 text-xs py-2.5"
              >
                购买授权
              </button>
              <FavoriteButton
                item={{
                  id: pattern.id,
                  title: pattern.title,
                  src: pattern.src,
                  type: isRevival ? 'revival' : 'innovation',
                  addedAt: Date.now(),
                }}
                className="p-2 rounded-full hover:bg-red-50 transition-colors"
              />
            </div>
            <p className="text-[10px] text-gray-300 text-center -mt-2">
              免费预览 · 下载高清无水印需购买
            </p>
          </div>
        </div>
      </div>

      {/* ====== 选择版本弹窗 ====== */}
      {showBuy && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowBuy(false)}>
          <div className="bg-white rounded-2xl max-w-sm w-full p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-serif font-semibold text-ink mb-1">购买授权 · {pattern.title}</h3>
            <p className="text-xs text-gray-400 mb-6">按用途选择</p>

            <div className="space-y-3">
              {(Object.entries(TIER_CONFIG) as [PurchaseTier, typeof TIER_CONFIG[PurchaseTier]][]).map(([key, cfg]) => {
                if (!cfg.showTier(isRevival)) return null;
                const price = cfg.getPrice(isRevival);
                return (
                  <div
                    key={key}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedTier === key ? 'border-gold bg-gold/5' : 'border-gray-100 hover:border-gold'}`}
                    onClick={() => handleSelectTier(key)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-ink">{cfg.label}</p>
                        <p className="text-xs text-gray-400">{cfg.desc}</p>
                      </div>
                      <span className="text-lg font-serif font-bold text-gold">¥{price}<span className="text-xs font-normal text-gray-400">/幅</span></span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button onClick={() => setShowBuy(false)} className="btn-outline w-full text-sm mt-6">取消</button>
            <p className="text-[10px] text-gray-500 text-center mt-3 leading-relaxed">
              版权归创作者所有 · 您购买的是使用权许可 · 禁止转卖文件、子授权、注册商标
            </p>
          </div>
        </div>
      )}

      {/* ====== 支付弹窗 ====== */}
      {showPay && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowPay(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl text-center max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <p className="text-xs text-gray-400 mb-1">支付</p>
            <p className="text-xl font-serif font-semibold text-ink mb-2">¥{getPriceText(selectedTier)}/幅</p>
            <p className="text-xs text-gray-500 mb-1">{getLabelText(selectedTier)}</p>
            <p className="text-[10px] text-gray-400 mb-5">订单号：HETU-{Date.now().toString(36).toUpperCase()}</p>

            {/* 买家联系方式 */}
            <div className="mb-4 text-left">
              <label className="text-[11px] text-gray-500 mb-1 block">联系方式（邮箱）</label>
              <input
                type="email"
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
                placeholder="请输入您的邮箱，用于接收文件及授权书"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs text-ink placeholder-gray-300 focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            <div className="bg-gray-50 rounded-xl p-4 inline-block mb-4">
              <img src="/qrcode.png" alt="支付宝付款码" className="w-48 h-48 object-contain" />
            </div>

            {!orderSubmitted ? (
              <>
                <p className="text-xs text-gray-500">请使用支付宝扫码支付</p>
                <p className="text-[10px] text-gray-400 mt-1">支付时请备注纹样名称</p>
                <button
                  onClick={handleSubmitOrder}
                  disabled={!buyerEmail.trim()}
                  className={`inline-flex items-center gap-2 px-6 py-2.5 mt-4 rounded-xl text-sm font-medium transition-colors shadow-md
                    ${buyerEmail.trim()
                      ? 'bg-gold text-white hover:bg-amber-600'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  我已支付
                </button>
              </>
            ) : selectedTier === 'source' ? (
              {/* ====== 源文件企业授权 → 客服发送 ====== */}
              <div className="mt-4 px-4 py-5 rounded-xl bg-amber-50 border border-amber-200 text-center space-y-3">
                <svg className="w-8 h-8 text-amber-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-sm font-semibold text-ink">订单已提交</p>
                <p className="text-xs text-gray-500">确认支付后，PSD源文件及企业授权协议将发送至您填写的邮箱</p>
                <p className="text-[10px] text-gray-400">{buyerEmail}</p>
                <p className="text-[10px] text-gray-300">如有疑问请联系 hetu@hetu-pattern.com</p>
              </div>
            ) : selectedTier === 'commercial' ? (
              /* ====== 商业许可 ====== */
              <div className="mt-4 space-y-3">
                <div className="px-4 py-3 rounded-xl bg-qing/5 border border-qing/20 text-center">
                  <svg className="w-8 h-8 text-qing mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-semibold text-ink">支付确认成功</p>
                  <p className="text-[10px] text-gray-500 mt-1">已记录至「个人中心」</p>
                </div>
                <button onClick={() => handleDownload(true)} className="w-full py-3 rounded-xl bg-qing text-white text-sm font-semibold hover:bg-qing/90 transition-colors shadow-md flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  下载高清无水印图
                </button>
                <button
                  onClick={() => setShowAuthForm(true)}
                  className="w-full py-3 rounded-xl border-2 border-gold text-gold text-sm font-semibold hover:bg-gold/5 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  填写信息 · 生成授权书
                </button>
              </div>
            ) : (
              /* ====== 个人学习 → 直接下载（带水印） ====== */
              <div className="mt-4 space-y-3">
                <div className="px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-center">
                  <svg className="w-8 h-8 text-green-500 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-semibold text-ink">支付确认成功</p>
                  <p className="text-[10px] text-gray-500 mt-1">已记录至「个人中心」</p>
                </div>
                <button onClick={handleDownload} className="w-full py-3 rounded-xl bg-qing text-white text-sm font-semibold hover:bg-qing/90 transition-colors shadow-md flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  下载图片（带水印）
                </button>
                <p className="text-[10px] text-gray-400">水印仅供参考学习，不含商业使用权</p>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-[10px] text-gray-500 leading-relaxed">
                版权归创作者所有 · 购买即同意授权条款<br />
                禁止转卖文件、子授权、注册商标<br />
                如发现将纹样注册商标，授权自动终止并保留追诉权利
              </p>
            </div>

            <button onClick={() => setShowPay(false)} className="btn-outline w-full text-xs mt-4">返回</button>
          </div>
        </div>
      )}

      {/* ====== 授权书填写表单 ====== */}
      {showAuthForm && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowAuthForm(false)}>
          <div className="bg-white rounded-2xl max-w-sm w-full p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-serif font-semibold text-ink mb-1">授权书信息</h3>
            <p className="text-xs text-gray-400 mb-6">请填写被授权方信息</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">被授权人姓名 / 公司名称 *</label>
                <input
                  type="text"
                  value={authData.name}
                  onChange={(e) => setAuthData({ ...authData, name: e.target.value })}
                  placeholder="个人姓名或企业全称"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-gold transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">统一社会信用代码（企业选填）</label>
                <input
                  type="text"
                  value={authData.company}
                  onChange={(e) => setAuthData({ ...authData, company: e.target.value })}
                  placeholder="企业信用代码"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-gold transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">用途说明</label>
                <textarea
                  value={authData.purpose}
                  onChange={(e) => setAuthData({ ...authData, purpose: e.target.value })}
                  placeholder="如：布料印花、包装设计、产品贴图等"
                  rows={2}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-gold transition-colors resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAuthForm(false)}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  if (!authData.name.trim()) return;
                  setShowAuthForm(false);
                  setShowAuthDoc(true);
                }}
                disabled={!authData.name.trim()}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  authData.name.trim()
                    ? 'bg-gold text-white hover:bg-amber-600'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                生成授权书
              </button>
            </div>

            <p className="text-[10px] text-gray-400 text-center mt-4">
              填写后点击"生成"，即可获得个性化授权书
            </p>
          </div>
        </div>
      )}

      {/* ====== 授权书展示 ====== */}
      {showAuthDoc && (
        <AuthorizationDoc
          pattern={pattern}
          price={getPriceText('commercial')}
          authData={authData}
          onClose={() => setShowAuthDoc(false)}
        />
      )}

      {/* 放大查看 */}
      {showLightbox && (
        <Lightbox src={pattern.src} title={pattern.title} onClose={() => setShowLightbox(false)} />
      )}
    </>
  );
}

/* ========== 授权书组件 ========== */
function AuthorizationDoc({
  pattern,
  price,
  authData,
  onClose,
}: {
  pattern: BasePattern;
  price: string;
  authData: { name: string; company: string; purpose: string };
  onClose: () => void;
}) {
  const today = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  const authId = `HETU-${pattern.id.slice(0, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="text-center mb-6">
          <h2 className="text-xl font-serif font-bold text-ink mb-1">纹样使用授权书</h2>
          <p className="text-xs text-gray-400">Certificate of Pattern Usage Authorization</p>
        </div>

        <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
          <div className="bg-qing/5 rounded-xl p-4 border border-qing/10 space-y-1">
            <p><span className="font-semibold">授权编号：</span>{authId}</p>
            <p><span className="font-semibold">授权日期：</span>{today}</p>
            <p><span className="font-semibold">授权方：</span>合图纹样工作室</p>
          </div>

          <div className="bg-gold/5 rounded-xl p-4 border border-gold/10 space-y-1">
            <p className="text-xs text-gold font-semibold mb-2">被授权方</p>
            <p><span className="font-semibold">名称：</span>{authData.name}</p>
            {authData.company && <p><span className="font-semibold">统一社会信用代码：</span>{authData.company}</p>}
          </div>

          <p>
            兹授权 <span className="font-semibold text-ink">{authData.name}</span> 在以下范围内使用本平台提供的纹样作品：
          </p>

          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <p><span className="font-semibold">作品名称：</span>{pattern.title}</p>
            <p><span className="font-semibold">作品类型：</span>{pattern.type === 'revival' || pattern.dynasty ? '复原纹样' : '创新纹样'}</p>
            <p><span className="font-semibold">授权类型：</span>标准商业许可（非独家）</p>
            <p><span className="font-semibold">授权费用：</span>¥{price}</p>
            {authData.purpose && <p><span className="font-semibold">用途：</span>{authData.purpose}</p>}
          </div>

          <div>
            <h4 className="font-semibold text-ink mb-2">授权范围：</h4>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>可用于产品印刷、包装设计、布料印花等商业用途</li>
              <li>不限印刷数量 · 不限使用次数</li>
              <li>可用于自有品牌产品，不限制产品品类</li>
              <li>可在社交媒体、电商平台展示含有本纹样的产品</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-ink mb-2">禁止事项：</h4>
            <ul className="list-disc pl-5 space-y-1 text-xs text-red-600">
              <li>禁止将纹样文件转卖、转授权给第三方</li>
              <li>禁止将纹样以子授权形式分发</li>
              <li>禁止将纹样注册为商标</li>
              <li>禁止声称拥有该纹样的著作权</li>
            </ul>
          </div>

          <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 text-xs">
            <p className="font-semibold text-amber-800 mb-1">⚠️ 重要提示</p>
            <p className="text-amber-700">
              本授权为非独占许可，著作权归合图纹样工作室所有。如发现将纹样注册商标的行为，
              本授权自动终止，工作室保留追诉权利。
            </p>
          </div>

          <div className="text-center pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between mt-3">
              <div className="text-left text-xs text-gray-500">
                <p>授权方：合图纹样工作室</p>
                <p>日期：{today}</p>
              </div>
              <div className="w-24 h-24 rounded-full border-2 border-red-400 flex items-center justify-center bg-red-50/30 select-none">
                <div className="text-center">
                  <p className="text-[10px] text-red-600/80 font-serif leading-tight">合图纹样</p>
                  <p className="text-[8px] text-red-500/60">HETU PATTERN</p>
                  <p className="text-[8px] text-red-400/50 mt-0.5">授权专用章</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => window.print()}
            className="flex-1 py-3 rounded-xl bg-gold text-white text-sm font-semibold hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            打印授权书
          </button>
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-colors">
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
