'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Breadcrumb from '../../../components/Breadcrumb';
import SectionTitle from '../../../components/SectionTitle';
import FilterSidebar from '../../../components/FilterSidebar';
import PatternDetail from '../../../components/PatternDetail';
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

export default function RevivalPatternsPage() {
  const [selected, setSelected] = useState<RevivalPattern | null>(null);
  const [dynastyFilter, setDynastyFilter] = useState<string | null>(null);

  const dynasties = useMemo(() => {
    const set = new Set(revivalPatterns.map((p) => p.dynasty));
    return Array.from(set).sort((a, b) => (DYNASTY_ORDER[a] || 99) - (DYNASTY_ORDER[b] || 99));
  }, []);

  const filtered = useMemo(
    () =>
      dynastyFilter
        ? revivalPatterns.filter((p) => p.dynasty === dynastyFilter)
        : revivalPatterns,
    [dynastyFilter]
  );

  return (
    <main className="min-h-screen px-4 sm:px-6 py-12">
      <Breadcrumb crumbs={[
        { label: '首页', href: '/' },
        { label: '纹样库', href: '/patterns' },
        { label: '复原纹样' },
      ]} />
      <SectionTitle title="复原纹样" subtitle="按朝代筛选 · 点击作品查看细节" />

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 max-w-6xl mx-auto">
        <FilterSidebar
          label="按朝代"
          options={dynasties}
          selected={dynastyFilter}
          onChange={setDynastyFilter}
        />

        <div className="flex-1 grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
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
