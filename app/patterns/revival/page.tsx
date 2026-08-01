'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Breadcrumb from '../../../components/Breadcrumb';
import SectionTitle from '../../../components/SectionTitle';
import FilterSidebar from '../../../components/FilterSidebar';
import PatternDetail from '../../../components/PatternDetail';
import FavoriteButton from '../../../components/FavoriteButton';
import { revivalPatterns, type RevivalPattern } from './data';

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

// 结构大类
const STRUCTURE_CATEGORIES = ['四方连续', '二方连续', '单独', '适合'];

function getStructureCat(structure: string): string {
  for (const cat of STRUCTURE_CATEGORIES) {
    if (structure.startsWith(cat)) return cat;
  }
  return '其他';
}

export default function RevivalPatternsPage() {
  const [selected, setSelected] = useState<RevivalPattern | null>(null);
  const [dynastyFilter, setDynastyFilter] = useState<string | null>(null);
  const [structureFilter, setStructureFilter] = useState<string | null>(null);
  const [elementFilter, setElementFilter] = useState<string | null>(null);

  const dynasties = useMemo(() => {
    const set = new Set(revivalPatterns.map((p) => p.dynasty));
    return Array.from(set).sort((a, b) => (DYNASTY_ORDER[a] || 99) - (DYNASTY_ORDER[b] || 99));
  }, []);

  // 结构分类
  const structureCats = useMemo(() => {
    const cats = new Set(revivalPatterns.filter(p => p.structure).map(p => getStructureCat(p.structure)));
    return Array.from(cats).sort();
  }, []);

  // 热门元素 Top 20
  const popularElements = useMemo(() => {
    const count: Record<string, number> = {};
    revivalPatterns.forEach(p => {
      (p.elements || []).forEach(e => { count[e] = (count[e] || 0) + 1; });
    });
    return Object.entries(count).sort((a, b) => b[1] - a[1]).slice(0, 20).map(([k]) => k);
  }, []);

  const filtered = useMemo(() => {
    let list = revivalPatterns;
    if (dynastyFilter) list = list.filter((p) => p.dynasty === dynastyFilter);
    if (structureFilter) list = list.filter((p) => p.structure && getStructureCat(p.structure) === structureFilter);
    if (elementFilter) list = list.filter((p) => (p.elements || []).includes(elementFilter));
    return list;
  }, [dynastyFilter, structureFilter, elementFilter]);

  return (
    <main className="min-h-screen px-4 sm:px-6 py-12">
      <div className="max-w-6xl mx-auto">
      <Breadcrumb crumbs={[
        { label: '首页', href: '/' },
        { label: '纹样库', href: '/patterns' },
        { label: '复原纹样' },
      ]} />
      </div>
      <SectionTitle title="复原纹样" subtitle="朝代 · 结构 · 元素  多维度筛选" />

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 max-w-6xl mx-auto">
        {/* 多维筛选栏 */}
        <aside className="hidden lg:block w-44 shrink-0 space-y-6">
          <FilterSidebar label="按朝代" options={dynasties} selected={dynastyFilter} onChange={setDynastyFilter} desktopOnly />
          <FilterSidebar label="按结构" options={structureCats} selected={structureFilter} onChange={setStructureFilter} desktopOnly />
          <FilterSidebar label="按元素" options={popularElements} selected={elementFilter} onChange={setElementFilter} desktopOnly />
        </aside>
        {/* 手机端筛选 */}
        <div className="lg:hidden space-y-0 mb-4">
          <FilterSidebar label="按朝代" options={dynasties} selected={dynastyFilter} onChange={setDynastyFilter} mobileOnly />
          <FilterSidebar label="按结构" options={structureCats} selected={structureFilter} onChange={setStructureFilter} mobileOnly />
          <FilterSidebar label="按元素" options={popularElements} selected={elementFilter} onChange={setElementFilter} mobileOnly />
        </div>

        <div className="flex-1 grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6 items-start">
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
                {/* 收藏按钮 */}
                <FavoriteButton
                  item={{
                    id: item.id,
                    title: item.title,
                    src: item.thumbSrc || item.src,
                    type: 'revival',
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
