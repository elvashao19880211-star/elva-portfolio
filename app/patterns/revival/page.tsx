'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Breadcrumb from '../../../components/Breadcrumb';
import SectionTitle from '../../../components/SectionTitle';
import FilterSidebar from '../../../components/FilterSidebar';
import PatternDetail from '../../../components/PatternDetail';
import FavoriteButton from '../../../components/FavoriteButton';
import NewThisMonth from '../../../components/NewThisMonth';
import ActiveFilters from '../../../components/ActiveFilters';
import { revivalPatterns, type RevivalPattern, ELEMENT_CATEGORIES } from './data';

const DYNASTY_ORDER: Record<string, number> = {
  '新石器时代': 1,
  '商周': 2,
  '西周': 3,
  '春秋': 4,
  '汉代': 5,
  '魏晋南北朝': 6,
  '北凉': 7,
  '北朝': 8,
  '西魏': 9,
  '唐代': 10,
  '初唐': 11,
  '盛唐': 12,
  '辽代': 13,
  '宋代': 14,
  '金代': 15,
  '元代': 16,
  '明代': 17,
  '明清': 18,
  '清代': 19,
  '近代': 20,
  '现代': 21,
};

// 新结构体系
const STRUCTURE_L1 = ['单独纹样', '二方连续', '四方连续'];
const STRUCTURE_L2: Record<string, string[]> = {
  '单独纹样': ['自由纹样', '适合纹样', '角隅纹样'],
  '二方连续': ['散点式', '直立式', '波线式', '折线式', '综合式'],
  '四方连续': ['散点式', '连缀式', '重叠式'],
};

// 元素按大类分组 {cat: [elements...]}
const ELEMENT_BY_CAT = Object.fromEntries(
  ELEMENT_CATEGORIES.map((g) => [g.cat, g.elements as readonly string[]])
) as Record<string, readonly string[]>;
const ELEMENT_CATS = ELEMENT_CATEGORIES.map((g) => g.cat);
const ALL_ELEMENTS = ELEMENT_CATEGORIES.flatMap((g) => g.elements as readonly string[]);

export default function RevivalPatternsPage() {
  const [selected, setSelected] = useState<RevivalPattern | null>(null);
  const [dynastyFilter, setDynastyFilter] = useState<string | null>(null);
  const [structureL1, setStructureL1] = useState<string | null>(null);
  const [structureL2, setStructureL2] = useState<string | null>(null);
  const [elementCat, setElementCat] = useState<string | null>(null);
  const [elementFilter, setElementFilter] = useState<string | null>(null);
  const [showNewOnly, setShowNewOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const dynasties = useMemo(() => {
    const set = new Set(revivalPatterns.map((p) => p.dynasty));
    return Array.from(set).sort((a, b) => (DYNASTY_ORDER[a] || 99) - (DYNASTY_ORDER[b] || 99));
  }, []);

  const filtered = useMemo(() => {
    let list = revivalPatterns;
    if (dynastyFilter) list = list.filter((p) => p.dynasty === dynastyFilter);
    if (structureL1) list = list.filter((p) => p.structureL1 === structureL1);
    if (structureL2) list = list.filter((p) => p.structureL2 === structureL2);
    if (elementCat) {
      const catElems = ELEMENT_BY_CAT[elementCat] || [];
      list = list.filter((p) => (p.elements || []).some((e) => catElems.includes(e)));
    }
    if (elementFilter) list = list.filter((p) => (p.elements || []).includes(elementFilter));
    if (showNewOnly) list = list.filter((p) => p.isNew);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.dynasty.toLowerCase().includes(q) ||
        (p.elements || []).some((e) => e.toLowerCase().includes(q))
      );
    }
    return list;
  }, [dynastyFilter, structureL1, structureL2, elementCat, elementFilter, showNewOnly, searchQuery]);

  return (
    <main className="min-h-screen px-4 sm:px-6 py-12">
      <div className="max-w-6xl mx-auto">
      <Breadcrumb crumbs={[
        { label: '首页', href: '/' },
        { label: '纹样库', href: '/patterns' },
        { label: '复原纹样' },
      ]} />
      </div>
      <SectionTitle title="复原纹样" subtitle="朝代 · 结构 · 元素大类  多维度级联筛选" />

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
            placeholder="搜索纹样名称、朝代、构成元素..."
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
          count={revivalPatterns.filter(p => p.isNew).length}
          active={showNewOnly}
          onClick={() => setShowNewOnly(!showNewOnly)}
        />
      </div>

      {/* 当前筛选条件 */}
      <div className="max-w-6xl mx-auto mb-4">
        <ActiveFilters
          chips={[
            ...(dynastyFilter ? [{ key: 'dynasty', label: '朝代', value: dynastyFilter, onClear: () => setDynastyFilter(null) }] : []),
            ...(structureL1 && !structureL2 ? [{ key: 'structureL1', label: '结构', value: structureL1, onClear: () => setStructureL1(null) }] : []),
            ...(structureL1 && structureL2 ? [{ key: 'structureL2', label: '结构', value: `${structureL1} / ${structureL2}`, onClear: () => setStructureL2(null) }] : []),
            ...(elementCat ? [{ key: 'elementCat', label: '元素大类', value: elementCat, onClear: () => setElementCat(null) }] : []),
            ...(elementFilter ? [{ key: 'element', label: '元素', value: elementFilter, onClear: () => setElementFilter(null) }] : []),
            ...(showNewOnly ? [{ key: 'new', label: '上新', value: '本月上新', onClear: () => setShowNewOnly(false) }] : []),
            ...(searchQuery ? [{ key: 'search', label: '搜索', value: `"${searchQuery}"`, onClear: () => setSearchQuery('') }] : []),
          ]}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 max-w-6xl mx-auto">
        {/* 多维筛选栏 */}
        <aside className="hidden lg:block w-44 shrink-0 space-y-5 overflow-y-auto max-h-[calc(100vh-8rem)] sticky top-24 pb-4">
          <FilterSidebar label="按朝代" options={dynasties} selected={dynastyFilter} onChange={setDynastyFilter} desktopOnly />
          <FilterSidebar
            label="按结构"
            options={STRUCTURE_L1}
            selected={structureL1}
            onChange={(v) => { setStructureL1(v); setStructureL2(null); }}
            desktopOnly
          />
          {structureL1 && (
            <FilterSidebar
              label={`${structureL1}`}
              options={STRUCTURE_L2[structureL1] || []}
              selected={structureL2}
              onChange={setStructureL2}
              desktopOnly
            />
          )}
          <FilterSidebar
            label="元素大类"
            options={ELEMENT_CATS}
            selected={elementCat}
            onChange={(v) => { setElementCat(v); setElementFilter(null); }}
            desktopOnly
          />
          {elementCat && (
            <FilterSidebar
              label={`${elementCat}`}
              options={Array.from(ELEMENT_BY_CAT[elementCat] || [])}
              selected={elementFilter}
              onChange={setElementFilter}
              desktopOnly
            />
          )}
        </aside>
        {/* 手机端筛选 */}
        <div className="lg:hidden space-y-0 mb-4">
          <FilterSidebar label="按朝代" options={dynasties} selected={dynastyFilter} onChange={setDynastyFilter} mobileOnly />
          <FilterSidebar
            label="按结构"
            options={STRUCTURE_L1}
            selected={structureL1}
            onChange={(v) => { setStructureL1(v); setStructureL2(null); }}
            mobileOnly
          />
          {structureL1 && (
            <FilterSidebar
              label={`${structureL1}`}
              options={STRUCTURE_L2[structureL1] || []}
              selected={structureL2}
              onChange={setStructureL2}
              mobileOnly
            />
          )}
          <FilterSidebar
            label="元素大类"
            options={ELEMENT_CATS}
            selected={elementCat}
            onChange={(v) => { setElementCat(v); setElementFilter(null); }}
            mobileOnly
          />
          {elementCat && (
            <FilterSidebar
              label={`${elementCat}`}
              options={Array.from(ELEMENT_BY_CAT[elementCat] || [])}
              selected={elementFilter}
              onChange={setElementFilter}
              mobileOnly
            />
          )}
        </div>

        <div className="w-full lg:flex-1 grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6 items-start">
          {filtered.map((item) => (
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
                {/* 朝代水标 */}
                <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] rounded-full bg-white/90 text-ink/70 font-medium shadow-sm">
                  {item.dynasty}
                </span>
              </div>
              <div className="p-3 sm:p-5 relative">
                <h3 className="text-xs sm:text-base font-serif font-semibold text-ink mb-0.5 sm:mb-1.5 line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-[11px] sm:text-sm line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
                {item.elements && item.elements.length > 0 && (
                  <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-1.5 sm:mt-3">
                    {item.elements.slice(0, 2).map((el) => (
                      <span key={el} className="hidden sm:inline-block px-2 py-0.5 text-[11px] rounded-full bg-qing/15 text-ink/60">
                        {el}
                      </span>
                    ))}
                    {item.elements.length > 2 && (
                      <span className="text-[11px] text-gray-400">+{item.elements.length - 2}</span>
                    )}
                  </div>
                )}
                <FavoriteButton
                  item={{
                    id: item.id,
                    title: item.title,
                    src: item.thumbSrc || item.src,
                    type: 'revival',
                    addedAt: Date.now(),
                  }}
                  className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <PatternDetail pattern={selected} onClose={() => setSelected(null)} />
      )}
    </main>
  );
}
