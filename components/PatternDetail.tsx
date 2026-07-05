'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

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

export default function PatternDetail({ pattern, onClose }: PatternDetailProps) {
  const [showBuy, setShowBuy] = useState(false);
  const [showPay, setShowPay] = useState(false);
  const [selectedTier, setSelectedTier] = useState('commercial');
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

  const handleBuy = () => {
    setShowBuy(true);
  };

  const handleSelectTier = (tier: string) => {
    setSelectedTier(tier);
    setShowBuy(false);
    setShowPay(true);
  };

  const getPriceText = (tier: string) => {
    if (tier === 'personal') return isRevival ? '9.9' : '29.9';
    if (tier === 'commercial') return isRevival ? '399' : '499';
    return '3,999';
  };

  const getLabelText = (tier: string) => {
    if (tier === 'personal') return isRevival ? '个人学习/临摹 · 带水印 · ¥9.9' : '个人学习/临摹 · 带水印 · ¥29.9';
    if (tier === 'commercial') return isRevival ? '标准商业许可 · 高清PNG · ¥399' : '标准商业许可 · 高清PNG · ¥499';
    return '源文件企业授权 · PSD+修改权 · ¥4,999';
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
          <div className="relative w-full md:w-1/2 min-h-[280px] md:min-h-[460px] bg-stone-50">
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
            {/* 标签 + 标题 */}
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
                {pattern.structure && (
                  <span className="inline-block px-2.5 py-0.5 text-xs rounded-full bg-gray-100 text-ink/50">
                    {pattern.structure}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-serif font-semibold text-ink">{pattern.title}</h2>
            </div>

            {/* 灵感来源 */}
            {pattern.inspiration && (
              <div>
                <h3 className="text-xs font-medium text-gold uppercase tracking-wider mb-1.5">灵感来源</h3>
                <p className="text-gray-700 text-sm">{pattern.inspiration}</p>
              </div>
            )}

            {/* 文化背景 */}
            {pattern.culture && (
              <div>
                <h3 className="text-xs font-medium text-gold uppercase tracking-wider mb-1.5">文化背景</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{pattern.culture}</p>
              </div>
            )}

            {/* 元素 */}
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

            {/* 颜色 */}
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

            {/* 设计说明 */}
            {pattern.detail && (
              <div>
                <h3 className="text-xs font-medium text-gold uppercase tracking-wider mb-1.5">设计说明</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{pattern.detail}</p>
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex gap-3 mt-auto pt-4 border-t border-gray-100">
              <button
                onClick={handleBuy}
                className="btn-gold flex-1 text-xs py-2.5"
              >
                购买授权
              </button>
            </div>
            <p className="text-[10px] text-gray-200 text-center -mt-2">
              免费预览 · 下载高清无水印需购买
            </p>
          </div>
        </div>
      </div>

      {/* 选择版本弹窗 */}
      {showBuy && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowBuy(false)}>
          <div className="bg-white rounded-2xl max-w-sm w-full p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-serif font-semibold text-ink mb-1">购买授权 · {pattern.title}</h3>
            <p className="text-xs text-gray-400 mb-6">按用途选择</p>

            <div className="space-y-3">
              {/* 个人学习 */}
              <div
                className="p-4 rounded-xl border-2 cursor-pointer transition-all border-gray-100 hover:border-gold"
                onClick={() => handleSelectTier('personal')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink">个人学习 / 临摹</p>
                    <p className="text-xs text-gray-400">带水印 · 非商业用途</p>
                  </div>
                  <span className="text-lg font-serif font-bold text-gold">¥{isRevival ? '9.9' : '29.9'}</span>
                </div>
              </div>

              {/* 商业许可 */}
              <div
                className="p-4 rounded-xl border-2 cursor-pointer transition-all border-gold bg-gold/5"
                onClick={() => handleSelectTier('commercial')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink">标准商业许可</p>
                    <p className="text-xs text-gray-400">高清无水印 · 不限印刷量 · 非独家</p>
                  </div>
                  <span className="text-lg font-serif font-bold text-gold">¥{isRevival ? '399' : '499'}</span>
                </div>
              </div>

              {/* 源文件（仅创新纹样） */}
              {!isRevival && (
                <div
                  className="p-4 rounded-xl border-2 cursor-pointer transition-all border-gray-100 hover:border-gold"
                  onClick={() => handleSelectTier('source')}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-ink">源文件企业授权</p>
                      <p className="text-xs text-gray-400">PSD源文件 · 修改权 · 永久</p>
                    </div>
                    <span className="text-lg font-serif font-bold text-gold">¥3,999</span>
                  </div>
                </div>
              )}
            </div>

            <button onClick={() => setShowBuy(false)} className="btn-outline w-full text-sm mt-6">取消</button>
            <p className="text-[10px] text-gray-300 text-center mt-3 leading-relaxed">
              版权归创作者所有 · 您购买的是使用权许可 · 禁止转卖文件、子授权、注册商标
            </p>
          </div>
        </div>
      )}

      {/* 支付弹窗 — 支付宝扫码 */}
      {showPay && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowPay(false)}>
          <div className="bg-white rounded-2xl max-w-sm w-full p-8 shadow-2xl text-center" onClick={(e) => e.stopPropagation()}>
            <p className="text-xs text-gray-400 mb-1">支付</p>
            <p className="text-xl font-serif font-semibold text-ink mb-2">¥{getPriceText(selectedTier)}</p>
            <p className="text-xs text-gray-500 mb-5">{getLabelText(selectedTier)}</p>

            <div className="bg-gray-50 rounded-xl p-4 inline-block mb-4">
              <img src="/qrcode.png" alt="支付宝付款码" className="w-48 h-48 object-contain" />
            </div>

            <p className="text-xs text-gray-400">请使用支付宝扫码支付</p>
            <p className="text-[10px] text-gray-300 mt-1">支付后请联系客服发送文件</p>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-[10px] text-gray-300 leading-relaxed">
                版权归创作者所有 · 购买即同意授权条款<br />
                禁止转卖文件、子授权、注册商标<br />
                如发现将纹样注册商标，授权自动终止并保留追诉权利
              </p>
            </div>

            <button onClick={() => setShowPay(false)} className="btn-outline w-full text-xs mt-4">返回</button>
          </div>
        </div>
      )}
    </>
  );
}