interface FilterSidebarProps {
  label: string;
  options: string[];
  selected: string | null;
  onChange: (value: string | null) => void;
  horizontalOnMobile?: boolean;
}

export default function FilterSidebar({
  label,
  options,
  selected,
  onChange,
  horizontalOnMobile = true,
}: FilterSidebarProps) {
  return (
    <>
      {/* 桌面端：侧边栏 */}
      <aside className="hidden lg:block w-44 shrink-0">
        <h3 className="text-sm font-serif font-semibold text-ink mb-4">{label}</h3>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => onChange(null)}
              className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-all duration-200 ${
                selected === null
                  ? 'bg-ink text-white shadow-sm'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-ink'
              }`}
            >
              全部
            </button>
          </li>
          {options.map((opt) => (
            <li key={opt}>
              <button
                onClick={() => onChange(opt)}
                className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-all duration-200 ${
                  selected === opt
                    ? 'bg-gold/15 text-gold font-medium border border-gold/20'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-ink'
                }`}
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* 手机端：横滑 pills */}
      {horizontalOnMobile && (
        <div className="lg:hidden mb-4">
          <h3 className="text-xs font-serif font-semibold text-ink mb-2">{label}</h3>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => onChange(null)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs transition-all duration-200 whitespace-nowrap ${
                selected === null
                  ? 'bg-ink text-white shadow-sm'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              全部
            </button>
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => onChange(opt)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs transition-all duration-200 whitespace-nowrap ${
                  selected === opt
                    ? 'bg-gold/15 text-gold font-medium border border-gold/30'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
