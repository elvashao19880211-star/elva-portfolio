'use client';

import { useState, useEffect } from 'react';

/**
 * 回到顶部按钮
 * 页面滚动超过一定距离后出现，点击平滑回到顶部
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollTop}
      aria-label="回到顶部"
      className="fixed bottom-24 right-6 z-40 w-11 h-11 rounded-full bg-white border border-gray-200 text-ink/60 shadow-lg hover:text-qing hover:border-qing/40 hover:shadow-qing/20 transition-all flex items-center justify-center animate-slideDown"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
}
