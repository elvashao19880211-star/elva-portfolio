'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '../../../components/Breadcrumb';
import { getFavorites, removeFavorite, addPurchase, type FavoriteItem } from '@/lib/userData';

// 价格映射（仿 PatternDetail 逻辑）
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
    return selectedItems.reduce((sum, item) => {
      const prices = PRICES[item.type] || PRICES.innovation;
      return sum + parseFloat(prices[tier] || prices.commercial);
    }, 0);
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
    // 批量记录已购
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
    // 清除已选的收藏
    selectedItems.forEach((item) => removeFavorite(item.id));
    setPaid(true);
  };

  return (
    <main className="min-h-screen px-4 sm:px-6 py-12">
      <Breadcrumb crumbs={[
        { label: '首页', href: '/' },
        { label: '个人中心', href: '/account' },
        { label: '我的收藏' },
      ]} />

      <div className="max-w-4xl mx-auto">
        {/* 标题栏 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-serif font-semibold text-ink">我的收藏</h2>
            <p className="text-xs text-gray-400 mt-1">
              {favorites.length} 件 · 勾选后可合并付款
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

        {favorites.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-12 text-center">
            <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <p className="text-sm text-gray-400 mb-4">收藏夹空空如也</p>
            <Link href="/patterns" className="text-xs text-qing hover:underline">去纹样库逛逛 →</Link>
          </div>
        ) : (
          <>
            {/* 收藏列表 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {favorites.map((item) => (
                <div
                  key={item.id}
                  className={`relative bg-white rounded-xl overflow-hidden border-2 shadow-sm transition-all cursor-pointer group
                    ${selected.has(item.id) ? 'border-gold shadow-gold/20' : 'border-gray-100 hover:border-gray-200'}`}
                  onClick={() => toggleSelect(item.id)}
                >
                  {/* 选择框 */}
                  <div className={`absolute top-2 right-2 z-10 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                    ${selected.has(item.id) ? 'bg-gold border-gold' : 'border-white bg-black/20 group-hover:bg-black/30'}`}>
                    {selected.has(item.id) && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>

                  {/* 删除 */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRemove(item.id); }}
                    className="absolute top-2 left-2 z-10 w-6 h-6 rounded-full bg-black/30 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                  >
                    ×
                  </button>

                  <div className="relative w-full aspect-square bg-stone-50">
                    <Image src={item.src} alt={item.title} fill className="object-cover" sizes="25vw" />
                  </div>
                  <div className="p-2.5">
                    <h4 className="text-xs font-medium text-ink truncate">{item.title}</h4>
                    <span className="text-[10px] text-gray-400">
                      {item.type === 'revival' ? '复原纹样' : '创新纹样'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* 底部操作栏 */}
            {selectedItems.length > 0 && (
              <div className="sticky bottom-4 bg-white rounded-2xl border border-gray-200 shadow-xl p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
                  {/* 许可选择 */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">许可类型：</span>
                    <button
                      onClick={() => setTier('commercial')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                        ${tier === 'commercial' ? 'bg-gold text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                      商业许可
                    </button>
                    <button
                      onClick={() => setTier('personal')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                        ${tier === 'personal' ? 'bg-gold text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                      个人学习
                    </button>
                  </div>

                  <div className="flex items-center gap-4 sm:ml-auto">
                    <span className="text-xs text-gray-400">
                      已选 <span className="font-semibold text-ink">{selectedItems.length}</span> 件
                    </span>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400">合计</p>
                      <p className="text-xl font-serif font-bold text-gold">¥{totalPrice}</p>
                    </div>
                    <button
                      onClick={handlePay}
                      className="px-6 py-2.5 rounded-xl bg-gold text-white text-sm font-semibold hover:bg-amber-600 transition-colors shadow-md"
                    >
                      合并付款
                    </button>
                  </div>
                </div>

                {/* 小字说明 */}
                <p className="text-[10px] text-gray-400 mt-3 sm:ml-0">
                  {tier === 'commercial'
                    ? '商业许可 · 高清无水印 · 不限印刷量'
                    : '个人学习 · 带水印 · 非商业用途'}
                  · 支持支付宝扫码支付
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* 支付弹窗 */}
      {showPay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowPay(false)}>
          <div className="bg-white rounded-2xl max-w-sm w-full p-8 shadow-2xl text-center" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-serif font-semibold text-ink mb-1">合并付款</h3>
            <p className="text-xs text-gray-400 mb-2">
              {selectedItems.length} 件 · {tier === 'commercial' ? '商业许可' : '个人学习'}
            </p>

            <div className="bg-qing/5 border border-qing/20 rounded-xl px-4 py-3 mb-5">
              <p className="text-xs text-qing/70 mb-1">请输入以下金额</p>
              <p className="text-2xl font-bold text-qing tracking-wide">¥{totalPrice}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 inline-block mb-4">
              <img src="/qrcode.png" alt="支付宝付款码" className="w-48 h-48 object-contain" />
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
                <p className="text-[10px] text-gray-500 mt-1">已记录至「个人中心」· 客服将尽快联系发送文件</p>
              </div>
            )}
            <p className="text-[10px] text-gray-300 mt-1">支付后请联系客服发送文件</p>

            <button onClick={() => { setShowPay(false); refresh(); }} className="btn-outline w-full text-xs mt-4">
              {paid ? '完成' : '返回'}
            </button>
          </div>
        </div>
      )}

      {/* 空选提示——直接按合并付款 */}
      {selectedItems.length === 0 && (
        <div className="text-center mt-8">
          <p className="text-xs text-gray-300">
            点击纹样卡片勾选，然后合并付款
          </p>
        </div>
      )}
    </main>
  );
}
