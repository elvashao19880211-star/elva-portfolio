'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Breadcrumb from '../../components/Breadcrumb';
import SectionTitle from '../../components/SectionTitle';
import materials, { MATERIAL_CATEGORIES } from './data';

export default function MaterialsPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [dynastyFilter, setDynastyFilter] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allDynasties = useMemo(() => {
    const sorted = ['商', '周', '汉', '北魏', '唐', '宋', '元', '明', '清'];
    const set = new Set(materials.map((m) => m.dynasty).filter(Boolean));
    return sorted.filter((d) => set.has(d));
  }, []);

  const filtered = useMemo(() => {
    let result = materials;
    if (activeCategory) result = result.filter((m) => m.category === activeCategory);
    if (dynastyFilter) result = result.filter((m) => m.dynasty === dynastyFilter);
    if (activeTag) result = result.filter((m) => m.tags.includes(activeTag));
    return result;
  }, [activeCategory, dynastyFilter, activeTag]);

  const tags = useMemo(() => {
    let items = materials;
    if (activeCategory) items = items.filter((m) => m.category === activeCategory);
    if (dynastyFilter) items = items.filter((m) => m.dynasty === dynastyFilter);
    return Array.from(new Set(items.flatMap((m) => m.tags)));
  }, [activeCategory, dynastyFilter]);

  return (
    <main className="min-h-screen px-4 sm:px-6 py-12">
      <Breadcrumb crumbs={[
        { label: '首页', href: '/' },
        { label: '纹样素材' },
      ]} />
      <SectionTitle
        title="纹样素材"
        subtitle="按分类 · 朝代 · 标签精准筛选 —— 素材均有明确历史背景"
      />

      <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
        {/* 侧边栏 */}
        <aside className="hidden lg:block w-52 shrink-0">
          <h3 className="text-sm font-serif font-semibold text-ink mb-4">素材分类</h3>
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => { setActiveCategory(null); setActiveTag(null); setDynastyFilter(null); }}
                className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-all duration-200 ${
                  activeCategory === null && dynastyFilter === null
                    ? 'bg-ink text-white shadow-sm'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-ink'
                }`}
              >
                全部素材
              </button>
            </li>
            {MATERIAL_CATEGORIES.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => { setActiveCategory(cat.id); setActiveTag(null); setDynastyFilter(null); }}
                  className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-all duration-200 ${
                    activeCategory === cat.id
                      ? 'bg-gold/15 text-gold font-medium border border-gold/20'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-ink'
                  }`}
                >
                  {cat.icon} {cat.label}
                </button>
              </li>
            ))}
          </ul>

          {/* 朝代筛选 */}
          {activeCategory && allDynasties.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-xs font-serif font-semibold text-ink mb-3">按朝代筛选</h3>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setDynastyFilter(null)}
                    className={`w-full text-left px-4 py-1.5 rounded-lg text-xs transition-all duration-200 ${
                      dynastyFilter === null
                        ? 'bg-qing/15 text-qing font-medium'
                        : 'text-gray-400 hover:bg-gray-100'
                    }`}
                  >
                    所有朝代
                  </button>
                </li>
                {allDynasties.map((d) => (
                  <li key={d}>
                    <button
                      onClick={() => setDynastyFilter(d)}
                      className={`w-full text-left px-4 py-1.5 rounded-lg text-xs transition-all duration-200 ${
                        dynastyFilter === d
                          ? 'bg-gold/15 text-gold font-medium'
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                    >
                      {d}代
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>

        {/* 手机端：分类横滑 + 朝代横滑 */}
        <div className="lg:hidden space-y-3 mb-2">
          <div>
            <h3 className="text-xs font-serif font-semibold text-ink mb-2">素材分类</h3>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => { setActiveCategory(null); setActiveTag(null); setDynastyFilter(null); }}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs transition-all duration-200 whitespace-nowrap ${
                  activeCategory === null && dynastyFilter === null
                    ? 'bg-ink text-white shadow-sm'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                全部素材
              </button>
              {MATERIAL_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setActiveTag(null); setDynastyFilter(null); }}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs transition-all duration-200 whitespace-nowrap ${
                    activeCategory === cat.id
                      ? 'bg-gold/15 text-gold font-medium border border-gold/30'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* 手机端朝代筛选 */}
          {activeCategory && allDynasties.length > 0 && (
            <div>
              <h3 className="text-xs font-serif font-semibold text-ink mb-2">朝代</h3>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setDynastyFilter(null)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs transition-all duration-200 whitespace-nowrap ${
                    dynastyFilter === null
                      ? 'bg-qing/15 text-qing font-medium'
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                  }`}
                >
                  所有朝代
                </button>
                {allDynasties.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDynastyFilter(d)}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs transition-all duration-200 whitespace-nowrap ${
                      dynastyFilter === d
                        ? 'bg-gold/15 text-gold font-medium'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    {d}代
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 右侧 */}
        <div className="flex-1 min-w-0">
          {/* 筛选提示 */}
          <div className="flex items-center flex-wrap gap-2 mb-4 text-xs">
            {activeCategory && (
              <span className="px-3 py-1 rounded-full bg-qing/15 text-qing font-medium">
                {MATERIAL_CATEGORIES.find((c) => c.id === activeCategory)?.label}
              </span>
            )}
            {dynastyFilter && (
              <span className="px-3 py-1 rounded-full bg-gold/15 text-gold font-medium">
                {dynastyFilter}代
              </span>
            )}
            <span className="text-gray-400 ml-auto">{filtered.length} 个素材</span>
          </div>

          {/* 标签筛选 */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-6">
              <button
                onClick={() => setActiveTag(null)}
                className={`px-3 py-1 text-xs rounded-full transition-all ${
                  activeTag === null
                    ? 'bg-ink/10 text-ink font-medium'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                全部标签
              </button>
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                  className={`px-3 py-1 text-xs rounded-full transition-all ${
                    activeTag === tag
                      ? 'bg-gold/20 text-gold font-medium'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          {/* 素材网格 */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="group cursor-pointer bg-white rounded-xl overflow-hidden border border-gray-100
                             shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative w-full aspect-square overflow-hidden bg-stone-50">
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="text-sm font-medium text-ink truncate">{item.title}</h4>
                      {item.dynasty && (
                        <span className="shrink-0 px-1.5 py-0.5 text-[10px] rounded bg-gold/15 text-gold font-medium">
                          {item.dynasty}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400 line-clamp-1">{item.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.tags.slice(0, 3).map((t) => (
                        <span key={t} className="px-1.5 py-0.5 text-[10px] rounded bg-gray-100 text-gray-500">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-20">暂无符合条件的素材 · 换个筛选条件试试</p>
          )}
        </div>
      </div>
    </main>
  );
}
