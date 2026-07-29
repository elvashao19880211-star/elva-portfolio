'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '../../../components/Breadcrumb';
import { getFavorites, removeFavorite, addPurchase, type FavoriteItem } from '@/lib/userData';

const PRICES: Record<string, Record<string, string>> = {
  revival: { personal: '9.9', commercial: '399' },
  innovation: { personal: '29.9', commercial: '499', source: '3999' },
};

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showPay, setShowPay] = useState(false);
  const [paid, setPaid] = useState(false);
  const [tier, setTier] = useState<'commercial' | 'personal'>('commercial');

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const refresh = () => {
    setFavorites(getFavorites());
    setSelected(new Set());
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === favorites.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(favorites.map((f) => f.id)));
    }
  };

  const selectedItems = useMemo(
    () => favorites.filter((f) => selected.has(f.id)),
    [favorites, selected]
  );

  const totalPrice = useMemo(() => {
    const raw = selectedItems.reduce((sum, item) => {
      const prices = PRICES[item.type] || PRICES.innovation;
      return sum + parseFloat(prices[tier] || prices.commercial);
    }, 0);
    return Math.round(raw * 10) / 10;
  }, [selectedItems, tier]);

  const handleRemove = (id: string) => {
    removeFavorite(id);
    refresh();
  };

  const handlePay = () => {
    if (selectedItems.length === 0) return;
    setShowPay(true);
    setPaid(false);
  };

  const handleConfirmPaid = () => {
    selectedItems.forEach((item) => {
      const prices = PRICES[item.type] || PRICES.innovation;
      addPurchase({
        id: item.id,
        title: item.title,
        src: item.src,
        type: item.type,
        tier,
        price: `¥${prices[tier] || prices.commercial}`,
        purchasedAt: Date.now(),
      });
    });
    selectedItems.forEach((item) => removeFavorite(item.id));
    setPaid(true);
  };

  return (
    <main className="min-h-screen bg-[#F5F3EE] px-4 sm:px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <Breadcrumb crumbs={[
          { label: '首页', href: '/' },
          { label: '个人中心', href: '/account' },
          { label: '我的收藏' },
        ]} />
      </div>

      <div className="max-w-6xl mx-auto mt-6 flex flex-col lg:flex-row gap-6">
        {/* 左侧边栏 */}
        <aside className="lg:w-56 shrink-0">
          <nav className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-6">
            <SideMenuItem href="/account" icon={<HomeIcon />} label="个人中心概览" />
            <SideMenuItem href="/account/favorites" icon={<HeartIcon />} label="我的收藏" count={favorites.length} active />
            <SideMenuItem href="/member" icon={<ShieldIcon />} label="会员中心" />
            <SideMenuItem href="/patterns" icon={<GridIcon />} label="纹样库" />
          </nav>
        </aside>

        {/* 右侧内容区 */}
        <div className="flex-1">
          {/* 标题栏 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-ink">我的收藏</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  共 {favorites.length} 件商品
                </p>
              </div>
              {favorites.length > 0 && (
                <button
                  onClick={toggleAll}
                  className="text-xs text-gray-500 hover:text-qing transition-colors"
                >
                  {selected.size === favorites.length ? '取消全选' : '全选'}
                </button>
              )}
            </div>
          </div>

          {favorites.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-50 flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <p className="text-sm text-gray-400 mb-3">收藏夹是空的</p>
              <Link href="/patterns" className="inline-flex items-center gap-1 text-sm text-qing hover:underline">
                去纹样库逛逛
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ) : (
            <>
              {/* 许可类型切换 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 mb-4">
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-500 shrink-0">许可类型</span>
                  <div className="flex bg-gray-100 rounded-lg p-0.5">
                    <button
                      onClick={() => setTier('commercial')}
                      className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                        tier === 'commercial'
                          ? 'bg-white text-ink shadow-sm'
                          : 'text-gray-500 hover:text-ink'
                      }`}
                    >
                      商业许可
                    </button>
                    <button
                      onClick={() => setTier('personal')}
                      className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                        tier === 'personal'
                          ? 'bg-white text-ink shadow-sm'
                          : 'text-gray-500 hover:text-ink'
                      }`}
                    >
                      个人学习
                    </button>
                  </div>
                  <span className="text-[10px] text-gray-400 ml-auto">
                    {tier === 'commercial' ? '高清无水印 · 非授权不可商用' : '带水印 · 仅供个人学习'}
                  </span>
                </div>
              </div>

              {/* 列表 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {favorites.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-4 p-4 border-b border-gray-50 last:border-b-0 hover:bg-gray-50/50 transition-colors
                      ${selected.has(item.id) ? 'bg-qing/[0.03]' : ''}`}
                  >
                    {/* 选择框 */}
                    <button
                      onClick={() => toggleSelect(item.id)}
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
                        ${selected.has(item.id)
                          ? 'bg-qing border-qing'
                          : 'border-gray-300 hover:border-gold'
                        }`}
                    >
                      {selected.has(item.id) && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>

                    {/* 图片 */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-stone-50 overflow-hidden shrink-0">
                      <Image src={item.src} alt={item.title} fill className="object-cover" sizes="96px" />
                    </div>

                    {/* 信息 */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/patterns/${item.type}/${encodeURIComponent(item.title)}`}
                        className="text-sm font-medium text-ink hover:text-qing transition-colors line-clamp-1"
                      >
                        {item.title}
                      </Link>
                      <p className="text-[11px] text-gray-400 mt-1">
                        {item.type === 'revival' ? '复原纹样' : '创新纹样'}
                      </p>
                    </div>

                    {/* 价格 */}
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-gold">
                        ¥{PRICES[item.type]?.[tier] || PRICES.innovation[tier] || PRICES.innovation.commercial}
                      </p>
                    </div>

                    {/* 删除 */}
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors shrink-0"
                      title="删除"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* 底部结算栏 */}
              {selectedItems.length > 0 && (
                <div className="sticky bottom-0 mt-4 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-5">
                  <div className="flex items-center gap-4 sm:gap-6">
                    <button onClick={toggleAll} className="text-xs text-gray-500 hover:text-qing shrink-0">
                      {selected.size === favorites.length ? '取消全选' : '全选'}
                    </button>

                    <div className="flex-1" />

                    <span className="text-xs text-gray-400">
                      已选 <b className="text-ink">{selectedItems.length}</b> 件
                    </span>

                    <div className="text-right">
                      <p className="text-[10px] text-gray-400">合计</p>
                      <p className="text-xl font-bold text-gold">¥{totalPrice}</p>
                    </div>

                    <button
                      onClick={handlePay}
                      className="px-6 sm:px-8 py-3 rounded-xl bg-gold text-white text-sm font-semibold hover:bg-amber-600 transition-colors shadow-md shrink-0"
                    >
                      去结算
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* 支付弹窗 */}
      {showPay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowPay(false)}>
          <div className="bg-white rounded-2xl max-w-sm w-full p-8 shadow-2xl text-center" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-serif font-semibold text-ink mb-1">确认订单</h3>
            <p className="text-xs text-gray-400 mb-2">
              {selectedItems.length} 件 · {tier === 'commercial' ? '商业许可' : '个人学习'}
            </p>

            <div className="bg-qing/5 border border-qing/20 rounded-xl px-4 py-3 mb-5">
              <p className="text-xs text-qing/70 mb-1">支付金额</p>
              <p className="text-2xl font-bold text-qing tracking-wide">¥{totalPrice}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 inline-block mb-4">
              <img src="/qrcode.png" alt="支付宝付款码" className="w-44 h-44 object-contain" />
            </div>

            {!paid ? (
              <>
                <p className="text-xs text-gray-400">请使用支付宝扫码支付</p>
                <button
                  onClick={handleConfirmPaid}
                  className="inline-flex items-center gap-2 px-6 py-2.5 mt-4 rounded-xl bg-gold text-white text-sm font-medium hover:bg-amber-600 transition-colors shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  我已完成支付
                </button>
              </>
            ) : (
              <div className="mt-4 px-4 py-3 rounded-xl bg-qing/10 border border-qing/20 text-center">
                <svg className="w-8 h-8 text-qing mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium text-ink">支付确认成功！</p>
                <p className="text-[10px] text-gray-500 mt-1">已记录至「个人中心」</p>
              </div>
            )}

            <button onClick={() => { setShowPay(false); refresh(); }} className="btn-outline w-full text-xs mt-4">
              {paid ? '完成' : '返回'}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

/* ====== 侧边栏菜单项 ====== */
function SideMenuItem({ href, icon, label, count, active }: {
  href: string;
  icon: React.ReactNode;
  label: string;
  count?: number;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors
        ${active
          ? 'bg-qing/5 text-qing font-medium border-r-[3px] border-qing'
          : 'text-gray-600 hover:bg-gray-50 border-r-[3px] border-transparent'
        }`}
    >
      <span className={active ? 'text-qing' : 'text-gray-400'}>{icon}</span>
      <span>{label}</span>
      {count !== undefined && count > 0 && (
        <span className="ml-auto bg-red-500 text-white text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
          {count}
        </span>
      )}
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

function HeartIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth={1.5} />
      <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth={1.5} />
      <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth={1.5} />
      <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth={1.5} />
    </svg>
  );
}
