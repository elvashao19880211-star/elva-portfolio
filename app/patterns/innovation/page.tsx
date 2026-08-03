'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Breadcrumb from '../../../components/Breadcrumb';
import SectionTitle from '../../../components/SectionTitle';
import PatternDetail from '../../../components/PatternDetail';
import FavoriteButton from '../../../components/FavoriteButton';
import NewThisMonth from '../../../components/NewThisMonth';
import ActiveFilters from '../../../components/ActiveFilters';
import innovationPatterns, { type InnovationPattern, STRUCTURES, STRUCTURE_L2, COLORS, CATEGORIES } from './data';

export default function InnovationPatternsPage() {
  const [selected, setSelected] = useState<InnovationPattern | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [structureL1, setStructureL1] = useState<string | null>(null);
  const [structureL2, setStructureL2] = useState<string | null>(null);
  const [colorFilter, setColorFilter] = useState<string | null>(null);
  const [showNewOnly, setShowNewOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = CATEGORIES;

  const filtered = useMemo(() => {
    let result = innovationPatterns;
    if (categoryFilter) result = result.filter((p) => p.category === categoryFilter);
    if (structureL1) result = result.filter((p) => p.structureL1 === structureL1);
    if (structureL2) result = result.filter((p) => p.structureL2 === structureL2);
    if (colorFilter) result = result.filter((p) => p.colors?.includes(colorFilter));
    if (showNewOnly) result = result.filter((p) => p.isNew);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.elements || []).some((e) => e.toLowerCase().includes(q))
      );
    }
    return result;
  }, [categoryFilter, structureL1, structureL2, colorFilter, showNewOnly, searchQuery]);

  const hasFilters = !!categoryFilter || !!structureL1 || !!colorFilter;

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

      {/* 搜索栏 */}
      <div className="max-w-6xl mx-auto mb-4 flex justify-center">
        <div className="relative w-full max-w-md">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索纹样名称、分类、构成元素..."
            className="w-full pl-10 pr-10 py-2.5 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 text-sm text-ink placeholder-gray-300
                       focus:outline-none focus:border-qing focus:bg-white focus:shadow-lg focus:shadow-qing/5 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-200 text-gray-400 hover:bg-gray-300 hover:text-gray-600 flex items-center justify-center text-[10px] transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto mb-4 flex justify-center">
        <NewThisMonth
          count={innovationPatterns.filter(p => p.isNew).length}
          active={showNewOnly}
          onClick={() => setShowNewOnly(!showNewOnly)}
        />
      </div>

      {/* 当前筛选条件 */}
      <div className="max-w-6xl mx-auto mb-4">
        <ActiveFilters
          chips={[
            ...(categoryFilter ? [{ key: 'category', label: '分类', value: categoryFilter, onClear: () => setCategoryFilter(null) }] : []),
            ...(structureL1 && !structureL2 ? [{ key: 'structureL1', label: '结构', value: structureL1, onClear: () => setStructureL1(null) }] : []),
            ...(structureL1 && structureL2 ? [{ key: 'structureL2', label: '结构', value: `${structureL1} / ${structureL2}`, onClear: () => setStructureL2(null) }] : []),
            ...(colorFilter ? [{ key: 'color', label: '色系', value: colorFilter, onClear: () => setColorFilter(null) }] : []),
            ...(showNewOnly ? [{ key: 'new', label: '上新', value: '本月上新', onClear: () => setShowNewOnly(false) }] : []),
            ...(searchQuery ? [{ key: 'search', label: '搜索', value: `"${searchQuery}"`, onClear: () => setSearchQuery('') }] : []),
          ]}
        />
      </div>

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
                    onClick={() => {
                      setStructureL1(structureL1 === s ? null : s);
                      setStructureL2(null);
                    }}
                    className={`px-2.5 py-1 rounded-full text-xs transition-all ${
                      structureL1 === s
                        ? 'bg-gold/15 text-gold font-medium border border-gold/30'
                        : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-ink border border-transparent'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {structureL1 && STRUCTURE_L2[structureL1] && (
                <div className="flex flex-wrap gap-1.5 mt-1.5 ml-2">
                  {STRUCTURE_L2[structureL1].map((s2: string) => (
                    <button
                      key={s2}
                      onClick={() => setStructureL2(structureL2 === s2 ? null : s2)}
                      className={`px-2.5 py-1 rounded-full text-xs transition-all ${
                        structureL2 === s2
                          ? 'bg-gold/15 text-gold font-medium border border-gold/30'
                          : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-ink border border-transparent'
                      }`}
                    >
                      {s2}
                    </button>
                  ))}
                </div>
              )}
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
                  setStructureL1(null);
                  setStructureL2(null);
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
        <div className="w-full lg:flex-1 grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6 items-start">
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
                    src={item.thumbSrc || item.src}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
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
