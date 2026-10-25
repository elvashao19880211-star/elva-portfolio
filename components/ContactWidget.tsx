'use client';

import { useState, useEffect } from 'react';

/**
 * 全站悬浮咨询按钮
 * 点击展开联系方式：小红书 + 邮箱（纯前端，无需服务器）
 */
export default function ContactWidget() {
  const [open, setOpen] = useState(false);
  const [showWechat, setShowWechat] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {/* 展开面板 */}
      {open && (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-72 overflow-hidden animate-slideDown">
          {/* 头部 */}
          <div className="bg-qing px-5 py-4 text-white">
            <p className="text-sm font-serif font-semibold">联系我们</p>
            <p className="text-xs text-white/70 mt-0.5">纹样授权 · 定制合作 · 设计咨询</p>
          </div>

          {/* 联系方式列表 */}
          <div className="p-4 space-y-3">
            {/* 小红书 */}
            <a
              href="https://www.xiaohongshu.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl bg-red-50/60 border border-red-100 hover:bg-red-50 transition-colors group"
            >
              <span className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                红
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium text-ink">小红书</p>
                <p className="text-xs text-red-500 truncate">@河图纹画</p>
              </div>
              <svg className="w-4 h-4 text-gray-300 ml-auto shrink-0 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>

            {/* 微信 */}
            <button
              onClick={() => setShowWechat(!showWechat)}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-green-50/60 border border-green-100 hover:bg-green-50 transition-colors group text-left"
            >
              <span className="w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0" style={{ backgroundColor: '#07C160' }}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.7 3C4.9 3 1.8 5.6 1.8 8.8c0 1.8 1 3.4 2.6 4.5l-.7 2.1 2.5-1.3c.7.2 1.5.3 2.3.3h.4c-.1-.4-.2-.9-.2-1.3 0-2.9 2.8-5.2 6.3-5.2h.4C14.8 4.6 11.9 3 8.7 3zM6.3 6.1c.5 0 .9.4.9.9s-.4.9-.9.9-.9-.4-.9-.9.4-.9.9-.9zm4.4 0c.5 0 .9.4.9.9s-.4.9-.9.9-.9-.4-.9-.9.4-.9.9-.9zM15.9 9.4c-3.3 0-6 2.2-6 4.9s2.7 4.9 6 4.9c.7 0 1.4-.1 2-.3l2.2 1.1-.6-1.8c1.4-1 2.3-2.5 2.3-4 0-2.6-2.6-4.8-5.9-4.8zm-2.1 2.4c.4 0 .8.3.8.8 0 .4-.4.8-.8.8-.4 0-.8-.3-.8-.8 0-.4.4-.8.8-.8zm4.2 0c.4 0 .8.3.8.8 0 .4-.4.8-.8.8-.4 0-.8-.3-.8-.8 0-.4.4-.8.8-.8z" />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium text-ink">微信（推荐）</p>
                <p className="text-xs truncate" style={{ color: '#07C160' }}>ElvaHTWH</p>
              </div>
              <svg
                className={`w-4 h-4 text-gray-300 ml-auto shrink-0 transition-transform ${showWechat ? 'rotate-90' : 'group-hover:translate-x-0.5'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* 微信二维码（展开） */}
            {showWechat && (
              <div className="flex flex-col items-center px-3 pb-3 rounded-xl bg-green-50/60 border border-green-100">
                <img
                  src="/images/wechat-qr.webp"
                  alt="微信二维码 ElvaHTWH"
                  className="w-44 h-44 rounded-lg bg-white p-1.5 shadow-sm"
                />
                <p className="text-xs text-gray-500 mt-2 text-center leading-relaxed">
                  扫码添加微信
                  <br />
                  或搜索微信号 <span className="font-medium text-ink">ElvaHTWH</span>
                </p>
              </div>
            )}

            {/* 邮箱 */}
            <a
              href="mailto:studio@hetu-pattern.com"
              className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors group"
            >
              <span className="w-9 h-9 rounded-full bg-qing flex items-center justify-center text-white shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium text-ink">邮箱</p>
                <p className="text-xs text-gray-500 truncate">studio@hetu-pattern.com</p>
              </div>
              <svg className="w-4 h-4 text-gray-300 ml-auto shrink-0 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* 底部提示 */}
          <div className="px-4 pb-4">
            <p className="text-xs text-gray-400 leading-relaxed">
              工作时间：工作日 9:00 - 18:00<br />
              通常 24 小时内回复
            </p>
          </div>
        </div>
      )}

      {/* 悬浮按钮 */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="联系咨询"
        className="relative w-14 h-14 rounded-full bg-qing text-white shadow-lg shadow-qing/30 hover:bg-qing/90 transition-all hover:scale-105 flex items-center justify-center"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>
    </div>
  );
}
