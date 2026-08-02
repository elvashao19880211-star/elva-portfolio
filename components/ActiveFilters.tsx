'use client';

interface FilterChip {
  key: string;
  label: string;   // 筛选维度名
  value: string;   // 当前值
  onClear: () => void;
}

export default function ActiveFilters({ chips }: { chips: FilterChip[] }) {
  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[11px] text-gray-400 shrink-0">当前筛选：</span>
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] rounded-full bg-qing/10 text-ink/70 border border-qing/20"
        >
          <span className="text-gray-400">{chip.label}:</span>
          <span>{chip.value}</span>
          <button
            onClick={chip.onClear}
            className="ml-0.5 w-3.5 h-3.5 rounded-full hover:bg-qing/30 flex items-center justify-center text-[9px] text-ink/40 hover:text-ink transition-colors"
            title={`清除 ${chip.label}`}
          >
            ✕
          </button>
        </span>
      ))}
      <button
        onClick={() => chips.forEach((c) => c.onClear())}
        className="text-[11px] text-gray-400 hover:text-ink/60 underline underline-offset-2 transition-colors ml-1"
      >
        清除全部
      </button>
    </div>
  );
}
