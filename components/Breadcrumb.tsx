interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  crumbs: Crumb[];
}

export default function Breadcrumb({ crumbs }: Props) {
  return (
    <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8">
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && (
            <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
          {crumb.href ? (
            <a href={crumb.href} className="hover:text-gold transition-colors">
              {crumb.label}
            </a>
          ) : (
            <span className="text-gray-600">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
