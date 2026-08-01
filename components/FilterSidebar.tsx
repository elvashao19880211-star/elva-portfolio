interface FilterSidebarProps {
  label: string;
  options: string[];
  selected: string | null;
  onChange: (value: string | null) => void;
  mobileOnly?: boolean;   // true = only show mobile view
  desktopOnly?: boolean;  // true = only show desktop view (no outer aside)
}

export default function FilterSidebar({
  label,
  options,
  selected,
  onChange,
  mobileOnly = false,
  desktopOnly = false,
}: FilterSidebarProps) {
  const renderList = () => (
    <>
      <h3 className="text-sm font-serif font-semibold text-ink mb-3">{label}</h3>
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
    </>
  );

  // 纯桌面模式（不含外框，由父级包）
  if (desktopOnly) {
    return <div className="hidden lg:block">{renderList()}</div>;
  }

  // 纯手机模式
  if (mobileOnly) {
    return (
      <div className="lg:hidden mb-3">
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none items-center">
          <h3 className="text-xs font-serif font-semibold text-ink shrink-0 mr-1">{label}</h3>
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
    );
  }

  // 默认：完整侧边栏
  return (
    <>
      <aside className="hidden lg:block w-44 shrink-0">{renderList()}</aside>
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
    </>
  );
}
