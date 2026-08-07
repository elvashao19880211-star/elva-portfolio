'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '../../components/Breadcrumb';
import Lightbox from '../../components/Lightbox';
import NewThisMonth from '../../components/NewThisMonth';
import ActiveFilters from '../../components/ActiveFilters';
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
  STRUCTURE_L1,
  STRUCTURE_L2,
  COLORS,
  DYNASTY_ALIASES,
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
  '樱粉': 'bg-pink-300',
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
  expandedCategory,
  depth = 0,
}: {
  node: ElementNode;
  selected: Set<string>;
  onToggle: (id: string) => void;
  onCategoryClick?: (id: string) => void;
  expandedCategory?: string | null;
  depth?: number;
}) {
  const isSelected = selected.has(node.id);
  const isExpandedCat = expandedCategory === node.id;
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
            isExpandedCat
              ? 'bg-gold/10 text-gold font-semibold'
              : isSelected
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
              expandedCategory={expandedCategory}
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
  const [elementIds, setElementIds] = useState<Set<string>>(new Set());
  const [structureL1, setStructureL1] = useState<string | null>(null);
  const [structureL2, setStructureL2] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  // 当前展开查看二级元素的一级分类
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{ src: string; title: string } | null>(null);
  const [showMembership, setShowMembership] = useState(false);
  const [memberTier, setMemberTier] = useState<'personal' | 'commercial'>('personal');

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
    setElementIds(new Set());
    setStructureL1(null);
    setStructureL2(null);
    setColor(null);
    setSearchQuery('');
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [showNewOnly, setShowNewOnly] = useState(false);

  const hasFilters = dynasty || elementIds.size > 0 || structureL1 || color || !!searchQuery;

  // 当前展开的一级元素的二级子项
  const expandedChildren = useMemo(() => {
    if (!expandedCategory) return [];
    const cat = ELEMENT_TREE.find((n) => n.id === expandedCategory);
    return cat?.children ?? [];
  }, [expandedCategory]);

  const filtered = useMemo(() => {
    let result = materials;
    if (dynasty) result = result.filter((m) => m.dynasty === dynasty || DYNASTY_ALIASES[m.dynasty] === dynasty);
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
    if (structureL1) result = result.filter((m) => {
      if (!m.structureL1) return false;
      if (!structureL2) return m.structureL1 === structureL1;
      return m.structureL1 === structureL1 && m.structureL2 === structureL2;
    });
    if (color) result = result.filter((m) => m.colors.includes(color));
    // 搜索：匹配标题、朝代、元素名称
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((m) =>
        m.title.toLowerCase().includes(q) ||
        (m.dynasty && m.dynasty.toLowerCase().includes(q)) ||
        m.elements.some((eid) => {
          const label = elementLabelMap.get(eid);
          return label?.toLowerCase().includes(q);
        })
      );
    }
    if (showNewOnly) result = result.filter((m) => m.isNew);
    // 点击一级分类时，只显示该分类下的图片
    if (expandedCategory) {
      result = result.filter((m) =>
        m.elements.some((eid) => getAncestors(eid).has(expandedCategory))
      );
    }
    return result;
  }, [dynasty, elementIds, structureL1, structureL2, color, expandedCategory, searchQuery, showNewOnly]);

  return (
    <main className="min-h-screen px-4 sm:px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb crumbs={[{ label: '首页', href: '/' }, { label: '纹样素材' }]} />
      </div>
      <SectionTitle
        title="纹样素材"
        subtitle="朝代 · 元素 · 结构 · 颜色 —— 四维精准筛选"
      />

      <div className="max-w-7xl mx-auto mb-4 flex justify-center">
        <NewThisMonth
          count={materials.filter(m => m.isNew).length}
          active={showNewOnly}
          onClick={() => setShowNewOnly(!showNewOnly)}
        />
      </div>

      {/* 会员制度说明 */}
      <div className="max-w-7xl mx-auto mb-5 px-4 py-3 bg-gradient-to-r from-gold/5 via-white to-qing/5 border border-gold/20 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-semibold text-gold">会员制订阅</span>
        </div>
        <p className="text-[12px] text-ink/70 leading-relaxed">
          素材库采用年度会员制，开通后会员期内无限下载全部素材。内容持续上新，会员无需额外付费。如需购买单件成品纹样，请前往
          <Link href="/patterns" className="text-qing font-medium hover:underline mx-0.5">纹样库</Link>
        </p>
      </div>

      {/* 会员按钮 */}
      <div className="max-w-7xl mx-auto mb-6 flex justify-end">
        <button
          onClick={() => setShowMembership(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-gold to-amber-500 text-white rounded-xl text-sm font-medium
                     shadow-md hover:shadow-lg hover:from-amber-500 hover:to-amber-600 transition-all"
        >
          开通会员 · 下载全库素材
        </button>
      </div>

      {/* 搜索栏 */}
      <div className="max-w-7xl mx-auto mb-5 flex justify-center">
        <div className="relative w-full max-w-md">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索纹样..."
            className="w-full pl-10 pr-10 py-2.5 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 text-sm text-ink placeholder-gray-300
                       focus:outline-none focus:border-gold focus:bg-white focus:shadow-lg focus:shadow-gold/5 transition-all"
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

      {/* 当前筛选条件 */}
      <div className="max-w-7xl mx-auto mb-4">
        <ActiveFilters
          chips={[
            ...(dynasty ? [{ key: 'dynasty', label: '朝代', value: dynasty, onClear: () => setDynasty(null) }] : []),
            ...(elementIds.size > 0 ? [{ key: 'elements', label: '元素', value: `${elementIds.size}个元素`, onClear: () => setElementIds(new Set()) }] : []),
            ...(structureL1 && !structureL2 ? [{ key: 'structureL1', label: '结构', value: structureL1, onClear: () => setStructureL1(null) }] : []),
            ...(structureL1 && structureL2 ? [{ key: 'structureL2', label: '结构', value: `${structureL1} / ${structureL2}`, onClear: () => setStructureL2(null) }] : []),
            ...(color ? [{ key: 'color', label: '颜色', value: color, onClear: () => setColor(null) }] : []),
            ...(showNewOnly ? [{ key: 'new', label: '上新', value: '本月上新', onClear: () => setShowNewOnly(false) }] : []),
            ...(searchQuery ? [{ key: 'search', label: '搜索', value: `"${searchQuery}"`, onClear: () => setSearchQuery('') }] : []),
          ]}
        />
      </div>

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
                  <FilterBtn active={!dynasty} onClick={() => setDynasty(null)} isAll>
                    全部
                  </FilterBtn>
                  {DYNASTIES.map((d) => (
                    <FilterBtn key={d} active={dynasty === d} onClick={() => setDynasty(dynasty === d ? null : d)}>
                      {d}
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
                      expandedCategory={expandedCategory}
                    />
                  ))}
                </ul>
              </AccordionSection>

              {/* 结构 */}
              <AccordionSection title="结构" hasSelection={!!structureL1}>
                <div className="flex flex-col gap-0.5">
                  <FilterBtn active={!structureL1} onClick={() => setStructureL1(null)} isAll>
                    全部
                  </FilterBtn>
                  {STRUCTURE_L1.map((l1) => (
                    <FilterBtn key={l1} active={structureL1 === l1 && !structureL2} onClick={() => setStructureL1(structureL1 === l1 ? null : l1)}>
                      {l1}
                    </FilterBtn>
                  ))}
                </div>
                {structureL1 && (STRUCTURE_L2[structureL1]?.length ?? 0) > 0 && (
                  <div className="ml-3 mt-1 pt-1 border-l border-gray-100">
                    <div className="text-[10px] text-gray-400 mb-1 px-2">{structureL1}</div>
                    <div className="flex flex-col gap-0.5">
                      {STRUCTURE_L2[structureL1]!.map((l2) => (
                        <FilterBtn key={l2} active={structureL2 === l2} onClick={() => setStructureL2(structureL2 === l2 ? null : l2)}>
                          {l2}
                        </FilterBtn>
                      ))}
                    </div>
                  </div>
                )}
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
          <MobileScroll title="颜色" options={[...COLORS]} selected={color} onSelect={setColor} />
        </div>

        {/* ===== 素材网格 ===== */}
        <div className="flex-1 min-w-0">
          <ActiveChips
            dynasty={dynasty}
            elementIds={elementIds}
            structureL1={structureL1}
            structureL2={structureL2}
            color={color}
            onRemoveDynasty={() => setDynasty(null)}
            onRemoveElement={(id) => toggleElement(id)}
            onRemoveStructureL1={() => setStructureL1(null)}
            onRemoveStructureL2={() => setStructureL2(null)}
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

      {/* 会员购买弹窗 */}
      {showMembership && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowMembership(false)}>
          <div className="bg-white rounded-2xl max-w-sm w-full p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-serif font-semibold text-ink mb-1">开通会员</h3>
            <p className="text-xs text-gray-400 mb-6">素材库会员 · 年度订阅 · 全年持续上新</p>

            <div className="space-y-3">
              <div
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  memberTier === 'personal' ? 'border-gold bg-gold/5' : 'border-gray-100 hover:border-gold'
                }`}
                onClick={() => setMemberTier('personal')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink">个人/学习会员</p>
                    <p className="text-xs text-gray-400">非商业用途 · 全年持续上新</p>
                  </div>
                  <span className="text-lg font-serif font-bold text-gold">¥159/年</span>
                </div>
              </div>

              <div
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  memberTier === 'commercial' ? 'border-gold bg-gold/5' : 'border-gray-100 hover:border-gold'
                }`}
                onClick={() => setMemberTier('commercial')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink">商用会员</p>
                    <p className="text-xs text-gray-400">标准商业许可 · 全年持续上新</p>
                  </div>
                  <span className="text-lg font-serif font-bold text-gold">¥899/年</span>
                </div>
              </div>
            </div>

            {/* 二维码支付 */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500 mb-3">
                选择 <span className="font-medium text-ink">{memberTier === 'personal' ? '个人/学习会员 ¥159/年' : '商用会员 ¥899/年'}</span>
              </p>
              <div className="bg-gray-50 rounded-xl p-4 inline-block mb-3">
                <img src="/qrcode.png" alt="支付宝付款码" className="w-48 h-48 object-contain" />
              </div>
              <p className="text-xs text-gray-400">请使用支付宝扫码支付</p>
              <p className="text-[10px] text-gray-300 mt-1">支付后请联系客服开通会员</p>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-100">
              <p className="text-[10px] text-gray-500 leading-relaxed">
                会员有效期365天 · 到期需续费<br />
                会员到期后已用于产品的素材可继续使用<br />
                源文件不包含在会员权益内
              </p>
            </div>

            <button onClick={() => setShowMembership(false)} className="btn-outline w-full text-xs mt-4">关闭</button>
          </div>
        </div>
      )}
    </main>
  );
}

/* ========== 子组件 ========== */

function FilterBtn({ active, onClick, children, isAll }: { active: boolean; onClick: () => void; children: string; isAll?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`text-left text-[11px] px-2 py-1 rounded-md transition-colors ${
        active
          ? isAll
            ? 'bg-ink/5 text-ink font-medium'
            : 'bg-gold/10 text-gold font-medium'
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
  dynasty, elementIds, structureL1, structureL2, color,
  onRemoveDynasty, onRemoveElement,
  onRemoveStructureL1, onRemoveStructureL2, onRemoveColor, count,
}: {
  dynasty: string | null; elementIds: Set<string>;
  structureL1: string | null; structureL2: string | null; color: string | null;
  onRemoveDynasty: () => void;
  onRemoveElement: (id: string) => void;
  onRemoveStructureL1: () => void; onRemoveStructureL2: () => void; onRemoveColor: () => void;
  count: number;
}) {
  return (
    <div className="flex items-center flex-wrap gap-1.5 mb-5 text-[11px]">
      {dynasty && <Chip label={dynasty} onRemove={onRemoveDynasty} />}
      {structureL1 && !structureL2 && <Chip label={structureL1} onRemove={onRemoveStructureL1} />}
      {structureL1 && structureL2 && <Chip label={`${structureL1} / ${structureL2}`} onRemove={onRemoveStructureL2} />}
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
          src={item.src.replace('/images/materials/', '/images/materials/thumbs/')}
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
        </div>
      </div>
    </div>
  );
}
