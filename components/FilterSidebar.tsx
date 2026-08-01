'use client';

import { useState } from 'react';

interface FilterSidebarProps {
  label: string;
  options: string[];
  selected: string | null;
  onChange: (value: string | null) => void;
  mobileOnly?: boolean;
  desktopOnly?: boolean;
  defaultOpen?: boolean;
}

export default function FilterSidebar({
  label,
  options,
  selected,
  onChange,
  mobileOnly = false,
  desktopOnly = false,
  defaultOpen = false,
}: FilterSidebarProps) {
  const [open, setOpen] = useState(defaultOpen);

  const chevron = (
    <svg
      className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
    </svg>
  );

  const renderList = () => (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left mb-3 group"
      >
        <h3 className="text-sm font-serif font-semibold text-ink/80 group-hover:text-ink transition-colors">
          {label}
        </h3>
        {chevron}
      </button>
      {open && (
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
      )}
    </>
  );

  if (desktopOnly) {
    return <div className="hidden lg:block">{renderList()}</div>;
  }

  if (mobileOnly) {
    return (
      <div className="lg:hidden mb-3">
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none items-center">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-0.5 shrink-0 mr-1"
          >
            <h3 className="text-xs font-serif font-semibold text-ink/70">{label}</h3>
            {chevron}
          </button>
          {open && (
            <>
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
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <aside className="hidden lg:block w-44 shrink-0">{renderList()}</aside>
      <div className="lg:hidden mb-4">
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none items-center">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-0.5 shrink-0 mr-1"
          >
            <h3 className="text-xs font-serif font-semibold text-ink/70">{label}</h3>
            {chevron}
          </button>
          {open && (
            <>
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
            </>
          )}
        </div>
      </div>
    </>
  );
}
