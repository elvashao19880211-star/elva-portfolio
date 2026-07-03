'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Breadcrumb from '../../components/Breadcrumb';
import Lightbox from '../../components/Lightbox';
import { ELEMENT_TREE, type ElementNode } from './data';

// 预构建祖先映射：每个元素 ID → 其所有祖先 ID（含自身）
function buildAncestorMap(tree: ElementNode[]) {
  const map = new Map<string, Set<string>>();
  (function walk(nodes: ElementNode[], ancestors: string[]) {
    for (const n of nodes) {
      map.set(n.id, new Set([...ancestors, n.id]));
      if (n.children) walk(n.children, [...ancestors, n.id]);
    }
  })(tree, []);
  return map;
}
const ancestorMap = buildAncestorMap(ELEMENT_TREE);
const getAncestors = (id: string) => ancestorMap.get(id) ?? new Set<string>();
import SectionTitle from '../../components/SectionTitle';
import materials, {
  DYNASTIES,
  CARRIERS,
  STRUCTURES,
  COLORS,
  flattenElements,
  getElementPath,
  type MaterialItem,
} from './data';

// 预计算标签映射
const elementLabelMap = flattenElements(ELEMENT_TREE);

/* ========== 颜色映射（纯色色块用） ========== */
const COLOR_SWATCH: Record<string, string> = {
  '青蓝': 'bg-sky-500',
  '赤红': 'bg-rose-500',
  '黄金': 'bg-amber-400',
  '白素': 'bg-stone-200 ring-1 ring-gray-300',
  '黑墨': 'bg-stone-800',
  '绿翠': 'bg-emerald-500',
  '紫绀': 'bg-purple-500',
  '赭褐': 'bg-amber-700',
  '烟灰': 'bg-gray-400',
  '银素': 'bg-slate-300',
  '多色': 'bg-gradient-to-r from-rose-400 via-amber-400 to-sky-400',
};

/* ========== 可折叠分区组件 ========== */
function AccordionSection({
  title,
  children,
  hasSelection = false,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  hasSelection?: boolean;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-50 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2.5 text-xs hover:bg-gray-50/80 transition-colors"
      >
        <span className={`font-serif font-semibold ${open ? 'text-ink' : 'text-gray-500'}`}>{title}</span>
        {hasSelection && <span className="w-1.5 h-1.5 rounded-full bg-gold ml-auto" />}
        <svg
          className={`w-3 h-3 text-gray-300 transition-transform ${hasSelection ? '' : 'ml-auto'} ${open ? 'rotate-90' : ''}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && <div className="px-3 pb-2.5">{children}</div>}
    </div>
  );
}

/* ========== 元素树组件（递归展开） ========== */
function ElementTreeItem({
  node,
  selected,
  onToggle,
  onCategoryClick,
  depth = 0,
}: {
  node: ElementNode;
  selected: Set<string>;
  onToggle: (id: string) => void;
  onCategoryClick?: (id: string) => void;
  depth?: number;
}) {
  const isSelected = selected.has(node.id);
  const hasChildren = node.children && node.children.length > 0;
  const [expanded, setExpanded] = useState(false);
  const isTopLevel = depth === 0;

  const handleLabelClick = () => {
    if (isTopLevel && onCategoryClick) {
      // 点击一级分类名 → 图片上方显示二级分类
      onCategoryClick(node.id);
    } else {
      // 点击二/三级 → 直接筛选
      onToggle(node.id);
    }
  };

  return (
    <li>
      <div className="flex items-center group">
        {hasChildren ? (
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-4 h-4 flex items-center justify-center text-gray-300 hover:text-ink text-[9px] shrink-0"
          >
            {expanded ? '▾' : '▸'}
          </button>
        ) : (
          <span className="w-4 shrink-0" />
        )}
        <button
          onClick={handleLabelClick}
          className={`text-left px-1 py-0.5 rounded text-[11px] transition-colors truncate flex-1 ${
            isSelected
              ? 'bg-gold/10 text-gold font-medium'
              : 'text-gray-400 hover:bg-gray-50 hover:text-ink'
          }`}
        >
          {node.label}
        </button>
      </div>
      {hasChildren && expanded && (
        <ul className="ml-2 border-l border-gray-100 pl-1.5">
          {node.children!.map((child) => (
            <ElementTreeItem
              key={child.id}
              node={child}
              selected={selected}
              onToggle={onToggle}
              onCategoryClick={onCategoryClick}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

/* ========== 主页面 ========== */
export default function MaterialsPage() {
  const [dynasty, setDynasty] = useState<string | null>(null);
  const [carrier, setCarrier] = useState<string | null>(null);
  const [elementIds, setElementIds] = useState<Set<string>>(new Set());
  const [structure, setStructure] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  // 当前展开查看二级元素的一级分类
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{ src: string; title: string } | null>(null);

  const toggleElement = (id: string) => {
    setElementIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearAll = () => {
    setDynasty(null);
    setCarrier(null);
    setElementIds(new Set());
    setStructure(null);
    setColor(null);
  };

  const hasFilters = dynasty || carrier || elementIds.size > 0 || structure || color;

  // 当前展开的一级元素的二级子项
  const expandedChildren = useMemo(() => {
    if (!expandedCategory) return [];
    const cat = ELEMENT_TREE.find((n) => n.id === expandedCategory);
    return cat?.children ?? [];
  }, [expandedCategory]);

  const filtered = useMemo(() => {
    let result = materials;
    if (dynasty) result = result.filter((m) => m.dynasty === dynasty);
    if (carrier) result = result.filter((m) => m.carrier === carrier);
    if (elementIds.size > 0) {
      result = result.filter((m) =>
        m.elements.some((eid) => {
          if (elementIds.has(eid)) return true;
          // 如果选的是父级，匹配其所有子孙
          const ancestors = getAncestors(eid);
          return [...elementIds].some((sid) => ancestors.has(sid));
        })
      );
    }
    if (structure) result = result.filter((m) => m.structure === structure);
    if (color) result = result.filter((m) => m.colors.includes(color));
    // 点击一级分类时，只显示该分类下的图片
    if (expandedCategory) {
      result = result.filter((m) =>
        m.elements.some((eid) => getAncestors(eid).has(expandedCategory))
      );
    }
    return result;
  }, [dynasty, carrier, elementIds, structure, color, expandedCategory]);

  return (
    <main className="min-h-screen px-4 sm:px-6 py-12">
      <Breadcrumb crumbs={[{ label: '首页', href: '/' }, { label: '纹样素材' }]} />
      <SectionTitle
        title="纹样素材"
        subtitle="朝代 · 载体 · 元素 · 结构 · 颜色 —— 五维精准筛选"
      />

      <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
        {/* ===== 侧边栏 ===== */}
        <aside className="hidden lg:block w-52 shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
            {/* 头部 */}
            <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <span className="text-xl font-serif font-semibold text-ink">
                筛选条件
              </span>
              {hasFilters && (
                <button
                  onClick={clearAll}
                  className="text-[10px] text-gray-300 hover:text-red-400 transition-colors px-1.5 py-0.5 rounded hover:bg-red-50"
                >
                  ✕ 清除
                </button>
              )}
            </div>

            <div className="py-1 max-h-[calc(100vh-260px)] overflow-y-auto">
              {/* 全部素材 */}
              <div className="px-3 py-2">
                <button
                  onClick={clearAll}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all font-medium ${
                    !hasFilters
                      ? 'bg-ink text-white shadow-sm'
                      : 'text-gray-400 bg-gray-50 hover:bg-gray-100 hover:text-ink'
                  }`}
                >
                  ◈ 全部素材
                </button>
              </div>

              {/* 朝代 */}
              <AccordionSection title="朝代" hasSelection={!!dynasty} defaultOpen>
                <div className="flex flex-col gap-0.5">
                  {DYNASTIES.map((d) => (
                    <FilterBtn key={d} active={dynasty === d} onClick={() => setDynasty(dynasty === d ? null : d)}>
                      {d}
                    </FilterBtn>
                  ))}
                </div>
              </AccordionSection>

              {/* 载体 */}
              <AccordionSection title="载体" hasSelection={!!carrier}>
                <div className="flex flex-col gap-0.5">
                  {CARRIERS.map((c) => (
                    <FilterBtn key={c} active={carrier === c} onClick={() => setCarrier(carrier === c ? null : c)}>
                      {c}
                    </FilterBtn>
                  ))}
                </div>
              </AccordionSection>

              {/* 元素 */}
              <AccordionSection title="元素" hasSelection={elementIds.size > 0}>
                <ul className="space-y-0.5">
                  {ELEMENT_TREE.map((node) => (
                    <ElementTreeItem
                      key={node.id}
                      node={node}
                      selected={elementIds}
                      onToggle={toggleElement}
                      onCategoryClick={setExpandedCategory}
                    />
                  ))}
                </ul>
              </AccordionSection>

              {/* 结构 */}
              <AccordionSection title="结构" hasSelection={!!structure}>
                <div className="flex flex-col gap-0.5">
                  {STRUCTURES.map((s) => (
                    <FilterBtn key={s} active={structure === s} onClick={() => setStructure(structure === s ? null : s)}>
                      {s}
                    </FilterBtn>
                  ))}
                </div>
              </AccordionSection>

              {/* 颜色 */}
              <AccordionSection title="颜色" hasSelection={!!color}>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(color === c ? null : c)}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] transition-all ${
                        color === c
                          ? 'bg-gray-100 ring-1 ring-gold/40 shadow-sm'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full shrink-0 shadow-inner ring-1 ring-black/5 ${COLOR_SWATCH[c] ?? 'bg-gray-300'}`} />
                      <span className={color === c ? 'text-ink font-medium' : 'text-gray-400'}>{c}</span>
                    </button>
                  ))}
                </div>
              </AccordionSection>
            </div>
          </div>
        </aside>

        {/* ===== 移动端横滑筛选 ===== */}
        <div className="lg:hidden space-y-2">
          <MobileScroll title="朝代" options={[...DYNASTIES]} selected={dynasty} onSelect={setDynasty} />
          <MobileScroll title="载体" options={[...CARRIERS]} selected={carrier} onSelect={setCarrier} />
          <MobileScroll title="结构" options={[...STRUCTURES]} selected={structure} onSelect={setStructure} />
          <MobileScroll title="颜色" options={[...COLORS]} selected={color} onSelect={setColor} />
        </div>

        {/* ===== 素材网格 ===== */}
        <div className="flex-1 min-w-0">
          <ActiveChips
            dynasty={dynasty}
            carrier={carrier}
            elementIds={elementIds}
            structure={structure}
            color={color}
            onRemoveDynasty={() => setDynasty(null)}
            onRemoveCarrier={() => setCarrier(null)}
            onRemoveElement={(id) => toggleElement(id)}
            onRemoveStructure={() => setStructure(null)}
            onRemoveColor={() => setColor(null)}
            count={filtered.length}
          />

          {/* 二级元素分类 chip 条（点=筛选，不再钻取） */}
          {expandedChildren.length > 0 && (
            <div className="mb-4 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] text-gray-400">
                  {ELEMENT_TREE.find((n) => n.id === expandedCategory)?.label} · 二级分类
                </span>
                {expandedChildren.some((c) => elementIds.has(c.id)) && (
                  <button
                    onClick={() => expandedChildren.forEach((c) => elementIds.has(c.id) && toggleElement(c.id))}
                    className="text-[10px] text-gray-300 hover:text-red-400"
                  >
                    清除
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {expandedChildren.map((child) => {
                  const count = filtered.filter((item) =>
                    item.elements.some((id) => getAncestors(id).has(child.id))
                  ).length;
                  return (
                    <button
                      key={child.id}
                      onClick={() => toggleElement(child.id)}
                      className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                        elementIds.has(child.id)
                          ? 'bg-gold/15 text-gold font-medium border border-gold/30 shadow-sm'
                          : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-ink border border-transparent'
                      }`}
                    >
                      {child.label} {count > 0 && <span className="opacity-50 ml-0.5">{count}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {filtered.map((item) => renderCard(item, setLightbox))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-gray-400 text-sm">暂无符合条件的素材</p>
              <p className="text-gray-300 text-xs mt-1">换个筛选条件试试</p>
            </div>
          )}
        </div>
      </div>
      {lightbox && (
        <Lightbox
          src={lightbox.src}
          title={lightbox.title}
          onClose={() => setLightbox(null)}
        />
      )}
    </main>
  );
}

/* ========== 子组件 ========== */

function FilterBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button
      onClick={onClick}
      className={`text-left text-[11px] px-2 py-1 rounded-md transition-colors ${
        active
          ? 'bg-gold/10 text-gold font-medium'
          : 'text-gray-400 hover:bg-gray-50 hover:text-ink'
      }`}
    >
      {children}
    </button>
  );
}

function MobileScroll({
  title,
  options,
  selected,
  onSelect,
}: {
  title: string;
  options: string[];
  selected: string | null;
  onSelect: (v: string | null) => void;
}) {
  return (
    <div>
      <h3 className="text-[11px] font-serif font-semibold text-ink mb-1">{title}</h3>
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => onSelect(null)}
          className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] whitespace-nowrap transition-colors ${
            !selected ? 'bg-ink text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          全部
        </button>
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onSelect(selected === o ? null : o)}
            className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] whitespace-nowrap transition-colors ${
              selected === o
                ? 'bg-gold/15 text-gold font-medium border border-gold/30'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function ActiveChips({
  dynasty, carrier, elementIds, structure, color,
  onRemoveDynasty, onRemoveCarrier, onRemoveElement,
  onRemoveStructure, onRemoveColor, count,
}: {
  dynasty: string | null; carrier: string | null; elementIds: Set<string>;
  structure: string | null; color: string | null;
  onRemoveDynasty: () => void; onRemoveCarrier: () => void;
  onRemoveElement: (id: string) => void;
  onRemoveStructure: () => void; onRemoveColor: () => void;
  count: number;
}) {
  return (
    <div className="flex items-center flex-wrap gap-1.5 mb-5 text-[11px]">
      {dynasty && <Chip label={dynasty} onRemove={onRemoveDynasty} />}
      {carrier && <Chip label={carrier} onRemove={onRemoveCarrier} />}
      {structure && <Chip label={structure} onRemove={onRemoveStructure} />}
      {color && <Chip label={color} onRemove={onRemoveColor} />}
      {Array.from(elementIds).map((eid) => (
        <Chip key={eid} label={elementLabelMap.get(eid) ?? eid} onRemove={() => onRemoveElement(eid)} />
      ))}
      <span className="text-gray-400 ml-auto">{count} 个素材</span>
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-gray-200 text-gray-600 shadow-sm">
      {label}
      <button onClick={onRemove} className="text-gray-300 hover:text-red-400 text-xs leading-none">×</button>
    </span>
  );
}

/* ========== 卡片渲染 ========== */

function renderCard(item: MaterialItem, setLightbox: (lb: { src: string; title: string } | null) => void) {
  return (
    <div
      key={item.id}
      className="group cursor-pointer bg-white rounded-xl overflow-hidden border border-gray-100
                 shadow-sm hover:shadow-lg transition-all duration-300"
      onClick={() => setLightbox({ src: item.src, title: item.title })}
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
          <span className="shrink-0 px-1.5 py-0.5 text-[10px] rounded bg-gold/15 text-gold font-medium">
            {item.dynasty}
          </span>
        </div>
        <p className="text-[11px] text-gray-400 line-clamp-1">{item.description}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {item.elements.slice(0, 3).map((eid) => (
            <span key={eid} className="px-1.5 py-0.5 text-[10px] rounded bg-gray-100 text-gray-500">
              {elementLabelMap.get(eid) ?? eid}
            </span>
          ))}
          {item.colors.slice(0, 2).map((c) => (
            <span key={c} className="px-1.5 py-0.5 text-[10px] rounded bg-qing/10 text-qing">
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
