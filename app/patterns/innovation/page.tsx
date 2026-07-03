'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Breadcrumb from '../../../components/Breadcrumb';
import SectionTitle from '../../../components/SectionTitle';
import PatternDetail from '../../../components/PatternDetail';
import innovationPatterns, { type InnovationPattern, STRUCTURES, COLORS } from './data';

export default function InnovationPatternsPage() {
  const [selected, setSelected] = useState<InnovationPattern | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [elementFilter, setElementFilter] = useState<Set<string>>(new Set());
  const [structureFilter, setStructureFilter] = useState<string | null>(null);
  const [colorFilter, setColorFilter] = useState<string | null>(null);

  const categories = useMemo(() => {
    const set = new Set(innovationPatterns.map((p) => p.category));
    return Array.from(set);
  }, []);

  // 收集所有不重复的元素标签
  const allElements = useMemo(() => {
    const set = new Set<string>();
    innovationPatterns.forEach((p) => p.elements?.forEach((e) => set.add(e)));
    return Array.from(set).sort();
  }, []);

  const filtered = useMemo(() => {
    let result = innovationPatterns;
    if (categoryFilter) result = result.filter((p) => p.category === categoryFilter);
    if (elementFilter.size > 0) {
      result = result.filter((p) =>
        p.elements?.some((e) => elementFilter.has(e))
      );
    }
    if (structureFilter) result = result.filter((p) => p.structure === structureFilter);
    if (colorFilter) result = result.filter((p) => p.colors?.includes(colorFilter));
    return result;
  }, [categoryFilter, elementFilter, structureFilter, colorFilter]);

  const toggleElement = (el: string) => {
    setElementFilter((prev) => {
      const next = new Set(prev);
      if (next.has(el)) next.delete(el); else next.add(el);
      return next;
    });
  };

  const hasFilters = !!categoryFilter || elementFilter.size > 0 || !!structureFilter || !!colorFilter;

  return (
    <main className="min-h-screen px-4 sm:px-6 py-12">
      <Breadcrumb crumbs={[
        { label: '首页', href: '/' },
        { label: '纹样库', href: '/patterns' },
        { label: '创新纹样' },
      ]} />
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

            {/* 元素 */}
            {allElements.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-ink/70 mb-2">元素</h4>
                <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                  {allElements.map((el) => (
                    <button
                      key={el}
                      onClick={() => toggleElement(el)}
                      className={`px-2.5 py-1 rounded-full text-xs transition-all ${
                        elementFilter.has(el)
                          ? 'bg-gold/15 text-gold font-medium border border-gold/30'
                          : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-ink border border-transparent'
                      }`}
                    >
                      {el}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 清除 */}
            {hasFilters && (
              <button
                onClick={() => {
                  setCategoryFilter(null);
                  setElementFilter(new Set());
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
                  {item.structure && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 text-[10px] rounded-full bg-white/80 text-ink/50 shadow-sm">
                      {item.structure}
                    </span>
                  )}
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
