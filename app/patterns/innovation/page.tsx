'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Breadcrumb from '../../../components/Breadcrumb';
import SectionTitle from '../../../components/SectionTitle';
import PatternDetail from '../../../components/PatternDetail';
import FavoriteButton from '../../../components/FavoriteButton';
import innovationPatterns, { type InnovationPattern, STRUCTURES, COLORS, CATEGORIES } from './data';

export default function InnovationPatternsPage() {
  const [selected, setSelected] = useState<InnovationPattern | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [structureFilter, setStructureFilter] = useState<string | null>(null);
  const [colorFilter, setColorFilter] = useState<string | null>(null);

  const categories = CATEGORIES;

  const filtered = useMemo(() => {
    let result = innovationPatterns;
    if (categoryFilter) result = result.filter((p) => p.category === categoryFilter);
    if (structureFilter) result = result.filter((p) => p.structure === structureFilter);
    if (colorFilter) result = result.filter((p) => p.colors?.includes(colorFilter));
    return result;
  }, [categoryFilter, structureFilter, colorFilter]);

  const hasFilters = !!categoryFilter || !!structureFilter || !!colorFilter;

  return (
    <main className="min-h-screen px-4 sm:px-6 py-12">
      <div className="max-w-6xl mx-auto">
      <Breadcrumb crumbs={[
        { label: '首页', href: '/' },
        { label: '纹样库', href: '/patterns' },
        { label: '创新纹样' },
      ]} />
      </div>
      <SectionTitle title="创新纹样" subtitle="多维筛选 · 点击作品查看设计理念" />

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 max-w-6xl mx-auto">
        {/* 筛选侧栏 */}
        <aside className="w-full lg:w-52 shrink-0">
          <div className="lg:sticky lg:top-24 space-y-5 bg-white rounded-xl border border-gray-100 shadow-sm p-4">

            {/* 分类 */}
            <div>
              <h4 className="text-xs font-medium text-ink/70 mb-2">分类</h4>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(categoryFilter === cat ? null : cat)}
                    className={`px-2.5 py-1 rounded-full text-xs transition-all ${
                      categoryFilter === cat
                        ? 'bg-gold/15 text-gold font-medium border border-gold/30'
                        : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-ink border border-transparent'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* 结构 */}
            <div>
              <h4 className="text-xs font-medium text-ink/70 mb-2">结构</h4>
              <div className="flex flex-wrap gap-1.5">
                {STRUCTURES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStructureFilter(structureFilter === s ? null : s)}
                    className={`px-2.5 py-1 rounded-full text-xs transition-all ${
                      structureFilter === s
                        ? 'bg-gold/15 text-gold font-medium border border-gold/30'
                        : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-ink border border-transparent'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* 颜色 */}
            <div>
              <h4 className="text-xs font-medium text-ink/70 mb-2">颜色</h4>
              <div className="flex flex-wrap gap-1.5">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColorFilter(colorFilter === c ? null : c)}
                    className={`px-2.5 py-1 rounded-full text-xs transition-all ${
                      colorFilter === c
                        ? 'bg-gold/15 text-gold font-medium border border-gold/30'
                        : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-ink border border-transparent'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* 清除 */}
            {hasFilters && (
              <button
                onClick={() => {
                  setCategoryFilter(null);
                  setStructureFilter(null);
                  setColorFilter(null);
                }}
                className="text-[10px] text-gray-300 hover:text-red-400 transition-colors"
              >
                清除全部筛选
              </button>
            )}
          </div>
        </aside>

        {/* 作品网格 */}
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
          {filtered.length === 0 ? (
            <p className="col-span-full text-gray-400 text-center py-20">暂无匹配作品</p>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="group cursor-pointer bg-white rounded-xl overflow-hidden border border-gray-100
                           shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                onClick={() => setSelected(item)}
              >
                <div className="relative w-full aspect-square overflow-hidden bg-stone-50">
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] rounded-full bg-white/90 text-ink/70 font-medium shadow-sm">
                    {item.category}
                  </span>
                  <FavoriteButton
                    item={{
                      id: item.id,
                      title: item.title,
                      src: item.src,
                      type: 'innovation',
                      addedAt: Date.now(),
                    }}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 shadow-sm"
                  />
                </div>
                <div className="p-3 sm:p-5">
                  <h3 className="text-xs sm:text-base font-serif font-semibold text-ink mb-0.5 sm:mb-1.5 line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-[11px] sm:text-sm line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-1.5 sm:mt-3">
                    {item.elements?.slice(0, 3).map((el) => (
                      <span key={el} className="px-2 py-0.5 text-[11px] rounded-full bg-qing/15 text-ink/60">
                        {el}
                      </span>
                    ))}
                    {item.colors?.slice(0, 2).map((c) => (
                      <span key={c} className="hidden sm:inline-block px-2 py-0.5 text-[11px] rounded-full bg-gold/10 text-ink/50">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {selected && (
        <PatternDetail pattern={selected} onClose={() => setSelected(null)} />
      )}
    </main>
  );
}
