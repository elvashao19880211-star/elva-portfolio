'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface BasePattern {
  id: string;
  title: string;
  dynasty?: string;
  era?: string;
  culture?: string;
  elements?: string[];
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
  const [buyOption, setBuyOption] = useState<'hd' | 'vector' | 'commercial'>('hd');
  const [paySuccess, setPaySuccess] = useState(false);

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

  const handleDownload = () => {
    // 模拟下载
    const a = document.createElement('a');
    a.href = pattern.src;
    a.download = `${pattern.title}.png`;
    a.click();
  };

  const handleBuy = () => {
    setShowBuy(true);
  };

  const handlePay = () => {
    setShowBuy(false);
    setPaySuccess(true);
    setTimeout(() => setPaySuccess(false), 2000);
  };

  const prices = { hd: 9.9, vector: 29.9, commercial: 99 };
  const labels = {
    hd: '高清版 · 1920px · ¥9.9',
    vector: '高清+矢量 · 3840px+EPS · ¥29.9',
    commercial: '商用完整版 · 源文件+授权 · ¥99',
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
            {/* 水印 */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
              <div className="text-white/20 text-4xl font-serif font-bold rotate-[-30deg] tracking-[0.3em]">
                河图预览
              </div>
            </div>
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
                onClick={handleDownload}
                className="btn-outline flex-1 text-xs py-2.5"
              >
                下载水印版
              </button>
              <button
                onClick={handleBuy}
                className="btn-gold flex-1 text-xs py-2.5"
              >
                购买高清版
              </button>
            </div>
            <p className="text-[10px] text-gray-200 text-center -mt-2">
              免费预览 · 下载高清无水印需购买
            </p>
          </div>
        </div>
      </div>

      {/* 购买弹窗 */}
      {showBuy && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowBuy(false)}>
          <div className="bg-white rounded-2xl max-w-sm w-full p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="heading-3 text-ink mb-2">购买 {pattern.title}</h3>
            <p className="body-sm text-gray-400 mb-6">选择下载版本</p>

            <div className="space-y-3">
              {( ['hd', 'vector', 'commercial'] as const).map((opt) => (
                <div
                  key={opt}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    buyOption === opt ? 'border-qing bg-qing/5' : 'border-gray-100 hover:border-gray-200'
                  }`}
                  onClick={() => setBuyOption(opt)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-ink">{labels[opt].split('·')[0].trim()}</p>
                      <p className="text-xs text-gray-400">{labels[opt].split('·').slice(1).join('·')}</p>
                    </div>
                    <span className="text-lg font-serif font-bold text-gold">¥{prices[opt]}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowBuy(false)} className="btn-outline flex-1 text-sm">取消</button>
              <button onClick={handlePay} className="btn-ink flex-1 text-sm">支付 ¥{prices[buyOption]}</button>
            </div>
            <p className="text-[10px] text-gray-300 text-center mt-4">（演示模式 · 支付接口待接入）</p>
          </div>
        </div>
      )}

      {/* Toast */}
      {paySuccess && (
        <div className="fixed top-24 right-6 z-[70] bg-white rounded-xl shadow-lg border border-green-100 p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-ink">购买成功！</p>
            <p className="text-xs text-gray-400">高清文件已加入你的下载中心</p>
          </div>
        </div>
      )}
    </>
  );
}
