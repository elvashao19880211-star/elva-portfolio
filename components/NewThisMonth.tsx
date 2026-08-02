'use client';

interface NewBadgeProps {
  count: number;
  active: boolean;
  onClick: () => void;
}

export default function NewThisMonth({ count, active, onClick }: NewBadgeProps) {
  if (count === 0) return null;

  return (
    <button
      onClick={onClick}
      className={`
        group flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
        transition-all duration-300 border
        ${active
          ? 'bg-qing text-white border-qing shadow-md'
          : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:border-amber-300'}
      `}
    >
      <span>本月上新</span>
      <span className={`
        inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5
        rounded-full text-xs font-bold
        ${active ? 'bg-white/20 text-white' : 'bg-amber-200 text-amber-800'}
      `}>
        {count}
      </span>
      {active && (
        <span className="ml-1 text-xs opacity-70">✕ 查看全部</span>
      )}
    </button>
  );
}
