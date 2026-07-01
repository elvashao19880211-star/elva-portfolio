'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Breadcrumb from '../../components/Breadcrumb';
import SectionTitle from '../../components/SectionTitle';
import materials, {
  ELEMENT_TREE,
  DYNASTIES,
  CARRIERS,
  STRUCTURES,
  COLORS,
  flattenElements,
  getElementPath,
  type ElementNode,
  type MaterialItem,
} from './data';

// 预计算标签映射
const elementLabelMap = flattenElements(ELEMENT_TREE);

/* ========== 元素树组件（递归展开） ========== */
function ElementTreeItem({
  node,
  selected,
  onToggle,
  depth = 0,
}: {
  node: ElementNode;
  selected: Set<string>;
  onToggle: (id: string) => void;
  depth?: number;
}) {
  const isSelected = selected.has(node.id);
  const hasChildren = node.children && node.children.length > 0;
  const [expanded, setExpanded] = useState(depth < 1); // 默认展开一级

  return (
    <li>
      <div className="flex items-center group">
        {hasChildren && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-5 h-5 flex items-center justify-center text-gray-300 hover:text-ink text-[10px] shrink-0"
          >
            {expanded ? '▾' : '▸'}
          </button>
        )}
        {!hasChildren && <span className="w-5 shrink-0" />}
        <button
          onClick={() => onToggle(node.id)}
          className={`text-left px-1.5 py-1 rounded text-xs transition-colors truncate flex-1 ${
            isSelected
              ? 'bg-gold/15 text-gold font-medium'
              : 'text-gray-400 hover:bg-gray-100 hover:text-ink'
          }`}
          style={{ paddingLeft: hasChildren ? 0 : 20 }}
        >
          {node.label}
        </button>
      </div>
      {hasChildren && expanded && (
        <ul className="ml-2.5 border-l border-gray-100 pl-2">
          {node.children!.map((child) => (
            <ElementTreeItem
              key={child.id}
              node={child}
              selected={selected}
              onToggle={onToggle}
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
  // 五维筛选状态
  const [dynasty, setDynasty] = useState<string | null>(null);
  const [carrier, setCarrier] = useState<string | null>(null);
  const [elementIds, setElementIds] = useState<Set<string>>(new Set());
  const [structure, setStructure] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);

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

  const filtered = useMemo(() => {
    let result = materials;
    if (dynasty) result = result.filter((m) => m.dynasty === dynasty);
    if (carrier) result = result.filter((m) => m.carrier === carrier);
    if (elementIds.size > 0) {
      result = result.filter((m) => m.elements.some((eid) => elementIds.has(eid)));
    }
    if (structure) result = result.filter((m) => m.structure === structure);
    if (color) result = result.filter((m) => m.colors.includes(color));
    return result;
  }, [dynasty, carrier, elementIds, structure, color]);

  return (
    <main className="min-h-screen px-4 sm:px-6 py-12">
      <Breadcrumb crumbs={[{ label: '首页', href: '/' }, { label: '纹样素材' }]} />
      <SectionTitle
        title="纹样素材"
        subtitle="朝代 · 载体 · 元素 · 结构 · 颜色 —— 五维精准筛选"
      />

      <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
        {/* ===== 侧边栏 ===== */}
        <aside className="hidden lg:block w-48 shrink-0 space-y-6">
          {/* 全部 + 清除 */}
          <div className="flex items-center gap-2">
            <button
              onClick={clearAll}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                !hasFilters ? 'bg-ink text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              全部素材
            </button>
          </div>

          {/* 朝代 */}
          <FilterSection title="朝代">
            {DYNASTIES.map((d) => (
              <FilterBtn key={d} active={dynasty === d} onClick={() => setDynasty(dynasty === d ? null : d)}>
                {d}
              </FilterBtn>
            ))}
          </FilterSection>

          {/* 载体 */}
          <FilterSection title="载体">
            {CARRIERS.map((c) => (
              <FilterBtn key={c} active={carrier === c} onClick={() => setCarrier(carrier === c ? null : c)}>
                {c}
              </FilterBtn>
            ))}
          </FilterSection>

          {/* 元素（树形） */}
          <FilterSection title="元素">
            <ul className="space-y-0.5 -ml-1">
              {ELEMENT_TREE.map((node) => (
                <ElementTreeItem
                  key={node.id}
                  node={node}
                  selected={elementIds}
                  onToggle={toggleElement}
                />
              ))}
            </ul>
          </FilterSection>

          {/* 结构 */}
          <FilterSection title="结构">
            {STRUCTURES.map((s) => (
              <FilterBtn key={s} active={structure === s} onClick={() => setStructure(structure === s ? null : s)}>
                {s}
              </FilterBtn>
            ))}
          </FilterSection>

          {/* 颜色 */}
          <FilterSection title="颜色" colorChips>
            <div className="flex flex-wrap gap-1.5">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(color === c ? null : c)}
                  className={`px-2 py-1 rounded-full text-[11px] transition-all border ${
                    color === c
                      ? 'border-gold bg-gold/10 text-gold font-medium'
                      : 'border-gray-200 text-gray-400 hover:border-gray-300'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </FilterSection>
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
          {/* 当前筛选标签 */}
          <ActiveChips
            dynasty={dynasty}
            carrier={carrier}
            elementIds={elementIds}
            structure={structure}
            color={color}
            onClear={clearAll}
            onRemoveDynasty={() => setDynasty(null)}
            onRemoveCarrier={() => setCarrier(null)}
            onRemoveElement={(id) => toggleElement(id)}
            onRemoveStructure={() => setStructure(null)}
            onRemoveColor={() => setColor(null)}
            count={filtered.length}
          />

          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {filtered.map(renderCard)}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-20">
              暂无符合条件的素材 · 换个筛选条件试试
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

/* ========== 子组件 ========== */

function FilterSection({
  title,
  children,
  colorChips,
}: {
  title: string;
  children: React.ReactNode;
  colorChips?: boolean;
}) {
  return (
    <div>
      <h3 className="text-xs font-serif font-semibold text-ink mb-2">{title}</h3>
      <div className={colorChips ? '' : 'flex flex-col gap-1'}>{children}</div>
    </div>
  );
}

function FilterBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button
      onClick={onClick}
      className={`text-left text-xs px-2 py-1 rounded transition-colors ${
        active ? 'bg-gold/15 text-gold font-medium' : 'text-gray-400 hover:bg-gray-100 hover:text-ink'
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
  onClear, onRemoveDynasty, onRemoveCarrier, onRemoveElement,
  onRemoveStructure, onRemoveColor, count,
}: {
  dynasty: string | null; carrier: string | null; elementIds: Set<string>;
  structure: string | null; color: string | null;
  onClear: () => void;
  onRemoveDynasty: () => void; onRemoveCarrier: () => void;
  onRemoveElement: (id: string) => void;
  onRemoveStructure: () => void; onRemoveColor: () => void;
  count: number;
}) {
  return (
    <div className="flex items-center flex-wrap gap-1.5 mb-4 text-[11px]">
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
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold/10 text-gold text-[11px]">
      {label}
      <button onClick={onRemove} className="hover:text-red-400">×</button>
    </span>
  );
}

/* ========== 卡片渲染 ========== */

function renderCard(item: MaterialItem) {
  return (
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
