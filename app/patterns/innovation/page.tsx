'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Breadcrumb from '../../../components/Breadcrumb';
import SectionTitle from '../../../components/SectionTitle';
import FilterSidebar from '../../../components/FilterSidebar';
import PatternDetail from '../../../components/PatternDetail';
import innovationPatterns, { type InnovationPattern } from './data';

export default function InnovationPatternsPage() {
  const [selected, setSelected] = useState<InnovationPattern | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const categories = useMemo(() => {
    const set = new Set(innovationPatterns.map((p) => p.category));
    return Array.from(set);
  }, []);

  const filtered = useMemo(
    () =>
      categoryFilter
        ? innovationPatterns.filter((p) => p.category === categoryFilter)
        : innovationPatterns,
    [categoryFilter]
  );

  return (
    <main className="min-h-screen px-4 sm:px-6 py-12">
      <Breadcrumb crumbs={[
        { label: '首页', href: '/' },
        { label: '纹样库', href: '/patterns' },
        { label: '创新纹样' },
      ]} />
      <SectionTitle title="创新纹样" subtitle="按分类筛选 · 点击作品查看设计理念" />

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 max-w-6xl mx-auto">
        <FilterSidebar
          label="按分类"
          options={categories}
          selected={categoryFilter}
          onChange={setCategoryFilter}
        />

        <div className="flex-1 grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
          {filtered.length === 0 ? (
            <p className="col-span-full text-gray-400 text-center py-20">暂无该分类的作品</p>
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
