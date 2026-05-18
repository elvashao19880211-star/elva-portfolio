'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';

const NAV_LINKS = [
  { label: '首页', href: '/' },
  { label: '纹样库', href: '/patterns' },
  { label: '素材库', href: '/materials' },
  { label: '会员', href: '/member' },
  { label: '复原记录', href: '/heritage' },
  { label: '交流区', href: '/community' },
  { label: 'AI 纹样', href: '/ai-gen' },
  { label: '企业合作', href: '/cooperation' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-20">
        {/* Logo */}
        <a href="/" className="shrink-0">
          <img
            src="/logo/logo-horizontal.svg"
            alt="河图"
            className="h-9 sm:h-10 w-auto"
          />
        </a>

        {/* 桌面导航 */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`relative px-4 py-2 text-sm rounded-full transition-all duration-200 ${
                    isActive
                      ? 'text-gold font-medium'
                      : 'text-gray-500 hover:text-ink hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-gold" />
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        {/* 用户区域 */}
        <div className="hidden md:flex items-center">
          <a
            href="/login"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors group"
            title="登录 / 注册"
          >
            <svg className="w-5 h-5 text-gray-400 group-hover:text-ink transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </a>
        </div>

        {/* 手机菜单按钮 */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="菜单"
        >
          <span
            className={`block w-5 h-0.5 rounded bg-ink transition-all duration-300 ${
              mobileOpen ? 'rotate-45 translate-y-1' : ''
            }`}
          />
          <span
            className={`block w-5 h-0.5 rounded bg-ink transition-all duration-300 ${
              mobileOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block w-5 h-0.5 rounded bg-ink transition-all duration-300 ${
              mobileOpen ? '-rotate-45 -translate-y-1' : ''
            }`}
          />
        </button>
      </div>

      {/* 手机下拉菜单 */}
      {mobileOpen && (
        <div className="md:hidden animate-slideDown">
          <div className="px-6 pb-4 pt-2 space-y-1 bg-white border-t border-gray-100">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm transition-all ${
                  isActive
                    ? 'bg-gold/10 text-gold font-medium'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-ink'
                }`}
              >
                {link.label}
              </a>
            );
          })}
          <hr className="my-2 border-gray-100" />
          <a
            href="/login"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-gray-50 hover:text-ink"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            登录 / 注册
          </a>
        </div>
      </div>
      )}
    </nav>
  );
}
