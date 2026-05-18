'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Breadcrumb from '../../components/Breadcrumb';
import SectionTitle from '../../components/SectionTitle';
import heritageData, { type HeritageItem, DYNASTIES } from './data';

export default function HeritagePage() {
  const [selected, setSelected] = useState<HeritageItem | null>(null);
  const [dynastyFilter, setDynastyFilter] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'process' | 'reference' | 'culture'>('process');

  const filtered = useMemo(
    () =>
      dynastyFilter
        ? heritageData.filter((item) => item.dynasty === dynastyFilter)
        : heritageData,
    [dynastyFilter]
  );

  // 关闭弹窗（按下 Escape 键）
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const openDetail = useCallback((item: HeritageItem) => {
    setSelected(item);
    setActiveTab('process');
  }, []);

  return (
    <main className="min-h-screen px-4 sm:px-6 py-12">
      <Breadcrumb crumbs={[
        { label: '首页', href: '/' },
        { label: '传承理念' },
      ]} />
      <SectionTitle
        title="纹样复原记录"
        subtitle="从考据研究到线稿绘制，再到色彩校对——记录纹样从文物到新生的完整旅程"
      />

      {/* 朝代筛选 */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        <button
          onClick={() => setDynastyFilter(null)}
          className={`px-5 py-2 rounded-full text-sm transition-all duration-200 ${
            dynastyFilter === null
              ? 'bg-ink text-white shadow-sm'
              : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100 shadow-sm'
          }`}
        >
          全部记录
        </button>
        {DYNASTIES.filter((d) => heritageData.some((h) => h.dynasty === d)).map((d) => (
          <button
            key={d}
            onClick={() => setDynastyFilter(d)}
            className={`px-5 py-2 rounded-full text-sm transition-all duration-200 ${
              dynastyFilter === d
                ? 'bg-gold text-white shadow-sm'
                : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100 shadow-sm'
            }`}
          >
            {d}代
          </button>
        ))}
      </div>

      {/* 记录卡片网格 */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group cursor-pointer bg-white rounded-xl overflow-hidden border border-gray-100
                         shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
              onClick={() => openDetail(item)}
            >
              {/* 封面图 */}
              <div className="relative w-full aspect-[16/9] overflow-hidden bg-stone-100">
                <Image
                  src={item.coverSrc}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* 视频状态指示 */}
                <div className={`absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs shadow ${
                  item.videoSrc || item.videoUrl
                    ? 'bg-gold text-white'
                    : 'bg-black/40 text-white/70'
                }`}>
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  {item.videoSrc || item.videoUrl ? '有视频' : '暂无'}
                </div>
              </div>

              {/* 信息区 */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block px-2.5 py-0.5 text-xs rounded-full bg-gold/20 text-gold font-medium">
                    {item.dynasty}代
                  </span>
                  <span className="text-xs text-gray-400">{item.date}</span>
                </div>
                <h3 className="text-base font-serif font-semibold text-ink mb-2 line-clamp-1">{item.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-2">{item.description}</p>
                {/* 进度标签 */}
                <div className="flex items-center gap-3 mt-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {item.processSteps.length} 步复原
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    {item.references.length} 件参考文物
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center py-20">该朝代暂无复原记录 · 敬请期待</p>
      )}

      {/* 详情弹窗 */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-8"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelected(null);
          }}
        >
          {/* 遮罩 */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* 弹窗内容 */}
          <div className="relative z-10 w-full max-w-5xl max-h-[90vh] bg-white rounded-xl sm:rounded-2xl overflow-y-auto shadow-2xl">
            {/* 关闭按钮 */}
            <button
              onClick={() => setSelected(null)}
              className="fixed top-2 right-2 sm:absolute sm:top-4 sm:right-4 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* 头部：封面大图 */}
            <div className="relative w-full aspect-video sm:aspect-[21/9] bg-stone-100">
              <Image
                src={selected.coverSrc}
                alt={selected.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
              {/* 渐变遮罩 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-8 right-4 sm:right-8">
                <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                  <span className="inline-block px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs rounded-full bg-gold text-white font-medium">
                    {selected.dynasty}代
                  </span>
                  <span className="text-white/70 text-[10px] sm:text-xs">{selected.date}</span>
                </div>
                <h2 className="text-lg sm:text-3xl font-serif font-semibold text-white">{selected.title}</h2>
                <p className="text-white/70 text-xs sm:text-sm mt-0.5 sm:mt-1 max-w-2xl line-clamp-2 sm:line-clamp-none">{selected.description}</p>
              </div>
            </div>

            {/* 视频区域 */}
            <div className="px-4 sm:px-8 pt-4 sm:pt-8">
              <h3 className="text-lg font-serif font-medium text-ink mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                复原过程视频
              </h3>

              {selected.videoSrc ? (
                /* 自托管视频 */
                <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden">
                  <video
                    className="w-full h-full object-contain"
                    controls
                    poster={selected.coverSrc}
                  >
                    <source src={selected.videoSrc} type="video/mp4" />
                    您的浏览器不支持视频播放，请尝试更换浏览器
                  </video>
                </div>
              ) : selected.videoUrl ? (
                /* 外部平台嵌入 */
                <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden">
                  <iframe
                    src={selected.videoUrl}
                    title={selected.videoTitle || selected.title}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              ) : (
                /* 暂无视频 — 引导上传区 */
                <div className="aspect-video rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center text-center p-8">
                  <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-400 font-medium mb-1">暂无视频</p>
                  <p className="text-gray-300 text-xs max-w-xs">
                    将拍摄的复原过程视频放入 <code className="bg-gray-100 px-1 rounded text-gray-400">public/videos/</code> 文件夹，
                    <br />然后在 <code className="bg-gray-100 px-1 rounded text-gray-400">data.ts</code> 中填入 <code className="bg-gray-100 px-1 rounded text-gray-400">videoSrc</code> 即可显示
                  </p>
                </div>
              )}
            </div>

            {/* 内容标签页 */}
            <div className="px-4 sm:px-8 pt-6 sm:pt-8 pb-2">
              <div className="flex border-b border-gray-200 gap-4 sm:gap-6 overflow-x-auto scrollbar-none">
                {([
                  { key: 'process' as const, label: '复原过程', icon: '✏️' },
                  { key: 'reference' as const, label: '文物对照', icon: '🏛️' },
                  { key: 'culture' as const, label: '文化背景', icon: '📜' },
                ]).map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`shrink-0 pb-3 text-xs sm:text-sm font-medium transition-all border-b-2 -mb-[1px] ${
                      activeTab === tab.key
                        ? 'border-gold text-gold'
                        : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 标签页内容 */}
            <div className="px-4 sm:px-8 py-4 sm:py-6 space-y-8 sm:space-y-10">
              {/* === 复原过程 === */}
              {activeTab === 'process' && (
                <div>
                  {selected.processSteps.map((step, idx) => (
                    <div key={idx} className="relative pl-10 pb-10 last:pb-0">
                      {/* 时间线竖线 */}
                      {idx < selected.processSteps.length - 1 && (
                        <div className="absolute left-[15px] top-6 bottom-0 w-0.5 bg-gradient-to-b from-qing to-transparent" />
                      )}
                      {/* 圆点 */}
                      <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-qing/20 flex items-center justify-center">
                        <span className="text-xs font-bold text-qing">{idx + 1}</span>
                      </div>

                      {/* 内容 */}
                      <div>
                        <h4 className="text-lg font-medium text-ink mb-1">{step.name}</h4>
                        <p className="text-gray-500 text-sm leading-relaxed mb-4">{step.desc}</p>
                        <div className="relative w-full aspect-video max-w-md rounded-lg overflow-hidden bg-stone-50 border border-gray-100">
                          <Image
                            src={step.imageSrc}
                            alt={step.name}
                            fill
                            className="object-cover"
                            sizes="400px"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* 最终成果 */}
                  <div className="mt-6 p-6 rounded-xl bg-gradient-to-br from-gold/10 to-qing/10 border border-gold/20">
                    <h4 className="text-lg font-medium text-ink mb-2 flex items-center gap-2">
                      <span>🎉</span> 复原成果
                    </h4>
                    <p className="text-gray-500 text-sm mb-4">{selected.designNotes}</p>
                    <div className="relative w-full aspect-video max-w-md rounded-lg overflow-hidden bg-stone-50 border border-gray-100">
                      <Image
                        src={selected.finalImage}
                        alt={`${selected.title} 最终成品`}
                        fill
                        className="object-cover"
                        sizes="400px"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* === 文物对照 === */}
              {activeTab === 'reference' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {selected.references.map((ref, idx) => (
                    <div key={idx} className="bg-stone-50 rounded-xl p-5 border border-gray-100">
                      <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-white mb-4">
                        <Image
                          src={ref.imageSrc}
                          alt={ref.name}
                          fill
                          className="object-contain p-2"
                          sizes="(max-width: 640px) 100vw, 50vw"
                        />
                      </div>
                      <h4 className="text-sm font-medium text-ink mb-1">{ref.name}</h4>
                      <p className="text-gray-500 text-xs leading-relaxed">{ref.desc}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* === 文化背景 === */}
              {activeTab === 'culture' && (
                <div className="max-w-3xl">
                  <div className="p-6 rounded-xl bg-gradient-to-br from-qing/5 to-gold/5 border border-qing/20">
                    <h4 className="text-ink font-medium text-base mb-3 flex items-center gap-2">
                      <span>📖</span> 文化传承背景
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                      {selected.culturalBackground}
                    </p>
                  </div>

                  <div className="mt-6 p-6 rounded-xl bg-ink/5 border border-gray-200">
                    <h4 className="text-ink font-medium text-base mb-3 flex items-center gap-2">
                      <span>💡</span> 设计说明与复原心得
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                      {selected.designNotes}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 底部 */}
            <div className="px-4 sm:px-8 py-3 sm:py-4 border-t border-gray-100 text-center">
              <p className="text-[10px] sm:text-xs text-gray-400">
                {selected.date} · {selected.category} · 共 {selected.processSteps.length} 步复原步骤 · 参考 {selected.references.length} 件文物
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
