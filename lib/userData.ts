'use client';

// ========== LocalStorage 用户数据工具 ==========
// 收藏 + 已购记录（本地存储，后续可迁移到服务端）

const FAVORITES_KEY = 'hetu_favorites';
const PURCHASES_KEY = 'hetu_purchases';

export interface FavoriteItem {
  id: string;
  title: string;
  src: string;
  type: 'revival' | 'innovation';
  addedAt: number;
}

export interface PurchaseItem {
  id: string;
  title: string;
  src: string;
  type: 'revival' | 'innovation';
  tier: 'personal' | 'commercial' | 'source';
  price: string;
  purchasedAt: number;
  email?: string;
}

// ========== 收藏 ==========

export function getFavorites(): FavoriteItem[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
  } catch {
    return [];
  }
}

export function isFavorite(id: string): boolean {
  return getFavorites().some((f) => f.id === id);
}

export function toggleFavorite(item: FavoriteItem): boolean {
  const list = getFavorites();
  const idx = list.findIndex((f) => f.id === item.id);
  let added = false;
  if (idx >= 0) {
    list.splice(idx, 1);
    added = false;
  } else {
    list.push({ ...item, addedAt: Date.now() });
    added = true;
  }
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
  return added;
}

export function removeFavorite(id: string): void {
  const list = getFavorites().filter((f) => f.id !== id);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
}

// ========== 已购 ==========

export function getPurchases(): PurchaseItem[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(PURCHASES_KEY) || '[]');
  } catch {
    return [];
  }
}

export function addPurchase(item: PurchaseItem): void {
  const list = getPurchases();
  // 去重：同一 id + 同一 tier 不重复加
  if (!list.some((p) => p.id === item.id && p.tier === item.tier)) {
    list.push({ ...item, purchasedAt: Date.now() });
  }
  localStorage.setItem(PURCHASES_KEY, JSON.stringify(list));
}

export function hasPurchased(id: string): boolean {
  return getPurchases().some((p) => p.id === id);
}
