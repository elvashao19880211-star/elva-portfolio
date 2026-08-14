'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Breadcrumb from '../../components/Breadcrumb';
import { getFavorites, getPurchases, type FavoriteItem, type PurchaseItem } from '@/lib/userData';

function mergePurchases(server: PurchaseItem[], local: PurchaseItem[]): PurchaseItem[] {
  const map = new Map<string, PurchaseItem>();
  for (const p of server) map.set(`${p.id}-${p.tier}`, p);
  for (const p of local) {
    const key = `${p.id}-${p.tier}`;
    if (!map.has(key)) map.set(key, p);
  }
  return Array.from(map.values()).sort((a, b) => b.purchasedAt - a.purchasedAt);
}

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

    // 已购：服务端权威 + localStorage 兜底合并
    const local = getPurchases();
    fetch('/api/purchases')
      .then((r) => r.json())
      .then((d) => {
        const server: PurchaseItem[] = Array.isArray(d.purchases) ? d.purchases : [];
        setPurchases(mergePurchases(server, local));
      })
      .catch(() => setPurchases(local));
  }, []);

  return (
    <main className="min-h-screen bg-[#F5F3EE] px-4 sm:px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <Breadcrumb crumbs={[{ label: '首页', href: '/' }, { label: '个人中心' }]} />
      </div>

      <div className="max-w-6xl mx-auto mt-6 flex flex-col lg:flex-row gap-6">
        {/* ========== 左侧边栏 ========== */}
        <aside className="lg:w-56 shrink-0">
          {/* 用户卡片 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-qing to-gold flex items-center justify-center text-white text-2xl font-serif font-bold mb-3 shadow-sm">
                {user ? user.nickname.charAt(0).toUpperCase() : '?'}
              </div>
              <h3 className="text-sm font-semibold text-ink">
                {loading ? '加载中...' : user ? user.nickname : '未登录'}
              </h3>
              {!loading && !user && (
                <Link href="/login" className="text-xs text-gold hover:underline mt-1">
                  登录/注册 →
                </Link>
              )}
            </div>

            {/* 统计 */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-50">
              <div className="text-center">
                <p className="text-lg font-bold text-ink">{purchases.length}</p>
                <p className="text-[10px] text-gray-400">已购</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-ink">{favorites.length}</p>
                <p className="text-[10px] text-gray-400">收藏</p>
              </div>
            </div>
          </div>

          {/* 菜单 */}
          <nav className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <SidebarMenuItem
              href="/account"
              icon={<HomeIcon />}
              label="个人中心概览"
              active
            />
            <SidebarMenuItem
              href="/account/favorites"
              icon={<HeartIcon />}
              label="我的收藏"
              count={favorites.length}
            />
            <SidebarMenuItem
              href="/member"
              icon={<ShieldIcon />}
              label="会员中心"
            />
            <SidebarMenuItem
              href="/patterns"
              icon={<GridIcon />}
              label="纹样库"
            />
          </nav>
        </aside>

        {/* ========== 右侧内容区 ========== */}
        <div className="flex-1 space-y-6">
          {/* 已购纹样 */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-ink flex items-center gap-2">
                <svg className="w-5 h-5 text-qing" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                已购纹样
              </h3>
              <span className="text-xs text-gray-400">{purchases.length} 件</span>
            </div>

            {purchases.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-50 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <p className="text-sm text-gray-400">暂无购买记录</p>
                <Link href="/patterns" className="text-xs text-qing hover:underline mt-2 inline-block">
                  去纹样库看看 →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {purchases.map((item) => (
                  <Link
                    key={`${item.id}-${item.tier}`}
                    href={`/patterns/${item.type}/${encodeURIComponent(item.title)}`}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <div className="relative w-16 h-16 rounded-lg bg-stone-50 overflow-hidden shrink-0">
                      <Image src={item.src} alt={item.title} fill className="object-cover" sizes="64px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-ink truncate group-hover:text-qing transition-colors">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          item.tier === 'personal' ? 'bg-blue-50 text-blue-500' :
                          item.tier === 'commercial' ? 'bg-gold/10 text-gold' :
                          'bg-purple-50 text-purple-500'
                        }`}>
                          {item.tier === 'personal' ? '个人非商用' : item.tier === 'commercial' ? '商业许可' : '企业授权'}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(item.purchasedAt).toLocaleDateString('zh-CN')}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-gold">{item.price}</p>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          const link = document.createElement('a');
                          link.href = item.src;
                          link.download = `${item.title}.png`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        className="text-[10px] text-qing hover:underline mt-0.5"
                      >
                        再次下载
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* 快捷入口 */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
            <h3 className="text-base font-semibold text-ink mb-4">快捷入口</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <QuickLink
                href="/account/favorites"
                icon={<HeartIcon className="w-5 h-5" />}
                title="我的收藏"
                desc={`${favorites.length} 件 · 合并付款`}
                color="red"
              />
              <QuickLink
                href="/member"
                icon={<ShieldIcon className="w-5 h-5" />}
                title="会员中心"
                desc="素材订阅 · 权益"
                color="gold"
              />
              <QuickLink
                href="/patterns"
                icon={<GridIcon className="w-5 h-5" />}
                title="纹样库"
                desc="浏览全部作品"
                color="qing"
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

/* ====== 辅助组件 ====== */

function SidebarMenuItem({ href, icon, label, count, active }: {
  href: string;
  icon: React.ReactNode;
  label: string;
  count?: number;
  active?: boolean;
}) {
  const pathname = usePathname();
  const isActive = active ?? (pathname === href);

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors
        ${isActive
          ? 'bg-qing/5 text-qing font-medium border-r-[3px] border-qing'
          : 'text-gray-600 hover:bg-gray-50 border-r-[3px] border-transparent'
        }`}
    >
      <span className={isActive ? 'text-qing' : 'text-gray-400'}>{icon}</span>
      <span>{label}</span>
      {count !== undefined && count > 0 && (
        <span className="ml-auto bg-red-500 text-white text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
          {count}
        </span>
      )}
    </Link>
  );
}

function QuickLink({ href, icon, title, desc, color }: {
  href: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: 'red' | 'gold' | 'qing';
}) {
  const bgMap = { red: 'bg-red-50', gold: 'bg-gold/10', qing: 'bg-qing/10' };
  const textMap = { red: 'text-red-400', gold: 'text-gold', qing: 'text-qing' };

  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group"
    >
      <div className={`w-10 h-10 rounded-xl ${bgMap[color]} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
        <span className={textMap[color]}>{icon}</span>
      </div>
      <div>
        <p className="text-sm font-medium text-ink">{title}</p>
        <p className="text-[11px] text-gray-400">{desc}</p>
      </div>
    </Link>
  );
}

/* ====== 图标 ====== */
function HomeIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'w-4 h-4'} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'w-4 h-4'} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function GridIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'w-4 h-4'} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth={1.5} />
      <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth={1.5} />
      <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth={1.5} />
      <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth={1.5} />
    </svg>
  );
}
