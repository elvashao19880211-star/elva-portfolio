'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '../../components/Breadcrumb';
import { getFavorites, getPurchases, type FavoriteItem, type PurchaseItem } from '@/lib/userData';

export default function AccountPage() {
  const [user, setUser] = useState<{ nickname: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [purchases, setPurchases] = useState<PurchaseItem[]>([]);

  useEffect(() => {
    fetch('/api/auth/session')
      .then((r) => r.json())
      .then((d) => {
        if (d.user) setUser(d.user);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    setFavorites(getFavorites());
    setPurchases(getPurchases());
  }, []);

  const refreshData = () => {
    setFavorites(getFavorites());
    setPurchases(getPurchases());
  };

  return (
    <main className="min-h-screen px-4 sm:px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <Breadcrumb crumbs={[{ label: '首页', href: '/' }, { label: '个人中心' }]} />
      </div>

      <div className="max-w-4xl mx-auto">
        {/* 用户信息卡片 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-qing to-gold flex items-center justify-center text-white text-xl font-serif font-bold">
              {user ? user.nickname.charAt(0).toUpperCase() : '?'}
            </div>
            <div>
              <h2 className="text-xl font-serif font-semibold text-ink">
                {loading ? '加载中...' : user ? user.nickname : '未登录'}
              </h2>
              {!loading && !user && (
                <p className="text-sm text-gray-400 mt-1">
                  请
                  <Link href="/login" className="text-gold hover:underline mx-1">注册/登录</Link>
                  以使用完整功能
                </p>
              )}
            </div>
            <div className="ml-auto flex gap-3">
              <Link
                href="/account/favorites"
                className="px-4 py-2 rounded-xl bg-red-50 text-red-500 text-sm font-medium hover:bg-red-100 transition-colors flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                我的收藏 ({favorites.length})
              </Link>
            </div>
          </div>
        </div>

        {/* 已购纹样 */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-serif font-semibold text-ink">已购纹样</h3>
            <span className="text-xs text-gray-400">{purchases.length} 件</span>
          </div>

          {purchases.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-10 text-center">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p className="text-sm text-gray-400 mb-1">暂无购买记录</p>
              <Link href="/patterns" className="text-xs text-qing hover:underline">去纹样库看看 →</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {purchases.map((item) => (
                <div
                  key={`${item.id}-${item.tier}`}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group"
                >
                  <div className="relative w-full aspect-square bg-stone-50">
                    <Image src={item.src} alt={item.title} fill className="object-cover" sizes="25vw" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] rounded-full bg-gold text-white font-medium shadow-sm">
                      {item.tier === 'personal' ? '个人' : item.tier === 'commercial' ? '商业' : '企业'}
                    </span>
                  </div>
                  <div className="p-3">
                    <h4 className="text-xs font-medium text-ink truncate">{item.title}</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {item.price} · {new Date(item.purchasedAt).toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 快捷入口 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/account/favorites"
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:border-red-200 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5 text-red-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-ink">我的收藏</p>
                <p className="text-[11px] text-gray-400">{favorites.length} 件 · 支持合并付款</p>
              </div>
            </div>
          </Link>

          <Link
            href="/member"
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:border-gold transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-ink">会员中心</p>
                <p className="text-[11px] text-gray-400">素材库订阅 · 权益管理</p>
              </div>
            </div>
          </Link>

          <Link
            href="/patterns"
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:border-qing transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-qing/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5 text-qing" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5" />
                  <path d="M3 9h18M9 3v18" strokeWidth="1" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-ink">纹样库</p>
                <p className="text-[11px] text-gray-400">浏览更多纹样作品</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
