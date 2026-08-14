import Breadcrumb from '../../components/Breadcrumb';
import SectionTitle from '../../components/SectionTitle';
import { FAQ, CATEGORIES } from './data';

export default function CommunityPage() {
  return (
    <main className="min-h-screen px-4 sm:px-6 py-12">
      <Breadcrumb
        crumbs={[
          { label: '首页', href: '/' },
          { label: '纹样知识' },
        ]}
      />
      <SectionTitle
        title="纹样知识库"
        subtitle="常见问题、设计技法和文化背景，持续更新"
      />

      <div className="max-w-3xl mx-auto space-y-12">
        {CATEGORIES.map((cat) => {
          const items = FAQ.filter((f) => f.category === cat.id);
          if (items.length === 0) return null;

          return (
            <section key={cat.id}>
              <h3 className="text-lg font-serif font-semibold text-ink mb-4 flex items-center gap-2">
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </h3>
              <div className="space-y-3">
                {items.map((item, i) => (
                  <details
                    key={i}
                    className="group bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden transition-all"
                  >
                    <summary className="flex items-center justify-between cursor-pointer p-4 sm:p-5 select-none">
                      <span className="text-sm sm:text-base font-serif text-ink pr-4 group-open:text-qing transition-colors">
                        {item.q}
                      </span>
                      <svg
                        className="w-4 h-4 text-gray-300 group-open:rotate-180 group-open:text-qing transition-all shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </summary>
                    <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed">
                      {item.a.split('\n').map((line, j) => (
                        <p key={j} className="mb-2 last:mb-0">
                          {line || '\u00A0'}
                        </p>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <p className="text-center text-xs text-gray-300 mt-16">
        内容持续更新 · 有问题欢迎在小红书 @河图纹画 留言
      </p>
    </main>
  );
}
